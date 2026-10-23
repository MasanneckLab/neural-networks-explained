# Neural networks, unpacked

An interactive lecture demo from **MasanneckLab**: follow the computation from a tiny two-outcome neural network, through a trained digit classifier, to the architecture of a large language model.

**[Open the live demo](https://masannecklab.github.io/neural-networks-explained/)** · **[Download lecture QR (PNG)](https://masannecklab.github.io/neural-networks-explained/assets/lecture-qr.png)** · **[QR as SVG](https://masannecklab.github.io/neural-networks-explained/assets/lecture-qr.svg)**

## For a lecture or screen recording

1. Open the demo in a desktop browser. A 1920 × 1080 recording works well.
2. Click **Present**, then **Play the 75-second story**. The guided sequence changes the inputs, moves through all three chapters, and displays short narration captions. It has no audio.
3. Pause to inspect a neuron, edit a weight, or change a pixel. The story can resume or restart. Changing chapters pauses it; backgrounding the tab also pauses it.
4. Finish with **Share / QR**. The QR opens the demo directly, without accounts or API keys. The PNG is 1200 × 1200 pixels, with a four-module quiet zone and medium error correction. The SVG is suitable for slides and print.

Keyboard: **← / →** or **1 / 2 / 3** switch chapters; **Space** plays or pauses the story when focus is outside an interactive control. **Escape** closes a dialog or exits fullscreen. Native controls retain their keyboard behavior. The layout supports phones and respects reduced-motion preferences for visual animations.

## What is real?

| Chapter | Network | Parameters | What the page actually does |
| --- | --- | ---: | --- |
| Two outcomes | 2 → 2 → 2, ReLU, softmax | 12 | Computes XOR with hand-set weights. Switches and weight editing run actual arithmetic. Hidden activations, logits, and softmax can be inspected. |
| Ten digits | 35 → 16 → 10, ReLU, softmax | 746 | Runs a trained classifier locally on editable 5 × 7 bitmap inputs. Shows all 720 connections and highlights those of a selected hidden neuron. |
| A language model | Decoder-only transformer schematic | ~8 billion, Llama 3 8B reference | Illustrates embeddings, attention, feed-forward layers, residual connections, normalization, repeated blocks, and next-token selection. No LLM is loaded or executed. |

The common idea is learned weighted computation and nonlinear transformation. A transformer is **not merely a wider multilayer perceptron**: attention mixes information across tokens, and other architectural components matter. Knowing the arithmetic or architecture does not fully explain a model's learned behavior. Even small learned networks do not automatically have human-interpretable hidden features.

### Two-outcome network

The task is exclusive OR: ON if exactly one switch is on. For binary inputs `a` and `b`:

```text
h1 = ReLU(a - b)
h2 = ReLU(b - a)
z_OFF = 2 - 4*h1 - 4*h2
z_ON  = -2 + 4*h1 + 4*h2
p = softmax([z_OFF, z_ON])
```

The slider replaces the first `a` coefficient with a chosen weight. The parameter count includes all weights and biases, including zeros: `2*2 + 2 + 2*2 + 2 = 12`. Softmax outputs are normalized scores, not calibrated confidence estimates. Nothing trains during interaction.

### Digit network: provenance and limits

The ten bitmap templates in `src/models.js` are original synthetic symbols. Training uses on-the-fly independent 7% pixel flips of these same templates. There is no external dataset and no MNIST dependency.

- Architecture: 35 inputs, 16 ReLU hidden units, 10 softmax outputs.
- Parameters: `35*16 + 16 + 16*10 + 10 = 746`.
- Optimizer: stochastic gradient descent, cross-entropy loss, 80,000 updates; learning rate decreases from 0.025 toward 0.00375.
- Training seed: `20261022`; evaluation seed: `571932`.
- Check: all ten clean symbols are classified correctly; **1,985/2,000 (99.25%)** fresh noisy versions of the same ten templates are correct.
- This is a within-template synthetic robustness check. It is **not independent validation on new symbol styles, real handwriting, or people**.
- The classifier always distributes probability across its ten classes. It has no learned rejection class. A high score on an arbitrary drawing can be wrong. The UI flags blank input rather than presenting it as a meaningful recognized digit, while still showing the model's numerical outputs.

`public/assets/digit-model.json` contains the full weights and evaluation metadata. `npm run train` rebuilds it deterministically, including its independent noise draws. Training and browser inference use the same forward implementation. All arithmetic is ordinary JavaScript; no Python environment is required.

### Transformer schematic: provenance and limits

The scale reference is **Meta Llama 3 8B (2024)**: 32 transformer blocks and 4,096 features per token. It is a concrete reference, not a claim about every LLM or the latest model.

The prompt chunks are simplified and do not reproduce Llama tokenization. Attention distributions and candidate logits are explicitly authored in `languageExamples`; only their four-way softmax normalization is computed. They are **not measured model outputs or attention explanations**. A real model scores its entire vocabulary, uses many attention heads, and repeats a much richer computation. The schematic compresses normalization, positional operations, and residual paths. Llama uses SwiGLU feed-forward layers rather than this demo's ReLU. No Llama weights or source code are bundled.

References:

- [Vaswani et al. (2017), Attention Is All You Need](https://arxiv.org/abs/1706.03762).
- [Meta's Llama 3 reference implementation](https://github.com/meta-llama/llama3/blob/main/llama/model.py): architecture defaults and transformer sublayers.
- [Meta's Llama 3 model card](https://github.com/meta-llama/llama3/blob/main/MODEL_CARD.md): 8B and 70B model families and model context.

## Local use

Requires Node.js 20 or newer. This is a static HTML/CSS/JavaScript site, with no runtime framework, account, analytics, external fonts, or inference API. QR generation is a build-time dependency; the deployed browser needs no package CDN.

```sh
npm ci
npm test
npm run build
npm run dev
```

Open the printed local URL (normally `http://127.0.0.1:4173`). The server serves `dist/`, so rebuild after editing. A local web server is needed for JavaScript modules and the model fetch; opening `index.html` as a file is not supported. Once served locally, the demo works without an internet connection.

```sh
npm run train  # optional: reproduce the committed model
npm test
npm run build
```

## Repository layout

```text
index.html                 Page shell, dialogs, model explanations
src/app.js                 Interactive diagrams, input handling, timed story
src/models.js              Inference functions, bitmap templates, illustrative LLM values
src/styles.css             Responsive layout and presentation mode
public/assets/             Original model weights and favicon
scripts/train.mjs          Reproducible synthetic digit training and evaluation
scripts/build.mjs          Static build and QR generation
scripts/serve.mjs          Local static preview
tests/models.test.mjs      Numerical and reproducibility checks
.github/workflows/pages.yml  Test, build, and deploy GitHub Pages
```

## Deployment

GitHub Pages uses **GitHub Actions** as its source. Pushes to `main` run the numerical tests, build the site, and deploy `dist/`. Pull requests test and build without deploying. The expected public URL is configured in `scripts/build.mjs` and the UI sharing links; update those when forking to another owner or repository.

## License

MIT for the demo's original code, synthetic templates, and trained toy weights. Referenced publications and third-party model names remain the property of their respective owners; this demo does not redistribute their implementations or weights.
