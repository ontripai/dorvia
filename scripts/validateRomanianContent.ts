import { PILOT_PHRASES } from '../src/content/romanian/pilot';
import { STAGE0_PHRASES } from '../src/content/romanian/stage0';
import {
  SEED_DOMAINS,
  SEED_WORDS,
  SEED_VERBS,
  SEED_GRAPHEMES,
  SEED_DIALOGUES,
} from '../src/content/romanian/seed';
import {
  validateRomanianContent,
  computeContentStats,
  RomanianValidationContext,
} from '../src/lib/romanian/validator';

function main() {
  const allPhrases = [...PILOT_PHRASES, ...STAGE0_PHRASES];
  const publishedPhrases = allPhrases.filter(p => p.status === 'published');

  const context: RomanianValidationContext = {
    phrases: allPhrases,
    words: SEED_WORDS,
    verbs: SEED_VERBS,
    graphemes: SEED_GRAPHEMES,
    dialogues: SEED_DIALOGUES,
    domains: SEED_DOMAINS,
  };

  console.log('================================================================');
  console.log('DORVIA Romanian Language Content Validator (dre-p153, Taxonomy)');
  console.log('================================================================');
  console.log(
    `Auditing ${allPhrases.length} phrases (${publishedPhrases.length} published), ${SEED_WORDS.length} words, ${SEED_VERBS.length} verbs, ${SEED_GRAPHEMES.length} graphemes, ${SEED_DOMAINS.length} domains across rules V1 to V16...\n`
  );

  const errors = validateRomanianContent(context);

  if (errors.length > 0) {
    console.error(`❌ FAILED: Found ${errors.length} validation error(s):\n`);
    for (const err of errors) {
      console.error(`  [${err.rule}] (entity: "${err.phraseId}"): ${err.message}`);
    }
    console.error('\nBuild aborted due to content validation failure.');
    process.exit(1);
  }

  const stats = computeContentStats(context);

  console.log('DOMAIN SIZES:');
  for (const d of stats.domainSizes) {
    const parts: string[] = [];
    if (d.phrases > 0 || (d.words === 0 && d.verbs === 0)) {
      parts.push(`${String(d.phrases).padStart(2, ' ')} phrase${d.phrases === 1 ? ' ' : 's'}`);
    }
    if (d.words > 0) {
      parts.push(`${String(d.words).padStart(2, ' ')} word${d.words === 1 ? ' ' : 's'}`);
    }
    if (d.verbs > 0) {
      parts.push(`${String(d.verbs).padStart(2, ' ')} verb${d.verbs === 1 ? ' ' : 's'}`);
    }
    const budgetStr = typeof d.budget === 'number' ? `   (budget ${d.budget})` : '';
    console.log(`  ${d.id.padEnd(15, ' ')}: ${parts.join(', ')}${budgetStr}`);
  }
  console.log(`  words in 'core' that also belong to another domain: ${stats.coreMultiDomainWords}`);
  console.log(`  verbs in 'core' that also belong to another domain: ${stats.coreMultiDomainVerbs}`);

  console.log(`\nCATEGORY MAPPING: ${stats.mappedCategoriesCount} of ${stats.totalCategoriesCount} categories mapped to at least one domain\n`);

  console.log('✅ SUCCESS: All Romanian content strictly adheres to rules V1 to V16.');
  console.log(`  - Total phrases: ${allPhrases.length} (${publishedPhrases.length} published, 2 in review)`);
  console.log(`  - Total words: ${SEED_WORDS.length}`);
  console.log(`  - Total verbs: ${SEED_VERBS.length}`);
  console.log(`  - Total graphemes: ${SEED_GRAPHEMES.length}`);
  console.log(`  - Total domains: ${SEED_DOMAINS.length}`);
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
  console.log('  - Category-domain compatibility verified (V15).');
  console.log('  - Domain item budgets verified (V16).');
  process.exit(0);
}

main();
