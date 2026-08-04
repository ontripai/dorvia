const fs = require('fs');

let content = fs.readFileSync('src/app/api/evaluation/route.ts', 'utf8');
content = content.replace(
    'fetch(\\`https://api.telegram.org/bot\\${botToken}/sendMessage\\`, {',
    'fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {'
);
content = content.replace(
    'Error(\\`Telegram API responded with \\${telegramRes.status}\\`)',
    'Error(`Telegram API responded with ${telegramRes.status}`)'
);
fs.writeFileSync('src/app/api/evaluation/route.ts', content, 'utf8');
console.log('Fixed syntax error');
