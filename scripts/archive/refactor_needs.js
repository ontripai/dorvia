const fs = require('fs');
const file = 'src/components/NeedsContent.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add imports
if (!content.includes('OperationalGuideLayout')) {
  content = content.replace(
    "import { ParentHubFooterCard } from './ParentHubFooterCard';",
    "import { ParentHubFooterCard } from './ParentHubFooterCard';\nimport { OperationalGuideLayout } from './guide/OperationalGuideLayout';\nimport { drivingLicenseEN } from '../content/guides/driving-license/en';\nimport { drivingLicenseFA } from '../content/guides/driving-license/fa';"
  );
}

// Find case 'driving-license'
const startIdx = content.indexOf("case 'driving-license':");
const endMarker = "    // 3. CERTIFIED TRANSLATION";
const endIdx = content.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `case 'driving-license': {
      const guideData = currentLang === 'fa' ? drivingLicenseFA : drivingLicenseEN;
      const translations = currentLang === 'fa' ? {
        tocTitle: 'فهرست محتوای این راهنما',
        quickOverview: 'پاسخ سریع: ',
        appliesTo: 'این بخش برای چه کسانی است؟',
        exceptionsTitle: 'استثنائات و محدودیت‌ها',
        documentsTitle: 'مدارک مورد نیاز',
        stepsTitle: 'مراحل انجام کار',
        feesTitle: 'هزینه‌های مربوطه',
        timelinesTitle: 'زمان‌بندی فرآیند',
        amountHeader: 'مبلغ',
        notesHeader: 'توضیحات',
        durationHeader: 'مدت زمان',
        authorityTitle: 'مرجع مسئول',
        actionLabel: 'پورتال رسمی اقدام',
        warningsTitle: 'هشدارهای مهم',
        sourcesTitle: 'منابع رسمی استناد شده',
        accessedOn: 'تاریخ دسترسی',
        lastReviewed: 'آخرین بازبینی'
      } : {
        tocTitle: 'Table of Contents',
        quickOverview: 'Quick Overview: ',
        appliesTo: 'Who this applies to',
        exceptionsTitle: 'Exceptions & Limitations',
        documentsTitle: 'Required Documents',
        stepsTitle: 'Step-by-Step Process',
        feesTitle: 'Applicable Fees',
        timelinesTitle: 'Process Timelines',
        amountHeader: 'Amount',
        notesHeader: 'Notes',
        durationHeader: 'Duration',
        authorityTitle: 'Responsible Authority',
        actionLabel: 'Official Action Portal',
        warningsTitle: 'Important Warnings',
        sourcesTitle: 'Official Sources Cited',
        accessedOn: 'Accessed on',
        lastReviewed: 'Last Reviewed'
      };

      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="needs/driving-license" currentLang={currentLang} onNavigate={onNavigate} />
          <OperationalGuideLayout guide={guideData} translations={translations} />
          <ParentHubFooterCard
            currentLang={currentLang}
            hubTitle={currentLang === 'fa' ? 'نیازهای روزمره' : 'Daily Essentials'}
            hubDesc={currentLang === 'fa' ? 'بازگشت به فهرست نیازمندی‌ها' : 'Return to essentials directory'}
            hubRoute="/needs"
          />
          <CommentsSection pagePath={\`needs/\${subRoute}\`} currentLang={currentLang} />
        </div>
      );
    }

`;

  content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
  fs.writeFileSync(file, content);
  console.log('Successfully replaced driving-license case.');
} else {
  console.log('Could not find boundaries.');
}
