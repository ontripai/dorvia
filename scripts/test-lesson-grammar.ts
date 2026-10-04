import assert from 'node:assert/strict';
import {GRAMMAR_TOPICS,GRAMMAR_NOUNS,grammarVerbsFor,isGrammarLessonPath} from '../src/content/romanian/lesson-grammar';
import {homeStoryLessons,familyCafeLesson,familyBakeryLesson} from '../src/content/romanian/family-story';
import {pharmacyScenarios} from '../src/content/romanian/pharmacy-scenarios';
import {bankingScenarios} from '../src/content/romanian/banking-scenarios';
import {cafeScenarios} from '../src/content/romanian/cafe-scenarios';
import {shoppingScenarios} from '../src/content/romanian/shopping-scenarios';
import {transportScenarios} from '../src/content/romanian/transport-scenarios';
import {directionsScenarios} from '../src/content/romanian/directions-scenarios';
import {workplaceScenarios} from '../src/content/romanian/workplace-scenarios';
import {housingScenarios} from '../src/content/romanian/housing-scenarios';
import {appointmentScenarios} from '../src/content/romanian/appointment-scenarios';
import {additionalFoundationLessons} from '../src/content/romanian/additional-foundation-lessons';
for(const lang of ['fa','en']) {
 const groups={acasa:homeStoryLessons,farmacie:pharmacyScenarios,banca:bankingScenarios,cafenea:[...cafeScenarios,familyCafeLesson],magazin:[...shoppingScenarios,familyBakeryLesson],transport:transportScenarios,directii:directionsScenarios,munca:workplaceScenarios,locuinta:housingScenarios,programare:appointmentScenarios};
 for(const [topic,lessons] of Object.entries(groups))for(const lesson of lessons)assert(isGrammarLessonPath(`/${lang}/learn-romanian/lectie/${topic}/${lesson.slug}`));
 for(const slug of Object.keys(additionalFoundationLessons))assert(isGrammarLessonPath(`/${lang}/learn-romanian/fundamente/${slug}`));
 for(const slug of ['bilet','metrou','autobuz-tramvai','un-o-doi-doua','magazin','cafenea','farmacie','directii','programare'])assert(isGrammarLessonPath(`/${lang}/learn-romanian/lectie/${slug}`));
 assert(isGrammarLessonPath(`/${lang}/learn-romanian/alfabet/a`));
 for(const route of ['', '/fundamente','/alfabet','/lectie','/lectie/tema/home','/modul'])assert(!isGrammarLessonPath(`/${lang}/learn-romanian${route}`));
}
assert.deepEqual(grammarVerbsFor('Mergem la cafenea. Cumpăr pâine.',true).map(v=>v.lemma),['a fi','a avea']);
assert(grammarVerbsFor('Da, mergem împreună. Plătesc cu cardul.',false).some(v=>v.lemma==='a merge'));
assert(grammarVerbsFor('Plătesc cu cardul.',false).some(v=>v.lemma==='a plăti'));
assert(grammarVerbsFor('Nu înțeleg.',false).some(v=>v.lemma==='a înțelege'));
assert(!grammarVerbsFor('O schimbare.',false).some(v=>v.lemma==='a avea'));
assert.equal(GRAMMAR_NOUNS.find(n=>n.lemma==='bilet')?.gender,'n');
for(const topic of GRAMMAR_TOPICS){assert(topic.explanation.fa&&topic.explanation.en&&topic.warning.fa&&topic.warning.en);assert(topic.rows.every(row=>row.length===topic.headers.length));assert(topic.examples.every(e=>e.ro&&e.fa&&e.en));assert(topic.sources.every(s=>s.url.startsWith('https://dexonline.ro/definitie/')));}
console.log('Grammar guide: all scenario/foundation/legacy/alphabet lesson routes covered, indexes excluded, foundation verb restriction, contextual forms and bilingual tables passed.');
