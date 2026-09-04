const fs = require('fs');
const path = 'src/components/MainContent.tsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/'Your information is processed in accordance with the site\\'s privacy policy and solely for reviewing requests and service-related communication.'/g, '"Your information is processed in accordance with the site\\'s privacy policy and solely for reviewing requests and service-related communication."');
fs.writeFileSync(path, content);
