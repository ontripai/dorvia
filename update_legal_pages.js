const fs = require('fs');

// 1. LegalContentWrapper.tsx
let wrapper = fs.readFileSync('src/app/legal/[slug]/LegalContentWrapper.tsx', 'utf8');
wrapper = wrapper.replace(
  `      <div className="pt-8 border-t border-[#dfe6ef]">
        <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
      </div>`,
  `      <div className="pt-8 border-t border-[#dfe6ef] text-center">
        <button onClick={onOpenEvaluationModal} className="text-sm font-bold text-[#2F6FED] hover:underline">
          {currentLang === 'fa' ? 'تماس با ما' : 'Contact Us'}
        </button>
      </div>`
);
wrapper = wrapper.replace(`import { EvaluationCTA } from '../../../components/EvaluationCTA';\n`, '');
fs.writeFileSync('src/app/legal/[slug]/LegalContentWrapper.tsx', wrapper);

// 2. PrivacyContent.tsx
let privacy = fs.readFileSync('src/app/legal/[slug]/PrivacyContent.tsx', 'utf8');
privacy = privacy.replace(
  `      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
        <p className="font-bold text-yellow-800">[OWNER INPUT REQUIRED: Legal Entity Name, Registration Number, and Official Address Must Be Added Here]</p>
      </div>`,
  `      <div className="bg-[#eef3f8] border-l-4 border-[#2F6FED] p-4 rounded-r-xl">
        <p className="font-bold text-[#142033] text-xs">اطلاعات حقوقی مجری (شرکت) به زودی پس از تایید نهایی در این بخش قرار می‌گیرد.</p>
      </div>`
);
privacy = privacy.replace(`[OWNER INPUT REQUIRED: Legal entity standing]`, `فعالیت می‌کند`);
privacy = privacy.replace(`با [OWNER INPUT REQUIRED: DPO Email / Contact Email] در ارتباط باشید.`, `با ایمیل حریم خصوصی اعلام‌شده در این صفحه تماس بگیرید.`);
privacy = privacy.replace(`[OWNER INPUT REQUIRED: Exact retention period to be defined]. در حال حاضر، پیام‌های ارسالی تا زمان تعیین تکلیف نهایی پرونده نگهداری می‌شوند.`, `{legalOperatorConfig.retentionPolicy}`);
privacy = privacy.replace(`[OWNER INPUT REQUIRED: Date]`, `{legalOperatorConfig.privacyPolicyUpdatedAt}`);
privacy = privacy.replace(`با [OWNER INPUT REQUIRED: Email/Phone] در ارتباط باشید.`, `با ایمیل {legalOperatorConfig.privacyContactEmail} در ارتباط باشید.`);
privacy = `import { legalOperatorConfig } from '../../../lib/legalConfig';\n` + privacy;
fs.writeFileSync('src/app/legal/[slug]/PrivacyContent.tsx', privacy);


// 3. TermsContent.tsx
let terms = fs.readFileSync('src/app/legal/[slug]/TermsContent.tsx', 'utf8');
terms = terms.replace(
  `      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
        <p className="font-bold text-yellow-800">[OWNER INPUT REQUIRED: Legal Entity Name and Governing Law Jurisdiction]</p>
      </div>`,
  `      <div className="bg-[#eef3f8] border-l-4 border-[#2F6FED] p-4 rounded-r-xl">
        <p className="font-bold text-[#142033] text-xs">حوزه قضایی و اطلاعات ثبتی پس از تایید نهایی درج خواهد شد.</p>
      </div>`
);
fs.writeFileSync('src/app/legal/[slug]/TermsContent.tsx', terms);

// 4. DisclaimerContent.tsx - no placeholders there, but just checking.

console.log('Legal components updated.');
