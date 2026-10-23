// All inference is local, deterministic, and independent of the visual layer.
export const relu = (x) => Math.max(0, x);
export function softmax(values) {
  const m = Math.max(...values);
  const exp = values.map((x) => Math.exp(x - m));
  const sum = exp.reduce((a, b) => a + b, 0);
  return exp.map((x) => x / sum);
}
export function binaryForward(a, b, weight = 1) {
  const pre = [a * weight - b, b - a];
  const hidden = pre.map(relu);
  const logits = [
    2 - 4 * hidden[0] - 4 * hidden[1],
    -2 + 4 * hidden[0] + 4 * hidden[1],
  ];
  return { input: [a, b], pre, hidden, logits, probabilities: softmax(logits) };
}
export function denseForward(input, model) {
  let values = input;
  const layers = model.layers.map(({ weights, biases }, index) => {
    const layerInput = values;
    const pre = weights.map((row, j) =>
      row.reduce((sum, w, i) => sum + w * layerInput[i], biases[j]),
    );
    values = index === model.layers.length - 1 ? pre : pre.map(relu);
    return { input: layerInput, pre, output: values };
  });
  return { input, layers, logits: values, probabilities: softmax(values) };
}
export function parameterCount(model) {
  return model.layers.reduce(
    (sum, layer) => sum + layer.weights.flat().length + layer.biases.length,
    0,
  );
}

// Cross-entropy gradients are computed for every layer before weights are changed.
export function denseGradients(input, model, label) {
  const forward = denseForward(input, model);
  let delta = forward.probabilities.map((p, j) => p - Number(j === label));
  const gradients = Array(model.layers.length);
  for (let l = model.layers.length - 1; l >= 0; l--) {
    gradients[l] = {
      weights: delta.map((d) => forward.layers[l].input.map((x) => d * x)),
      biases: [...delta],
    };
    if (l > 0) {
      delta = forward.layers[l - 1].pre.map((v, i) =>
        v > 0
          ? delta.reduce(
              (sum, d, j) => sum + d * model.layers[l].weights[j][i],
              0,
            )
          : 0,
      );
    }
  }
  return gradients;
}
export function seededRandom(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Original 5 × 7 bitmap patterns. These are synthetic symbols, not handwriting data.
export const digitPatterns = [
  ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
  ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
  ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
].map((rows) => rows.join("").split("").map(Number));

// These scores are authored illustrations, not measurements from Llama or an LLM.
export const languageExamples = {
  France: {
    tokens: ["The", "capital", "of", "France", "is"],
    next: ["Paris", "Lyon", "the", "a"],
    scores: [3.8, 1, 0.5, 0],
    attention: [0.03, 0.22, 0.05, 0.61, 0.09],
  },
  Italy: {
    tokens: ["The", "capital", "of", "Italy", "is"],
    next: ["Rome", "Milan", "the", "a"],
    scores: [3.5, 0.9, 0.4, 0],
    attention: [0.04, 0.23, 0.06, 0.57, 0.1],
  },
  Japan: {
    tokens: ["The", "capital", "of", "Japan", "is"],
    next: ["Tokyo", "Kyoto", "the", "a"],
    scores: [3.6, 1.1, 0.3, 0],
    attention: [0.03, 0.21, 0.05, 0.63, 0.08],
  },
};
