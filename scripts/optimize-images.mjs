import { readdir } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const sourceDir = fileURLToPath(new URL("../source-images/", import.meta.url));
const assetsDir = fileURLToPath(new URL("../public/assets/", import.meta.url));
const files = await readdir(sourceDir);

await Promise.all(files.filter((file) => extname(file).toLowerCase() === ".png" && file !== "og-source.png").map(async (file) => {
  const source = join(sourceDir, file);
  const destination = join(assetsDir, basename(file, ".png") + ".webp");
  await sharp(source).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 82, smartSubsample: true }).toFile(destination);
  console.log(`${file} → ${file.replace(/\.png$/i, ".webp")}`);
}));

if (files.includes("og-source.png")) {
  await sharp(join(sourceDir, "og-source.png")).resize(1200, 630, { fit: "cover", position: "centre" }).jpeg({ quality: 86, mozjpeg: true }).toFile(fileURLToPath(new URL("../public/og.jpg", import.meta.url)));
  console.log("og-source.png → og.jpg");
}
