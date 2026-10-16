const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Ensure output directories exist
const appDir = path.join(__dirname, '..', 'app');
const publicDir = path.join(__dirname, '..', 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Generate 1200x630 Open Graph share image
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5c50ee"/>
      <stop offset="50%" stop-color="#5145e5"/>
      <stop offset="100%" stop-color="#3b31b3"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.04"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- Subtle decorative accents -->
  <circle cx="1060" cy="120" r="220" fill="#ffffff" fill-opacity="0.04"/>
  <circle cx="140" cy="520" r="180" fill="#ffffff" fill-opacity="0.03"/>

  <!-- Central Brand Container -->
  <g transform="translate(600, 290)">
    <!-- Brand Icon Emblem -->
    <g transform="translate(0, -115)">
      <rect x="-42" y="-42" width="84" height="84" rx="22" fill="#ffffff" fill-opacity="0.16" stroke="#ffffff" stroke-opacity="0.3" stroke-width="2"/>
      <!-- Conversation circles and arc -->
      <circle cx="-14" cy="-8" r="8" fill="#ffffff"/>
      <circle cx="14" cy="-8" r="8" fill="#ffffff"/>
      <path d="M-18 10 C-18 2 -6 2 0 6 C6 2 18 2 18 10" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none"/>
    </g>

    <!-- Large White Wordmark -->
    <text x="0" y="25" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="82" font-weight="800" letter-spacing="-2" fill="#ffffff">
      Metvent
    </text>

    <!-- Tagline underneath -->
    <text x="0" y="85" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="34" font-weight="500" letter-spacing="-0.5" fill="#f1f0fd">
      Keep a conversation going.
    </text>

    <!-- Purpose sub-badge -->
    <g transform="translate(0, 140)">
      <rect x="-180" y="-18" width="360" height="36" rx="18" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1"/>
      <text x="0" y="5" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="16" font-weight="600" letter-spacing="1" fill="#ffffff">
        COMMUNITY MEETUP COMPANION
      </text>
    </g>
  </g>

  <!-- Small URL at the bottom -->
  <g transform="translate(600, 565)">
    <text x="0" y="0" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="20" font-weight="600" letter-spacing="0.5" fill="#e0e7ff" fill-opacity="0.9">
      metvent.vercel.app
    </text>
  </g>
</svg>
`;

// 2. Modern SVG App Icon
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="iconBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5c50ee"/>
      <stop offset="100%" stop-color="#4338ca"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="120" fill="url(#iconBg)"/>
  <!-- Two conversation attendee nodes -->
  <circle cx="176" cy="208" r="56" fill="#ffffff"/>
  <circle cx="336" cy="208" r="56" fill="#ffffff"/>
  <!-- Connecting bridge / conversation wave -->
  <path d="M160 320 C160 272 224 272 256 296 C288 272 352 272 352 320" stroke="#ffffff" stroke-width="36" stroke-linecap="round" fill="none"/>
</svg>
`;

async function buildAssets() {
  console.log('Generating images and icons...');

  // Write SVG files
  fs.writeFileSync(path.join(appDir, 'icon.svg'), iconSvg);
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), iconSvg);
  fs.writeFileSync(path.join(publicDir, 'opengraph-image.svg'), ogSvg);
  console.log('Wrote SVG icons and share image SVG');

  // Generate PNG 1200x630 share picture
  const ogPngBuffer = await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .png({ quality: 95 })
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'opengraph-image.png'), ogPngBuffer);
  fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogPngBuffer);
  fs.writeFileSync(path.join(appDir, 'opengraph-image.png'), ogPngBuffer);
  console.log('Generated 1200x630 Open Graph share PNG');

  // Generate 32x32 browser tab icon
  const icon32Buffer = await sharp(Buffer.from(iconSvg))
    .resize(32, 32)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(appDir, 'icon.png'), icon32Buffer);
  fs.writeFileSync(path.join(publicDir, 'icon.png'), icon32Buffer);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icon32Buffer);
  console.log('Generated 32x32 tab icon and favicon.ico');

  // Generate 180x180 Apple touch icon for home screens
  const appleIconBuffer = await sharp(Buffer.from(iconSvg))
    .resize(180, 180)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(appDir, 'apple-icon.png'), appleIconBuffer);
  fs.writeFileSync(path.join(publicDir, 'apple-icon.png'), appleIconBuffer);
  console.log('Generated 180x180 Apple Touch Icon');

  // Generate 192x192 & 512x512 PWA icons
  const icon192Buffer = await sharp(Buffer.from(iconSvg))
    .resize(192, 192)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192Buffer);

  const icon512Buffer = await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), icon512Buffer);
  console.log('Generated 192x192 and 512x512 PWA manifest icons');

  console.log('Asset generation complete.');
}

buildAssets().catch((err) => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
