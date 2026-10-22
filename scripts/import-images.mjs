// Importa las imágenes extraídas del WordPress (audit/images) a public/images,
// redimensionadas y convertidas a WebP. next/image genera AVIF/WebP en runtime;
// esto solo evita guardar originales de 2560px+ en el repo.
// Uso: node scripts/import-images.mjs
import { mkdir, copyFile, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("audit/images");
const OUT = path.resolve("public/images");

const MAX_WIDTH = { proyectos: 2000, secciones: 2000, blog: 1600, aliados: 600 };
const SKIP = [/\.gif$/i, /^legacy-/, /-unused/, /-old\./, /^_manifest/];

async function run() {
  await mkdir(path.join(OUT, "logo"), { recursive: true });
  await copyFile(path.join(SRC, "logo/solartech-logo-color.png"), path.join(OUT, "logo/solartech-logo-color.png"));
  await copyFile(path.join(SRC, "logo/solartech-logo-blanco.svg"), path.join(OUT, "logo/solartech-logo-blanco.svg"));

  for (const dir of Object.keys(MAX_WIDTH)) {
    await mkdir(path.join(OUT, dir), { recursive: true });
    for (const file of await readdir(path.join(SRC, dir))) {
      if (SKIP.some((re) => re.test(file))) continue;
      const name = file.replace(/\.(png|jpe?g)$/i, ".webp");
      const info = await sharp(path.join(SRC, dir, file))
        .resize({ width: MAX_WIDTH[dir], withoutEnlargement: true })
        .webp({ quality: dir === "aliados" ? 90 : 80 })
        .toFile(path.join(OUT, dir, name));
      console.log(`${dir}/${name}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
