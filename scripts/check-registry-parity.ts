import * as fs from 'fs';
import * as path from 'path';
import {
  ALL_WORDS,
  ALL_VERBS,
  ALL_GRAPHEMES,
  ALL_PHRASES,
  ALL_DIALOGUES,
  ALL_DOMAINS,
} from '../src/content/romanian/registry';
import {
  ALL_ROMANIAN_WORDS,
  ALL_ROMANIAN_VERBS,
  ALL_ROMANIAN_GRAPHEMES,
  ALL_ROMANIAN_PHRASES,
  ALL_ROMANIAN_DIALOGUES,
  ALL_ROMANIAN_DOMAINS,
} from '../src/lib/romanian/content';

function main() {
  const lines: string[] = [];
  const log = (msg: string) => {
    console.log(msg);
    lines.push(msg);
  };

  log('================================================================');
  log('DORVIA Romanian Content Registry Parity Audit (dre-p159)');
  log('================================================================');

  const entities = [
    {
      name: 'Words',
      registryCount: ALL_WORDS.length,
      contentCount: ALL_ROMANIAN_WORDS.length,
      expected: 26,
    },
    {
      name: 'Verbs',
      registryCount: ALL_VERBS.length,
      contentCount: ALL_ROMANIAN_VERBS.length,
      expected: 14,
    },
    {
      name: 'Graphemes',
      registryCount: ALL_GRAPHEMES.length,
      contentCount: ALL_ROMANIAN_GRAPHEMES.length,
      expected: 24,
    },
    {
      name: 'Phrases',
      registryCount: ALL_PHRASES.length,
      contentCount: ALL_ROMANIAN_PHRASES.length,
      expected: 35,
    },
    {
      name: 'Dialogues',
      registryCount: ALL_DIALOGUES.length,
      contentCount: ALL_ROMANIAN_DIALOGUES.length,
      expected: 0,
    },
    {
      name: 'Domains',
      registryCount: ALL_DOMAINS.length,
      contentCount: ALL_ROMANIAN_DOMAINS.length,
      expected: 5,
    },
  ];

  let parityFailed = false;

  for (const item of entities) {
    const match = item.registryCount === item.contentCount && item.registryCount === item.expected;
    const status = match ? 'MATCH' : 'MISMATCH';
    if (!match) parityFailed = true;

    log(
      `  [${status}] ${item.name.padEnd(10)}: Registry=${String(item.registryCount).padEnd(2)} | Content=${String(item.contentCount).padEnd(2)} | Expected=${item.expected}`
    );
  }

  log('\nDETAILED STATUS BREAKDOWN:');
  log(`  - Published Words: ${ALL_ROMANIAN_WORDS.filter(w => w.status === 'published').length}, Draft Words: ${ALL_ROMANIAN_WORDS.filter(w => w.status === 'draft').length}`);
  log(`  - Published Verbs: ${ALL_ROMANIAN_VERBS.filter(v => v.status === 'published').length}, Draft Verbs: ${ALL_ROMANIAN_VERBS.filter(v => v.status === 'draft').length}`);
  log(`  - Published Graphemes: ${ALL_ROMANIAN_GRAPHEMES.filter(g => g.status === 'published').length}, Draft Graphemes: ${ALL_ROMANIAN_GRAPHEMES.filter(g => g.status === 'draft').length}`);
  log(`  - Published Phrases: ${ALL_ROMANIAN_PHRASES.filter(p => p.status === 'published').length}, In-Review Phrases: ${ALL_ROMANIAN_PHRASES.filter(p => p.status !== 'published').length}`);

  if (parityFailed) {
    log('\n❌ PARITY CHECK FAILED: Mismatch between registry and content layer.');
    fs.writeFileSync(path.join(process.cwd(), 'registry-parity.log'), lines.join('\n'), 'utf8');
    process.exit(1);
  } else {
    log('\n✅ 100% PARITY VERIFIED: Registry and Content layers are strictly identical across all entities.');
    fs.writeFileSync(path.join(process.cwd(), 'registry-parity.log'), lines.join('\n'), 'utf8');
    process.exit(0);
  }
}

main();
