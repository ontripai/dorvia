const http = require('https');

console.log('Testing BNR XML feed retrieval and parsing...');

http.get('https://www.bnr.ro/nbrfxrates.xml', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const cubeDateMatch = data.match(/<Cube\s+date="([^"]+)">/i);
      const date = cubeDateMatch ? cubeDateMatch[1] : 'Unknown';

      const tagMatches = data.match(/<Rate\s+[^>]+>[\d\.]+<\/Rate>/gi) || [];
      const rates = {};

      for (const tag of tagMatches) {
        const currMatch = tag.match(/currency="([A-Z]{3})"/i);
        const valMatch = tag.match(/>([\d\.]+)<\/Rate>/i);
        if (currMatch && valMatch) {
          rates[currMatch[1]] = parseFloat(valMatch[1]);
        }
      }

      console.log(`✓ BNR Feed Date: ${date}`);
      console.log(`✓ Parsed ${Object.keys(rates).length} exchange rates.`);
      console.log('✓ Key Rates:', {
        EUR: rates.EUR,
        USD: rates.USD,
        GBP: rates.GBP,
        AED: rates.AED,
        TRY: rates.TRY
      });

      if (rates.EUR && rates.USD) {
        console.log('\n✅ BNR Feed Verification PASSED!');
      } else {
        console.error('❌ BNR Feed Verification FAILED: EUR/USD missing.');
        process.exit(1);
      }
    } catch (e) {
      console.error('❌ Parser error:', e.message);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('❌ Network error fetching BNR feed:', err.message);
  process.exit(1);
});
