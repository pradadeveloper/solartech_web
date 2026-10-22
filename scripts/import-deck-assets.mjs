// Importa fotos de proyectos y logos extraídos de las presentaciones comerciales
// ("PPT Solartech-Industria.pdf" y "Presentación PPA 2026.pdf") a public/images, en WebP.
// Las imágenes se extrajeron de los PDF con pdf.js dentro de Chrome (herramienta temporal, ya
// retirada del repo); este script solo es necesario si se vuelven a extraer.
// Uso: node scripts/import-deck-assets.mjs <carpeta-industria> <carpeta-ppa>
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [industria, ppa] = process.argv.slice(2);
const OUT = path.resolve("public/images");

async function find(dir, prefix) {
  const file = (await readdir(dir)).find((f) => f.startsWith(prefix));
  if (!file) throw new Error(`No se encontró ${prefix} en ${dir}`);
  return path.join(dir, file);
}

// [carpeta, prefijo del archivo extraído, destino]
const photos = [
  [industria, "p10-img4-", "proyectos/proyecto-rotoplast-guarne"],
  [industria, "p10-img5-", "proyectos/proyecto-especial-impresores-medellin"],
  [industria, "p11-img4-", "proyectos/proyecto-lam-cosmeticos-itagui"],
  [industria, "p11-img7-", "proyectos/proyecto-plastired-la-estrella"],
  [industria, "p12-img4-", "proyectos/proyecto-comodisimos-sabaneta"],
  [industria, "p12-img5-", "proyectos/proyecto-botero-soto-itagui"],
  [industria, "p12-img6-", "proyectos/proyecto-colpagro-itagui"],
  [industria, "p12-img7-", "proyectos/proyecto-agroindefuturo-cordoba"],
  [industria, "p13-img5-", "proyectos/proyecto-columbus-school-envigado"],
  [industria, "p13-img6-", "proyectos/proyecto-hotel-sabana-del-sinu-monteria"],
  [industria, "p13-img7-", "proyectos/proyecto-hotel-alfahar-carmen-de-viboral"],
  [industria, "p14-img5-", "proyectos/ppa-torre-guayacan-envigado"],
  [industria, "p15-img7-", "proyectos/residencial-casa-la-ceja"],
  [industria, "p15-img8-", "proyectos/residencial-casa-envigado"],
  [industria, "p15-img9-", "proyectos/residencial-casa-rionegro"],
  [industria, "p16-img4-", "proyectos/residencial-casa-medellin"],
  [industria, "p16-img5-", "proyectos/residencial-casa-rionegro-2"],
  [industria, "p16-img6-", "proyectos/agro-finca-ganadera-dorada"],
  [industria, "p16-img7-", "proyectos/agro-guadalquivir"],
  [ppa, "p01-img1-", "proyectos/ppa-ph-entre-parques-portada"],
  [ppa, "p05-img1-", "proyectos/ppa-ph-entre-parques-envigado"],
  [ppa, "p06-img1-", "proyectos/ppa-ph-nuvo-medellin"],
  [ppa, "p07-img1-", "proyectos/ppa-ph-el-vergel-medellin"],
  [ppa, "p08-img1-", "proyectos/ppa-ph-cr-canela-sabaneta"],
  [ppa, "p09-img1-", "proyectos/ppa-edificio-oclock-envigado"],
  [ppa, "p10-img1-", "proyectos/ppa-edificio-lyon-envigado"],
  [ppa, "p11-img1-", "proyectos/ppa-edificio-plex-medellin"],
  [ppa, "p12-img1-", "proyectos/ppa-edificio-avinon-medellin"],
  [ppa, "p13-img1-", "proyectos/ppa-ph-canta-girone-medellin"],
];

// Logos de clientes (diapositivas 8 y 9) y marcas (diapositiva 17).
// Verificado contra la hoja de logos (la numeración de pdf.js no sigue el orden visual).
const logos = [
  ["p08-img3-", "grupo-santamaria"], ["p08-img4-", "tropical-banana"], ["p08-img5-", "caribe-motor"], ["p08-img6-", "pergamino"],
  ["p08-img7-", "linea-directa"], ["p08-img8-", "plastired"], ["p08-img9-", "laboratorios-delta"], ["p08-img10-", "columbus-school"],
  ["p08-img11-", "colpagro"], ["p08-img12-", "clinica-erasmo"], ["p08-img13-", "frudelca"], ["p08-img14-", "club-campestre"],
  ["p08-img15-", "rotoplast"], ["p08-img16-", "geodic"], ["p08-img17-", "marymount-school"], ["p08-img18-", "comodisimos"],
  ["p08-img19-", "la-media-naranja"], ["p09-img3-", "natural-harvest"], ["p09-img4-", "templamos"], ["p09-img5-", "safer"],
  ["p09-img6-", "absorbentes"], ["p09-img7-", "aduanimex"], ["p09-img8-", "casa-magna"], ["p09-img9-", "lam-cosmeticos"],
  ["p09-img10-", "hotel-sabana-del-sinu"], ["p09-img11-", "marres"], ["p09-img12-", "canta-girone"], ["p09-img13-", "implantec"],
  ["p09-img14-", "distecsa"], ["p09-img15-", "invesa"], ["p09-img16-", "especial-impresores"], ["p09-img17-", "monterrey"],
  ["p09-img18-", "la-manchuria"], ["p09-img19-", "proalco"], ["p09-img20-", "colplast"], ["p09-img21-", "aeromaquinados"],
];
const brands = [
  ["p17-img4-", "marca-longi-2026"], ["p17-img5-", "marca-goodwe"], ["p17-img7-", "marca-huawei"], ["p17-img8-", "marca-jinko-solar"],
];

await mkdir(path.join(OUT, "proyectos"), { recursive: true });
await mkdir(path.join(OUT, "clientes"), { recursive: true });

for (const [dir, prefix, dest] of photos) {
  const info = await sharp(await find(dir, prefix)).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(OUT, `${dest}.webp`));
  console.log(`${dest}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
const manifest = {};
for (const [prefix, name] of logos) {
  // Recorte del espacio blanco sobrante para que todos se vean del mismo tamaño en su ficha.
  const info = await sharp(await find(industria, prefix)).trim({ threshold: 18 }).resize({ width: 400, withoutEnlargement: true }).webp({ quality: 90 }).toFile(path.join(OUT, "clientes", `${name}.webp`));
  manifest[name] = [info.width, info.height];
}
for (const [prefix, name] of brands) {
  const info = await sharp(await find(industria, prefix)).trim({ threshold: 18 }).resize({ width: 600, withoutEnlargement: true }).webp({ quality: 90 }).toFile(path.join(OUT, "aliados", `${name}.webp`));
  manifest[name] = [info.width, info.height];
}
console.log(JSON.stringify(manifest));
