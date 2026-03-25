import sharp from "sharp";
import { readdir } from "fs/promises";
import { join } from "path";

const PUBLIC = join(process.cwd(), "public");
const THRESHOLD = 30; // pixels with R,G,B all below this become transparent
const EDGE_FADE = 50; // pixels below this get partial transparency for smooth edges

const files = (await readdir(PUBLIC)).filter(
  (f) => f.startsWith("orb") && f.endsWith(".png")
);

for (const file of files) {
  const filePath = join(PUBLIC, file);
  console.log(`Processing ${file}...`);

  const image = sharp(filePath);
  const { width, height } = await image.metadata();

  const raw = await image.ensureAlpha().raw().toBuffer();

  const out = Buffer.from(raw);

  for (let i = 0; i < out.length; i += 4) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];

    if (r < THRESHOLD && g < THRESHOLD && b < THRESHOLD) {
      out[i + 3] = 0; // fully transparent
    } else if (r < EDGE_FADE && g < EDGE_FADE && b < EDGE_FADE) {
      // Smooth edge transition: scale alpha from 0 to original
      const maxC = Math.max(r, g, b);
      const factor = (maxC - THRESHOLD) / (EDGE_FADE - THRESHOLD);
      out[i + 3] = Math.round(out[i + 3] * Math.max(0, Math.min(1, factor)));
    }
  }

  await sharp(out, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(filePath.replace(".png", "-clean.png"));

  console.log(`  -> ${file.replace(".png", "-clean.png")} done`);
}

console.log("All done!");
