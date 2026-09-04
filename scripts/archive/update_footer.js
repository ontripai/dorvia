const fs = require('fs');

// Footer
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footer = footer.replace(
  `              <li><Link href="/legal/privacy" className="hover:text-[#F4F7FC] transition-colors cursor-pointer">{currentLang === 'fa' ? 'سیاست حریم خصوصی' : 'Privacy Policy'}</Link></li>
              <li><Link href="/legal/disclaimer" className="hover:text-[#F4F7FC] transition-colors cursor-pointer">{currentLang === 'fa' ? 'سلب مسئولیت قانونی' : 'Legal Disclaimer'}</Link></li>`,
  `              <li><Link href="/legal/privacy" className="hover:text-[#F4F7FC] transition-colors cursor-pointer">{currentLang === 'fa' ? 'سیاست حریم خصوصی' : 'Privacy Policy'}</Link></li>
              <li><Link href="/legal/terms" className="hover:text-[#F4F7FC] transition-colors cursor-pointer">{currentLang === 'fa' ? 'شرایط استفاده' : 'Terms of Use'}</Link></li>
              <li><Link href="/legal/disclaimer" className="hover:text-[#F4F7FC] transition-colors cursor-pointer">{currentLang === 'fa' ? 'سلب مسئولیت قانونی' : 'Legal Disclaimer'}</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-[#F4F7FC] transition-colors cursor-pointer">{currentLang === 'fa' ? 'اطلاعات کوکی‌ها' : 'Cookie Information'}</Link></li>`
);
fs.writeFileSync('src/components/Footer.tsx', footer, 'utf8');


// Sitemap
let sitemap = fs.readFileSync('src/app/sitemap.ts', 'utf8');
if (sitemap.includes('/admin/comments')) {
    sitemap = sitemap.replace(
      `    { url: \`\${baseUrl}/admin/comments\`, lastModified: new Date(), changeFrequency: 'never', priority: 0.0 },\n`,
      ''
    );
}
// check if legal routes are there
if (!sitemap.includes('/legal/privacy')) {
    const sitemapArrEnd = sitemap.lastIndexOf('];');
    if (sitemapArrEnd !== -1) {
        const legalLinks = `
    { url: \`\${baseUrl}/legal/privacy\`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 },
    { url: \`\${baseUrl}/legal/terms\`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 },
    { url: \`\${baseUrl}/legal/disclaimer\`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 },
`;
        sitemap = sitemap.slice(0, sitemapArrEnd) + legalLinks + sitemap.slice(sitemapArrEnd);
    }
}
fs.writeFileSync('src/app/sitemap.ts', sitemap, 'utf8');

console.log('Footer and Sitemap updated.');
