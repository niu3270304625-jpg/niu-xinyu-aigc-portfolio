import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const portraitPath = path.join(root, "public", "images", "niu-editorial-portrait.png");
const outputPath = path.join(root, "public", "images", "niu-integrated-hero.png");

const width = 1800;
const height = 1125;

const portrait = sharp(portraitPath).resize({
  width: 720,
  height: 900,
  fit: "cover",
  position: "center",
});

const portraitBuffer = await portrait
  .modulate({ saturation: 0.72, brightness: 1.04 })
  .linear(0.96, 8)
  .png()
  .toBuffer();

const softPortraitBuffer = await sharp(portraitBuffer)
  .resize({ width: 900, height: 1125, fit: "cover" })
  .blur(22)
  .modulate({ saturation: 0.55, brightness: 1.16 })
  .png()
  .toBuffer();

const portraitMask = Buffer.from(`
<svg width="720" height="900" viewBox="0 0 720 900" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="m" cx="50%" cy="42%" r="58%">
      <stop offset="0%" stop-color="white" stop-opacity="1"/>
      <stop offset="66%" stop-color="white" stop-opacity="0.98"/>
      <stop offset="88%" stop-color="white" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="720" height="900" fill="url(#m)"/>
</svg>`);

const softMask = Buffer.from(`
<svg width="900" height="1125" viewBox="0 0 900 1125" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="m" cx="50%" cy="42%" r="62%">
      <stop offset="0%" stop-color="white" stop-opacity="0.34"/>
      <stop offset="72%" stop-color="white" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="900" height="1125" fill="url(#m)"/>
</svg>`);

const maskedPortrait = await sharp(portraitBuffer)
  .joinChannel(portraitMask)
  .png()
  .toBuffer();

const maskedSoftPortrait = await sharp(softPortraitBuffer)
  .joinChannel(softMask)
  .png()
  .toBuffer();

const posterSvg = Buffer.from(`
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fbfcf2"/>
      <stop offset="48%" stop-color="#edf4e4"/>
      <stop offset="100%" stop-color="#fbfcf2"/>
    </linearGradient>
    <radialGradient id="sun" cx="56%" cy="38%" r="52%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.86"/>
      <stop offset="48%" stop-color="#f6fbef" stop-opacity="0.62"/>
      <stop offset="100%" stop-color="#d8ebc9" stop-opacity="0"/>
    </radialGradient>
    <filter id="paper">
      <feTurbulence baseFrequency="0.9" numOctaves="2" seed="24" type="fractalNoise"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0.032"/>
      </feComponentTransfer>
    </filter>
  </defs>
  <rect width="1800" height="1125" fill="url(#bg)"/>
  <rect width="1800" height="1125" fill="url(#sun)"/>
  <g opacity="0.34">
    ${Array.from({ length: 23 }, (_, i) => `<line x1="${i * 80}" y1="0" x2="${i * 80}" y2="1125" stroke="#7faa6d" stroke-opacity="0.16" stroke-width="1"/>`).join("")}
    ${Array.from({ length: 15 }, (_, i) => `<line x1="0" y1="${i * 80}" x2="1800" y2="${i * 80}" stroke="#7faa6d" stroke-opacity="0.1" stroke-width="1"/>`).join("")}
  </g>
  <path d="M1160 130 C1380 245 1488 470 1435 680 C1380 894 1160 1010 920 990 C685 970 538 815 542 620 C546 382 782 198 1020 134 C1076 119 1122 112 1160 130Z" fill="#ffffff" opacity="0.28"/>
  <text x="900" y="425" text-anchor="middle" font-family="Georgia, Times New Roman, serif" font-size="300" font-weight="700" fill="#4f604c" opacity="0.055" letter-spacing="-16">AIGC</text>
  <text x="900" y="160" text-anchor="middle" font-family="Georgia, Times New Roman, serif" font-size="54" fill="#172719" opacity="0.62" letter-spacing="-1">Collected Works / AIGC Cinema</text>
  <text x="900" y="300" text-anchor="middle" font-family="KaiTi, STKaiti, serif" font-size="170" fill="#172719" opacity="0.93">牛昕宇</text>
  <text x="900" y="365" text-anchor="middle" font-family="Brush Script MT, Segoe Script, cursive" font-size="98" fill="#5f6d58" opacity="0.52">Niu Xinyu</text>
  <g font-family="Arial, sans-serif" font-size="19" font-weight="700" letter-spacing="8" fill="#172719" opacity="0.52">
    <text transform="translate(112 300) rotate(90)">PERSONAL AIGC PORTFOLIO</text>
    <text transform="translate(1688 300) rotate(90)">FILM PROJECT LEAD / 2026</text>
  </g>
  <g font-family="Arial, sans-serif" font-size="17" font-weight="700" letter-spacing="6" fill="#4f604c" opacity="0.72">
    <text x="690" y="970">STORY</text>
    <text x="852" y="970">CHARACTER</text>
    <text x="1078" y="970">IMAGE</text>
  </g>
  <text x="900" y="1038" text-anchor="middle" font-family="KaiTi, STKaiti, serif" font-size="32" fill="#172719" opacity="0.66">把故事、角色与情绪，转译成可执行的 AI 影像生产流程。</text>
  <rect width="1800" height="1125" filter="url(#paper)" opacity="0.8"/>
</svg>`);

const base = sharp(posterSvg);

await base
  .composite([
    {
      input: maskedSoftPortrait,
      left: 450,
      top: 0,
      blend: "multiply",
    },
    {
      input: maskedPortrait,
      left: 540,
      top: 310,
    },
    {
      input: Buffer.from(`
        <svg width="1800" height="1125" viewBox="0 0 1800 1125" xmlns="http://www.w3.org/2000/svg">
          <rect x="550" y="300" width="700" height="650" fill="none" stroke="#7faa6d" stroke-opacity="0.13" stroke-width="1"/>
          <path d="M465 900 C690 835 1012 846 1310 918" fill="none" stroke="#ffffff" stroke-opacity="0.38" stroke-width="36"/>
          <path d="M515 910 C740 858 1022 870 1262 928" fill="none" stroke="#7faa6d" stroke-opacity="0.12" stroke-width="22"/>
        </svg>`),
      left: 0,
      top: 0,
    },
  ])
  .png({ quality: 95 })
  .toFile(outputPath);

const stats = await fs.stat(outputPath);
console.log(`generated ${outputPath} (${stats.size} bytes)`);
