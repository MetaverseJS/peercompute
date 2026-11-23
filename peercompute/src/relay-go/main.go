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
  "strconv"
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

const (
  keepaliveProtocol         = "/peercompute/keepalive/1.0.0"
  directoryTopic            = "peercompute-directory"
  defaultDirectoryTTLMs     = 5 * 60 * 1000
  defaultTopicIdleTTLMs     = 10 * 60 * 1000
  defaultCircuitDurationSec = 3600
  defaultCircuitDataMB      = 64
)

var defaultControlTopics = []string{
  "peercompute._peer-discovery._p2p._pubsub",
  "peercompute-presence",
  "peercompute-direct",
}

var defaultDataTopics = []string{
  "peercompute-state",
  "peercompute-state-sync",
}

var defaultRelayTopics = append(append([]string{}, defaultControlTopics...), defaultDataTopics...)

type relayConfig struct {
  BootstrapPeers []string        `json:"bootstrapPeers"`
  PubsubType     string          `json:"pubsubType,omitempty"`
  WebRTC         json.RawMessage `json:"webrtc,omitempty"`
  Gossipsub      json.RawMessage `json:"gossipsub,omitempty"`
}

type gossipsubTopicScoreJSON struct {
  TopicWeight                     *float64 `json:"topicWeight"`
  MeshMessageDeliveriesWeight     *float64 `json:"meshMessageDeliveriesWeight"`
  MeshMessageDeliveriesThreshold  *float64 `json:"meshMessageDeliveriesThreshold"`
  MeshMessageDeliveriesCap        *float64 `json:"meshMessageDeliveriesCap"`
  MeshMessageDeliveriesDecay      *float64 `json:"meshMessageDeliveriesDecay"`
  MeshFailurePenaltyWeight        *float64 `json:"meshFailurePenaltyWeight"`
  MeshFailurePenaltyDecay         *float64 `json:"meshFailurePenaltyDecay"`
  InvalidMessageDeliveriesWeight  *float64 `json:"invalidMessageDeliveriesWeight"`
  InvalidMessageDeliveriesDecay   *float64 `json:"invalidMessageDeliveriesDecay"`
  FirstMessageDeliveriesWeight    *float64 `json:"firstMessageDeliveriesWeight"`
  FirstMessageDeliveriesCap       *float64 `json:"firstMessageDeliveriesCap"`
  FirstMessageDeliveriesDecay     *float64 `json:"firstMessageDeliveriesDecay"`
  TimeInMeshWeight                *float64 `json:"timeInMeshWeight"`
  TimeInMeshCap                   *float64 `json:"timeInMeshCap"`
}

type gossipsubScoreParamsJSON struct {
  TopicScoreCap               *float64                            `json:"topicScoreCap"`
  IPColocationFactorWeight    *float64                            `json:"IPColocationFactorWeight"`
  IPColocationFactorThreshold *int                                `json:"IPColocationFactorThreshold"`
  BehaviourPenaltyWeight      *float64                            `json:"behaviourPenaltyWeight"`
  BehaviourPenaltyWeightCap   *float64                            `json:"BehaviourPenaltyWeight"`
  BehaviourPenaltyThreshold   *float64                            `json:"behaviourPenaltyThreshold"`
  BehaviourPenaltyDecay       *float64                            `json:"behaviourPenaltyDecay"`
  Topics                      map[string]*gossipsubTopicScoreJSON `json:"topics"`
}

type gossipsubConfigJSON struct {
  D                   *int                      `json:"D"`
  Dlo                 *int                      `json:"Dlo"`
  Dhi                 *int                      `json:"Dhi"`
  Dout                *int                      `json:"Dout"`
  Dlazy               *int                      `json:"Dlazy"`
  Dscore              *int                      `json:"Dscore"`
  HeartbeatIntervalMs *int                      `json:"heartbeatInterval"`
  ScoreParams         *gossipsubScoreParamsJSON `json:"scoreParams"`
}

func isDataTopic(topic string) bool {
  return strings.Contains(topic, ".state") ||
    strings.Contains(topic, "-state") ||
    strings.Contains(topic, ".shard.") ||
    strings.Contains(topic, "-shard-")
}

func parseBoolEnv(key string, fallback bool) bool {
  raw := strings.ToLower(strings.TrimSpace(os.Getenv(key)))
  if raw == "" {
    return fallback
  }
  if raw == "true" || raw == "1" || raw == "yes" {
    return true
  }
  if raw == "false" || raw == "0" || raw == "no" {
    return false
  }
  return fallback
}

func parseIntEnv(key string, fallback int) int {
  raw := strings.TrimSpace(os.Getenv(key))
  if raw == "" {
    return fallback
  }
  val, err := strconv.Atoi(raw)
  if err != nil {
    return fallback
  }
  return val
}

func buildTopicScoreParams(cfg *gossipsubTopicScoreJSON) *pubsub.TopicScoreParams {
  if cfg == nil {
    return nil
  }
  params := &pubsub.TopicScoreParams{
    SkipAtomicValidation: true,
    TopicWeight:          1.0,
    TimeInMeshQuantum:    time.Second,
  }
  if cfg.TopicWeight != nil {
    params.TopicWeight = *cfg.TopicWeight
  }
  if cfg.TimeInMeshWeight != nil {
    params.TimeInMeshWeight = *cfg.TimeInMeshWeight
  }
  if cfg.TimeInMeshCap != nil {
    params.TimeInMeshCap = *cfg.TimeInMeshCap
  }
  if cfg.FirstMessageDeliveriesWeight != nil {
    params.FirstMessageDeliveriesWeight = *cfg.FirstMessageDeliveriesWeight
  }
  if cfg.FirstMessageDeliveriesCap != nil {
    params.FirstMessageDeliveriesCap = *cfg.FirstMessageDeliveriesCap
  }
  if cfg.FirstMessageDeliveriesDecay != nil {
    params.FirstMessageDeliveriesDecay = *cfg.FirstMessageDeliveriesDecay
  }
  if cfg.MeshMessageDeliveriesWeight != nil {
    params.MeshMessageDeliveriesWeight = *cfg.MeshMessageDeliveriesWeight
  }
  if cfg.MeshMessageDeliveriesThreshold != nil {
    params.MeshMessageDeliveriesThreshold = *cfg.MeshMessageDeliveriesThreshold
  }
  if cfg.MeshMessageDeliveriesCap != nil {
    params.MeshMessageDeliveriesCap = *cfg.MeshMessageDeliveriesCap
  }
  if cfg.MeshMessageDeliveriesDecay != nil {
    params.MeshMessageDeliveriesDecay = *cfg.MeshMessageDeliveriesDecay
  }
  if cfg.MeshFailurePenaltyWeight != nil {
    params.MeshFailurePenaltyWeight = *cfg.MeshFailurePenaltyWeight
  }
  if cfg.MeshFailurePenaltyDecay != nil {
    params.MeshFailurePenaltyDecay = *cfg.MeshFailurePenaltyDecay
  }
  if cfg.InvalidMessageDeliveriesWeight != nil {
    params.InvalidMessageDeliveriesWeight = *cfg.InvalidMessageDeliveriesWeight
  }
  if cfg.InvalidMessageDeliveriesDecay != nil {
    params.InvalidMessageDeliveriesDecay = *cfg.InvalidMessageDeliveriesDecay
  }
  return params
}

func buildGossipSubOptions(raw json.RawMessage, tracer pubsub.EventTracer, initialTopics []string) ([]pubsub.Option, pubsub.GossipSubParams, *pubsub.PeerScoreParams) {
  params := pubsub.DefaultGossipSubParams()
  var opts []pubsub.Option
  if tracer != nil {
    opts = append(opts, pubsub.WithEventTracer(tracer))
  }
  var scoreParams *pubsub.PeerScoreParams
  if len(raw) > 0 {
    var cfg gossipsubConfigJSON
    if err := json.Unmarshal(raw, &cfg); err != nil {
      log.Printf("[Relay] Failed to decode RELAY_GOSSIPSUB_CONFIG fields: %v", err)
    } else {
      if cfg.D != nil && *cfg.D > 0 {
        params.D = *cfg.D
      }
      if cfg.Dlo != nil && *cfg.Dlo >= 0 {
        params.Dlo = *cfg.Dlo
      }
      if cfg.Dhi != nil && *cfg.Dhi > 0 {
        params.Dhi = *cfg.Dhi
      }
      if cfg.Dout != nil && *cfg.Dout >= 0 {
        params.Dout = *cfg.Dout
      }
      if cfg.Dlazy != nil && *cfg.Dlazy > 0 {
        params.Dlazy = *cfg.Dlazy
      }
      if cfg.Dscore != nil && *cfg.Dscore >= 0 {
        params.Dscore = *cfg.Dscore
      }
      if cfg.HeartbeatIntervalMs != nil && *cfg.HeartbeatIntervalMs > 0 {
        params.HeartbeatInterval = time.Duration(*cfg.HeartbeatIntervalMs) * time.Millisecond
      }
      // Enforce go-libp2p-pubsub invariants so partial overrides stay valid.
      if params.Dlo > params.D {
        params.Dlo = params.D
      }
      if params.Dhi < params.D {
        params.Dhi = params.D
      }
      maxDout := params.D / 2
      if params.Dlo > 0 && params.Dlo-1 < maxDout {
        maxDout = params.Dlo - 1
      }
      if maxDout < 0 {
        maxDout = 0
      }
      if params.Dout > maxDout {
        params.Dout = maxDout
      }

      if cfg.ScoreParams != nil {
        sp := &pubsub.PeerScoreParams{
          SkipAtomicValidation: true,
          Topics:               make(map[string]*pubsub.TopicScoreParams),
          DecayInterval:        time.Second,
          DecayToZero:          0.01,
          RetainScore:          10 * time.Second,
        }
        if cfg.ScoreParams.TopicScoreCap != nil {
          sp.TopicScoreCap = *cfg.ScoreParams.TopicScoreCap
        }
        if cfg.ScoreParams.IPColocationFactorWeight != nil {
          sp.IPColocationFactorWeight = *cfg.ScoreParams.IPColocationFactorWeight
        }
        if cfg.ScoreParams.IPColocationFactorThreshold != nil {
          sp.IPColocationFactorThreshold = *cfg.ScoreParams.IPColocationFactorThreshold
        }
        if cfg.ScoreParams.BehaviourPenaltyWeight != nil {
          sp.BehaviourPenaltyWeight = *cfg.ScoreParams.BehaviourPenaltyWeight
        } else if cfg.ScoreParams.BehaviourPenaltyWeightCap != nil {
          sp.BehaviourPenaltyWeight = *cfg.ScoreParams.BehaviourPenaltyWeightCap
        }
        if cfg.ScoreParams.BehaviourPenaltyThreshold != nil {
          sp.BehaviourPenaltyThreshold = *cfg.ScoreParams.BehaviourPenaltyThreshold
        }
        if cfg.ScoreParams.BehaviourPenaltyDecay != nil {
          sp.BehaviourPenaltyDecay = *cfg.ScoreParams.BehaviourPenaltyDecay
        }
        if len(cfg.ScoreParams.Topics) > 0 {
          defaultTopicCfg := cfg.ScoreParams.Topics["__default"]
          for name, topicCfg := range cfg.ScoreParams.Topics {
            if name == "__default" || topicCfg == nil {
              continue
            }
            sp.Topics[name] = buildTopicScoreParams(topicCfg)
          }
          if defaultTopicCfg != nil {
            for _, topic := range initialTopics {
              if _, exists := sp.Topics[topic]; !exists {
                sp.Topics[topic] = buildTopicScoreParams(defaultTopicCfg)
              }
            }
          }
        }
        thresholds := &pubsub.PeerScoreThresholds{
          SkipAtomicValidation:        true,
          GossipThreshold:             -4000,
          PublishThreshold:            -8000,
          GraylistThreshold:           -16000,
          AcceptPXThreshold:           100,
          OpportunisticGraftThreshold: 5,
        }
        scoreParams = sp
        opts = append(opts, pubsub.WithPeerScore(sp, thresholds))
      }
    }
  }
  if scoreParams == nil {
    // Neutral IP-colocation scoring by default so peers sharing a home LAN NAT
    // or localhost test harness are never graylisted even without custom JSON.
    sp := &pubsub.PeerScoreParams{
      SkipAtomicValidation:     true,
      Topics:                   make(map[string]*pubsub.TopicScoreParams),
      DecayInterval:            time.Second,
      DecayToZero:              0.01,
      RetainScore:              10 * time.Second,
      IPColocationFactorWeight: 0,
      BehaviourPenaltyWeight:   0,
    }
    thresholds := &pubsub.PeerScoreThresholds{
      SkipAtomicValidation:        true,
      GossipThreshold:             -4000,
      PublishThreshold:            -8000,
      GraylistThreshold:           -16000,
      AcceptPXThreshold:           100,
      OpportunisticGraftThreshold: 5,
    }
    scoreParams = sp
    opts = append(opts, pubsub.WithPeerScore(sp, thresholds))
  }
  opts = append(opts, pubsub.WithGossipSubParams(params))
  return opts, params, scoreParams
}

func buildCircuitRelayOptions(resources relay.Resources, infinite bool, durationSec int, dataMB int) []relay.Option {
  opts := []relay.Option{relay.WithResources(resources)}
  if infinite {
    return append(opts, relay.WithInfiniteLimits())
  }
  if durationSec <= 0 {
    durationSec = defaultCircuitDurationSec
  }
  if dataMB <= 0 {
    dataMB = defaultCircuitDataMB
  }
  return append(opts, relay.WithLimit(&relay.RelayLimit{
    Duration: time.Duration(durationSec) * time.Second,
    Data:     int64(dataMB) * 1024 * 1024,
  }))
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

type topicEntry struct {
  topic      *pubsub.Topic
  cancel     pubsub.RelayCancelFunc
  lastActive time.Time
  pinned     bool
}

type topicRegistry struct {
  pubsub          *pubsub.PubSub
  prefixes        []string
  allow           map[string]struct{}
  controlOnlyMode bool
  mu              sync.Mutex
  topics          map[string]*topicEntry
}

func newTopicRegistry(ps *pubsub.PubSub, prefixes []string, allow map[string]struct{}, controlOnlyMode bool) *topicRegistry {
  return &topicRegistry{
    pubsub:          ps,
    prefixes:        prefixes,
    allow:           allow,
    controlOnlyMode: controlOnlyMode,
    topics:          make(map[string]*topicEntry),
  }
}

func (r *topicRegistry) allowed(topic string) bool {
  if r.controlOnlyMode && isDataTopic(topic) {
    return false
  }
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

func (r *topicRegistry) ensureWithPin(topic string, pinned bool) *pubsub.Topic {
  now := time.Now()
  r.mu.Lock()
  if existing, ok := r.topics[topic]; ok {
    existing.lastActive = now
    if pinned {
      existing.pinned = true
    }
    t := existing.topic
    r.mu.Unlock()
    return t
  }
  r.mu.Unlock()

  t, err := r.pubsub.Join(topic)
  if err != nil {
    if strings.Contains(err.Error(), "topic already exists") {
      r.mu.Lock()
      r.topics[topic] = &topicEntry{topic: nil, lastActive: now, pinned: pinned}
      r.mu.Unlock()
      return nil
    }
    log.Printf("[Relay] Failed to join topic %s: %v", topic, err)
    return nil
  }

  cancelFn, err := t.Relay()
  if err != nil {
    log.Printf("[Relay] Failed to enable relay for topic %s: %v", topic, err)
  }

  r.mu.Lock()
  r.topics[topic] = &topicEntry{
    topic:      t,
    cancel:     cancelFn,
    lastActive: now,
    pinned:     pinned,
  }
  r.mu.Unlock()
  return t
}

func (r *topicRegistry) ensure(topic string) *pubsub.Topic {
  return r.ensureWithPin(topic, false)
}

func (r *topicRegistry) ensureIfAllowed(topic string) *pubsub.Topic {
  if !r.allowed(topic) {
    return nil
  }
  return r.ensureWithPin(topic, false)
}

func (r *topicRegistry) pruneIdle(idleTTL time.Duration, now time.Time) int {
  if idleTTL <= 0 {
    return 0
  }
  type toClose struct {
    name   string
    entry  *topicEntry
  }
  var expired []toClose
  r.mu.Lock()
  for name, entry := range r.topics {
    if entry == nil || entry.pinned || entry.topic == nil {
      continue
    }
    if len(entry.topic.ListPeers()) > 0 {
      entry.lastActive = now
      continue
    }
    if now.Sub(entry.lastActive) >= idleTTL {
      expired = append(expired, toClose{name: name, entry: entry})
      delete(r.topics, name)
    }
  }
  r.mu.Unlock()

  for _, item := range expired {
    if item.entry.cancel != nil {
      item.entry.cancel()
    }
    _ = item.entry.topic.Close()
  }
  return len(expired)
}

type peerDirectoryEntry struct {
  Multiaddrs []string
  LastSeen   int64
  RoomID     string
  TopologyID string
  ShardID    string
}

type peerDirectoryStore struct {
  mu      sync.Mutex
  entries map[string]peerDirectoryEntry
}

func newPeerDirectoryStore() *peerDirectoryStore {
  return &peerDirectoryStore{entries: make(map[string]peerDirectoryEntry)}
}

func (d *peerDirectoryStore) upsert(peerID string, entry peerDirectoryEntry) {
  if peerID == "" {
    return
  }
  d.mu.Lock()
  d.entries[peerID] = entry
  d.mu.Unlock()
}

func (d *peerDirectoryStore) get(peerID string) (peerDirectoryEntry, bool) {
  d.mu.Lock()
  entry, ok := d.entries[peerID]
  d.mu.Unlock()
  return entry, ok
}

func (d *peerDirectoryStore) pruneExpired(ttlMs int64, nowMs int64) int {
  if ttlMs <= 0 {
    return 0
  }
  d.mu.Lock()
  removed := 0
  for id, entry := range d.entries {
    if nowMs-entry.LastSeen > ttlMs {
      delete(d.entries, id)
      removed++
    }
  }
  d.mu.Unlock()
  return removed
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
  relayControlOnlyMode := parseBoolEnv("RELAY_CONTROL_ONLY_MODE", false)
  relayEnableDirectory := parseBoolEnv("RELAY_ENABLE_DIRECTORY", true)
  relayDirectoryTTLMs := int64(parseIntEnv("RELAY_DIRECTORY_TTL_MS", defaultDirectoryTTLMs))
  if relayDirectoryTTLMs <= 0 {
    relayDirectoryTTLMs = defaultDirectoryTTLMs
  }
  relayTopicIdleTTLMs := parseIntEnv("RELAY_TOPIC_IDLE_TTL_MS", defaultTopicIdleTTLMs)
  relayInfiniteLimits := parseBoolEnv("RELAY_INFINITE_LIMITS", false)
  relayCircuitDurationSec := parseIntEnv("RELAY_CIRCUIT_DURATION_SEC", defaultCircuitDurationSec)
  relayCircuitDataMB := parseIntEnv("RELAY_CIRCUIT_DATA_MB", defaultCircuitDataMB)

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
  circuitOpts := buildCircuitRelayOptions(resources, relayInfiniteLimits, relayCircuitDurationSec, relayCircuitDataMB)
  relayService, err := relay.New(host, circuitOpts...)
  if err != nil {
    log.Fatalf("[Relay] Failed to start relay service: %v", err)
  }
  defer relayService.Close()
  if relayInfiniteLimits {
    log.Printf("[Relay] Circuit limits: infinite (RELAY_INFINITE_LIMITS=1)")
  } else {
    log.Printf("[Relay] Circuit limits: duration=%ds data=%dMB/dir", relayCircuitDurationSec, relayCircuitDataMB)
  }

  initialTopics := make([]string, 0, len(defaultRelayTopics)+1)
  initialTopics = append(initialTopics, defaultControlTopics...)
  if !relayControlOnlyMode {
    initialTopics = append(initialTopics, defaultDataTopics...)
  } else {
    log.Printf("[Relay] Control-only mode enabled - skipping state topic subscriptions")
  }
  if relayEnableDirectory {
    initialTopics = append(initialTopics, directoryTopic)
  }

  tracer := &autoSubTracer{topics: make(chan string, 256)}
  ctx, cancel := context.WithCancel(context.Background())
  defer cancel()

  var ps *pubsub.PubSub
  if useGossipsub {
    gsOpts, gsParams, scoreParams := buildGossipSubOptions(gossipsubConfig, tracer, initialTopics)
    log.Printf("[Relay] Gossipsub params: D=%d Dlo=%d Dhi=%d Dout=%d Dlazy=%d scoring=%v",
      gsParams.D, gsParams.Dlo, gsParams.Dhi, gsParams.Dout, gsParams.Dlazy, scoreParams != nil)
    ps, err = pubsub.NewGossipSub(ctx, host, gsOpts...)
  } else {
    ps, err = pubsub.NewFloodSub(ctx, host, pubsub.WithEventTracer(tracer))
  }
  if err != nil {
    log.Fatalf("[Relay] Failed to start pubsub: %v", err)
  }

  allow := make(map[string]struct{})
  for _, topic := range initialTopics {
    allow[topic] = struct{}{}
  }
  registry := newTopicRegistry(ps, relayTopicPrefixes, allow, relayControlOnlyMode)
  joinedTopics := make(map[string]*pubsub.Topic, len(initialTopics))
  for _, topic := range initialTopics {
    if t := registry.ensureWithPin(topic, true); t != nil {
      joinedTopics[topic] = t
    }
  }
  log.Printf("Relay subscribed to topics: %s", strings.Join(initialTopics, ", "))

  if relayEnableDirectory {
    dirStore := newPeerDirectoryStore()
    log.Printf("[Relay] Peer directory enabled (TTL: %dms)", relayDirectoryTTLMs)
    if dirTopic, ok := joinedTopics[directoryTopic]; ok && dirTopic != nil {
      if dirSub, err := dirTopic.Subscribe(); err == nil {
        go func() {
          defer dirSub.Cancel()
          for {
            msg, err := dirSub.Next(ctx)
            if err != nil {
              return
            }
            if msg.ReceivedFrom == host.ID() {
              continue
            }
            var req map[string]any
            if err := json.Unmarshal(msg.Data, &req); err != nil {
              continue
            }
            reqType, _ := req["type"].(string)
            switch reqType {
            case "directory-register":
              fromID, _ := req["from"].(string)
              var addrs []string
              if rawAddrs, ok := req["multiaddrs"].([]any); ok {
                for _, item := range rawAddrs {
                  if s, ok := item.(string); ok && s != "" {
                    addrs = append(addrs, s)
                  }
                }
              }
              roomID, _ := req["roomId"].(string)
              topologyID, _ := req["topologyId"].(string)
              shardID, _ := req["shardId"].(string)
              dirStore.upsert(fromID, peerDirectoryEntry{
                Multiaddrs: addrs,
                LastSeen:   time.Now().UnixMilli(),
                RoomID:     roomID,
                TopologyID: topologyID,
                ShardID:    shardID,
              })
            case "directory-query":
              targetPeerID, _ := req["targetPeerId"].(string)
              requestID, _ := req["requestId"].(string)
              if targetPeerID == "" {
                continue
              }
              entry, found := dirStore.get(targetPeerID)
              resp := map[string]any{
                "type":         "directory-response",
                "requestId":    requestID,
                "targetPeerId": targetPeerID,
                "found":        found,
                "multiaddrs":   []string{},
                "lastSeen":     nil,
                "metadata":     nil,
              }
              if found {
                resp["multiaddrs"] = entry.Multiaddrs
                resp["lastSeen"] = entry.LastSeen
                resp["metadata"] = map[string]any{
                  "roomId":     entry.RoomID,
                  "topologyId": entry.TopologyID,
                  "shardId":    entry.ShardID,
                }
              }
              if encoded, err := json.Marshal(resp); err == nil {
                if err := dirTopic.Publish(ctx, encoded); err != nil {
                  log.Printf("[Directory] Failed to respond: %v", err)
                }
              }
            }
          }
        }()
      }
    }
    if presenceTopic, ok := joinedTopics["peercompute-presence"]; ok && presenceTopic != nil {
      if presSub, err := presenceTopic.Subscribe(); err == nil {
        go func() {
          defer presSub.Cancel()
          for {
            msg, err := presSub.Next(ctx)
            if err != nil {
              return
            }
            if msg.ReceivedFrom == host.ID() {
              continue
            }
            var payload map[string]any
            if err := json.Unmarshal(msg.Data, &payload); err != nil {
              continue
            }
            fromID, _ := payload["from"].(string)
            rawAddrs, ok := payload["multiaddrs"].([]any)
            if fromID == "" || !ok {
              continue
            }
            addrs := make([]string, 0, len(rawAddrs))
            for _, item := range rawAddrs {
              if s, ok := item.(string); ok && s != "" {
                addrs = append(addrs, s)
              }
            }
            roomID, _ := payload["roomId"].(string)
            topologyID, _ := payload["topologyId"].(string)
            shardID, _ := payload["shardId"].(string)
            dirStore.upsert(fromID, peerDirectoryEntry{
              Multiaddrs: addrs,
              LastSeen:   time.Now().UnixMilli(),
              RoomID:     roomID,
              TopologyID: topologyID,
              ShardID:    shardID,
            })
          }
        }()
      }
    }
    go func() {
      ticker := time.NewTicker(time.Minute)
      defer ticker.Stop()
      for {
        select {
        case <-ticker.C:
          if expired := dirStore.pruneExpired(relayDirectoryTTLMs, time.Now().UnixMilli()); expired > 0 {
            log.Printf("[Directory] Expired %d entries", expired)
          }
        case <-ctx.Done():
          return
        }
      }
    }()
  }

  if relayTopicIdleTTLMs > 0 {
    idleTTL := time.Duration(relayTopicIdleTTLMs) * time.Millisecond
    go func() {
      ticker := time.NewTicker(time.Minute)
      defer ticker.Stop()
      for {
        select {
        case <-ticker.C:
          if pruned := registry.pruneIdle(idleTTL, time.Now()); pruned > 0 {
            log.Printf("[Relay] Unsubscribed %d idle dynamic topic(s)", pruned)
          }
        case <-ctx.Done():
          return
        }
      }
    }()
  }

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
