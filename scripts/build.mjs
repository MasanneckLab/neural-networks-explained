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
const html = (await readFile("index.html", "utf8")).replace(
  './src/styles.css"',
  `./src/styles.css?v=${styleVersion}"`,
);
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
