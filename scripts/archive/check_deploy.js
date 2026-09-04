const https = require('https');

async function getUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function postUrl(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, (res) => {
      let resData = '';
      res.on('data', chunk => resData += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: resData }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function check() {
  const baseUrl = 'https://romania-git-dre-p00-base-t01-r01-ontrip.vercel.app';
  
  // 1. Privacy
  const privacy = await getUrl(baseUrl + '/legal/privacy');
  console.log('Privacy Status:', privacy.status);
  console.log('Has OWNER INPUT:', privacy.data.includes('OWNER INPUT'));
  
  // 2. Admin Comments
  const admin = await getUrl(baseUrl + '/admin/comments');
  console.log('Admin Status:', admin.status);
  
  // 3. API Evaluation missing config
  const apiRes = await postUrl(baseUrl + '/api/evaluation', {
    fullName: 'Test User',
    phone: '+40 000000000',
    mainGoal: 'study',
    privacyAcknowledgment: true
  });
  console.log('API Status:', apiRes.status);
  console.log('API Response:', apiRes.data);
}

check();
