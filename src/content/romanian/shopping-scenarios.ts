import type { EverydayScenario } from '@/components/romanian/EverydayScenarioLesson';

export const shoppingScenarios: EverydayScenario[] = [
  {
    slug: 'brutarie', title: { fa: 'خرید از نانوایی', en: 'At the bakery' },
    goal: { fa: 'نان بخواهید، موجودی را بپرسید و تعداد را مشخص کنید.', en: 'Ask for bread, check availability, and specify a quantity.' },
    dialogue: [
      { who: 'you', ro: 'Bună ziua!', en: 'Hello!', fa: 'سلام!' },
      { who: 'you', ro: 'Aveți pâine proaspătă?', en: 'Do you have fresh bread?', fa: 'نان تازه دارید؟' },
      { who: 'seller', ro: 'Da, avem pâine proaspătă.', en: 'Yes, we have fresh bread.', fa: 'بله، نان تازه داریم.' },
      { who: 'you', ro: 'Două pâini, vă rog.', en: 'Two loaves, please.', fa: 'لطفاً دو قرص نان.' },
      { who: 'seller', ro: 'Mai doriți ceva?', en: 'Would you like anything else?', fa: 'چیز دیگری هم میل دارید؟' },
      { who: 'you', ro: 'Nu, mulțumesc. Cât costă?', en: 'No, thank you. How much is it?', fa: 'نه، ممنون. چقدر می‌شود؟' },
    ],
    rules: [
      { title: { fa: 'پرسش دربارهٔ موجودی', en: 'Ask if an item is available' }, explanation: { fa: 'Aveți صورت مؤدبانهٔ «دارید؟» از a avea است. نام کالا پس از فعل می‌آید: Aveți pâine proaspătă? صفت proaspătă بعد از pâine قرار می‌گیرد و با اسم مؤنث هماهنگ است.', en: 'Aveți is polite “do you have?” from a avea. Put the item after the verb. Proaspătă (“fresh”) follows the feminine noun pâine and agrees with it.' }, examples: [{ ro: 'Aveți pâine proaspătă?', en: 'Do you have fresh bread?', fa: 'نان تازه دارید؟' }] },
      { title: { fa: 'تعداد نان', en: 'Number of loaves' }, explanation: { fa: 'pâine در مفرد «نان/یک قرص نان» و pâini در جمع است. برای اسم مؤنث، عدد دو به شکل două می‌آید: două pâini. در درخواست کوتاه، تعداد و کالا را بگویید و vă rog را بیفزایید.', en: 'Pâine is singular; pâini is plural. The feminine form of “two” is două: două pâini. For a short request, say the quantity and item, then add vă rog.' }, examples: [{ ro: 'Două pâini, vă rog.', en: 'Two loaves, please.', fa: 'لطفاً دو قرص نان.' }] },
      { title: { fa: 'پاسخ به «چیز دیگر؟»', en: 'Reply to “Anything else?”' }, explanation: { fa: 'Mai doriți ceva? یعنی «چیز دیگری هم می‌خواهید؟». اگر خریدتان تمام است، Nu, mulțumesc. بگویید و سپس قیمت را بپرسید: Cât costă?', en: 'Mai doriți ceva? asks “Anything else?” If you are done, reply Nu, mulțumesc. and ask Cât costă? for the price.' }, examples: [{ ro: 'Nu, mulțumesc. Cât costă?', en: 'No, thank you. How much is it?', fa: 'نه، ممنون. چقدر می‌شود؟' }] },
    ],
    tasks: [
      { ro: 'Aveți pâine proaspătă?', en: 'Ask for fresh bread.', fa: 'بپرسید نان تازه دارند؟', hint: 'Aveți pâine …?' },
      { ro: 'Două pâini, vă rog.', en: 'Ask for two loaves.', fa: 'دو قرص نان بخواهید.', hint: 'Două …, vă rog.' },
      { ro: 'Nu, mulțumesc. Cât costă?', en: 'Decline more items and ask the price.', fa: 'کالای دیگری نخواهید و قیمت را بپرسید.', hint: 'Nu, mulțumesc. Cât …?' },
    ],
  },
  {
    slug: 'fructe', title: { fa: 'میوه و مقدار', en: 'Fruit and quantity' },
    goal: { fa: 'مقدار میوه را به کیلوگرم بگویید و درخواست کیسه کنید.', en: 'Specify a weight of fruit and ask for a bag.' },
    dialogue: [
      { who: 'you', ro: 'Aș dori un kilogram de mere, vă rog.', en: 'I would like one kilogram of apples, please.', fa: 'لطفاً یک کیلوگرم سیب می‌خواهم.' },
      { who: 'seller', ro: 'Doriți și banane?', en: 'Would you like bananas too?', fa: 'موز هم می‌خواهید؟' },
      { who: 'you', ro: 'Da, o jumătate de kilogram de banane.', en: 'Yes, half a kilogram of bananas.', fa: 'بله، نیم کیلوگرم موز.' },
      { who: 'seller', ro: 'Altceva?', en: 'Anything else?', fa: 'چیز دیگری؟' },
      { who: 'you', ro: 'Aveți o pungă, vă rog?', en: 'Do you have a bag, please?', fa: 'لطفاً یک کیسه دارید؟' },
      { who: 'seller', ro: 'Da, poftiți.', en: 'Yes, here you are.', fa: 'بله، بفرمایید.' },
    ],
    rules: [
      { title: { fa: 'مقدار + de + کالا', en: 'Quantity + de + item' }, explanation: { fa: 'برای وزن، نخست مقدار، سپس de و بعد نام کالا را می‌آوریم: un kilogram de mere. mere جمعِ măr («سیب») است. مقدار را مطابق نیاز واقعی تغییر دهید.', en: 'For weight, put the quantity before de and the item: un kilogram de mere. Mere is the plural of măr (“apple”). Change the amount to match your need.' }, examples: [{ ro: 'Aș dori un kilogram de mere, vă rog.', en: 'I would like one kilogram of apples, please.', fa: 'لطفاً یک کیلوگرم سیب می‌خواهم.' }] },
      { title: { fa: 'نیم کیلوگرم', en: 'Half a kilogram' }, explanation: { fa: 'o jumătate de kilogram یعنی «نیم کیلوگرم». برای موز، عبارت de banane را در پایان اضافه کنید. jumătate اسم مؤنث است و o می‌گیرد.', en: 'O jumătate de kilogram means “half a kilogram”. Add de banane for bananas. Jumătate is feminine and takes o.' }, examples: [{ ro: 'Da, o jumătate de kilogram de banane.', en: 'Yes, half a kilogram of bananas.', fa: 'بله، نیم کیلوگرم موز.' }] },
      { title: { fa: 'درخواست کیسه', en: 'Ask for a bag' }, explanation: { fa: 'pungă به معنی «کیسه» و اسم مؤنث است؛ پس o pungă می‌گوییم. Aveți صورت مؤدبانهٔ «دارید؟» است. افزودن vă rog درخواست را مؤدبانه می‌کند.', en: 'Pungă means “bag” and is feminine, so say o pungă. Aveți is polite “do you have?” Add vă rog to soften the request.' }, examples: [{ ro: 'Aveți o pungă, vă rog?', en: 'Do you have a bag, please?', fa: 'لطفاً یک کیسه دارید؟' }] },
    ],
    tasks: [
      { ro: 'Aș dori un kilogram de mere, vă rog.', en: 'Ask for one kilogram of apples.', fa: 'یک کیلوگرم سیب بخواهید.', hint: 'Aș dori un kilogram de … .' },
      { ro: 'Da, o jumătate de kilogram de banane.', en: 'Add half a kilogram of bananas.', fa: 'نیم کیلوگرم موز اضافه کنید.', hint: 'Da, o jumătate de kilogram de … .' },
      { ro: 'Aveți o pungă, vă rog?', en: 'Ask for a bag.', fa: 'یک کیسه بخواهید.', hint: 'Aveți o …, vă rog?' },
    ],
  },
  {
    slug: 'marime', title: { fa: 'اندازه و رنگ در فروشگاه', en: 'Size and colour in a shop' },
    goal: { fa: 'اندازه و رنگ لباس را بپرسید و اجازهٔ امتحان کردن بخواهید.', en: 'Ask for a clothing size and colour, then ask to try it on.' },
    dialogue: [
      { who: 'you', ro: 'Bună ziua! Aveți acest tricou în mărimea M?', en: 'Hello! Do you have this T-shirt in size M?', fa: 'سلام! این تی‌شرت را در اندازهٔ M دارید؟' },
      { who: 'seller', ro: 'Da, avem mărimea M.', en: 'Yes, we have size M.', fa: 'بله، اندازهٔ M داریم.' },
      { who: 'you', ro: 'Îl aveți și pe albastru?', en: 'Do you also have it in blue?', fa: 'رنگ آبی آن را هم دارید؟' },
      { who: 'seller', ro: 'Da, este aici.', en: 'Yes, it is here.', fa: 'بله، اینجاست.' },
      { who: 'you', ro: 'Pot să îl probez?', en: 'May I try it on?', fa: 'می‌توانم آن را امتحان کنم؟' },
      { who: 'seller', ro: 'Da, cabina de probă este acolo.', en: 'Yes, the fitting room is over there.', fa: 'بله، اتاق پرو آنجاست.' },
    ],
    rules: [
      { title: { fa: 'اندازهٔ لباس', en: 'Clothing size' }, explanation: { fa: 'acest tricou یعنی «این تی‌شرت». în mărimea M یعنی «در اندازهٔ M». برای پرسیدن موجودی، Aveți را در آغاز جمله بیاورید. mărimea شکل معینِ mărime («اندازه») است.', en: 'Acest tricou means “this T-shirt”; în mărimea M means “in size M”. Begin with Aveți to ask if the shop has it. Mărimea is the definite form of mărime (“size”).' }, examples: [{ ro: 'Bună ziua! Aveți acest tricou în mărimea M?', en: 'Hello! Do you have this T-shirt in size M?', fa: 'سلام! این تی‌شرت را در اندازهٔ M دارید؟' }] },
      { title: { fa: 'پرسش دربارهٔ رنگ', en: 'Ask about the colour' }, explanation: { fa: 'Îl در این جمله به tricou (اسم خنثی در مفرد) برمی‌گردد و پیش از aveți می‌آید. pe albastru در گفتار فروشگاهی «به رنگ آبی» است. și معنی «هم» دارد.', en: 'Îl refers back to tricou (neuter singular) and comes before aveți. Pe albastru is a common shop expression for “in blue”; și means “also”.' }, examples: [{ ro: 'Îl aveți și pe albastru?', en: 'Do you also have it in blue?', fa: 'رنگ آبی آن را هم دارید؟' }] },
      { title: { fa: 'امتحان کردن و اتاق پرو', en: 'Trying it on and fitting room' }, explanation: { fa: 'Pot să ...? یعنی «می‌توانم ...؟» و پس از să فعل صرف‌شده می‌آید: să îl probez («آن را امتحان کنم»). cabina de probă یعنی «اتاق پرو».', en: 'Pot să ...? means “May I ...?” After să, use the conjugated verb: să îl probez (“try it on”). Cabina de probă is the fitting room.' }, examples: [{ ro: 'Pot să îl probez?', en: 'May I try it on?', fa: 'می‌توانم آن را امتحان کنم؟' }, { ro: 'Da, cabina de probă este acolo.', en: 'Yes, the fitting room is over there.', fa: 'بله، اتاق پرو آنجاست.' }] },
    ],
    tasks: [
      { ro: 'Bună ziua! Aveți acest tricou în mărimea M?', en: 'Ask for this T-shirt in size M.', fa: 'تی‌شرت را در اندازهٔ M بخواهید.', hint: 'Bună ziua! Aveți acest tricou în …?' },
      { ro: 'Îl aveți și pe albastru?', en: 'Ask whether it also comes in blue.', fa: 'رنگ آبی آن را بپرسید.', hint: 'Îl aveți și pe …?' },
      { ro: 'Pot să îl probez?', en: 'Ask to try it on.', fa: 'اجازهٔ پرو کردن بخواهید.', hint: 'Pot să îl …?' },
    ],
  },
];

export function getShoppingScenario(slug: string) { return shoppingScenarios.find(scenario => scenario.slug === slug); }

