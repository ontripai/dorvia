import { faTranslations } from '../../src/lib/translations/fa';
import { enTranslations } from '../../src/lib/translations/en';
import fs from 'fs';
import path from 'path';

const outFa = path.join(process.cwd(), 'src/lib/translations/fa.json');
const outEn = path.join(process.cwd(), 'src/lib/translations/en.json');

fs.writeFileSync(outFa, JSON.stringify(faTranslations, null, 2), 'utf8');
fs.writeFileSync(outEn, JSON.stringify(enTranslations, null, 2), 'utf8');
console.log('Successfully extracted translations to fa.json and en.json');
