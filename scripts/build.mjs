import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import QRCode from "qrcode";
const url = "https://masannecklab.github.io/neural-networks-explained/";
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });
await cp("src", "dist/src", { recursive: true });
// A changed stylesheet gets a fresh URL even when a visitor has the old CSS cached.
const styleVersion = createHash("sha256")
  .update(await readFile("src/styles.css"))
  .digest("hex")
  .slice(0, 12);
// Keep inference code, translations, and weights in sync for returning visitors.
const modelVersion = createHash("sha256");
for (const file of [
  "src/app.js",
  "src/signal-flow.js",
  "src/models.js",
  "src/i18n.js",
  "public/assets/digit-model.json",
])
  modelVersion.update(await readFile(file));
const moduleVersion = modelVersion.digest("hex").slice(0, 12);
const app = (await readFile("src/app.js", "utf8"))
  .replace('"./signal-flow.js"', `"./signal-flow.js?v=${moduleVersion}"`)
  .replace('"./models.js"', `"./models.js?v=${moduleVersion}"`)
  .replace('"./i18n.js"', `"./i18n.js?v=${moduleVersion}"`)
  .replace(
    '"../assets/digit-model.json"',
    `"../assets/digit-model.json?v=${moduleVersion}"`,
  );
await writeFile("dist/src/app.js", app);
const html = (await readFile("index.html", "utf8"))
  .replace('./src/styles.css"', `./src/styles.css?v=${styleVersion}"`)
  .replace('./src/app.js"', `./src/app.js?v=${moduleVersion}"`);
await writeFile("dist/index.html", html);
await writeFile("dist/.nojekyll", "");
await QRCode.toFile("dist/assets/lecture-qr.png", url, {
  width: 1200,
  margin: 4,
  errorCorrectionLevel: "M",
  color: { dark: "#152b32", light: "#ffffff" },
});
await writeFile(
  "dist/assets/lecture-qr.svg",
  await QRCode.toString(url, {
    type: "svg",
    margin: 4,
    errorCorrectionLevel: "M",
    color: { dark: "#152b32", light: "#ffffff" },
  }),
);
console.log("Built static site in dist/");
