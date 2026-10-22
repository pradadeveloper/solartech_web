// Convierte el GIF del home anterior (audit/images/secciones/home-video-loop.gif, 90 MB) en
// videos livianos para el fondo del hero: MP4 (H.264) y WebM (VP9), más un póster WebP.
//
// No usa ffmpeg (la política del equipo bloquea ejecutables descargados): codifica con
// WebCodecs dentro del Google Chrome instalado y empaqueta con mp4-muxer / webm-muxer.
// Uso: node scripts/encode-hero-video.mjs [entrada.gif]
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { chromium } from "@playwright/test";

const INPUT = path.resolve(process.argv[2] ?? "audit/images/secciones/home-video-loop.gif");
const OUT = path.resolve("public/videos");
const WIDTH = 1280;
const HEIGHT = 720;

const meta = await sharp(INPUT, { animated: true, limitInputPixels: false }).metadata();
const total = meta.pages;
console.log(`${total} cuadros de ${meta.width}x${meta.pageHeight}`);

// Cuadros como JPEG + marcas de tiempo según el retardo de cada cuadro del GIF.
// Se decodifica por bloques: pedir cada cuadro suelto re-decodifica el GIF desde el inicio.
const BATCH = 24;
const frames = [];
let t = 0;
for (let start = 0; start < total; start += BATCH) {
  const n = Math.min(BATCH, total - start);
  const { data, info } = await sharp(INPUT, { page: start, pages: n, limitInputPixels: false }).raw().toBuffer({ resolveWithObject: true });
  const frameBytes = meta.width * meta.pageHeight * info.channels;
  for (let k = 0; k < n; k++) {
    const raw = data.subarray(k * frameBytes, (k + 1) * frameBytes);
    const jpg = await sharp(raw, { raw: { width: meta.width, height: meta.pageHeight, channels: info.channels } })
      .resize(WIDTH, HEIGHT, { fit: "cover" })
      .jpeg({ quality: 90 })
      .toBuffer();
    const durationMs = Math.max(20, meta.delay?.[start + k] ?? 40);
    frames.push({ jpg, timestampUs: Math.round(t * 1000), durationUs: durationMs * 1000 });
    t += durationMs;
  }
  process.stdout.write(`\r${frames.length}/${total} cuadros`);
}
process.stdout.write("\n");
console.log(`Duración: ${(t / 1000).toFixed(1)} s`);

await mkdir(OUT, { recursive: true });
// Miniatura borrosa (<1 KB) incrustada en el HTML mientras llega el video. Es tan pequeña
// que Chrome no la considera candidata a LCP, así que no compite con el título del hero.
const placeholder = await sharp(frames[0].jpg).resize(32, 18).blur(1).webp({ quality: 40 }).toBuffer();
await writeFile(
  path.resolve("src/components/sections/hero-video-placeholder.ts"),
  `// Generado por scripts/encode-hero-video.mjs — no editar a mano.\nexport const HERO_VIDEO_PLACEHOLDER = "data:image/webp;base64,${placeholder.toString("base64")}";\n`,
);

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
await page.route("https://encoder.local/**", async (route) => {
  const url = new URL(route.request().url());
  const m = url.pathname.match(/^\/f\/(\d+)\.jpg$/);
  if (m) return route.fulfill({ body: frames[Number(m[1])].jpg, contentType: "image/jpeg" });
  return route.fulfill({ body: "<!doctype html><title>encoder</title>", contentType: "text/html" });
});
await page.goto("https://encoder.local/");
// Los paquetes no exportan su build UMD (ni su package.json): se lee directo de node_modules.
const umd = (pkg) => path.resolve("node_modules", pkg, "build", `${pkg}.js`);
await page.addScriptTag({ content: await readFile(umd("mp4-muxer"), "utf8") });
await page.addScriptTag({ content: await readFile(umd("webm-muxer"), "utf8") });

const timing = frames.map((f) => [f.timestampUs, f.durationUs]);

async function encode(kind, width, height, bitrate) {
  return page.evaluate(
    async ({ kind, timing, width, height, bitrate }) => {
      const mp4 = kind === "mp4";
      const target = mp4 ? new Mp4Muxer.ArrayBufferTarget() : new WebMMuxer.ArrayBufferTarget();
      const muxer = mp4
        ? new Mp4Muxer.Muxer({ target, video: { codec: "avc", width, height }, fastStart: "in-memory" })
        : new WebMMuxer.Muxer({ target, video: { codec: "V_VP9", width, height } });
      const encoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error: (e) => {
          throw e;
        },
      });
      encoder.configure({
        codec: mp4 ? "avc1.4d401f" : "vp09.00.31.08",
        width,
        height,
        bitrate,
        framerate: 30,
        latencyMode: "quality",
        ...(mp4 ? { avc: { format: "avc" } } : {}),
      });
      for (let i = 0; i < timing.length; i++) {
        const blob = await (await fetch(`/f/${i}.jpg`)).blob();
        const bitmap = await createImageBitmap(blob, { resizeWidth: width, resizeHeight: height, resizeQuality: "high" });
        const frame = new VideoFrame(bitmap, { timestamp: timing[i][0], duration: timing[i][1] });
        encoder.encode(frame, { keyFrame: i % 60 === 0 });
        frame.close();
        bitmap.close();
        if (encoder.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 10));
      }
      await encoder.flush();
      muxer.finalize();
      const bytes = new Uint8Array(target.buffer);
      let bin = "";
      for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      return btoa(bin);
    },
    { kind, timing, width, height, bitrate },
  );
}

// Escritorio 1280×720 y móvil 640×360 (para no gastar datos del celular).
const variants = [
  { name: "hero-loop", width: WIDTH, height: HEIGHT, bitrate: { mp4: 1_300_000, webm: 900_000 } },
  { name: "hero-loop-sm", width: 640, height: 360, bitrate: { mp4: 420_000, webm: 300_000 } },
];
for (const v of variants) {
  for (const kind of ["mp4", "webm"]) {
    const b64 = await encode(kind, v.width, v.height, v.bitrate[kind]);
    const file = path.join(OUT, `${v.name}.${kind}`);
    await writeFile(file, Buffer.from(b64, "base64"));
    console.log(`${path.relative(process.cwd(), file)}  ${(Buffer.byteLength(b64, "base64") / 1024 / 1024).toFixed(2)} MB`);
  }
}
await browser.close();
