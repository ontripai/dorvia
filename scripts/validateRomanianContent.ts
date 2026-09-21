import { ALL_ROMANIAN_PHRASES } from '../src/lib/romanian/content';
import { validateRomanianPhrases } from '../src/lib/romanian/validator';

function main() {
  console.log('================================================================');
  console.log('DORVIA Romanian Language Content Validator (dre-p146, Phase L0)');
  console.log('================================================================');
  console.log(`Auditing ${ALL_ROMANIAN_PHRASES.length} phrases across rules V1 to V7...\n`);

  const errors = validateRomanianPhrases(ALL_ROMANIAN_PHRASES);

  if (errors.length > 0) {
    console.error(`❌ FAILED: Found ${errors.length} validation error(s):\n`);
    for (const err of errors) {
      console.error(`  [${err.rule}] (phrase: "${err.phraseId}"): ${err.message}`);
    }
    console.error('\nBuild aborted due to content validation failure.');
    process.exit(1);
  }

  console.log('✅ SUCCESS: All Romanian phrases strictly adhere to rules V1 to V7.');
  console.log(`  - Total phrases: ${ALL_ROMANIAN_PHRASES.length}`);
  console.log('  - All IDs & slugs unique and properly formatted.');
  console.log('  - All texts and sources validated.');
  console.log('  - Informal register strictly barred from published phrases.');
  console.log('  - Name tokens strictly consistent across ro/en/fa.');
  process.exit(0);
}

main();
