const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcPath = 'C:/Users/saurabh/.gemini/antigravity-ide/brain/24fc4d06-32fd-40ab-ade2-b62dedd2158d/.user_uploaded/media_1787838126192.jpg';

async function generateRoundedIcon(size, radiusRatio = 0.22) {
  const cornerRadius = Math.round(size * radiusRatio);
  const maskSvg = `<svg width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${cornerRadius}" ry="${cornerRadius}" fill="#ffffff"/></svg>`;
  const maskBuffer = Buffer.from(maskSvg);

  return sharp(srcPath)
    .resize(size, size)
    .composite([{ input: maskBuffer, blend: 'dest-in' }])
    .png();
}

async function run() {
  console.log('Generating rounded icons and favicons...');

  // 1. 512x512 rounded logo / app icon
  const icon512 = await generateRoundedIcon(512, 0.22);
  await icon512.toFile('src/app/icon.png');
  await icon512.toFile('public/icon-512.png');
  await icon512.toFile('public/logo.png');

  // 2. 192x192
  const icon192 = await generateRoundedIcon(192, 0.22);
  await icon192.toFile('public/icon-192.png');

  // 3. Apple Touch Icon 180x180
  const icon180 = await generateRoundedIcon(180, 0.22);
  await icon180.toFile('src/app/apple-icon.png');
  await icon180.toFile('public/apple-touch-icon.png');

  // 4. 32x32 & 16x16 Favicons
  const icon32 = await generateRoundedIcon(32, 0.22);
  await icon32.toFile('public/favicon-32x32.png');
  const buffer32 = await icon32.toBuffer();
  fs.writeFileSync('src/app/favicon.ico', buffer32);
  fs.writeFileSync('public/favicon.ico', buffer32);

  const icon16 = await generateRoundedIcon(16, 0.22);
  await icon16.toFile('public/favicon-16x16.png');

  console.log('All rounded icons and favicons successfully created!');
}

run().catch(console.error);
