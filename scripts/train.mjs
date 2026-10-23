import { writeFile } from "node:fs/promises";
import {
  digitPatterns,
  denseForward,
  denseGradients,
  seededRandom,
  parameterCount,
} from "../src/models.js";

const random = seededRandom(20261022);
const architecture = [35, 24, 16, 12, 10];
const model = {
  layers: architecture.slice(1).map((size, l) => ({
    weights: Array.from({ length: size }, () =>
      Array.from(
        { length: architecture[l] },
        () => (random() - 0.5) * Math.sqrt(24 / architecture[l]),
      ),
    ),
    biases: Array(size).fill(l === architecture.length - 2 ? 0 : 0.1),
  })),
};
const steps = 80000;
for (let step = 0; step < steps; step++) {
  const label = Math.floor(random() * 10);
  const input = digitPatterns[label].map((v) => (random() < 0.07 ? 1 - v : v));
  const gradients = denseGradients(input, model, label);
  const lr = 0.025 * (1 - (0.85 * step) / steps);
  model.layers.forEach((layer, l) => {
    layer.weights.forEach((row, j) => {
      row.forEach((w, i) => (row[i] = w - lr * gradients[l].weights[j][i]));
      layer.biases[j] -= lr * gradients[l].biases[j];
    });
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
  architecture,
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
