// Teaching timeline only: inference is already calculated; these seconds are not
// measurements of model latency. One clock drives every marker and highlight.
export const flowSteps = [
  [
    ["Input values", 1.2],
    ["Weighted sum + ReLU", 1.8],
    ["Output scores → probabilities", 2.2],
  ],
  [
    ["35 input pixels", 1.2],
    ["Hidden layer 1 · 24 neurons", 1.8],
    ["Hidden layer 2 · 16 neurons", 1.8],
    ["Hidden layer 3 · 12 neurons", 1.8],
    ["10 output probabilities", 2.2],
  ],
  [
    ["Tokens → embeddings", 1.8],
    ["Block 1 · attention mixes context", 2.2],
    ["Block 1 · projections + gate", 1.8],
    ["Block 1 · projection back", 1.8],
    ["Block 2 · attention + feed-forward", 1.6],
    ["Blocks 3–30 · same sequence, different weights", 2.4],
    ["Block 31 · attention + feed-forward", 1.6],
    ["Block 32 · attention + feed-forward", 1.6],
    ["Final norm → vocabulary scores", 1.8],
    ["Probabilities for the next token", 2.2],
  ],
];
export const flowDuration = (stage) =>
  flowSteps[stage].reduce((s, [, d]) => s + d, 0);
export function sampleFlow(stage, elapsed) {
  let time =
    ((elapsed % flowDuration(stage)) + flowDuration(stage)) %
    flowDuration(stage);
  for (let phase = 0; phase < flowSteps[stage].length; phase++) {
    const [label, duration] = flowSteps[stage][phase];
    if (time < duration) return { phase, progress: time / duration, label };
    time -= duration;
  }
  return { phase: 0, progress: 0, label: flowSteps[stage][0][0] };
}
export function phaseTime(stage, phase) {
  return flowSteps[stage].slice(0, phase).reduce((s, [, d]) => s + d, 0);
}
// Match the 25-second transformer chapter of the narrated sequence.
export function transformerTourTime(seconds) {
  const starts = [0, 3, 8, 10, 12, 13, 15, 16, 18, 21, 25];
  const time = Math.max(0, Math.min(24.999, seconds));
  const phase = starts.findIndex(
    (start, i) => time >= start && time < starts[i + 1],
  );
  return (
    phaseTime(2, phase) +
    (flowSteps[2][phase][1] * (time - starts[phase])) /
      (starts[phase + 1] - starts[phase])
  );
}
export function createSignalFlow(onPhase) {
  const $ = (s) => document.querySelector(s);
  const all = (s) => [...document.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let stage = 0,
    elapsed = 0,
    playing = !reduced.matches,
    last = null,
    raf = null;
  let externalClock = false;
  let previous = -1,
    nodes = [],
    markers = [],
    sketches = [];
  const targets = [
    ".embedding-block",
    '[data-part="attention"]',
    '[data-part="feedforward"]',
    '[data-part="feedforward"]',
    '[data-block="2"]',
    ".depth-gap",
    '[data-block="31"]',
    '[data-block="32"]',
    ".head-block",
    ".output-panel",
  ];
  function refresh() {
    nodes = all("[data-flow-node]");
    markers = all("[data-flow-edge]");
    sketches = all(
      '[data-part="feedforward"] [data-sketch-edge], .ffn-detail [data-sketch-edge]',
    );
  }
  function move(marker, progress, visible) {
    const [x1, y1, x2, y2] = marker.dataset.path.split(",").map(Number);
    marker.setAttribute("cx", x1 + (x2 - x1) * progress);
    marker.setAttribute("cy", y1 + (y2 - y1) * progress);
    marker.style.opacity = visible && !reduced.matches ? "1" : "0";
  }
  function draw() {
    const { phase, progress, label } = sampleFlow(stage, elapsed);
    const travel = Math.min(1, progress / 0.72);
    if (phase !== previous) {
      previous = phase;
      onPhase(stage, phase);
      refresh();
      $("#flow-label").textContent = label;
      $("#flow-counter").textContent =
        `${phase + 1} / ${flowSteps[stage].length}`;
    }
    $("#signal-controls").dataset.phase = phase;
    $("#flow-progress").style.width =
      `${(100 * (phase + progress)) / flowSteps[stage].length}%`;
    nodes.forEach((node) =>
      node.classList.toggle(
        "flow-node-active",
        Number(node.dataset.flowNode) ===
          (progress < 0.72 && phase > 0 ? phase - 1 : phase),
      ),
    );
    markers.forEach((marker) =>
      move(
        marker,
        travel,
        Number(marker.dataset.flowEdge) === phase - 1 &&
          travel > 0 &&
          travel < 1,
      ),
    );
    sketches.forEach((marker) =>
      move(
        marker,
        travel,
        stage === 2 &&
          Number(marker.dataset.sketchEdge) === phase - 2 &&
          travel > 0 &&
          travel < 1,
      ),
    );
    all(".flow-active").forEach((el) => el.classList.remove("flow-active"));
    if (stage === 2) {
      $(targets[phase])?.classList.add("flow-active");
      if (phase >= 1 && phase <= 3)
        $('[data-block="1"]')?.classList.add("flow-active");
      all(
        '[data-part="feedforward"] [data-sketch-node], .ffn-detail [data-sketch-node], [data-block="1"] [data-sketch-node]',
      ).forEach((node) =>
        node.classList.toggle(
          "flow-feature-active",
          phase >= 2 &&
            phase <= 3 &&
            Number(node.dataset.sketchNode) === phase - (travel < 1 ? 2 : 1),
        ),
      );
      const dot = $("#transformer-signal");
      const parent = $(".llm-workspace");
      const from = $(phase === 0 ? ".token-list" : targets[phase - 1]);
      const to = $(targets[phase]);
      if (dot && parent && from && to) {
        const a = from.getBoundingClientRect(),
          b = to.getBoundingClientRect(),
          r = parent.getBoundingClientRect();
        dot.style.left = `${a.left + a.width / 2 - r.left + (b.left + b.width / 2 - a.left - a.width / 2) * travel}px`;
        dot.style.top = `${a.top + a.height / 2 - r.top + (b.top + b.height / 2 - a.top - a.height / 2) * travel}px`;
        dot.hidden =
          reduced.matches || phase === 2 || phase === 3 || travel >= 1;
      }
    } else if (phase === flowSteps[stage].length - 1 && travel === 1) {
      $(".output-panel")?.classList.add("flow-active");
    }
  }
  function controls() {
    $("#flow-toggle").textContent = playing ? "Pause flow" : "Play flow";
    $("#flow-toggle").setAttribute("aria-pressed", String(playing));
  }
  function frame(now) {
    if (!playing) return;
    if (last !== null && !externalClock)
      elapsed += Math.min(0.1, (now - last) / 1000);
    last = now;
    draw();
    raf = requestAnimationFrame(frame);
  }
  function setPlaying(value) {
    cancelAnimationFrame(raf);
    playing = value;
    externalClock = false;
    last = null;
    controls();
    if (playing) raf = requestAnimationFrame(frame);
  }
  function reset(nextStage = stage) {
    stage = nextStage;
    externalClock = false;
    elapsed = 0;
    previous = -1;
    refresh();
    draw();
    controls();
  }
  function seek(phase, arrived = false) {
    elapsed =
      phaseTime(stage, phase) +
      (arrived ? flowSteps[stage][phase][1] * 0.85 : 0);
    previous = -1;
    draw();
  }
  function step() {
    setPlaying(false);
    seek(
      (sampleFlow(stage, elapsed).phase + 1) % flowSteps[stage].length,
      true,
    );
  }
  reduced.addEventListener("change", () => {
    setPlaying(false);
    draw();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) setPlaying(false);
  });
  return {
    reset,
    syncTour(seconds) {
      externalClock = true;
      elapsed = transformerTourTime(seconds);
      draw();
    },
    refresh,
    seek,
    step,
    setPlaying,
    get playing() {
      return playing;
    },
    start() {
      setPlaying(playing);
    },
  };
}
