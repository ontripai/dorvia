import { PILOT_PHRASES } from '../src/content/romanian/pilot';
import { STAGE0_PHRASES } from '../src/content/romanian/stage0';
import {
  SEED_DOMAINS,
  SEED_WORDS,
  SEED_VERBS,
  SEED_GRAPHEMES,
  SEED_DIALOGUES,
} from '../src/content/romanian/seed';
import { validateRomanianContent } from '../src/lib/romanian/validator';

function main() {
  const allPhrases = [...PILOT_PHRASES, ...STAGE0_PHRASES];

  console.log('================================================================');
  console.log('DORVIA Romanian Language Content Validator (dre-p152, Model V2)');
  console.log('================================================================');
  console.log(
    `Auditing ${allPhrases.length} phrases, ${SEED_WORDS.length} words, ${SEED_VERBS.length} verbs, ${SEED_GRAPHEMES.length} graphemes across rules V1 to V14...\n`
  );

  const errors = validateRomanianContent({
    phrases: allPhrases,
    words: SEED_WORDS,
    verbs: SEED_VERBS,
    graphemes: SEED_GRAPHEMES,
    dialogues: SEED_DIALOGUES,
    domains: SEED_DOMAINS,
  });

  if (errors.length > 0) {
    console.error(`❌ FAILED: Found ${errors.length} validation error(s):\n`);
    for (const err of errors) {
      console.error(`  [${err.rule}] (entity: "${err.phraseId}"): ${err.message}`);
    }
    console.error('\nBuild aborted due to content validation failure.');
    process.exit(1);
  }

  console.log('✅ SUCCESS: All Romanian content strictly adheres to rules V1 to V14.');
  console.log(`  - Total phrases: ${allPhrases.length}`);
  console.log(`  - Total words: ${SEED_WORDS.length}`);
  console.log(`  - Total verbs: ${SEED_VERBS.length}`);
  console.log(`  - Total graphemes: ${SEED_GRAPHEMES.length}`);
  console.log('  - All IDs & slugs unique and properly formatted (V1-V3).');
  console.log('  - All texts and sources validated (V4-V5).');
  console.log('  - Register policy scoped to intendedUse: produce (V6).');
  console.log('  - Name tokens strictly consistent across ro/en/fa (V7).');
  console.log('  - Verb prefix ZWNJ (نیم‌فاصله) strictly enforced (V8).');
  console.log('  - Reference existence strictly verified (V9).');
  console.log('  - Verb source URL & present tense conjugation verified (V10).');
  console.log('  - Noun gender and definite forms verified (V11).');
  console.log('  - Domain introduction order strictly enforced (V12).');
  console.log('  - Domain estimatedWeeks and stationOrder verified (V13).');
  console.log('  - High-risk domain sourcing policy strictly enforced (V14).');
  process.exit(0);
}

main();
