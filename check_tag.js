const https = require('https');
const opts = {
  hostname: 'romania-git-dre-p00-base-t01-r01-ontrip.vercel.app',
  path: '/legal/privacy',
  method: 'GET',
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
};
https.get(opts, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Robots tag:', data.match(/<meta[^>]*name="robots"[^>]*>/i));
  });
});
