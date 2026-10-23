import test from "node:test";
import assert from "node:assert/strict";
import {
  flowSteps,
  flowDuration,
  sampleFlow,
  phaseTime,
} from "../src/signal-flow.js";
test("each network visits every layer in order before looping", () => {
  for (let stage = 0; stage < 3; stage++) {
    flowSteps[stage].forEach(([label, duration], phase) => {
      const at = phaseTime(stage, phase);
      const sample = sampleFlow(stage, at + duration / 2);
      assert.equal(sample.phase, phase);
      assert.equal(sample.label, label);
      assert.ok(Math.abs(sample.progress - 0.5) < 1e-12);
    });
    assert.equal(sampleFlow(stage, flowDuration(stage)).phase, 0);
    assert.equal(
      sampleFlow(stage, flowDuration(stage) - 0.001).phase,
      flowSteps[stage].length - 1,
    );
  }
});
test("digit propagation has all three hidden layers; transformer includes elided blocks before head", () => {
  assert.equal(flowSteps[1].length, 5);
  const labels = flowSteps[2].map(([label]) => label);
  assert.ok(
    labels.indexOf("Blocks 3–30 · same sequence, different weights") <
      labels.indexOf("Block 31 · attention + feed-forward"),
  );
  assert.ok(
    labels.indexOf("Block 32 · attention + feed-forward") <
      labels.indexOf("Final norm → vocabulary scores"),
  );
});

test("guided transformer flow visits all stages in order and holds the final output", async () => {
  const { transformerTourTime } = await import("../src/signal-flow.js");
  const seconds = [0, 3, 8, 10, 12, 13, 15, 16, 18, 21];
  seconds.forEach((second, phase) =>
    assert.equal(
      sampleFlow(2, transformerTourTime(second + 0.01)).phase,
      phase,
    ),
  );
  assert.equal(sampleFlow(2, transformerTourTime(25)).phase, 9);
});

test("one animation clock pauses, resumes, resets, and stops in hidden tabs", async () => {
  const { createSignalFlow } = await import("../src/signal-flow.js");
  const original = Object.fromEntries(
    [
      "document",
      "matchMedia",
      "requestAnimationFrame",
      "cancelAnimationFrame",
    ].map((k) => [k, globalThis[k]]),
  );
  const elements = new Map();
  const element = (selector) => {
    if (!elements.has(selector))
      elements.set(selector, {
        dataset: {},
        style: {},
        textContent: "",
        attributes: {},
        setAttribute(k, v) {
          this.attributes[k] = v;
        },
        classList: { add() {}, remove() {}, toggle() {} },
      });
    return elements.get(selector);
  };
  const callbacks = new Map(),
    events = new Map();
  let nextId = 0,
    now = 0;
  const media = { matches: false, addEventListener() {} };
  globalThis.document = {
    hidden: false,
    querySelector: element,
    querySelectorAll: () => [],
    addEventListener: (event, callback) => events.set(event, callback),
  };
  globalThis.matchMedia = () => media;
  globalThis.requestAnimationFrame = (cb) => {
    callbacks.set(++nextId, cb);
    return nextId;
  };
  globalThis.cancelAnimationFrame = (id) => callbacks.delete(id);
  const frame = () => {
    now += 100;
    const pending = [...callbacks.values()];
    callbacks.clear();
    pending.forEach((cb) => cb(now));
  };
  try {
    const flow = createSignalFlow(() => {});
    flow.reset(0);
    flow.start();
    for (let i = 0; i < 20; i++) frame();
    assert.equal(element("#signal-controls").dataset.phase, 1);
    flow.setPlaying(false);
    const paused = element("#flow-progress").style.width;
    for (let i = 0; i < 30; i++) frame();
    assert.equal(element("#flow-progress").style.width, paused);
    assert.equal(callbacks.size, 0);
    flow.setPlaying(true);
    flow.setPlaying(true);
    assert.equal(
      callbacks.size,
      1,
      "repeated play never creates duplicate clocks",
    );
    frame();
    frame();
    assert.notEqual(element("#flow-progress").style.width, paused);
    flow.step();
    assert.equal(flow.playing, false);
    assert.equal(element("#signal-controls").dataset.phase, 2);
    flow.reset(1);
    assert.equal(element("#signal-controls").dataset.phase, 0);
    flow.setPlaying(true);
    document.hidden = true;
    events.get("visibilitychange")();
    assert.equal(flow.playing, false);
    assert.equal(callbacks.size, 0);
    media.matches = true;
    const reduced = createSignalFlow(() => {});
    reduced.reset(0);
    reduced.start();
    assert.equal(reduced.playing, false, "reduced motion does not autoplay");
  } finally {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete globalThis[key];
      else globalThis[key] = value;
    }
  }
});
