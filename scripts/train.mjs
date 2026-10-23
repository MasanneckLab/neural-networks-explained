import { writeFile } from "node:fs/promises";
import {
  digitPatterns,
  denseForward,
  seededRandom,
  parameterCount,
} from "../src/models.js";

const random = seededRandom(20261022);
const model = {
  w1: Array.from({ length: 16 }, () =>
    Array.from({ length: 35 }, () => (random() - 0.5) * Math.sqrt(24 / 35)),
  ),
  b1: Array(16).fill(0.1),
  w2: Array.from({ length: 10 }, () =>
    Array.from({ length: 16 }, () => (random() - 0.5) * Math.sqrt(24 / 16)),
  ),
  b2: Array(10).fill(0),
};
const steps = 80000;
for (let step = 0; step < steps; step++) {
  const label = Math.floor(random() * 10);
  const input = digitPatterns[label].map((v) => (random() < 0.07 ? 1 - v : v));
  const { hidden, pre, probabilities } = denseForward(input, model);
  const dz = probabilities.map((p, j) => p - Number(j === label));
  // Compute hidden gradients before mutating the output weights.
  const dh = hidden.map((_, h) =>
    pre[h] > 0 ? dz.reduce((s, d, j) => s + d * model.w2[j][h], 0) : 0,
  );
  const lr = 0.025 * (1 - (0.85 * step) / steps);
  model.w2.forEach((row, j) => {
    row.forEach((w, h) => (row[h] = w - lr * dz[j] * hidden[h]));
    model.b2[j] -= lr * dz[j];
  });
  model.w1.forEach((row, h) => {
    row.forEach((w, i) => (row[i] = w - lr * dh[h] * input[i]));
    model.b1[h] -= lr * dh[h];
  });
}
const evaluationRandom = seededRandom(571932);
let correct = 0;
const evalN = 2000;
for (let i = 0; i < evalN; i++) {
  const label = i % 10;
  const input = digitPatterns[label].map((v) =>
    evaluationRandom() < 0.07 ? 1 - v : v,
  );
  const p = denseForward(input, model).probabilities;
  if (p.indexOf(Math.max(...p)) === label) correct++;
}
const metadata = {
  architecture: [35, 16, 10],
  parameters: parameterCount(model),
  seed: 20261022,
  updates: steps,
  optimizer: "stochastic gradient descent",
  loss: "softmax cross-entropy",
  training:
    "On-the-fly 7% independent bit flips of ten original bitmap templates.",
  evaluation: {
    seed: 571932,
    n: evalN,
    correct,
    accuracy: correct / evalN,
    limitation:
      "Fresh noise draws from the SAME ten templates. Not an independent handwriting or novel-symbol validation.",
  },
};
await writeFile(
  new URL("../public/assets/digit-model.json", import.meta.url),
  JSON.stringify({ ...model, metadata }),
);
console.log(JSON.stringify(metadata, null, 2));
