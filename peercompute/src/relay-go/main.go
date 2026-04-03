package main

import (
  "context"
  "crypto/rand"
  "crypto/tls"
  "encoding/base64"
  "encoding/json"
  "errors"
  "fmt"
  "io"
  "log"
  "net"
  "os"
  "os/signal"
  "path/filepath"
  "strings"
  "sync"
  "syscall"
  "time"

  libp2p "github.com/libp2p/go-libp2p"
  "github.com/libp2p/go-libp2p/core/crypto"
  "github.com/libp2p/go-libp2p/core/network"
  "github.com/libp2p/go-libp2p/core/peer"
  "github.com/libp2p/go-libp2p/core/protocol"
  "github.com/libp2p/go-libp2p/core/transport"
  pubsub "github.com/libp2p/go-libp2p-pubsub"
  pubsubpb "github.com/libp2p/go-libp2p-pubsub/pb"
  "github.com/libp2p/go-libp2p/p2p/muxer/yamux"
  "github.com/libp2p/go-libp2p/p2p/protocol/circuitv2/relay"
  "github.com/libp2p/go-libp2p/p2p/security/noise"
  "github.com/libp2p/go-libp2p/p2p/transport/tcp"
  "github.com/libp2p/go-libp2p/p2p/transport/tcpreuse"
  ws "github.com/libp2p/go-libp2p/p2p/transport/websocket"
  ma "github.com/multiformats/go-multiaddr"
)

const keepaliveProtocol = "/peercompute/keepalive/1.0.0"

var defaultRelayTopics = []string{
  "peercompute._peer-discovery._p2p._pubsub",
  "peercompute-presence",
  "peercompute-direct",
  "peercompute-state",
  "peercompute-state-sync",
}

type relayConfig struct {
  BootstrapPeers []string        `json:"bootstrapPeers"`
  PubsubType     string          `json:"pubsubType,omitempty"`
  WebRTC         json.RawMessage `json:"webrtc,omitempty"`
  Gossipsub      json.RawMessage `json:"gossipsub,omitempty"`
}

type autoSubTracer struct {
  topics chan string
}

func (t *autoSubTracer) Trace(evt *pubsubpb.TraceEvent) {
  if evt == nil {
    return
  }
  if evt.GetType() != pubsubpb.TraceEvent_RECV_RPC {
    return
  }
  meta := evt.GetRecvRPC().GetMeta()
  if meta == nil {
    return
  }
  for _, sub := range meta.GetSubscription() {
    if !sub.GetSubscribe() {
      continue
    }
    topic := strings.TrimSpace(sub.GetTopic())
    if topic == "" {
      continue
    }
    select {
    case t.topics <- topic:
    default:
    }
  }
}

type topicRegistry struct {
  pubsub   *pubsub.PubSub
  prefixes []string
  allow    map[string]struct{}
  mu       sync.Mutex
  topics   map[string]*pubsub.Topic
}

func newTopicRegistry(ps *pubsub.PubSub, prefixes []string, allow map[string]struct{}) *topicRegistry {
  return &topicRegistry{
    pubsub:   ps,
    prefixes: prefixes,
    allow:    allow,
    topics:   make(map[string]*pubsub.Topic),
  }
}

func (r *topicRegistry) allowed(topic string) bool {
  if _, ok := r.allow[topic]; ok {
    return true
  }
  for _, prefix := range r.prefixes {
    if prefix == "" || strings.HasPrefix(topic, prefix) {
      return true
    }
  }
  return false
}

func (r *topicRegistry) ensure(topic string) {
  r.mu.Lock()
  if _, ok := r.topics[topic]; ok {
    r.mu.Unlock()
    return
  }
  r.mu.Unlock()

  t, err := r.pubsub.Join(topic)
  if err != nil {
    if strings.Contains(err.Error(), "topic already exists") {
      r.mu.Lock()
      r.topics[topic] = nil
      r.mu.Unlock()
      return
    }
    log.Printf("[Relay] Failed to join topic %s: %v", topic, err)
    return
  }

  if _, err := t.Relay(); err != nil {
    log.Printf("[Relay] Failed to enable relay for topic %s: %v", topic, err)
  }

  r.mu.Lock()
  r.topics[topic] = t
  r.mu.Unlock()
}

func (r *topicRegistry) ensureIfAllowed(topic string) {
  if !r.allowed(topic) {
    return
  }
  r.ensure(topic)
}

func envOrDefault(key, fallback string) string {
  if val, ok := os.LookupEnv(key); ok {
    return strings.TrimSpace(val)
  }
  return fallback
}

func envString(key string) string {
  return strings.TrimSpace(os.Getenv(key))
}

func parseJSONRaw(raw string) (json.RawMessage, error) {
  raw = strings.TrimSpace(raw)
  if raw == "" {
    return nil, nil
  }
  var decoded json.RawMessage
  if err := json.Unmarshal([]byte(raw), &decoded); err != nil {
    return nil, err
  }
  return decoded, nil
}

func splitList(raw string) []string {
  parts := strings.Split(raw, ",")
  out := make([]string, 0, len(parts))
  for _, part := range parts {
    part = strings.TrimSpace(part)
    if part == "" {
      continue
    }
    out = append(out, part)
  }
  return out
}

func toListenHostSegment(host string) string {
  trimmed := strings.TrimSpace(host)
  if trimmed == "" {
    return ""
  }
  ip := net.ParseIP(trimmed)
  if ip != nil {
    if ip.To4() != nil {
      return "/ip4/" + trimmed
    }
    return "/ip6/" + trimmed
  }
  return "/dns4/" + trimmed
}

func toMultiaddrHostSegments(host string) []string {
  trimmed := strings.TrimSpace(host)
  if trimmed == "" {
    return nil
  }
  ip := net.ParseIP(trimmed)
  if ip != nil {
    if ip.To4() != nil {
      return []string{"/ip4/" + trimmed}
    }
    return []string{"/ip6/" + trimmed}
  }
  // Publish both families so IPv4-only and IPv6-only agents can bootstrap.
  return []string{"/dns4/" + trimmed, "/dns6/" + trimmed}
}

func buildPublicRelayAddrs(host string, port string, protocol string) []ma.Multiaddr {
  trimmedPort := strings.TrimSpace(port)
  trimmedProtocol := strings.TrimSpace(protocol)
  if trimmedPort == "" || trimmedProtocol == "" {
    return nil
  }
  hostSegments := toMultiaddrHostSegments(host)
  if len(hostSegments) == 0 {
    return nil
  }
  addrs := make([]ma.Multiaddr, 0, len(hostSegments))
  seen := make(map[string]struct{}, len(hostSegments))
  for _, hostSegment := range hostSegments {
    value := fmt.Sprintf("%s/tcp/%s/%s", hostSegment, trimmedPort, trimmedProtocol)
    addr, err := ma.NewMultiaddr(value)
    if err != nil {
      log.Printf("[Relay] Invalid public multiaddr %s: %v", value, err)
      continue
    }
    if _, ok := seen[addr.String()]; ok {
      continue
    }
    seen[addr.String()] = struct{}{}
    addrs = append(addrs, addr)
  }
  return addrs
}

func loadRelayIdentity(identityPath string) (crypto.PrivKey, peer.ID, error) {
  if strings.TrimSpace(identityPath) == "" {
    return nil, "", nil
  }
  path := filepath.Clean(identityPath)
  if _, err := os.Stat(path); err == nil {
    raw, err := os.ReadFile(path)
    if err != nil {
      return nil, "", err
    }
    var payload map[string]any
    if err := json.Unmarshal(raw, &payload); err != nil {
      return nil, "", err
    }
    encoded := ""
    if value, ok := payload["privateKey"].(string); ok {
      encoded = value
    } else if value, ok := payload["privKey"].(string); ok {
      encoded = value
    }
    if encoded == "" {
      return nil, "", errors.New("identity file missing privateKey")
    }
    keyBytes, err := base64.StdEncoding.DecodeString(encoded)
    if err != nil {
      return nil, "", err
    }
    key, err := crypto.UnmarshalPrivateKey(keyBytes)
    if err != nil {
      return nil, "", err
    }
    pid, err := peer.IDFromPrivateKey(key)
    if err != nil {
      return nil, "", err
    }
    log.Printf("[Relay] Loaded identity key from %s", path)
    return key, pid, nil
  }

  key, _, err := crypto.GenerateEd25519Key(rand.Reader)
  if err != nil {
    return nil, "", err
  }
  pid, err := peer.IDFromPrivateKey(key)
  if err != nil {
    return nil, "", err
  }
  keyBytes, err := crypto.MarshalPrivateKey(key)
  if err != nil {
    return nil, "", err
  }
  payload := map[string]any{
    "type":      key.Type().String(),
    "peerId":    pid.String(),
    "privateKey": base64.StdEncoding.EncodeToString(keyBytes),
    "createdAt": time.Now().UTC().Format(time.RFC3339),
  }
  if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
    return nil, "", err
  }
  data, err := json.MarshalIndent(payload, "", "  ")
  if err != nil {
    return nil, "", err
  }
  if err := os.WriteFile(path, append(data, '\n'), 0o600); err != nil {
    return nil, "", err
  }
  log.Printf("[Relay] Wrote identity key to %s", path)
  return key, pid, nil
}

func pickWsAddr(addrs []ma.Multiaddr, preferWss bool) ma.Multiaddr {
  var fallback ma.Multiaddr
  for _, addr := range addrs {
    if strings.Contains(addr.String(), "/wss") {
      if preferWss {
        return addr
      }
      if fallback == nil {
        fallback = addr
      }
    }
    if strings.Contains(addr.String(), "/ws") {
      if !preferWss {
        return addr
      }
      if fallback == nil {
        fallback = addr
      }
    }
  }
  if fallback != nil {
    return fallback
  }
  if len(addrs) > 0 {
    return addrs[0]
  }
  return nil
}

func extractAddrParts(addr ma.Multiaddr) (host string, port string, protocol string) {
  if addr == nil {
    return "", "", ""
  }
  if value, err := addr.ValueForProtocol(ma.P_TCP); err == nil {
    port = value
  }
  for _, proto := range []int{ma.P_IP4, ma.P_IP6, ma.P_DNS4, ma.P_DNS6, ma.P_DNS} {
    if value, err := addr.ValueForProtocol(proto); err == nil {
      host = value
      break
    }
  }
  if strings.Contains(addr.String(), "/wss") || strings.Contains(addr.String(), "/tls/ws") {
    protocol = "wss"
  } else if strings.Contains(addr.String(), "/ws") {
    protocol = "ws"
  }
  return host, port, protocol
}

func writeRelayConfigFiles(files []string, payload relayConfig) {
  if len(files) == 0 {
    return
  }
  data, err := json.MarshalIndent(payload, "", "  ")
  if err != nil {
    log.Printf("[Relay] Failed to marshal relay config: %v", err)
    return
  }
  for _, filePath := range files {
    if strings.TrimSpace(filePath) == "" {
      continue
    }
    dir := filepath.Dir(filePath)
    if err := os.MkdirAll(dir, 0o755); err != nil {
      log.Printf("[Relay] Failed to create relay config dir %s: %v", dir, err)
      continue
    }
    if err := os.WriteFile(filePath, append(data, '\n'), 0o644); err != nil {
      log.Printf("[Relay] Failed to write relay-config.json to %s: %v", filePath, err)
      continue
    }
    log.Printf("[Relay] Wrote relay-config.json -> %s", filePath)
  }
}

func main() {
  log.SetFlags(0)
  relayPublicHost := envString("RELAY_PUBLIC_HOST")
  relayPublicPort := envString("RELAY_PUBLIC_PORT")
  relayPublicProtocol := strings.ToLower(envString("RELAY_PUBLIC_PROTOCOL"))
  relayListenHost := envString("RELAY_LISTEN_HOST")
  relayListenPort := envOrDefault("RELAY_LISTEN_PORT", "0")
  relaySslCert := envString("RELAY_SSL_CERT")
  relaySslKey := envString("RELAY_SSL_KEY")
  relayIdentityFile := envString("RELAY_IDENTITY_FILE")
  relayConfigDirs := splitList(envString("RELAY_CONFIG_DIRS"))
  relayConfigFile := envString("RELAY_CONFIG_FILE")
  relayTopicPrefixes := splitList(envOrDefault("RELAY_TOPIC_PREFIXES", "pc.,peercompute-"))

  relayPubsubType := strings.ToLower(envString("RELAY_PUBSUB_TYPE"))
  if relayPubsubType == "" {
    relayPubsubType = strings.ToLower(envString("RELAY_PUBSUB"))
  }
  useGossipsub := relayPubsubType == "gossipsub"

  webrtcConfig, err := parseJSONRaw(envString("RELAY_WEBRTC_CONFIG"))
  if err != nil {
    log.Printf("[Relay] Failed to parse RELAY_WEBRTC_CONFIG: %v", err)
  }
  gossipsubConfig, err := parseJSONRaw(envString("RELAY_GOSSIPSUB_CONFIG"))
  if err != nil {
    log.Printf("[Relay] Failed to parse RELAY_GOSSIPSUB_CONFIG: %v", err)
  }

  if relayListenHost == "" {
    if relayPublicHost != "" {
      relayListenHost = "0.0.0.0"
    } else {
      relayListenHost = "127.0.0.1"
    }
  }

  useWss := relaySslCert != "" && relaySslKey != ""
  if relayPublicProtocol != "ws" && relayPublicProtocol != "wss" {
    relayPublicProtocol = ""
  }

  log.Printf("Starting PeerCompute Go Relay...")
  log.Printf("Relay listen host: %s", relayListenHost)
  log.Printf("Relay listen port: %s", relayListenPort)
  if relayPublicHost != "" {
    log.Printf("Relay public host: %s", relayPublicHost)
  }
  if relayPublicPort != "" {
    log.Printf("Relay public port: %s", relayPublicPort)
  }
  if relayPublicProtocol != "" {
    log.Printf("Relay public protocol: %s", relayPublicProtocol)
  }
  if useWss {
    log.Printf("Relay using WSS with SSL_CERT=%s", relaySslCert)
  }
  if useGossipsub {
    log.Printf("Relay pubsub: gossipsub")
  } else {
    log.Printf("Relay pubsub: floodsub")
  }

  privKey, peerID, err := loadRelayIdentity(relayIdentityFile)
  if err != nil {
    log.Fatalf("[Relay] Failed to load identity: %v", err)
  }

  listenProtocol := "ws"
  if useWss {
    listenProtocol = "wss"
  }
  listenAddr := fmt.Sprintf("%s/tcp/%s/%s", toListenHostSegment(relayListenHost), relayListenPort, listenProtocol)
  advertiseProtocol := relayPublicProtocol
  if advertiseProtocol == "" {
    if useWss {
      advertiseProtocol = "wss"
    } else {
      advertiseProtocol = "ws"
    }
  }
  advertisedAddrs := buildPublicRelayAddrs(relayPublicHost, relayPublicPort, advertiseProtocol)

  var wsOpts []ws.Option
  if useWss {
    cert, err := tls.LoadX509KeyPair(relaySslCert, relaySslKey)
    if err != nil {
      log.Fatalf("[Relay] Failed to load TLS cert/key: %v", err)
    }
    wsOpts = append(wsOpts, ws.WithTLSConfig(&tls.Config{
      Certificates: []tls.Certificate{cert},
    }))
  }

  wsTransport := func(upgrader transport.Upgrader, rcmgr network.ResourceManager, sharedTCP *tcpreuse.ConnMgr) (transport.Transport, error) {
    return ws.New(upgrader, rcmgr, sharedTCP, wsOpts...)
  }

  opts := []libp2p.Option{
    libp2p.ListenAddrStrings(listenAddr),
    libp2p.Security(noise.ID, noise.New),
    libp2p.Muxer("/yamux/1.0.0", yamux.DefaultTransport),
    libp2p.Transport(wsTransport),
    libp2p.Transport(tcp.NewTCPTransport),
  }
  if len(advertisedAddrs) > 0 {
    opts = append(opts, libp2p.AddrsFactory(func([]ma.Multiaddr) []ma.Multiaddr {
      return advertisedAddrs
    }))
  }
  if privKey != nil {
    opts = append(opts, libp2p.Identity(privKey))
  }

  host, err := libp2p.New(opts...)
  if err != nil {
    log.Fatalf("[Relay] Failed to create host: %v", err)
  }
  if peerID != "" {
    log.Printf("Relay Server ID: %s", peerID.String())
  } else {
    log.Printf("Relay Server ID: %s", host.ID().String())
  }

  resources := relay.DefaultResources()
  // Keep relay reservations stable long enough for browser circuit announce
  // addresses to survive connect churn and match the older Node relay behavior.
  resources.ReservationTTL = time.Hour
  resources.MaxReservations = 1000
  resources.MaxCircuits = 1000
  resources.MaxReservationsPerIP = 1000
  resources.MaxReservationsPerASN = 1000
  resources.MaxReservationsPerPeer = 1
  relayService, err := relay.New(host, relay.WithResources(resources), relay.WithInfiniteLimits())
  if err != nil {
    log.Fatalf("[Relay] Failed to start relay service: %v", err)
  }
  defer relayService.Close()

  tracer := &autoSubTracer{topics: make(chan string, 256)}
  ctx, cancel := context.WithCancel(context.Background())
  defer cancel()

  var ps *pubsub.PubSub
  if useGossipsub {
    ps, err = pubsub.NewGossipSub(ctx, host, pubsub.WithEventTracer(tracer))
  } else {
    ps, err = pubsub.NewFloodSub(ctx, host, pubsub.WithEventTracer(tracer))
  }
  if err != nil {
    log.Fatalf("[Relay] Failed to start pubsub: %v", err)
  }

  allow := make(map[string]struct{})
  for _, topic := range defaultRelayTopics {
    allow[topic] = struct{}{}
  }
  registry := newTopicRegistry(ps, relayTopicPrefixes, allow)
  for _, topic := range defaultRelayTopics {
    registry.ensure(topic)
  }
  log.Printf("Relay subscribed to topics: %s", strings.Join(defaultRelayTopics, ", "))

  go func() {
    for {
      select {
      case topic := <-tracer.topics:
        if topic == "" {
          continue
        }
        registry.ensureIfAllowed(topic)
      case <-ctx.Done():
        return
      }
    }
  }()

  host.SetStreamHandler(protocol.ID(keepaliveProtocol), func(stream network.Stream) {
    defer stream.Close()
    _, _ = io.Copy(stream, stream)
  })
  log.Printf("[Relay] Keep-alive protocol registered")

  host.Network().Notify(&network.NotifyBundle{
    ConnectedF: func(_ network.Network, conn network.Conn) {
      log.Printf("[Relay] Peer connected: %s", conn.RemotePeer().String())
    },
    DisconnectedF: func(_ network.Network, conn network.Conn) {
      log.Printf("[Relay] Peer disconnected: %s", conn.RemotePeer().String())
    },
  })

  addrs := host.Addrs()
  log.Printf("Listen address: %s", listenAddr)
  log.Printf("Advertised addresses:")
  for _, addr := range addrs {
    log.Printf("%s", addr.String())
  }

  wsAddr := pickWsAddr(addrs, useWss)
  addrHost, addrPort, addrProto := extractAddrParts(wsAddr)
  if relayPublicHost == "" {
    relayPublicHost = addrHost
  }
  if relayPublicPort == "" {
    relayPublicPort = addrPort
  }
  if relayPublicProtocol == "" {
    if addrProto != "" {
      relayPublicProtocol = addrProto
    } else if useWss {
      relayPublicProtocol = "wss"
    } else {
      relayPublicProtocol = "ws"
    }
  }

  bootstrapPeers := make([]string, 0, len(addrs))
  if relayPublicHost != "" && relayPublicPort != "" {
    publicRelayAddrs := buildPublicRelayAddrs(relayPublicHost, relayPublicPort, relayPublicProtocol)
    for _, addr := range publicRelayAddrs {
      bootstrapPeers = append(bootstrapPeers, fmt.Sprintf("%s/p2p/%s", addr.String(), host.ID().String()))
    }
  } else if wsAddr != nil {
    bootstrapPeers = append(bootstrapPeers, fmt.Sprintf("%s/p2p/%s", wsAddr.String(), host.ID().String()))
  } else {
    log.Printf("No WebSocket address found")
  }

  if len(bootstrapPeers) > 0 {
    log.Printf("Relay Address: %s", bootstrapPeers[0])
    if len(bootstrapPeers) > 1 {
      log.Printf("[Relay] Additional relay addresses: %s", strings.Join(bootstrapPeers[1:], ", "))
    }
    config := relayConfig{
      BootstrapPeers: bootstrapPeers,
      PubsubType:     map[bool]string{true: "gossipsub", false: "floodsub"}[useGossipsub],
      WebRTC:         webrtcConfig,
      Gossipsub:      gossipsubConfig,
    }

    files := make([]string, 0, len(relayConfigDirs)+1)
    for _, dir := range relayConfigDirs {
      files = append(files, filepath.Join(dir, "relay-config.json"))
    }
    if relayConfigFile != "" {
      files = append(files, relayConfigFile)
    }
    writeRelayConfigFiles(files, config)
  }

  sigCh := make(chan os.Signal, 1)
  signal.Notify(sigCh, os.Interrupt, syscall.SIGTERM)
  <-sigCh
  cancel()
  _ = host.Close()
}
