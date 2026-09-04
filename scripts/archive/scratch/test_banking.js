const http = require('http');

http.get('http://localhost:3007/needs/banking', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('--- Checking /needs/banking (Status:', res.statusCode, ') ---');
    console.log('Has BCR:', data.includes('BCR'));
    console.log('Has BT:', data.includes('Transilvania'));
    console.log('Has Revolut:', data.includes('Revolut'));
    console.log('Has Wise:', data.includes('Wise'));
    console.log('Has Permis de Ședere:', data.includes('Permis de') || data.includes('کارت اقامت'));
  });
});

setTimeout(() => {
  http.get('http://localhost:3007/needs', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('--- Checking /needs hub link ---');
      console.log('/needs/banking link ->', data.includes(`href="/needs/banking"`) ? 'FOUND ✅' : 'NOT FOUND ❌');
    });
  });
}, 500);
