import test from "node:test";
import assert from "node:assert/strict";
import { preferredLanguage, translateText } from "../src/i18n.js";

test("German is the default regardless of missing, invalid, or inaccessible preferences", () => {
  assert.equal(preferredLanguage(), "de");
  assert.equal(preferredLanguage({ getItem: () => null }), "de");
  assert.equal(preferredLanguage({ getItem: () => "fr" }), "de");
  assert.equal(
    preferredLanguage({
      getItem: () => {
        throw new Error("storage blocked");
      },
    }),
    "de",
  );
  assert.equal(preferredLanguage({ getItem: () => "en" }), "en");
});

test("localization preserves numerical values and uses the appropriate decimal separator", () => {
  assert.equal(translateText("98.2%", "de"), "98,2 %");
  assert.equal(translateText("98.2%", "en"), "98.2%");
  assert.equal(translateText("max(0, 1.00)", "de"), "max(0; 1,00)");
  assert.equal(translateText("CC BY-SA 4.0", "de"), "CC BY-SA 4.0");
  assert.equal(
    translateText("OFF: 2 − 4h₁ − 4h₂ = -2.00", "de"),
    "AUS: 2 − 4h₁ − 4h₂ = -2,00",
  );
  assert.equal(
    translateText(
      "32 blocks · 4,096 features per token · schematic, not to scale",
      "de",
    ),
    "32 Blöcke · 4.096 Merkmale pro Token · schematisch, nicht maßstabsgetreu",
  );
});

test("dynamic accessible labels and evaluation limits are translated", () => {
  assert.equal(
    translateText("Inspect layer 3 neuron 12", "de"),
    "Schicht 3, Neuron 12 untersuchen",
  );
  assert.equal(
    translateText("Layer 2 · neuron 5", "de"),
    "Schicht 2 · Neuron 5",
  );
  assert.equal(
    translateText("Inputs: 24 activations from layer 1.", "de"),
    "Eingaben: 24 Aktivierungen aus Schicht 1.",
  );
  assert.equal(translateText("1,598 parameters", "de"), "1.598 Parameter");
  assert.equal(
    translateText("Pixel row 7, column 5", "de"),
    "Pixel in Zeile 7, Spalte 5",
  );
  assert.equal(
    translateText("OFF probability", "de"),
    "Wahrscheinlichkeit für AUS",
  );
  assert.equal(
    translateText("Inspect hidden neuron 16", "de"),
    "Verdecktes Neuron 16 untersuchen",
  );
  const source =
    "Reproducible check: 1985/2000 fresh noisy samples of the same templates were classified correctly. This tests robustness to similar pixel noise, not generalization to new handwriting styles.";
  assert.match(translateText(source, "de"), /1\.985\/2\.000/);
  assert.match(
    translateText(source, "de"),
    /nicht die Übertragbarkeit auf neue Handschriftstile/,
  );
});
