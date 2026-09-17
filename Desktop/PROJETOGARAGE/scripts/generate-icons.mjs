// Gera os ícones PWA (192x192 e 512x512) a partir do SVG usando sharp.
// Uso: node scripts/generate-icons.mjs
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#4f46e5"/>
  <g fill="none" stroke="#ffffff" stroke-width="32" stroke-linecap="round" stroke-linejoin="round">
    <path d="M96 256 L256 128 L416 256"/>
    <path d="M128 256 L128 416 L384 416 L384 256"/>
    <path d="M208 416 L208 320 L304 320 L304 416"/>
  </g>
</svg>`);

mkdirSync(new URL("../public/", import.meta.url), { recursive: true });

for (const size of [192, 512]) {
  const out = new URL(`../public/icon-${size}x${size}.png`, import.meta.url);
  const outPath = fileURLToPath(out);
  await sharp(svg).resize(size, size).png().toFile(outPath);
  console.log(`Gerado: ${outPath}`);
}
