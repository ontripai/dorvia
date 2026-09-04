const fs = require('fs');

let content = fs.readFileSync('src/components/CommentsSection.tsx', 'utf8');

// The privacy string to inject
const privacyNotice = `
          {/* Privacy Notice */}
          <div className="bg-[#f0f4f8] p-4 rounded-xl border border-[#dfe6ef] space-y-2 mt-2">
            <p className="text-xs text-[#526174] leading-relaxed">
              {currentLang === 'fa' 
                ? 'توجه: نام شما اختیاری است. لطفاً از ارسال اطلاعات شخصی، پزشکی، مهاجرتی یا مالی خودداری کنید. نظرات پس از تایید مدیر به صورت عمومی نمایش داده می‌شوند. جهت ثبت درخواست حذف یا ویرایش، به سیاست حریم خصوصی مراجعه فرمایید.'
                : 'Notice: Your name is optional. Please do not submit personal, medical, immigration, or financial details. Comments are moderated before public display. See the Privacy Policy to request removal.'}
            </p>
          </div>
`;

// Insert it right after the Comment Textarea div starts
const formStart = content.indexOf('<form onSubmit={handleSubmit} className="space-y-4">');
if (formStart !== -1) {
  content = content.slice(0, formStart + 54) + privacyNotice + content.slice(formStart + 54);
}

fs.writeFileSync('src/components/CommentsSection.tsx', content, 'utf8');
console.log('CommentsSection updated with privacy text.');
