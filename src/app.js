import {
  binaryForward,
  denseForward,
  digitPatterns,
  languageExamples,
  softmax,
} from "./models.js";

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const fmt = (n) => Number(n).toFixed(2);
const pct = (n) => (100 * n).toFixed(1) + "%";
const colors = {
  teal: "#17665f",
  orange: "#ae522f",
  paper: "#fffefa",
  ink: "#182f36",
};
const stages = [
  {
    hash: "small",
    kicker: "01 / A NETWORK YOU CAN TRACE",
    title: "Two switches. One simple decision.",
    count: "12 parameters",
    description: "2 inputs → 2 hidden → 2 outputs",
    thread: "A neuron is a small calculation.",
  },
  {
    hash: "digits",
    kicker: "02 / THE SAME OPERATIONS, MORE CONNECTIONS",
    title: "From pixels to a predicted digit.",
    count: "746 parameters",
    description: "35 inputs → 16 hidden → 10 outputs",
    thread: "Weights now come from training.",
  },
  {
    hash: "language",
    kicker: "03 / SHARED BUILDING BLOCKS, ADDED STRUCTURE",
    title: "Now, scale up to language.",
    count: "~8 billion parameters",
    description: "Llama 3 8B · architecture reference",
    thread: "Attention adds context between tokens.",
  },
];
const state = {
  stage: 0,
  a: 1,
  b: 0,
  weight: 1,
  selected: 0,
  pixels: [...digitPatterns[7]],
  digit: 7,
  country: "France",
  part: "attention",
  step: 0,
  model: null,
  modelError: false,
  present: false,
};
const tour = {
  active: false,
  playing: false,
  elapsed: 0,
  last: 0,
  event: -1,
  raf: null,
};
const content = $("#stage-content");

function probabilities(p, labels) {
  const max = Math.max(...p);
  const winner =
    p.filter((v) => Math.abs(v - max) < 1e-12).length > 1 ? -1 : p.indexOf(max);
  return p
    .map(
      (value, i) =>
        `<div class="probability-row ${i === winner ? "winner" : ""}"><span>${labels[i]}</span><div class="bar-track"><div class="bar-fill" style="width:${value * 100}%"></div></div><output aria-label="${labels[i]} probability">${pct(value)}</output></div>`,
    )
    .join("");
}
function svgNode(x, y, r, value, label, options = {}) {
  const { selected = false, id = "", level = 0, small = false } = options;
  const fill =
    level > 0.05
      ? `color-mix(in srgb, #8eb69a ${Math.min(75, level * 65)}%, #fffefa)`
      : "#fffefa";
  return `<g class="${id ? "node" : ""} ${selected ? "selected" : ""}" ${id ? `data-neuron="${id}" role="button" tabindex="0" aria-label="Inspect hidden neuron ${Number(id) + 1}"` : ""}><circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${level > 0.05 ? colors.teal : "#afbeb1"}" stroke-width="${selected ? 3 : 1.4}"/>${value !== "" ? `<text class="node-text" x="${x}" y="${y + 5}" text-anchor="middle" style="font-size:${small ? 9 : 16}px">${value}</text>` : ""}${label ? `<text class="node-caption" x="${x}" y="${y + r + 18}" text-anchor="middle">${label}</text>` : ""}</g>`;
}
function edge(
  x1,
  y1,
  x2,
  y2,
  w,
  opacity = 0.4,
  width = 1.4,
  label = false,
  flow = false,
  phase = 0,
) {
  const color = w >= 0 ? colors.teal : colors.orange;
  const path = `M${x1} ${y1}L${x2} ${y2}`;
  return `<path class="edge" d="${path}" fill="none" stroke="${color}" stroke-width="${width}" opacity="${opacity}" ${w < 0 ? 'stroke-dasharray="4 3"' : ""}/>${label ? `<text class="weight-text" x="${x1 + (x2 - x1) * 0.32}" y="${y1 + (y2 - y1) * 0.32 - 8}" text-anchor="middle">${w > 0 ? "+" : ""}${Number.isInteger(w) ? w : fmt(w)}</text>` : ""}${flow ? `<circle r="3" class="signal" style="fill:${color}"><animateMotion dur="4s" begin="${phase}s" repeatCount="indefinite" path="${path}" keyPoints="0;0;1;1" keyTimes="0;0.1;0.45;1" calcMode="linear"/><animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.1;0.42;0.45;1" dur="4s" begin="${phase}s" repeatCount="indefinite"/></circle>` : ""}`;
}
function neuralSvg(data, large = false) {
  if (!large) {
    const xs = [90, 310, 530],
      ys = [103, 245];
    let lines = "";
    for (let i = 0; i < 2; i++)
      for (let j = 0; j < 2; j++)
        lines += edge(
          xs[0],
          ys[i],
          xs[1],
          ys[j],
          [
            [state.weight, -1],
            [-1, 1],
          ][j][i],
          data.input[i] ? 0.75 : 0.25,
          1.7,
          true,
          Boolean(data.input[i]),
          0,
        );
    for (let i = 0; i < 2; i++)
      for (let j = 0; j < 2; j++)
        lines += edge(
          xs[1],
          ys[i],
          xs[2],
          ys[j],
          j === 0 ? -4 : 4,
          data.hidden[i] ? 0.75 : 0.25,
          1.7,
          true,
          Boolean(data.hidden[i]),
          1.4,
        );
    const nodes =
      data.input
        .map((v, i) =>
          svgNode(xs[0], ys[i], 25, String(v), `Switch ${i ? "B" : "A"}`, {
            level: v,
          }),
        )
        .join("") +
      data.hidden
        .map((v, i) =>
          svgNode(xs[1], ys[i], 26, fmt(v), `h${i ? "₂" : "₁"} · ReLU`, {
            level: v,
            id: String(i),
            selected: state.selected === i,
          }),
        )
        .join("") +
      data.probabilities
        .map((v, i) =>
          svgNode(
            xs[2],
            ys[i],
            29,
            (100 * v).toFixed(0) + "%",
            i ? "ON" : "OFF",
            { level: v },
          ),
        )
        .join("");
    return `<svg class="network" viewBox="0 0 620 330" role="group" aria-label="Fully connected neural network with two inputs, two hidden neurons and two output probabilities"><text x="90" y="40" text-anchor="middle">INPUT</text><text x="310" y="40" text-anchor="middle">HIDDEN LAYER</text><text x="530" y="40" text-anchor="middle">OUTPUT</text>${lines}${nodes}</svg>`;
  }
  const xs = [72, 310, 548],
    positions = [35, 16, 10].map((n) =>
      Array.from({ length: n }, (_, i) => 64 + (260 * i) / (n - 1)),
    );
  const hmax = Math.max(1, ...data.hidden);
  let lines = "";
  state.model.w1.forEach((row, j) =>
    row.forEach((w, i) => {
      const sel = j === state.selected;
      lines += edge(
        xs[0],
        positions[0][i],
        xs[1],
        positions[1][j],
        w,
        sel ? (data.input[i] ? 0.65 : 0.18) : 0.035,
        sel ? 1.4 : 0.6,
      );
    }),
  );
  state.model.w2.forEach((row, j) =>
    row.forEach(
      (w, i) =>
        (lines += edge(
          xs[1],
          positions[1][i],
          xs[2],
          positions[2][j],
          w,
          i === state.selected ? 0.5 : 0.045,
          i === state.selected ? 1.4 : 0.7,
        )),
    ),
  );
  const nodes =
    data.input
      .map((v, i) => svgNode(xs[0], positions[0][i], 3.1, "", "", { level: v }))
      .join("") +
    data.hidden
      .map((v, i) =>
        svgNode(xs[1], positions[1][i], 6, "", "", {
          level: v / hmax,
          id: String(i),
          selected: state.selected === i,
        }),
      )
      .join("") +
    data.probabilities
      .map((v, i) =>
        svgNode(xs[2], positions[2][i], 10, String(i), "", {
          level: v,
          small: true,
        }),
      )
      .join("");
  return `<svg class="network" viewBox="0 0 620 380" role="group" aria-label="Digit network with 35 pixel inputs, 16 hidden neurons and 10 outputs; selected neuron's connections highlighted"><text class="node-caption" x="72" y="40" text-anchor="middle">35 pixels</text><text class="node-caption" x="310" y="40" text-anchor="middle">16 hidden neurons</text><text class="node-caption" x="548" y="40" text-anchor="middle">10 digits</text>${lines}${nodes}<text class="node-caption" x="310" y="352" text-anchor="middle">Click a hidden neuron to trace its connections</text></svg>`;
}
function attachNeuronHandlers() {
  $$("[data-neuron]").forEach((node) => {
    const select = () => {
      const focusId = node.dataset.neuron;
      state.selected = Number(focusId);
      updateNetwork();
      $(`[data-neuron="${focusId}"]`)?.focus({ preventScroll: true });
    };
    node.addEventListener("click", select);
    node.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        select();
      }
    });
  });
}
function binaryHTML() {
  return `<div class="workspace fade-in"><aside class="input-panel binary-input"><p class="panel-label">01 / Input <span class="tiny-dot"></span></p><h3 class="panel-title">Exactly one switch?</h3><p class="panel-copy">The light should be ON when one switch is on, and the other is off.</p><div class="switches">${["A", "B"].map((v, i) => `<div class="switch-row"><span>Switch ${v}</span><button id="switch-${v.toLowerCase()}" class="switch" role="switch" aria-label="Switch ${v}" aria-checked="${Boolean(i ? state.b : state.a)}"><span>${i ? state.b : state.a}</span><i class="toggle-knob"></i></button></div>`).join("")}</div><p class="hint-box"><strong>Try it:</strong> turn both on.<br>Two hidden neurons detect the two ways the switches can differ.</p><span class="model-badge">Hand-set weights · real calculation</span></aside><div class="network-panel"><div class="network-topline"><span>Every connection is visible</span><div class="network-legend"><span><i></i> +</span><span><i class="negative"></i> −</span></div></div><div id="network-drawing"></div><div class="network-bottomline"><span>Brighter node = stronger activation</span><span>Illustrated signal flow</span></div></div><aside class="output-panel"><p class="panel-label">03 / Output</p><div class="prediction"><span class="prediction-value" id="binary-result"></span></div><div class="probability-list" id="binary-probabilities" aria-live="polite"></div><p class="output-note">Two scores become two probabilities through <strong>softmax</strong>. Pick the larger one.</p><details class="output-math"><summary>Trace the output scores</summary><div id="output-equations"></div></details></aside></div><div class="trace"><div><p class="trace-title" id="trace-title"></p><p class="trace-copy">Multiply, add a bias, apply ReLU.<br>ReLU keeps positive values; otherwise 0.</p></div><div class="equation" id="trace-equation"></div><div class="weight-control"><label for="weight">Edit a weight: A → h₁ <output id="weight-value"></output></label><input id="weight" type="range" min="-2" max="2" step="0.1" value="${state.weight}" aria-label="Weight from switch A to hidden neuron 1"><button id="reset-weight" class="text-button">Reset weight to +1</button></div></div>`;
}
function digitsHTML() {
  if (!state.model)
    return `<div class="workspace" style="display:block;padding:40px"><h3>${state.modelError ? "The digit model could not load." : "Loading the small digit model…"}</h3><p>${state.modelError ? "Check the connection and reload this page. The two-outcome network and language schematic are still available." : "746 weights and biases; inference stays on this device."}</p>${state.modelError ? '<button id="retry-model" class="secondary-button">Retry loading</button>' : ""}</div>`;
  return `<div class="workspace digits-workspace fade-in"><aside class="input-panel"><p class="panel-label">01 / Input <span class="compact-count">5 × 7</span></p><div class="pixel-grid" role="group" aria-label="Editable 5 by 7 digit pixels">${state.pixels.map((v, i) => `<button class="pixel ${v ? "on" : ""}" data-pixel="${i}" aria-label="Pixel row ${Math.floor(i / 5) + 1}, column ${(i % 5) + 1}" aria-pressed="${Boolean(v)}"></button>`).join("")}</div><div class="digit-presets" aria-label="Choose an example digit">${digitPatterns.map((_, i) => `<button class="digit-preset ${state.digit === i ? "selected" : ""}" data-digit="${i}" aria-label="Load digit ${i}" aria-pressed="${state.digit === i}">${i}</button>`).join("")}</div><div class="input-tools"><button id="clear-pixels">Clear</button><button id="add-noise">Flip 3 pixels</button></div><p class="hint-box">Click or drag over pixels.<br>Every pixel is one number: 0 or 1.</p><span class="model-badge">Trained weights · live inference</span></aside><div class="network-panel"><div class="network-topline"><span>720 connections · 26 biases</span><div class="network-legend"><span><i></i> +</span><span><i class="negative"></i> −</span></div></div><div id="network-drawing"></div></div><aside class="output-panel"><p class="panel-label">03 / Prediction</p><div class="prediction"><span class="prediction-value" id="digit-result"></span></div><div class="probability-list" id="digit-probabilities" aria-live="polite"></div><p class="output-note" id="digit-note">Simple symbols, learned from examples.<br>A high probability can still be wrong.</p></aside></div><div class="trace"><div><p class="trace-title" id="trace-title"></p><p class="trace-copy">Same calculation. More inputs.<br>Weights learned by backpropagation.</p></div><div class="equation" id="trace-equation"></div><p class="scale-note"><strong>35 × 16 + 16<br>+ 16 × 10 + 10 = 746</strong><br>Every weight and bias counts.</p></div>`;
}
function languageHTML() {
  const ex = languageExamples[state.country];
  return `<div class="workspace llm-workspace fade-in"><aside class="input-panel"><p class="panel-label">01 / Context</p><label class="sr-only" for="country">Choose a prompt</label><select class="prompt-select" id="country">${Object.keys(
    languageExamples,
  )
    .map(
      (c) => `<option ${c === state.country ? "selected" : ""}>${c}</option>`,
    )
    .join(
      "",
    )}</select><div class="token-list" id="token-list">${ex.tokens.map((t) => `<span class="token">${t}</span>`).join("")}<span class="token next-token">?</span></div><p class="hint-box">Text becomes tokens, then vectors of numbers.<br><br>Real tokens can be words, parts of words, or punctuation. These chunks are simplified.</p><span class="model-badge">Schematic · no LLM running</span></aside><div class="llm-network"><div class="llm-label"><span>Inside a decoder-only transformer</span><span class="illustration-tag">Values are illustrative</span></div><div class="transformer-flow"><div class="embedding-block">Token embeddings</div><span class="flow-arrow">→</span><div class="stack-wrap"><div class="transformer-block"><div class="block-heading">Transformer block <span>× 32</span></div><div class="block-core"><p class="normalization">NORM + POSITION IN ATTENTION</p><button class="block-part ${state.part === "attention" ? "active" : ""}" data-part="attention" aria-pressed="${state.part === "attention"}">Self-attention<small>Mix information across tokens</small></button><div class="block-plus">↓</div><p class="normalization">NORM</p><button class="block-part ${state.part === "feedforward" ? "active" : ""}" data-part="feedforward" aria-pressed="${state.part === "feedforward"}">Feed-forward network<small>Transform each token’s features</small></button><div class="block-plus">↓</div></div><p class="block-footer">+ residual paths around both sublayers</p></div></div><span class="flow-arrow">→</span><div class="head-block">Final norm → scores → softmax</div></div><div><div class="block-ticks" aria-label="32 repeated transformer blocks">${Array.from({ length: 32 }, (_, i) => `<i class="${i < 4 ? "lit" : ""}"></i>`).join("")}</div><p class="block-footer">32 blocks · 4,096 features per token · schematic, not to scale</p></div></div><aside class="output-panel"><p class="panel-label">03 / Next token</p><div class="prediction"><span class="prediction-value" id="language-result">${ex.next[0]}</span></div><div class="probability-list" id="language-probabilities">${probabilities(softmax(ex.scores), ex.next)}</div><p class="output-note">Four invented candidate scores, for illustration. Real models score the full vocabulary.</p><button id="language-step" class="primary-button">Step through the process →</button><div class="step-status" id="step-status">Click a block to look inside.</div></aside></div><div class="trace llm-trace" id="language-trace"></div>`;
}
function renderStage(index, fromTour = false) {
  if (!fromTour && tour.playing) pauseTour();
  state.stage = index;
  state.selected = 0;
  const s = stages[index];
  $("#stage-kicker").textContent = s.kicker;
  $("#stage-title").textContent = s.title;
  $("#parameter-count").textContent = s.count;
  $("#parameter-description").textContent = s.description;
  $("#thread-note").textContent = s.thread;
  $$(".chapter").forEach((el, i) => {
    el.classList.toggle("active", i === index);
    if (i === index) el.setAttribute("aria-current", "step");
    else el.removeAttribute("aria-current");
  });
  $("#previous").disabled = index === 0;
  $("#next").disabled = index === 2;
  history.replaceState(null, "", "#" + s.hash);
  content.innerHTML =
    index === 0 ? binaryHTML() : index === 1 ? digitsHTML() : languageHTML();
  if (index === 0) {
    ["a", "b"].forEach((k) =>
      $(`#switch-${k}`).addEventListener("click", () => {
        state[k] = 1 - state[k];
        updateNetwork();
      }),
    );
    $("#weight").addEventListener("input", (e) => {
      state.weight = Number(e.target.value);
      updateNetwork();
    });
    $("#reset-weight").addEventListener("click", () => {
      state.weight = 1;
      $("#weight").value = 1;
      updateNetwork();
    });
    updateNetwork();
  } else if (index === 1 && state.model) {
    $$("[data-digit]").forEach((b) =>
      b.addEventListener("click", () => setDigit(Number(b.dataset.digit))),
    );
    $("#clear-pixels").addEventListener("click", () => {
      state.pixels.fill(0);
      state.digit = null;
      updateNetwork();
    });
    $("#add-noise").addEventListener("click", () => {
      const available = Array.from({ length: 35 }, (_, i) => i);
      for (let n = 0; n < 3; n++) {
        const i = available.splice(
          Math.floor(Math.random() * available.length),
          1,
        )[0];
        state.pixels[i] = 1 - state.pixels[i];
      }
      state.digit = null;
      updateNetwork();
    });
    let painting = false,
      paintValue = 0;
    const grid = $(".pixel-grid");
    grid.addEventListener("pointerdown", (e) => {
      const pixel = e.target.closest("[data-pixel]");
      if (!pixel) return;
      e.preventDefault();
      pixel.focus({ preventScroll: true });
      painting = true;
      paintValue = 1 - state.pixels[Number(pixel.dataset.pixel)];
      state.pixels[Number(pixel.dataset.pixel)] = paintValue;
      state.digit = null;
      grid.setPointerCapture(e.pointerId);
      updateNetwork();
    });
    grid.addEventListener("pointermove", (e) => {
      if (!painting) return;
      const p = document
        .elementFromPoint(e.clientX, e.clientY)
        ?.closest("[data-pixel]");
      if (p) {
        const i = Number(p.dataset.pixel);
        if (state.pixels[i] !== paintValue) {
          state.pixels[i] = paintValue;
          updateNetwork();
        }
      }
    });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((type) =>
      grid.addEventListener(type, () => (painting = false)),
    );
    grid.addEventListener("click", (e) => {
      if (e.detail !== 0) return;
      const pixel = e.target.closest("[data-pixel]");
      if (pixel) {
        const i = Number(pixel.dataset.pixel);
        state.pixels[i] = 1 - state.pixels[i];
        state.digit = null;
        updateNetwork();
      }
    });
    updateNetwork();
  } else if (index === 1)
    $("#retry-model")?.addEventListener("click", loadModel);
  else if (index === 2) {
    $("#country").addEventListener("change", (e) => {
      state.country = e.target.value;
      state.step = 0;
      renderStage(2);
    });
    $$("[data-part]").forEach((b) =>
      b.addEventListener("click", () => {
        state.part = b.dataset.part;
        renderLanguageTrace();
      }),
    );
    $("#language-step").addEventListener("click", languageStep);
    renderLanguageTrace();
  }
}
function updateNetwork() {
  if (state.stage === 0) {
    const d = binaryForward(state.a, state.b, state.weight);
    ["a", "b"].forEach((k) => {
      const b = $(`#switch-${k}`);
      b.setAttribute("aria-checked", Boolean(state[k]));
      b.querySelector("span").textContent = state[k];
    });
    $("#network-drawing").innerHTML = neuralSvg(d);
    $("#binary-result").textContent =
      Math.abs(d.probabilities[1] - d.probabilities[0]) < 1e-12
        ? "TIE"
        : d.probabilities[1] > d.probabilities[0]
          ? "ON"
          : "OFF";
    $("#binary-probabilities").innerHTML = probabilities(d.probabilities, [
      "OFF",
      "ON",
    ]);
    $("#output-equations").innerHTML =
      `OFF: 2 − 4h₁ − 4h₂ = ${fmt(d.logits[0])}<br>ON: −2 + 4h₁ + 4h₂ = ${fmt(d.logits[1])}<br><br>P(ON) = exp(${fmt(d.logits[1])}) / [exp(${fmt(d.logits[0])}) + exp(${fmt(d.logits[1])})]<br>= ${pct(d.probabilities[1])}`;
    const h = state.selected === 1 ? 1 : 0;
    $("#trace-title").textContent = `Inside hidden neuron h${h ? "₂" : "₁"}`;
    $("#trace-equation").innerHTML =
      h === 0
        ? `ReLU(${state.a} × ${fmt(state.weight)} + ${state.b} × −1 + 0)<br>= max(0, ${fmt(d.pre[0])}) = <b>${fmt(d.hidden[0])}</b>`
        : `ReLU(${state.a} × −1 + ${state.b} × 1 + 0)<br>= max(0, ${fmt(d.pre[1])}) = <b>${fmt(d.hidden[1])}</b>`;
    $("#weight-value").textContent =
      (state.weight >= 0 ? "+" : "") + fmt(state.weight);
  } else if (state.stage === 1 && state.model) {
    const d = denseForward(state.pixels, state.model);
    $$("[data-pixel]").forEach((b) => {
      const v = Boolean(state.pixels[Number(b.dataset.pixel)]);
      b.classList.toggle("on", v);
      b.setAttribute("aria-pressed", v);
    });
    $$("[data-digit]").forEach((b) => {
      const selected = Number(b.dataset.digit) === state.digit;
      b.classList.toggle("selected", selected);
      b.setAttribute("aria-pressed", selected);
    });
    $("#network-drawing").innerHTML = neuralSvg(d, true);
    const blank = state.pixels.every((v) => v === 0);
    $("#digit-result").textContent = blank
      ? "?"
      : d.probabilities.indexOf(Math.max(...d.probabilities));
    $("#digit-probabilities").innerHTML = probabilities(
      d.probabilities,
      Array.from({ length: 10 }, (_, i) => i),
    );
    $("#digit-note").textContent = blank
      ? "Blank input: there is no digit. The network still assigns probabilities to its ten classes."
      : "Trained on simple synthetic symbols. A high probability can still be wrong.";
    const h = state.selected;
    const sum = d.pre[h] - state.model.b1[h];
    $("#trace-title").textContent = `Inside hidden neuron ${h + 1}`;
    $("#trace-equation").innerHTML =
      `ReLU(Σ pixelᵢ × weightᵢ + bias)<br>= ReLU(${fmt(sum)} ${state.model.b1[h] >= 0 ? "+" : "−"} ${fmt(Math.abs(state.model.b1[h]))}) = <b>${fmt(d.hidden[h])}</b><small>35 weighted pixel values + one bias. Connections are highlighted above.</small>`;
  }
  attachNeuronHandlers();
}
function setDigit(digit) {
  state.pixels = [...digitPatterns[digit]];
  state.digit = digit;
  if (state.stage === 1) updateNetwork();
}
function renderLanguageTrace() {
  if (state.stage !== 2) return;
  $$("[data-part]").forEach((b) => {
    b.classList.toggle("active", b.dataset.part === state.part);
    b.setAttribute("aria-pressed", b.dataset.part === state.part);
  });
  const ex = languageExamples[state.country];
  if (state.part === "attention") {
    $("#language-trace").innerHTML =
      `<div><p class="trace-title">Attention adds context.</p><p class="trace-copy">An illustrative attention row for “is”.<br>Tokens can mix information from earlier tokens and themselves.</p></div><div class="attention-weights">${ex.tokens.map((t, i) => `<div class="attention-word ${i === 3 ? "strongest" : ""}"><div class="attention-track"><div class="attention-fill" style="height:${ex.attention[i] * 100}%"></div></div><span>${t}</span><small>${Math.round(ex.attention[i] * 100)}%</small></div>`).join("")}</div><p class="scale-note"><strong>softmax(QKᵀ / √d + M) V</strong><br>Q, K, V are learned projections. M masks future tokens. Displayed values are illustrative.</p>`;
  } else {
    $("#language-trace").innerHTML =
      `<div><p class="trace-title">A familiar network, inside.</p><p class="trace-copy">Each token passes through the same feed-forward network.</p></div><div><div class="feedforward-mini"><span class="mini-layer">${"<i></i>".repeat(9)}</span><span>→</span><span class="mini-layer">${"<i></i>".repeat(18)}</span><span>→</span><span class="mini-layer">${"<i></i>".repeat(9)}</span><span>Weighted transforms<br>+ a nonlinearity</span></div><p class="trace-copy" style="margin-top:9px">Llama uses a gated nonlinearity (SwiGLU), not the small demo’s ReLU.</p></div><p class="scale-note"><strong>Shared computational building blocks.</strong><br>More features, more layers, and learned representations make full explanations harder.</p>`;
  }
}
const stepDescriptions = [
  "1 / 4 · Tokens become vectors of numbers.",
  "2 / 4 · Attention mixes the available context.",
  "3 / 4 · Feed-forward layers transform features; blocks repeat.",
  "4 / 4 · Select a next token, append it, and repeat.",
];
function languageStep() {
  const step = state.step % 4;
  const ex = languageExamples[state.country];
  $("#step-status").textContent = stepDescriptions[step];
  if (step === 0) {
    $("#token-list").innerHTML =
      ex.tokens.map((t) => `<span class="token">${t}</span>`).join("") +
      '<span class="token next-token">?</span>';
    state.part = "attention";
  }
  if (step === 1) state.part = "attention";
  if (step === 2) state.part = "feedforward";
  if (step === 3)
    $("#token-list").innerHTML =
      ex.tokens.map((t) => `<span class="token">${t}</span>`).join("") +
      `<span class="token">${ex.next[0]}</span><span class="token next-token">?</span>`;
  $$(".block-ticks i").forEach((el, i) =>
    el.classList.toggle("lit", i < (step >= 2 ? 32 : step === 1 ? 16 : 4)),
  );
  $("#language-step").textContent =
    step === 3 ? "Replay the process ↺" : "Next step →";
  state.step++;
  renderLanguageTrace();
}
const storyEvents = [
  {
    at: 0,
    stage: 0,
    caption:
      "Start small. Two numbers enter a network with just twelve weights and biases.",
    action: () => {
      state.a = 1;
      state.b = 0;
      state.weight = 1;
    },
  },
  {
    at: 6,
    caption:
      "Each hidden neuron multiplies, adds, and applies a simple rule: keep positive values.",
    action: () => {
      state.selected = 0;
      updateNetwork();
    },
  },
  {
    at: 12,
    caption:
      "Turn both switches on. Neither hidden neuron detects a difference, so the output changes to OFF.",
    action: () => {
      state.b = 1;
      updateNetwork();
    },
  },
  {
    at: 18,
    caption:
      "Now only switch B is on. The other hidden neuron activates. You can trace the whole decision.",
    action: () => {
      state.a = 0;
      state.selected = 1;
      updateNetwork();
    },
  },
  {
    at: 25,
    stage: 1,
    caption:
      "A digit is a grid of numbers. This small trained network uses exactly the same kinds of operations.",
    action: () => {
      state.pixels = [...digitPatterns[7]];
      state.digit = 7;
    },
  },
  {
    at: 31,
    caption:
      "Thirty-five pixels pass through sixteen hidden neurons to ten output scores.",
    action: () => setDigit(3),
  },
  {
    at: 37,
    caption:
      "The weights were learned from examples. Change the pattern and the prediction changes.",
    action: () => setDigit(8),
  },
  {
    at: 43,
    caption:
      "More connections, same arithmetic. These 746 parameters remain small enough to inspect.",
    action: () => {
      state.selected = 8;
      updateNetwork();
    },
  },
  {
    at: 50,
    stage: 2,
    caption:
      "A language model also transforms numbers with learned weights — at a vastly larger scale.",
    action: () => {
      state.country = "France";
      state.step = 0;
      state.part = "attention";
    },
  },
  {
    at: 56,
    caption:
      "Transformers add attention: tokens mix information from their context. These values are illustrative.",
    action: () => {
      state.step = 1;
      languageStep();
    },
  },
  {
    at: 62,
    caption:
      "Inside every block is a feed-forward network: a familiar building block, repeated many times.",
    action: () => {
      state.step = 2;
      languageStep();
    },
  },
  {
    at: 68,
    caption:
      "The output scores possible next tokens. Select one, add it to the context, and repeat.",
    action: () => {
      state.step = 3;
      languageStep();
    },
  },
  {
    at: 73,
    caption:
      "The operations are understandable. Explaining the behavior learned by billions of parameters is much harder.",
  },
];
function applyStoryEvents() {
  let index = 0;
  for (let i = 0; i < storyEvents.length; i++)
    if (tour.elapsed >= storyEvents[i].at) index = i;
  if (index !== tour.event) {
    for (let i = tour.event + 1; i <= index; i++) {
      const event = storyEvents[i];
      if (event.stage !== undefined) {
        event.action?.();
        renderStage(event.stage, true);
      } else event.action?.();
    }
    tour.event = index;
    $("#story-caption").textContent = storyEvents[index].caption;
  }
}
function updateTourControls() {
  $("#play-label").textContent = tour.playing
    ? "Pause story"
    : tour.active && tour.elapsed < 75
      ? "Resume story"
      : tour.elapsed >= 75
        ? "Replay the story"
        : "Play the 75-second story";
  $("#play-icon").textContent = tour.playing ? "Ⅱ" : "▶";
  $("#play-story").setAttribute("aria-label", $("#play-label").textContent);
}
function tourFrame(now) {
  if (!tour.playing) return;
  if (tour.last)
    tour.elapsed = Math.min(75, tour.elapsed + (now - tour.last) / 1000);
  tour.last = now;
  applyStoryEvents();
  $("#story-progress").style.width = (tour.elapsed / 75) * 100 + "%";
  const seconds = Math.floor(tour.elapsed);
  $("#story-time").textContent =
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")} / 1:15`;
  if (tour.elapsed >= 75) {
    tour.playing = false;
    updateTourControls();
    return;
  }
  tour.raf = requestAnimationFrame(tourFrame);
}
function pauseTour() {
  tour.playing = false;
  cancelAnimationFrame(tour.raf);
  tour.last = 0;
  updateTourControls();
}
function toggleTour() {
  if (tour.playing) {
    pauseTour();
    return;
  }
  if (tour.elapsed >= 75) {
    tour.elapsed = 0;
    tour.event = -1;
  }
  // If the user explored a different chapter while paused, replay the current scene.
  const intended = tour.elapsed < 25 ? 0 : tour.elapsed < 50 ? 1 : 2;
  if (state.stage !== intended) {
    tour.elapsed = intended === 0 ? 0 : intended === 1 ? 25 : 50;
    tour.event = storyEvents.findIndex((e) => e.at === tour.elapsed) - 1;
  }
  tour.active = true;
  tour.playing = true;
  tour.last = 0;
  $("#story-strip").hidden = false;
  updateTourControls();
  tour.raf = requestAnimationFrame(tourFrame);
}
function restartTour() {
  pauseTour();
  tour.elapsed = 0;
  tour.event = -1;
  toggleTour();
}
function endTour() {
  pauseTour();
  tour.active = false;
  tour.elapsed = 0;
  tour.event = -1;
  $("#story-strip").hidden = true;
  updateTourControls();
}
function modal(id) {
  if (tour.playing) pauseTour();
  $(id).showModal();
}

$$("[data-stage]").forEach((b) =>
  b.addEventListener("click", () => renderStage(Number(b.dataset.stage))),
);
$("#previous").addEventListener("click", () =>
  renderStage(Math.max(0, state.stage - 1)),
);
$("#next").addEventListener("click", () =>
  renderStage(Math.min(2, state.stage + 1)),
);
$("#play-story").addEventListener("click", toggleTour);
$("#restart-story").addEventListener("click", restartTour);
$("#end-story").addEventListener("click", endTour);
$("#share").addEventListener("click", () => modal("#share-dialog"));
$("#about").addEventListener("click", () => modal("#about-dialog"));
$$("[data-close]").forEach((b) =>
  b.addEventListener("click", () => b.closest("dialog").close()),
);
$$("dialog").forEach((d) =>
  d.addEventListener("click", (e) => {
    if (e.target === d) {
      const r = d.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        d.close();
    }
  }),
);
$("#copy-link").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(
      "https://masannecklab.github.io/neural-networks-explained/",
    );
    $("#copy-link").textContent = "Copied!";
    setTimeout(() => ($("#copy-link").textContent = "Copy link"), 2000);
  } catch {
    $("#copy-link").textContent = "Select the address above";
    $(".share-address").style.userSelect = "all";
  }
});
$("#present").addEventListener("click", async () => {
  state.present = !state.present;
  document.body.classList.toggle("presenting", state.present);
  $("#present").innerHTML = state.present
    ? "⛶ <span>Exit presentation</span>"
    : "⛶ <span>Present</span>";
  if (state.present) {
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      /* Presentation layout also works without fullscreen permission. */
    }
  } else if (document.fullscreenElement) await document.exitFullscreen();
});
// Keep the compact recording layout if the browser exits fullscreen automatically.
// The Present button remains the explicit toggle for this layout.
document.addEventListener("keydown", (e) => {
  if (
    $("dialog[open]") ||
    ["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)
  )
    return;
  if (e.key === "ArrowRight") {
    e.preventDefault();
    renderStage(Math.min(2, state.stage + 1));
  }
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    renderStage(Math.max(0, state.stage - 1));
  }
  if (["1", "2", "3"].includes(e.key)) renderStage(Number(e.key) - 1);
  if (
    e.code === "Space" &&
    !["BUTTON", "A", "SUMMARY"].includes(document.activeElement?.tagName) &&
    document.activeElement?.getAttribute("role") !== "button"
  ) {
    e.preventDefault();
    toggleTour();
  }
  if (e.key === "Escape" && state.present) {
    state.present = false;
    document.body.classList.remove("presenting");
    $("#present").innerHTML = "⛶ <span>Present</span>";
  }
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && tour.playing) pauseTour();
});
window.addEventListener("hashchange", () => {
  const i = stages.findIndex((s) => location.hash === "#" + s.hash);
  if (i >= 0 && i !== state.stage) renderStage(i);
});

async function loadModel() {
  state.modelError = false;
  if (state.stage === 1) renderStage(1);
  try {
    const response = await fetch(
      new URL("../assets/digit-model.json", import.meta.url),
    );
    if (!response.ok) throw new Error("Model fetch failed");
    state.model = await response.json();
    const ev = state.model.metadata.evaluation;
    $("#evaluation-note").textContent =
      `Reproducible check: ${ev.correct}/${ev.n} fresh noisy samples of the same templates were classified correctly. This tests robustness to similar pixel noise, not generalization to new handwriting styles.`;
  } catch (error) {
    state.modelError = true;
    $("#evaluation-note").textContent =
      "Model metadata is unavailable. See the repository for training and evaluation details.";
    console.error(error.message);
  }
  if (state.stage === 1) renderStage(1, true);
}
const initial = stages.findIndex((s) => location.hash === "#" + s.hash);
renderStage(initial < 0 ? 0 : initial);
await loadModel();
