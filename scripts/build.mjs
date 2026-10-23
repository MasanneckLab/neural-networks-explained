import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import QRCode from "qrcode";
const url = "https://masannecklab.github.io/neural-networks-explained/";
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });
await cp("src", "dist/src", { recursive: true });
await cp("index.html", "dist/index.html");
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
