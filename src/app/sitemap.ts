import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dorvia.eu';

  const routes = [
    '',
    '/about',
    '/contact',
    '/legal/privacy',
    '/legal/terms',
    '/legal/disclaimer',
    '/cities',
    '/universities',
    '/services',
    '/articles',
    // Work
    '/work',
    '/work/finding-job',
    '/work/work-permit',
    '/work/work-visa',
    '/work/employment-contract',
    '/work/taxes-salaries',
    '/work/insurance',
    // Immigration
    '/immigration',
    '/immigration/igi-process',
    '/immigration/residence-renewal',
    '/immigration/long-term-residence',
    '/immigration/citizenship',
    '/immigration/family-reunification',
    // Company
    '/company',
    '/company/registration',
    '/company/tax-types',
    '/company/bank-account',
    '/company/residency',
    '/company/real-estate-investment',
    '/company/startup-tech-investment',
    '/company/annual-tax-reporting',
    '/company/investment',
    // Study
    '/study',
    '/study/requirements',
    '/study/visa-type-d',
    '/study/tuition-overview',
    '/study/part-time-work',
    '/study/preparatory-year',
    '/study/scholarships',
    // Needs
    '/needs',
    '/needs/first-days-checklist',
    '/needs/housing',
    '/needs/banking',
    '/needs/transportation',
    '/needs/healthcare',
    '/needs/sim-internet',
    // Start Here
    '/start-here',
    '/start-here/planning-to-come',
    '/start-here/arriving-soon',
    '/start-here/newly-arrived',
    '/start-here/settling-in',
    '/start-here/long-term-stay',
    '/start-here/citizenship-goal',
    // Romania
    '/romania',
    '/romania/economy',
    '/romania/geography',
    '/romania/culture',
    '/romania/history'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
