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
