const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        if (file === 'node_modules' || file === '.next' || file === '.git' || file === '.gemini') return;
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filePath));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.css')) {
                results.push(filePath);
            }
        }
    });
    return results;
}

const files = walk('.');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // Remove decorative tricolor containers if they still exist anywhere
    content = content.replace(/<div className="absolute top-0 bottom-0 left-0 w-1(?:\.5)? flex flex-col">\s*<div className="h-1\/3 bg-\[#2F6FED\]" \/>\s*<div className="h-1\/3 bg-\[#fcd116\]" \/>\s*<div className="h-1\/3 bg-\[#ce1126\]" \/>\s*<\/div>/gi, '');

    // 1. Gradients
    content = content.replace(/bg-gradient-to-r from-slate-900 to-\[#071B3D\]/gi, 'bg-gradient-to-r from-[#071B3D] to-[#2F6FED]');
    content = content.replace(/from-[#071B3D] to-[#2F6FED]/gi, 'from-[#071B3D] to-[#2F6FED]');
    
    // 2. Selection
    content = content.replace(/selection:bg-\[#071B3D\]/gi, 'selection:bg-[#2F6FED]');
    content = content.replace(/selection:bg-\[#2F6FED\]/gi, 'selection:bg-[#2F6FED]');
    
    // 3. CTA Buttons
    content = content.replace(/bg-\[#fcd116\] hover:bg-yellow-400 text-\[#071B3D\]/gi, 'bg-[#2F6FED] hover:bg-[#1A5BB8] text-white');
    
    // 4. Exact color replaces
    content = content.replace(/#2F6FED/gi, '#2F6FED');
    content = content.replace(/#071B3D/gi, '#071B3D');
    content = content.replace(/#071B3D/gi, '#071B3D');
    
    // 5. fcd116 replacements
    content = content.replace(/bg-\[#fcd116\]/gi, 'bg-[#2F6FED]');
    content = content.replace(/border-\[#fcd116\]/gi, 'border-[#2F6FED]');
    
    // Custom check for text-[#2F6FED]:
    // In footer or hero section (dark backgrounds), replace with #F4F7FC (white-ish). Otherwise #2F6FED.
    // I will replace all with #F4F7FC for now if it is inside files known for dark backgrounds or just use #2F6FED generally.
    if (file.includes('Footer.tsx') || file.includes('TrustSection.tsx') || file.includes('MainContent.tsx') || file.includes('RomaniaOverviewContent.tsx')) {
        content = content.replace(/text-\[#fcd116\]/gi, 'text-[#F4F7FC]');
    } else {
        content = content.replace(/text-\[#fcd116\]/gi, 'text-[#2F6FED]');
    }
    content = content.replace(/hover:border-\[#fcd116\]/gi, 'hover:border-[#2F6FED]');
    content = content.replace(/hover:text-\[#fcd116\]/gi, 'hover:text-[#F4F7FC]'); // Many hovers are in footer/dark bg.

    // 6. #ce1126 removal
    // Just remove it from Button.tsx danger class
    content = content.replace(/bg-\[#ce1126\] hover:bg-\[#a50f20\]/gi, 'bg-red-600 hover:bg-red-700');
    content = content.replace(/focus:ring-\[#ce1126\]/gi, 'focus:ring-red-600');

    // 7. Tailwind config (fontFamily English -> Manrope)
    if (file.endsWith('tailwind.config.js')) {
        content = content.replace(/english:\s*\[['"]Inter['"],/g, "english: ['Manrope',");
        content = content.replace(/600:\s*['"]#ce1126['"]/g, "600: 'transparent'"); // Neutralize in config
        content = content.replace(/500:\s*['"]#fcd116['"]/g, "500: '#2F6FED'"); // Neutralize in config
    }

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
