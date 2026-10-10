const fs = require('fs');
const path = require('path');

function convertTokensToCss(inputFile, outputFile) {
    const rawData = fs.readFileSync(inputFile, 'utf8');
    const tokens = JSON.parse(rawData);

    const cssVariables = [];
    
    // Helper to format path into a CSS variable name
    // e.g., ["primitive colors", "color palette", "primary"] -> "--primitive-colors-color-palette-primary"
    function formatCssVarName(pathArray) {
        return '--' + pathArray
            .map(part => part.toLowerCase().replace(/\s+/g, '-'))
            .join('-');
    }

    // Helper to parse reference values like "{primitive colors.color palette.primary.primary40}"
    function formatValue(value) {
        if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
            const refPath = value.slice(1, -1).split('.');
            return `var(${formatCssVarName(refPath)})`;
        }
        return value;
    }

    // Helper to format complex values (like shadows or typography objects)
    function formatComplexValue(type, value) {
        if (type === 'custom-shadow' || type === 'boxShadow') {
            const shadows = Array.isArray(value) ? value : [value];
            return shadows.map(shadow => {
                const { offsetX, offsetY, radius, spread, color } = shadow;
                return `${offsetX}px ${offsetY}px ${radius}px ${spread}px ${color}`;
            }).join(', ');
        }
        if (type === 'typography') {
            const { fontWeight, fontSize, lineHeight, fontFamily } = value;
            return `${fontWeight} ${fontSize}/${lineHeight} '${fontFamily}'`;
        }
        return value;
    }

    // Recursively extract tokens
    function extractTokens(obj, currentPath = []) {
        for (const [key, val] of Object.entries(obj)) {
            if (val && typeof val === 'object') {
                if (val.hasOwnProperty('value')) {
                    // It's a token definition
                    const cssVarName = formatCssVarName([...currentPath, key]);
                    let cssValue;
                    
                    if (typeof val.value === 'object') {
                        cssValue = formatComplexValue(val.type, val.value);
                    } else {
                        cssValue = formatValue(val.value);
                    }
                    
                    cssVariables.push(`  ${cssVarName}: ${cssValue};`);
                } else {
                    // It's a group, recurse deeper
                    extractTokens(val, [...currentPath, key]);
                }
            }
        }
    }

    extractTokens(tokens);

    // Grouping primitive colors vs roles for better readability in CSS
    const primitiveVars = cssVariables.filter(v => v.includes('--primitive-colors'));
    const roleVars = cssVariables.filter(v => v.includes('--color-roles'));
    const otherVars = cssVariables.filter(v => !v.includes('--primitive-colors') && !v.includes('--color-roles'));

    const cssOutput = `/* 
  AUTO-GENERATED CSS VARIABLES FROM DESIGN TOKENS
  Source of truth: ${path.basename(inputFile)}
*/

:root {
  /* =========================================
     PRIMITIVE COLORS 
     (Do not use directly in UI elements)
     ========================================= */
${primitiveVars.join('\n')}

  /* =========================================
     COLOR ROLES 
     (Use these semantic tokens in your UI)
     ========================================= */
${roleVars.join('\n')}

  /* =========================================
     OTHER TOKENS (Typography, Effects, etc.)
     ========================================= */
${otherVars.join('\n')}
}
`;

    fs.writeFileSync(outputFile, cssOutput.trim());
    console.log(`✅ Successfully generated CSS variables to ${outputFile}`);
}

// Execute the conversion
const inputFile = path.join(__dirname, 'design-tokens.tokens.json');
const outputFile = path.join(__dirname, 'index.css');

if (fs.existsSync(inputFile)) {
    convertTokensToCss(inputFile, outputFile);
} else {
    console.error(`Error: Could not find ${inputFile}`);
}
