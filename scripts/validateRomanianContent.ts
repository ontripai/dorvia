import {
  ALL_WORDS,
  ALL_VERBS,
  ALL_GRAPHEMES,
  ALL_PHRASES,
  ALL_DIALOGUES,
  ALL_DOMAINS,
} from '../src/content/romanian/registry';
import {
  validateRomanianContent,
  computeContentStats,
  RomanianValidationContext,
} from '../src/lib/romanian/validator';

function main() {
  const allPhrases = ALL_PHRASES;
  const publishedPhrases = allPhrases.filter(p => p.status === 'published');
  const allWords = ALL_WORDS;
  const allVerbs = ALL_VERBS;
  const allGraphemes = ALL_GRAPHEMES;

  const context: RomanianValidationContext = {
    phrases: allPhrases,
    words: allWords,
    verbs: allVerbs,
    graphemes: allGraphemes,
    dialogues: ALL_DIALOGUES,
    domains: ALL_DOMAINS,
  };

  console.log('================================================================');
  console.log('DORVIA Romanian Language Content Validator (dre-p159, Registry)');
  console.log('================================================================');
  console.log(
    `Auditing ${allPhrases.length} phrases (${publishedPhrases.length} published), ${allWords.length} words, ${allVerbs.length} verbs, ${allGraphemes.length} graphemes, ${ALL_DOMAINS.length} domains across rules V1 to V23...\n`
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

  console.log('✅ SUCCESS: All Romanian content strictly adheres to rules V1 to V19.');
  console.log(`  - Total phrases: ${allPhrases.length} (${publishedPhrases.length} published, ${allPhrases.length - publishedPhrases.length} in review)`);
  console.log(`  - Total words: ${allWords.length} (${allWords.filter(w => w.status === 'published').length} published, ${allWords.filter(w => w.status === 'draft').length} draft)`);
  console.log(`  - Total verbs: ${allVerbs.length} (${allVerbs.filter(v => v.status === 'published').length} published, ${allVerbs.filter(v => v.status === 'draft').length} draft)`);
  console.log(`  - Total graphemes: ${allGraphemes.length} (${allGraphemes.filter(g => g.status === 'published').length} published, ${allGraphemes.filter(g => g.status === 'draft').length} draft)`);
  console.log(`  - Total domains: ${ALL_DOMAINS.length}`);
  console.log('  - All IDs & slugs unique and properly formatted (V1-V3, V17).');
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
  console.log('  - Global entity ID uniqueness across combined dataset verified (V17).');
  console.log('  - Grapheme-to-word referential integrity verified (V18).');
  console.log('  - Display form contains lesson grapheme verified (V19).');
  console.log('  - Verb participiu and conjunctiv completeness verified (V20).');
  console.log('  - Verb stored forms purity verified (V21).');
  console.log('  - Grapheme published audio completeness verified (V22).');
  console.log('  - Audio clip file referential integrity on disk verified (V23).');
  process.exit(0);
}

main();
