package main

import (
	"context"
	"encoding/json"
	"testing"
	"time"

	libp2p "github.com/libp2p/go-libp2p"
	pubsub "github.com/libp2p/go-libp2p-pubsub"
	"github.com/libp2p/go-libp2p/p2p/protocol/circuitv2/relay"
)

func TestBuildGossipSubOptionsAppliesProductionConfig(t *testing.T) {
	raw := json.RawMessage(`{
		"D": 8,
		"Dhi": 16,
		"Dout": 1,
		"heartbeatInterval": 1000,
		"scoreParams": {
			"IPColocationFactorWeight": 0,
			"behaviourPenaltyWeight": 0,
			"topics": {
				"__default": {
					"meshMessageDeliveriesWeight": 0,
					"meshMessageDeliveriesThreshold": 0,
					"meshFailurePenaltyWeight": 0
				}
			}
		}
	}`)
	opts, params, score := buildGossipSubOptions(raw, nil, defaultRelayTopics)
	if params.D != 8 || params.Dhi != 16 || params.Dout != 1 {
		t.Fatalf("unexpected gossipsub params: D=%d Dhi=%d Dout=%d", params.D, params.Dhi, params.Dout)
	}
	if params.HeartbeatInterval != time.Second {
		t.Fatalf("expected HeartbeatInterval=1s, got %v", params.HeartbeatInterval)
	}
	if score == nil {
		t.Fatalf("expected scoreParams to be constructed")
	}
	if score.IPColocationFactorWeight != 0 {
		t.Fatalf("expected IPColocationFactorWeight=0, got %v", score.IPColocationFactorWeight)
	}
	if score.BehaviourPenaltyWeight != 0 {
		t.Fatalf("expected BehaviourPenaltyWeight=0, got %v", score.BehaviourPenaltyWeight)
	}
	if _, ok := score.Topics["peercompute-presence"]; !ok {
		t.Fatalf("expected __default topic score to expand onto peercompute-presence")
	}

	// Verify go-libp2p-pubsub accepts the generated options on a real host.
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	h, err := libp2p.New(libp2p.ListenAddrStrings("/ip4/127.0.0.1/tcp/0"))
	if err != nil {
		t.Fatalf("failed to start host: %v", err)
	}
	defer h.Close()

	ps, err := pubsub.NewGossipSub(ctx, h, opts...)
	if err != nil {
		t.Fatalf("NewGossipSub rejected generated options: %v", err)
	}
	if ps == nil {
		t.Fatalf("expected non-nil PubSub instance")
	}
}

func TestBuildGossipSubOptionsClampsInvalidDout(t *testing.T) {
	raw := json.RawMessage(`{"D": 4, "Dlo": 3, "Dhi": 6, "Dout": 5}`)
	_, params, _ := buildGossipSubOptions(raw, nil, defaultRelayTopics)
	if params.Dout > params.D/2 || params.Dout >= params.Dlo {
		t.Fatalf("expected Dout to be clamped below Dlo and D/2, got D=%d Dlo=%d Dout=%d", params.D, params.Dlo, params.Dout)
	}
}

func TestTopicRegistryControlOnlyAndIdleGC(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	h, err := libp2p.New(libp2p.ListenAddrStrings("/ip4/127.0.0.1/tcp/0"))
	if err != nil {
		t.Fatalf("failed to start host: %v", err)
	}
	defer h.Close()

	ps, err := pubsub.NewGossipSub(ctx, h)
	if err != nil {
		t.Fatalf("failed to start gossipsub: %v", err)
	}
	allow := map[string]struct{}{"peercompute-presence": {}}
	reg := newTopicRegistry(ps, []string{"pc.", "peercompute-"}, allow, true)

	if reg.allowed("pc.cubechat.room1.state") {
		t.Fatalf("control-only mode must reject .state data topic")
	}
	if reg.allowed("pc.cubechat.room1.shard.0:0:0") {
		t.Fatalf("control-only mode must reject .shard. data topic")
	}
	if !reg.allowed("pc.cubechat.room1.presence") {
		t.Fatalf("control-only mode must allow .presence control topic")
	}

	reg.ensureWithPin("peercompute-presence", true)
	reg.ensureIfAllowed("pc.cubechat.room1.presence")
	if len(reg.topics) != 2 {
		t.Fatalf("expected 2 registered topics, got %d", len(reg.topics))
	}

	// Simulate idle expiration: pinned default stays, dynamic unpinned topic is pruned.
	future := time.Now().Add(15 * time.Minute)
	pruned := reg.pruneIdle(10*time.Minute, future)
	if pruned != 1 {
		t.Fatalf("expected 1 pruned idle topic, got %d", pruned)
	}
	if _, ok := reg.topics["peercompute-presence"]; !ok {
		t.Fatalf("pinned topic must never be pruned")
	}
	if _, ok := reg.topics["pc.cubechat.room1.presence"]; ok {
		t.Fatalf("idle dynamic topic should have been pruned")
	}
}

func TestBuildCircuitRelayOptionsBoundedByDefault(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	_ = ctx
	h, err := libp2p.New(libp2p.ListenAddrStrings("/ip4/127.0.0.1/tcp/0"))
	if err != nil {
		t.Fatalf("failed to start host: %v", err)
	}
	defer h.Close()

	opts := buildCircuitRelayOptions(relay.DefaultResources(), false, 1800, 32)
	svc, err := relay.New(h, opts...)
	if err != nil {
		t.Fatalf("failed to construct bounded circuit relay: %v", err)
	}
	defer svc.Close()
}
