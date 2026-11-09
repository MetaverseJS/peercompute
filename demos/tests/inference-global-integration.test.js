// Real DOM, IndexedDB agents and VoiceSession. Model/audio execution and the
// transport adapter are controlled; separate transport tests exercise Noise.
import assert from "node:assert/strict";
import { writeFile, mkdir, mkdtemp, rm } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { chromium } from "playwright";
import { tmpdir } from "node:os";
import { join } from "node:path";
test("Global and Personal isolate context, drafts and agents while sharing named multimodal turns", { timeout: 120000 }, async () => {
  const repo = fileURLToPath(new URL("../../", import.meta.url));
  const evidence = process.env.GLOBAL_CHAT_EVIDENCE;
  if (evidence) await mkdir(evidence, { recursive: true });
  const report = { startedAt: (new Date()).toISOString(), checks: [], pageErrors: [], consoleErrors: [], externalRequests: [] };
  const save = () => evidence ? writeFile(evidence + "/report.json", JSON.stringify(report, null, 2)) : Promise.resolve();
  let server, browser, cache, context, page, phase = "startup";
  const check = (label) => {
    report.checks.push({ label, at: (new Date()).toISOString() });
    console.log("PASS " + label);
  };
  async function mount(options = {}) {
    await page.evaluate(async (options2) => {
      const [{ mountInferencePanel }, { AgentRecordStore }, { AgentRuntime }, { createAgentModelAdapter }] = await Promise.all([
        import("/demos/inference/src/agentPanel.js"),
        import("/peercompute/src/peercompute/agents/AgentRecordStore.js"),
        import("/peercompute/src/peercompute/agents/AgentRuntime.js"),
        import("/demos/inference/src/agentModelAdapter.js")
      ]);
      window.calls = [];
      window.publications = [];
      window.serviceRecords = [];
      window.control = {};
      window.captureActive = false;
      const base = [["chat", "Fixture reasoning", "image-text-to-text", ["text", "image"], ["text"]], ["image", "Fixture image", "text-to-image", ["text"], ["image"]], ["asr", "Fixture recognition", "automatic-speech-recognition", ["audio"], ["text"]], ["tts", "Fixture speech", "text-to-speech", ["text"], ["audio"]]];
      const descriptors = base.map(([manifestCid, name, task, modalities, outputModalities]) => ({ key: "local:" + manifestCid, manifestCid, name, task, modalities, outputModalities, runtime: "test-managed-runtime", available: true, local: true, busy: false, queueAvailable: true }));
      const services = new Map(descriptors.map((d) => [d.manifestCid, { getStatus: () => ({ status: "ready", manifestCid: d.manifestCid, sessionId: "fixture-" + d.manifestCid }) }]));
      const pixels = () => ({ width: 2, height: 2, channels: 4, data: Uint8Array.from([255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 255, 255, 0, 255]) });
      const store = new AgentRecordStore({ name: "global-chat-acceptance" });
      await store.open();
      const runtime2 = {
        networkReady: true,
        networkManager: { isConnected: true, libp2p: { peerId: { toString: () => "acceptance-self" } } },
        store: { async getManifest(cid) {
          const d = descriptors.find((x) => x.manifestCid === cid);
          return { model: d };
        } },
        getPreferences: () => ({ sharing: true, hostInference: true }),
        listModelSources: () => [],
        listInferenceTargets: () => control.hidePeer ? descriptors : [...descriptors, { ...descriptors[0], key: "peer:chat", name: "Remote fixture reasoning", local: false }],
        getServiceForModel: (cid) => services.get(cid),
        getDiscoveryStatus: () => ({ connected: true, peerCount: 1, sharedModelCount: 2, hostedModelCount: 2 }),
        async refreshPeers() {
        },
        async listStoredModels() {
          return [];
        },
        async setSharing() {
        },
        async setHostInference() {
        },
        async unload() {
        },
        async cancel() {
        },
        async generate(target2, input) {
          input.signal?.throwIfAborted();
          const call = { type: "execute", target: target2, task: input.task, messages: structuredClone(input.messages), prompt: input.prompt, image: input.image ? Array.from(input.image.data) : null };
          calls.push(call);
          if (control.hold) {
            calls.push({ type: "held" });
            await new Promise((resolve) => {
              window.releaseGeneration = resolve;
              input.signal.addEventListener("abort", resolve, { once: true });
            });
            input.signal.throwIfAborted();
          }
          const descriptor = descriptors.find((x) => x.task === input.task) || descriptors[0];
          const route = { local: true, target: descriptor.key, manifestCid: descriptor.manifestCid, modelName: descriptor.name, task: input.task };
          input.onProgress?.({ type: "routing", route });
          if (input.task === "automatic-speech-recognition") return { text: "Recognized global voice", route };
          if (input.task === "text-to-speech") return { audio: new Float32Array(1600).fill(0.1), sampleRate: 16000, route };
          if (input.task === "text-to-image") return { text: "", image: pixels(), route, finishReason: "stop" };
          const text = "Reply to " + String(input.messages?.at(-1)?.content ?? input.prompt ?? "").replace(/\n\nBe concise\.$/, "");
          input.onToken?.(text);
          return { text, route, finishReason: "stop" };
        },
        async getAgentController() {
          return controller;
        },
        async dispose() {
          await controller.dispose();
          await store.destroy();
          calls.push({ type: "runtime-disposed" });
        }
      };
      const controller = new AgentRuntime({ store, inference: createAgentModelAdapter(runtime2) });
      window.nativeController = controller;
      const record = await controller.create({ name: "Private Ada", instructions: "You are Private Ada.", goals: ["Help the visitor"], summary: "NEVER_PUBLISH_AGENT_MEMORY", inferenceMode: "local-only" });
      await controller.resume(record.agentId);
      window.agentId = record.agentId;
      window.runtime = runtime2;
      window.globalChatFactory = ({ getNetworkManager, onEvent, onStatus }) => {
        const service = {
          started: false,
          closed: false,
          events: [],
          async start() {
            service.started = true;
            calls.push({ type: "global-start" });
            onStatus?.(service.getStatus());
          },
          async publish(input, { signal } = {}) {
            signal?.throwIfAborted();
            if (service.closed) throw Error("closed");
            const event = { ...structuredClone(input), id: crypto.randomUUID(), peerId: "acceptance-self", timestamp: Date.now() };
            publications.push(event);
            service.events.push(event);
            await onEvent(event);
            return { event, delivery: { sent: 1, failed: 0, peerCount: 1 } };
          },
          async refresh() {
            calls.push({ type: "global-refresh" });
            onStatus?.("Global connected. Recent messages are available while their authors stay online.");
            return service.getStatus();
          },
          getStatus() {
            return { connected: true, peerCount: 1, eventCount: service.events.length, cacheBytes: 0, errors: [] };
          },
          async close() {
            service.closed = true;
            calls.push({ type: "global-close" });
          }
        };
        window.injectGlobal = async (input) => {
          const event = { ...structuredClone(input), id: input.id ?? crypto.randomUUID(), peerId: input.peerId ?? "acceptance-other", timestamp: Date.now() };
          await onEvent(event);
        };
        serviceRecords.push(service);
        return service;
      };
      window.panel = await mountInferencePanel({
        container: document.querySelector("#app"),
        runtimeFactory: async () => runtime2,
        globalChatFactory,
        ...options2.sharedPanel ? {} : { enableGlobalChat: true },
        managementOnly: !!options2.managementOnly,
        refreshIntervalMs: 600000,
        audioFactory: async () => ({ async startRecording({ signal }) {
          signal.throwIfAborted();
          captureActive = true;
          calls.push({ type: "capture-start" });
        }, async stopRecording() {
          captureActive = false;
          return { samples: new Float32Array(1600), sampleRate: 16000 };
        }, async cancelRecording() {
          captureActive = false;
        }, async play(result) {
          calls.push({ type: "play", samples: result.audio.length });
        }, async stopPlayback() {
        }, async dispose() {
          calls.push({ type: "audio-disposed" });
        } })
      });
      await panel.startupReady;
      await panel.refreshPeers();
    }, options);
  }
  const tab = (name) => page.getByRole("tab", { name, exact: true });
  const prompt = () => page.getByLabel("Message", { exact: true });
  const activeLog = () => page.getByRole("log");
  const send = async (text) => {
    await prompt().fill(text);
    await page.getByRole("button", { name: "Send", exact: true }).click();
    await page.waitForFunction(() => !document.querySelector('[aria-label="Chat target"]').disabled);
  };
  async function clickTab(name) {
    await tab(name).click();
    assert.equal(await tab(name).getAttribute("aria-selected"), "true");
  }
  async function target(key) {
    await page.getByRole("button", { name: "Chat options", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Chat options", exact: true });
    await dialog.getByLabel("Chat target", { exact: true }).selectOption(key);
    await dialog.getByRole("button", { name: "Done", exact: true }).click();
  }
  async function attach() {
    const encoded = await page.evaluate(() => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 2;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, 2, 2);
      return canvas.toDataURL("image/png").split(",")[1];
    });
    await page.getByLabel("Choose image attachment", { exact: true }).setInputFiles({ name: "colored.png", mimeType: "image/png", buffer: Buffer.from(encoded, "base64") });
    await page.locator(".pc-chat-attachment:not([hidden])").waitFor();
  }
  try {
    cache = await mkdtemp(join(tmpdir(), "pc-global-ui-"));
    const html = '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><style>html,body{margin:0;height:100%;background:#0c1813}</style></head><body><main class="pc-inference-standalone" id="app"></main></body></html>';
    server = await createServer({ configFile: false, root: repo, cacheDir: cache, logLevel: "error", optimizeDeps: { entries: ["demos/inference/src/agentPanel.js"] }, server: { host: "127.0.0.1", port: 0, hmr: false }, plugins: [{ name: "global-acceptance", configureServer(vite) {
      vite.middlewares.use("/__global_acceptance", (_, res) => {
        res.setHeader("Content-Type", "text/html");
        res.end(html);
      });
    } }] });
    await server.listen();
    const origin = "http://127.0.0.1:" + server.httpServer.address().port;
    browser = await chromium.launch({ executablePath: "/opt/google/chrome/chrome", headless: true, args: ["--disable-gpu"] });
    context = await browser.newContext({ viewport: { width: 1200, height: 900 } });
    page = await context.newPage();
    page.setDefaultTimeout(15e3);
    page.on("pageerror", (error) => report.pageErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") report.consoleErrors.push(message.text());
    });
    await page.route("**/*", (route) => {
      if (new URL(route.request().url()).origin === origin) return route.continue();
      report.externalRequests.push(route.request().url());
      return route.abort();
    });
    await page.goto(origin + "/__global_acceptance");
    await mount();
    phase = "default";
    assert.equal(await tab("Global").getAttribute("aria-selected"), "true");
    assert.equal(await activeLog().count(), 1);
    assert.equal(await page.evaluate(() => publications.length), 0);
    check("Default Global, one visible conversation, no unsolicited publication");
    const nameInput = page.getByLabel("Display name", { exact: true });
    await nameInput.fill("Acceptance Alice");
    await nameInput.blur();
    await send("Public first");
    await activeLog().getByText("Reply to Public first", { exact: true }).waitFor();
    let events = await page.evaluate(() => publications.map((e) => ({ phase: e.phase, text: e.text, name: e.name, turnId: e.turnId })));
    assert.equal(events.length, 2);
    assert.deepEqual(events.map((e) => e.phase), ["prompt", "result"]);
    assert(events.every((e) => e.name === "Acceptance Alice"));
    assert.equal(events[0].turnId, events[1].turnId);
    check("Named public prompt and result share one turn");
    phase = "privacy";
    await prompt().fill("Unsent global draft");
    await clickTab("Personal");
    assert.equal(await prompt().inputValue(), "");
    await send("PERSONAL_SECRET_1");
    assert.equal(await page.evaluate(() => publications.length), 2);
    assert.doesNotMatch(await activeLog().textContent(), /Public first/);
    await prompt().fill("Unsent personal draft");
    await clickTab("Global");
    assert.equal(await prompt().inputValue(), "Unsent global draft");
    assert.doesNotMatch(await activeLog().textContent(), /PERSONAL_SECRET/);
    await send("Public second");
    const publicCall = await page.evaluate(() => calls.filter((c) => c.type === "execute").at(-1));
    assert.match(JSON.stringify(publicCall.messages), /Public first/);
    assert.doesNotMatch(JSON.stringify(publicCall.messages), /PERSONAL_SECRET/);
    await clickTab("Personal");
    assert.equal(await prompt().inputValue(), "Unsent personal draft");
    await send("PERSONAL_SECRET_2");
    const personalCall = await page.evaluate(() => calls.filter((c) => c.type === "execute").at(-1));
    assert.match(JSON.stringify(personalCall.messages), /PERSONAL_SECRET_1/);
    assert.doesNotMatch(JSON.stringify(personalCall.messages), /Public first|Public second/);
    assert.doesNotMatch(await page.evaluate(() => JSON.stringify(publications)), /PERSONAL_SECRET/);
    check("Independent drafts and LLM context; no Personal publication");
    phase = "remote";
    await clickTab("Global");
    const before = await page.evaluate(() => calls.filter((c) => c.type === "execute").length);
    await page.evaluate(async () => {
      await injectGlobal({ turnId: "remote-turn", phase: "prompt", name: "Bob <script>", text: "REMOTE_PUBLIC_PROMPT" });
      await injectGlobal({ turnId: "remote-turn", phase: "result", name: "Bob <script>", modelName: "Remote reasoning", text: "REMOTE_PUBLIC_RESULT" });
    });
    await activeLog().getByText("REMOTE_PUBLIC_RESULT", { exact: true }).waitFor();
    assert.equal(await page.evaluate(() => calls.filter((c) => c.type === "execute").length), before);
    assert.equal(await page.locator('script:not([type="module"]):not([src])').count(), 0);
    await send("Public third");
    assert.doesNotMatch(JSON.stringify(await page.evaluate(() => calls.filter((c) => c.type === "execute").at(-1).messages)), /REMOTE_PUBLIC/);
    check("Remote Global feed renders safely without inference or context injection");
    phase = "images";
    await attach();
    await send("Describe these colors");
    await page.waitForFunction(() => publications.some((e) => e.phase === "prompt" && e.image));
    assert(await activeLog().locator("img").count() > 0);
    await page.getByLabel("Generate image", { exact: true }).check();
    await send("Draw colored squares");
    await page.waitForFunction(() => publications.some((e) => e.phase === "result" && e.image));
    assert(await activeLog().locator("img").count() >= 2);
    check("Public image attachment and generated image both rendered and shared");
    phase = "voice";
    await page.getByLabel("Speak replies", { exact: true }).check();
    const talk = page.getByRole("button", { name: "Talk", exact: true });
    const box = await talk.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.waitForFunction(() => captureActive);
    assert(await tab("Personal").isDisabled());
    assert(await nameInput.isDisabled());
    await page.mouse.up();
    await page.waitForFunction(() => publications.some((e) => e.phase === "audio"));
    await page.waitForFunction(() => !document.querySelector('[aria-label="Chat target"]').disabled);
    assert(await activeLog().locator("audio[controls]").count() > 0);
    assert.equal(await activeLog().locator("audio[autoplay]").count(), 0);
    assert.match(await page.evaluate(() => JSON.stringify(publications.filter((e) => e.phase === "prompt"))), /Recognized global voice/);
    check("Hold-to-record publishes transcription and optional PCM reply, origin locked, no remote autoplay");
    phase = "agents";
    await page.getByRole("button", { name: "Agents", exact: true }).click();
    assert.equal(await tab("Personal").getAttribute("aria-selected"), "true");
    const agentDialog = page.getByRole("dialog", { name: "Agents", exact: true });
    await agentDialog.getByRole("button", { name: "Chat", exact: true }).first().click();
    await page.waitForFunction(() => document.querySelector('[aria-label="Chat target"]').value.startsWith("agent:"));
    await send("PERSONAL_AGENT_SECRET");
    await activeLog().getByText("Reply to PERSONAL_AGENT_SECRET", { exact: true }).waitFor();
    assert.match(JSON.stringify(await page.evaluate(() => calls.filter((c) => c.type === "execute").at(-1).messages)), /NEVER_PUBLISH_AGENT_MEMORY/);
    assert.doesNotMatch(await page.evaluate(() => JSON.stringify(publications)), /PERSONAL_AGENT_SECRET|NEVER_PUBLISH_AGENT_MEMORY/);
    check("Agents stay Personal and private identity/history never broadcast");
    phase = "agent-roundtrip";
    const beforeRoundtrip = await page.evaluate(() => publications.length);
    await clickTab("Global");
    await clickTab("Personal");
    assert.equal(await page.getByLabel("Chat target", { exact: true }).inputValue(), "agent:" + await page.evaluate(() => agentId));
    await send("PERSONAL_AGENT_FOLLOWUP");
    await activeLog().getByText("Reply to PERSONAL_AGENT_FOLLOWUP", { exact: true }).waitFor();
    assert.equal(await page.evaluate(() => publications.length), beforeRoundtrip);
    assert.match(JSON.stringify(await page.evaluate(() => calls.filter((c) => c.type === "execute").at(-1).messages)), /NEVER_PUBLISH_AGENT_MEMORY|PERSONAL_AGENT_SECRET/);
    check("Agent selection and private model context survive Global roundtrip");
    phase = "vanished-peer";
    await target("peer:chat");
    await prompt().fill("Keep this peer-specific draft");
    await page.evaluate(async () => {
      control.hidePeer = true;
      await panel.refreshPeers();
    });
    await clickTab("Global");
    await clickTab("Personal");
    assert.equal(await page.getByLabel("Chat target", { exact: true }).inputValue(), "peer:chat");
    assert.equal(await page.getByLabel("Chat target", { exact: true }).locator("option:checked").evaluate((option) => option.disabled), true, JSON.stringify(await page.evaluate(() => ({ hidePeer: control.hidePeer, targets: runtime.listInferenceTargets().map((t) => t.key), options: [...document.querySelector('[aria-label="Chat target"]').selectedOptions].map((o) => ({ value: o.value, disabled: o.disabled, text: o.textContent })) }))));
    assert.equal(await prompt().inputValue(), "Keep this peer-specific draft");
    assert(await page.getByRole("button", { name: "Send", exact: true }).isDisabled());
    check("Disappeared explicit peer stays unavailable across channel switch without rerouting");
    await target("mixed");
    phase = "visual";
    await clickTab("Global");
    for (const size of [{ width: 1280, height: 900, name: "desktop" }, { width: 390, height: 844, name: "mobile" }]) {
      await page.setViewportSize(size);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      const box2 = await page.getByRole("button", { name: "Send", exact: true }).boundingBox();
      assert(box2 && box2.x >= 0 && box2.y + box2.height <= size.height);
      if (evidence) await page.screenshot({ path: evidence + "/global-" + size.name + ".png" });
    }
    check("Desktop and mobile Global controls fit viewport");
    phase = "persistence";
    await page.evaluate(() => panel.dispose());
    assert(await page.evaluate(() => serviceRecords.every((s) => s.closed)));
    await mount();
    assert.equal(await nameInput.inputValue(), "Acceptance Alice");
    check("Name persists across remount and owned Global service closes");
    phase = "shared-default";
    await page.evaluate(() => panel.dispose());
    await mount({ sharedPanel: true });
    assert.equal(await page.getByRole("tab", { name: "Global", exact: true }).count(), 0);
    assert.equal(await page.evaluate(() => serviceRecords.length), 0);
    check("Shared embedded panel stays Personal unless Global is explicitly enabled");
    phase = "embedded";
    await page.evaluate(() => panel.dispose());
    await mount({ managementOnly: true });
    assert.equal(await page.getByRole("tab", { name: "Global", exact: true }).count(), 0);
    assert.equal(await page.evaluate(() => serviceRecords.length), 0);
    check("Embedded world model management has no Global service or tabs");
    await page.evaluate(() => panel.dispose());
    assert.deepEqual(report.pageErrors, []);
    assert.deepEqual(report.consoleErrors, []);
    assert.deepEqual(report.externalRequests, []);
    report.ok = true;
    report.finishedAt = (new Date()).toISOString();
    await save();
  } catch (error) {
    report.ok = false;
    report.failedPhase = phase;
    report.error = error.stack;
    await save();
    try {
      if (evidence) await page?.screenshot({ path: evidence + "/failure.png" });
    } catch {
    }
    ;
    throw error;
  } finally {
    try {
      await page?.evaluate(async () => {
        window.releaseGeneration?.();
        await window.panel?.dispose();
      });
    } catch {
    }
    await context?.close();
    await browser?.close();
    await server?.close();
    if (cache) await rm(cache, { recursive: true, force: true });
  }
});
test("real Global session renders offline, flushes a strict public outbox and ignores only its authenticated local echo", async () => {
  const { createGlobalChatSession } = await import("../inference/src/ui/globalChatSession.js");
  const { prepareGlobalChatInput } = await import("../shared/chat/globalInferenceChatContracts.js");
  let manager, receive, started = 0, closed = 0;
  const visible = [], wire = [], statuses = [];
  const session = createGlobalChatSession({
    getNetworkManager: () => manager,
    onEvent: (event) => visible.push(event),
    onStatus: (status) => statuses.push(status),
    serviceFactory: ({ networkManager, onEvent }) => {
      assert.equal(networkManager, manager);
      receive = onEvent;
      return {
        async start() {
          started++;
        },
        async refresh() {
        },
        async close() {
          closed++;
        },
        getStatus: () => ({ connected: true }),
        async publish(input) {
          prepareGlobalChatInput(input);
          wire.push(structuredClone(input));
          onEvent({ ...input, peerId: "own-authenticated-peer", id: crypto.randomUUID(), local: true });
          return { delivery: { status: "delivered" } };
        }
      };
    }
  });
  try {
    const turnId = crypto.randomUUID();
    session.publish({
      turnId,
      phase: "prompt",
      name: "Alice\u{1F642}".repeat(20),
      text: "Public question",
      part: 0,
      messages: [{ role: "system", content: "PERSONAL_SYSTEM_SECRET" }],
      record: { memory: "PRIVATE_AGENT" }
    });
    session.publish({ turnId, phase: "result", name: "Alice", text: "Public reply", modelName: "" });
    assert.equal(started, 0);
    assert.equal(wire.length, 0);
    assert.equal(visible.length, 2);
    assert(statuses.some((status) => /offline/i.test(status)));
    assert(visible.every((event) => event.local === true));
    assert(new TextEncoder().encode(visible[0].name).length <= 80);
    await session.refresh();
    manager = { fixture: true };
    await session.refresh();
    for (let i = 0; i < 10 && wire.length < 2; i++) await new Promise((resolve) => setImmediate(resolve));
    assert.equal(started, 1);
    assert.equal(wire.length, 2);
    assert.equal(visible.length, 2);
    assert.equal("part" in wire[0], false);
    assert.equal("modelName" in wire[1], false);
    assert.doesNotMatch(JSON.stringify(wire), /PERSONAL_SYSTEM_SECRET|PRIVATE_AGENT|messages|record/);
    receive({ turnId, phase: "prompt", name: "Other peer", text: "Independent same UUID", peerId: "remote-authenticated-peer", id: crypto.randomUUID() });
    assert.equal(visible.length, 3);
    assert.equal(visible.at(-1).peerId, "remote-authenticated-peer");
    session.publish({
      turnId,
      phase: "audio",
      name: "Alice",
      text: "",
      part: 0,
      audio: { samples: new Float32Array(100), sampleRate: 16000 }
    });
    await session.refresh();
    for (let i = 0; i < 10 && wire.length < 3; i++) await new Promise((resolve) => setImmediate(resolve));
    assert.equal(wire.length, 3);
    assert.equal(wire[2].part, 0);
    assert(wire[2].audio.samples instanceof Float32Array);
  } finally {
    await session.close();
  }
  assert.equal(closed, 1);
  const count = visible.length;
  session.publish({ turnId: crypto.randomUUID(), phase: "prompt", name: "Closed", text: "Must not appear" });
  assert.equal(visible.length, count);
});
