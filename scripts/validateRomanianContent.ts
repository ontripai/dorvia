import { PILOT_PHRASES } from '../src/content/romanian/pilot';
import { STAGE0_PHRASES } from '../src/content/romanian/stage0';
import { validateRomanianPhrases } from '../src/lib/romanian/validator';

function main() {
  const allPhrases = [...PILOT_PHRASES, ...STAGE0_PHRASES];

  console.log('================================================================');
  console.log('DORVIA Romanian Language Content Validator (dre-p146, Phase L0)');
  console.log('================================================================');
  console.log(`Auditing ${allPhrases.length} phrases across rules V1 to V8...\n`);

  const errors = validateRomanianPhrases(allPhrases);

  if (errors.length > 0) {
    console.error(`❌ FAILED: Found ${errors.length} validation error(s):\n`);
    for (const err of errors) {
      console.error(`  [${err.rule}] (phrase: "${err.phraseId}"): ${err.message}`);
    }
    console.error('\nBuild aborted due to content validation failure.');
    process.exit(1);
  }

  console.log('✅ SUCCESS: All Romanian phrases strictly adhere to rules V1 to V8.');
  console.log(`  - Total phrases: ${allPhrases.length}`);
  console.log('  - All IDs & slugs unique and properly formatted.');
  console.log('  - All texts and sources validated.');
  console.log('  - Informal register strictly barred from published phrases.');
  console.log('  - Name tokens strictly consistent across ro/en/fa.');
  console.log('  - Verb prefix ZWNJ (نیم‌فاصله) strictly enforced.');
  process.exit(0);
}

main();
