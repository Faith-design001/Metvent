const fs = require('fs');
const path = require('path');

const tokensPath = path.join(__dirname, '..', 'design-tokens.tokens.json');
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

function resolveRef(ref) {
  if (typeof ref === 'string' && ref.startsWith('{') && ref.endsWith('}')) {
    const parts = ref.slice(1, -1).split('.');
    let curr = tokens;
    for (const part of parts) {
      curr = curr[part];
    }
    return curr.value;
  }
  return ref;
}

const primaryToken = tokens['color roles collection']['color roles']['primary']['primary color'];
const onPrimaryToken = tokens['color roles collection']['color roles']['primary']['on primary color'];

const primaryHexRaw = resolveRef(primaryToken.value);
const onPrimaryHexRaw = resolveRef(onPrimaryToken.value);

const primaryHex = primaryHexRaw.slice(0, 7);
const onPrimaryHex = onPrimaryHexRaw.slice(0, 7);

const tokensCode = `// lib/tokens.ts
// AUTO-GENERATED from design-tokens.tokens.json
// Source tokens:
// - themeColor: color roles collection.color roles.primary.primary color (${primaryToken.value})
// - onPrimaryColor: color roles collection.color roles.primary.on primary color (${onPrimaryToken.value})

export const themeColor = '${primaryHex}';
export const onPrimaryColor = '${onPrimaryHex}';
`;

fs.writeFileSync(path.join(__dirname, '..', 'lib', 'tokens.ts'), tokensCode);
console.log('Successfully generated lib/tokens.ts with themeColor:', primaryHex);

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="7" fill="${primaryHex}"/>
  <circle cx="11" cy="13" r="3.5" fill="${onPrimaryHex}"/>
  <circle cx="21" cy="13" r="3.5" fill="${onPrimaryHex}"/>
  <path d="M10 20 C10 17 14 17 16 18.5 C18 17 22 17 22 20" stroke="${onPrimaryHex}" stroke-width="2" stroke-linecap="round" fill="none"/>
</svg>
`;

const appIconSvgPath = path.join(__dirname, '..', 'app', 'icon.svg');
fs.writeFileSync(appIconSvgPath, svgIcon);
console.log('Successfully generated app/icon.svg');

async function generatePng() {
  try {
    const sharp = require('sharp');
    const pngPath = path.join(__dirname, '..', 'app', 'icon.png');
    await sharp(Buffer.from(svgIcon))
      .resize(32, 32)
      .png()
      .toFile(pngPath);
    console.log('Successfully generated app/icon.png with sharp');
  } catch (err) {
    console.warn('Could not generate PNG icon with sharp:', err.message);
  }
}

generatePng();
