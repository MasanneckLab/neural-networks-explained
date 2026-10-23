import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  binaryForward,
  denseForward,
  softmax,
  parameterCount,
  digitPatterns,
  languageExamples,
  seededRandom,
} from "../src/models.js";
const model = JSON.parse(
  await readFile(
    new URL("../public/assets/digit-model.json", import.meta.url),
    "utf8",
  ),
);
test("two-output network implements all four XOR cases", () => {
  for (const [a, b] of [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ]) {
    const { probabilities: p, hidden } = binaryForward(a, b);
    assert.equal(p.indexOf(Math.max(...p)), a ^ b);
    assert.deepEqual(hidden, [Math.max(0, a - b), Math.max(0, b - a)]);
    assert.ok(Math.abs(p.reduce((x, y) => x + y) - 1) < 1e-12);
  }
});
test("weight editing changes an actual computation", () => {
  assert.ok(binaryForward(1, 0, 0).probabilities[0] > 0.9);
  assert.ok(binaryForward(1, 0, 1).probabilities[1] > 0.9);
});
test("stable softmax stays finite with large logits", () => {
  assert.deepEqual(softmax([1000, 1000]), [0.5, 0.5]);
});
test("digit model has 746 parameters and predicts all ten original symbols", () => {
  assert.equal(parameterCount(model), 746);
  digitPatterns.forEach((input, label) => {
    const { probabilities: p } = denseForward(input, model);
    assert.equal(p.indexOf(Math.max(...p)), label);
    assert.ok(Math.abs(p.reduce((a, b) => a + b) - 1) < 1e-12);
  });
});
test("held-out noise evaluation reproduces the saved result", () => {
  const random = seededRandom(model.metadata.evaluation.seed);
  let correct = 0;
  for (let i = 0; i < model.metadata.evaluation.n; i++) {
    const label = i % 10;
    const input = digitPatterns[label].map((v) =>
      random() < 0.07 ? 1 - v : v,
    );
    const p = denseForward(input, model).probabilities;
    correct += Number(p.indexOf(Math.max(...p)) === label);
  }
  assert.equal(correct, model.metadata.evaluation.correct);
  assert.ok(correct / model.metadata.evaluation.n > 0.9);
});
test("blank and fully lit inputs remain finite, without claiming a valid digit", () => {
  for (const value of [0, 1])
    assert.ok(
      denseForward(Array(35).fill(value), model).probabilities.every(
        Number.isFinite,
      ),
    );
});
test("illustrative attention rows are valid distributions", () => {
  for (const example of Object.values(languageExamples)) {
    assert.equal(example.tokens.length, example.attention.length);
    assert.ok(Math.abs(example.attention.reduce((a, b) => a + b) - 1) < 1e-12);
  }
});

test('an intermediate edited weight can produce a genuine tie', () => {
  assert.deepEqual(binaryForward(1, 0, 0.5).probabilities, [0.5, 0.5]);
});
