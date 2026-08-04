const fs = require('fs');
const path = require('path');

const layouts = {
  'articles/layout.tsx': `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مقالات و راهنماها | در رومانی – DORVIA EUROP',
  description: 'مقالات، راهنماها و آخرین به‌روزرسانی‌های قوانین مهاجرتی، کار و تحصیل در رومانی.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://dorvia.eu/articles',
  },
  openGraph: {
    title: 'مقالات و راهنماها | در رومانی – DORVIA EUROP',
    description: 'مقالات، راهنماها و آخرین به‌روزرسانی‌های قوانین مهاجرتی، کار و تحصیل در رومانی.',
    url: 'https://dorvia.eu/articles',
  }
};

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`,

  'cities/layout.tsx': `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شهرهای رومانی | در رومانی – DORVIA EUROP',
  description: 'راهنمای شهرهای مهم کشور رومانی از جمله بخارست، کلوژ-نپوکا، تیمیشوارا و یاش.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://dorvia.eu/cities',
  },
  openGraph: {
    title: 'شهرهای رومانی | در رومانی – DORVIA EUROP',
    description: 'راهنمای شهرهای مهم کشور رومانی از جمله بخارست، کلوژ-نپوکا، تیمیشوارا و یاش.',
    url: 'https://dorvia.eu/cities',
  }
};

export default function CitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`,

  'contact/layout.tsx': `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ارتباط با ما | در رومانی – DORVIA EUROP',
  description: 'ارتباط با کارشناسان DORVIA EUROP جهت مشاوره و ارزیابی پرونده‌های مهاجرتی رومانی.',
  alternates: {
    canonical: 'https://dorvia.eu/contact',
  },
  openGraph: {
    title: 'ارتباط با ما | در رومانی – DORVIA EUROP',
    description: 'ارتباط با کارشناسان DORVIA EUROP جهت مشاوره و ارزیابی پرونده‌های مهاجرتی رومانی.',
    url: 'https://dorvia.eu/contact',
  }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`,

  'immigration/layout.tsx': `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مهاجرت و اقامت رومانی | در رومانی – DORVIA EUROP',
  description: 'راهنمای جامع روش‌های قانونی مهاجرت به رومانی، تمدید اقامت، اقامت دائم و اخذ شهروندی.',
  alternates: {
    canonical: 'https://dorvia.eu/immigration',
  },
  openGraph: {
    title: 'مهاجرت و اقامت رومانی | در رومانی – DORVIA EUROP',
    description: 'راهنمای جامع روش‌های قانونی مهاجرت به رومانی، تمدید اقامت، اقامت دائم و اخذ شهروندی.',
    url: 'https://dorvia.eu/immigration',
  }
};

export default function ImmigrationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`,

  'immigration/[slug]/layout.tsx': `import type { Metadata } from 'next';

const metaMap: Record<string, { title: string; desc: string }> = {
  'residence-renewal': {
    title: 'تمدید اجازه اقامت رومانی | در رومانی – DORVIA EUROP',
    desc: 'مراحل، مدارک و قوانین تمدید اجازه اقامت موقت (Permis de Ședere) برای دانشجویان، کارکنان و کارآفرینان در رومانی.'
  },
  'long-term-residence': {
    title: 'اقامت بلندمدت و دائم رومانی | در رومانی – DORVIA EUROP',
    desc: 'شرایط اخذ اقامت دائم رومانی، قانون ۵ سال حضور مستمر، تمکن مالی و اثبات آشنایی با زبان رومانیایی.'
  },
  'citizenship': {
    title: 'حقوق شهروندی و تابعیت رومانی | در رومانی – DORVIA EUROP',
    desc: 'راهنمای کامل دریافت پاسپورت و تابعیت رومانی از طریق اقامت طولانی‌مدت یا شرایط قانونی خاص.'
  },
  'family-reunification': {
    title: 'پیوند با خانواده در رومانی | در رومانی – DORVIA EUROP',
    desc: 'قوانین و مراحل الحاق به خانواده در رومانی ویژه همسر و فرزندان اتباع خارجی مقیم قانونی.'
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = metaMap[params.slug] || {
    title: 'مهاجرت به رومانی | در رومانی – DORVIA EUROP',
    desc: 'انواع روش‌های مهاجرت و اقامت قانونی در کشور رومانی.'
  };
  return {
    title: meta.title,
    description: meta.desc,
    alternates: {
      canonical: \`https://dorvia.eu/immigration/\${params.slug}\`,
    },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      url: \`https://dorvia.eu/immigration/\${params.slug}\`,
    }
  };
}

export default function ImmigrationSubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`,

  'study/layout.tsx': `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تحصیل در رومانی | در رومانی – DORVIA EUROP',
  description: 'تحصیل در دانشگاه‌های معتبر رومانی به زبان انگلیسی، پذیرش بدون کنکور، مدارک معتبر اتحادیه اروپا و شهریه اقتصادی.',
  alternates: {
    canonical: 'https://dorvia.eu/study',
  },
  openGraph: {
    title: 'تحصیل در رومانی | در رومانی – DORVIA EUROP',
    description: 'تحصیل در دانشگاه‌های معتبر رومانی به زبان انگلیسی، پذیرش بدون کنکور، مدارک معتبر اتحادیه اروپا و شهریه اقتصادی.',
    url: 'https://dorvia.eu/study',
  }
};

export default function StudyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`,

  'study/[slug]/layout.tsx': `import type { Metadata } from 'next';

const metaMap: Record<string, { title: string; desc: string }> = {
  'preparatory-year': {
    title: 'دوره سال زبان رومانیایی | در رومانی – DORVIA EUROP',
    desc: 'شرایط ثبت‌نام، شهریه و اطلاعات دوره آمادگی زبان رومانیایی (Preparatory Year) پیش از ورود به دانشگاه.'
  },
  'scholarships': {
    title: 'بورسیه تحصیلی دولت رومانی | در رومانی – DORVIA EUROP',
    desc: 'راهنمای ثبت‌نام در برنامه بورسیه وزارت امور خارجه رومانی ویژه دانشجویان کشورهای غیر عضو اتحادیه اروپا.'
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = metaMap[params.slug] || {
    title: 'تحصیل در رومانی | در رومانی – DORVIA EUROP',
    desc: 'شرایط تحصیل و اخذ پذیرش دانشگاهی در رومانی.'
  };
  return {
    title: meta.title,
    description: meta.desc,
    alternates: {
      canonical: \`https://dorvia.eu/study/\${params.slug}\`,
    },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      url: \`https://dorvia.eu/study/\${params.slug}\`,
    }
  };
}

export default function StudySubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`,

  'work/layout.tsx': `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'کار و اشتغال در رومانی | در رومانی – DORVIA EUROP',
  description: 'راهنمای کاریابی، اخذ مجوز کار (Aviz de Munca)، ویزای کاری و قوانین استخدام اتباع خارجی در رومانی.',
  alternates: {
    canonical: 'https://dorvia.eu/work',
  },
  openGraph: {
    title: 'کار و اشتغال در رومانی | در رومانی – DORVIA EUROP',
    description: 'راهنمای کاریابی، اخذ مجوز کار (Aviz de Munca)، ویزای کاری و قوانین استخدام اتباع خارجی در رومانی.',
    url: 'https://dorvia.eu/work',
  }
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`,

  'work/[slug]/layout.tsx': `import type { Metadata } from 'next';

const metaMap: Record<string, { title: string; desc: string }> = {
  'permit': {
    title: 'مجوز کار رومانی (Aviz de Munca) | در رومانی – DORVIA EUROP',
    desc: 'شرایط قانونی صدور مجوز کار برای نیروی کار خارجی توسط کارفرما و تاییدیه اداره مهاجرت رومانی (IGI).'
  },
  'visa': {
    title: 'ویزای کار رومانی (Type D/AM) | در رومانی – DORVIA EUROP',
    desc: 'مراحل دریافت ویزای بلندمدت کاری رومانی از سفارت پس از صدور مجوز کار.'
  },
  'find-job': {
    title: 'راهنمای کاریابی در رومانی | در رومانی – DORVIA EUROP',
    desc: 'معرفی سایت‌های معتبر کاریابی، نحوه نگارش رزومه استاندارد و فرآیند استخدام در بازار کار رومانی.'
  },
  'contract': {
    title: 'قراردادهای کاری و قانون کار رومانی | در رومانی – DORVIA EUROP',
    desc: 'حقوق قانونی کارگران، ثبت قرارداد در سامانه REVISAL، بیمه کار و بازرسی کار (Inspectia Muncii).'
  },
  'tax': {
    title: 'مالیات بر درآمد حقوق در رومانی | در رومانی – DORVIA EUROP',
    desc: 'آشنایی با نرخ‌های مالیات حقوق، کسورات بیمه درمانی و بازنشستگی از حقوق ناخالص در رومانی.'
  },
  'insurance': {
    title: 'بیمه اجتماعی و سلامت کار در رومانی | در رومانی – DORVIA EUROP',
    desc: 'حقوق درمانی، خدمات پزشکی تحت پوشش بیمه دولتی (CNAS) و سیستم بازنشستگی در رومانی.'
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = metaMap[params.slug] || {
    title: 'کار در رومانی | در رومانی – DORVIA EUROP',
    desc: 'قوانین و شرایط اشتغال نیروی کار خارجی در کشور رومانی.'
  };
  return {
    title: meta.title,
    description: meta.desc,
    alternates: {
      canonical: \`https://dorvia.eu/work/\${params.slug}\`,
    },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      url: \`https://dorvia.eu/work/\${params.slug}\`,
    }
  };
}

export default function WorkSubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`,

  'company/layout.tsx': `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ثبت شرکت و کسب‌وکار در رومانی | در رومانی – DORVIA EUROP',
  description: 'راهنمای ثبت شرکت SRL، قوانین مالیاتی شرکت‌های میکرو، افتتاح حساب بانکی شرکتی و اقامت مدیرعامل در رومانی.',
  alternates: {
    canonical: 'https://dorvia.eu/company',
  },
  openGraph: {
    title: 'ثبت شرکت و کسب‌وکار در رومانی | در رومانی – DORVIA EUROP',
    description: 'راهنمای ثبت شرکت SRL، قوانین مالیاتی شرکت‌های میکرو، افتتاح حساب بانکی شرکتی و اقامت مدیرعامل در رومانی.',
    url: 'https://dorvia.eu/company',
  }
};

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`,

  'company/investment/layout.tsx': `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سرمایه‌گذاری در رومانی | در رومانی – DORVIA EUROP',
  description: 'فرصت‌های سرمایه‌گذاری ملکی و استارت‌آپی در رومانی و اخذ اقامت از طریق سرمایه‌گذاری.',
  alternates: {
    canonical: 'https://dorvia.eu/company/investment',
  },
  openGraph: {
    title: 'سرمایه‌گذاری در رومانی | در رومانی – DORVIA EUROP',
    description: 'فرصت‌های سرمایه‌گذاری ملکی و استارت‌آپی در رومانی و اخذ اقامت از طریق سرمایه‌گذاری.',
    url: 'https://dorvia.eu/company/investment',
  }
};

export default function CompanyInvestmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`,

  'company/[slug]/layout.tsx': `import type { Metadata } from 'next';

const metaMap: Record<string, { title: string; desc: string }> = {
  'registration': {
    title: 'مراحل ثبت شرکت SRL در رومانی | در رومانی – DORVIA EUROP',
    desc: 'مراحل و پیش‌نیازهای قانونی ثبت شرکت با مسئولیت محدود (SRL) در اداره ثبت شرکت‌های رومانی (ONRC).'
  },
  'tax-types': {
    title: 'انواع مالیات شرکت‌ها در رومانی | در رومانی – DORVIA EUROP',
    desc: 'بررسی رژیم‌های مالیاتی شرکت‌های خرد (Micro-Enterprise) و شرکت‌های عادی تحت قوانین مالیاتی ANAF.'
  },
  'bank-account': {
    title: 'افتتاح حساب بانکی شرکتی در رومانی | در رومانی – DORVIA EUROP',
    desc: 'مراحل و مدارک لازم جهت افتتاح حساب‌های جاری تجاری به لئو (RON) و یورو برای شرکت‌های تازه ثبت‌شده.'
  },
  'residency': {
    title: 'اقامت تجاری مدیرعامل در رومانی | در رومانی – DORVIA EUROP',
    desc: 'شرایط اخذ و تمدید اجازه اقامت موقت به عنوان مدیرعامل یا سهام‌دار شرکت تجاری در رومانی.'
  },
  'real-estate-investment': {
    title: 'سرمایه‌گذاری در املاک رومانی | در رومانی – DORVIA EUROP',
    desc: 'ضوابط خرید ملک، آپارتمان و زمین برای اشخاص حقیقی غیراروپایی یا از طریق شرکت تجاری.'
  },
  'startup-tech-investment': {
    title: 'سرمایه‌گذاری استارت‌آپی و فناوری | در رومانی – DORVIA EUROP',
    desc: 'فرصت‌های کارآفرینی در قطب‌های فناوری رومانی (بخارست و کلوژ-نپوکا) و ویزای استارت‌آپ.'
  },
  'annual-tax-reporting': {
    title: 'گزارش‌های مالیاتی سالانه شرکت‌ها | در رومانی – DORVIA EUROP',
    desc: 'تکالیف مالیاتی سالانه و فصلی شرکت‌ها و معرفی خدمات حسابداری رسمی در رومانی.'
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = metaMap[params.slug] || {
    title: 'ثبت شرکت در رومانی | در رومانی – DORVIA EUROP',
    desc: 'قوانین سرمایه‌گذاری و راه‌اندازی کسب‌وکار در کشور رومانی.'
  };
  return {
    title: meta.title,
    description: meta.desc,
    alternates: {
      canonical: \`https://dorvia.eu/company/\${params.slug}\`,
    },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      url: \`https://dorvia.eu/company/\${params.slug}\`,
    }
  };
}

export default function CompanySubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`,

  'needs/layout.tsx': `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'نیازهای زندگی در رومانی | در رومانی – DORVIA EUROP',
  description: 'راهنمای ضروری زندگی روزمره در رومانی شامل امور مالی، مسکن، خدمات درمانی، مدارس، رانندگی و کارهای اداری.',
  alternates: {
    canonical: 'https://dorvia.eu/needs',
  },
  openGraph: {
    title: 'نیازهای زندگی در رومانی | در رومانی – DORVIA EUROP',
    description: 'راهنمای ضروری زندگی روزمره در رومانی شامل امور مالی، مسکن، خدمات درمانی، مدارس، رانندگی و کارهای اداری.',
    url: 'https://dorvia.eu/needs',
  }
};

export default function NeedsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`,

  'needs/[slug]/layout.tsx': `import type { Metadata } from 'next';

const metaMap: Record<string, { title: string; desc: string; noindex?: boolean }> = {
  'currency-exchange': {
    title: 'صرافی و نرخ ارز در رومانی | در رومانی – DORVIA EUROP',
    desc: 'راهنمای تبدیل پول، نرخ‌های رسمی بانک ملی (BNR)، صرافی‌های معتبر و جلوگیری از کارمزدهای پنهان.'
  },
  'driving-license': {
    title: 'گواهینامه رانندگی در رومانی | در رومانی – DORVIA EUROP',
    desc: 'قوانین رانندگی با مجوز بین‌المللی و شرایط تبدیل گواهینامه خارجی در اداره پلیس راهور (DGPCI).'
  },
  'certified-translation': {
    title: 'دارالترجمه رسمی در رومانی | در رومانی – DORVIA EUROP',
    desc: 'یافتن مترجمین رسمی دادگستری رومانی جهت ترجمه مدارک هویتی و تحصیلی به زبان رومانیایی.'
  },
  'notary-public': {
    title: 'دفتر اسناد رسمی در رومانی | در رومانی – DORVIA EUROP',
    desc: 'نقش دفاتر اسناد رسمی (Notar Public)، ثبت قراردادها، وکالت‌نامه‌ها و رسمیت بخشیدن به اسناد ملکی و شرکتی.'
  },
  'iranian-embassy-and-mikhak': {
    title: 'سفارت ایران و سامانه میخک در رومانی | در رومانی – DORVIA EUROP',
    desc: 'راهنمای دریافت خدمات کنسولی، تایید مدارک و وکالت‌نامه‌ها از طریق سامانه میخک سفارت ایران در بخارست.'
  },
  'housing': {
    title: 'اجاره و خرید مسکن در رومانی | در رومانی – DORVIA EUROP',
    desc: 'چک‌لیست قرارداد اجاره مسکن، ثبت در دارایی (ANAF)، ودیعه و شرایط قانونی خرید آپارتمان و ملک.'
  },
  'first-days-checklist': {
    title: 'چک‌لیست روزهای نخست ورود به رومانی | در رومانی – DORVIA EUROP',
    desc: 'اقدامات فوری ۷۲ ساعت، ۷ روز و ۳۰ روز اول ورود شامل تهیه سیم‌کارت، حمل و نقل و حساب بانکی.'
  },
  'health': {
    title: 'خدمات درمانی و سلامت در رومانی | در رومانی – DORVIA EUROP',
    desc: 'آشنایی با سیستم بیمه سلامت عمومی (CNAS)، پزشک خانواده و بیمارستان‌های دولتی و خصوصی رومانی.',
    noindex: true
  },
  'school': {
    title: 'مدارس و سیستم آموزشی مدارس در رومانی | در رومانی – DORVIA EUROP',
    desc: 'آشنایی با سیستم آموزش ابتدایی و متوسطه، ثبت‌نام فرزندان در مدارس دولتی و مدارس بین‌المللی رومانی.',
    noindex: true
  },
  'telecom': {
    title: 'تلفن همراه و اینترنت در رومانی | در رومانی – DORVIA EUROP',
    desc: 'راهنمای خرید سیم‌کارت‌های اعتباری و دائمی (Orange, Vodafone, Digi) و اینترنت خانگی در رومانی.',
    noindex: true
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = metaMap[params.slug] || {
    title: 'نیازهای ضروری در رومانی | در رومانی – DORVIA EUROP',
    desc: 'راهنمای امور اداری و زندگی روزمره در کشور رومانی.'
  };
  return {
    title: meta.title,
    description: meta.desc,
    robots: meta.noindex ? { index: false, follow: true } : undefined,
    alternates: {
      canonical: \`https://dorvia.eu/needs/\${params.slug}\`,
    },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      url: \`https://dorvia.eu/needs/\${params.slug}\`,
    }
  };
}

export default function NeedsSubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`,

  'romania/layout.tsx': `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شناخت کشور رومانی | در رومانی – DORVIA EUROP',
  description: 'مقدمه‌ای بر جغرافیا، اقتصاد، جامعه، فرهنگ، قوانین کلیدی و شهرهای اصلی کشور رومانی.',
  alternates: {
    canonical: 'https://dorvia.eu/romania',
  },
  openGraph: {
    title: 'شناخت کشور رومانی | در رومانی – DORVIA EUROP',
    description: 'مقدمه‌ای بر جغرافیا، اقتصاد، جامعه، فرهنگ، قوانین کلیدی و شهرهای اصلی کشور رومانی.',
    url: 'https://dorvia.eu/romania',
  }
};

export default function RomaniaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`,

  'romania/[slug]/layout.tsx': `import type { Metadata } from 'next';

const metaMap: Record<string, { title: string; desc: string; noindex?: boolean }> = {
  'economy': {
    title: 'اقتصاد و صنایع رومانی | در رومانی – DORVIA EUROP',
    desc: 'تحلیل اقتصاد رومانی، بخش‌های فعال مانند خودروسازی و فناوری اطلاعات، درآمدها و رشد اقتصادی بازار کار.'
  },
  'society': {
    title: 'جامعه و زندگی اجتماعی در رومانی | در رومانی – DORVIA EUROP',
    desc: 'ساختار اجتماعی، زبان رسمی، آداب رفتار اجتماعی، سیستم آموزش عمومی و ادغام فرهنگی مهاجران.'
  },
  'culture-and-arts': {
    title: 'فرهنگ، هنر و میراث رومانی | در رومانی – DORVIA EUROP',
    desc: 'میراث فرهنگی غنی، قلعه‌های ترانسیلوانیا، موسیقی کلاسیک، جشن‌های سنتی و معماری بخارست.'
  },
  'laws-and-regulations': {
    title: 'قوانین و مقررات عمومی رومانی | در رومانی – DORVIA EUROP',
    desc: 'آشنایی با سیستم حقوقی رومانی، قوانین عمومی مدنی، حمایت از مصرف‌کننده و حقوق مالکیت معنوی.'
  },
  'tourism': {
    title: 'جاذبه‌های گردشگری رومانی | در رومانی – DORVIA EUROP',
    desc: 'راهنمای سفر به مناطق دیدنی رومانی، طبیعت کوه‌های کارپات، قلعه دراکولا و سواحل دریای سیاه.',
    noindex: true
  },
  'cities': {
    title: 'شهرهای اصلی کشور رومانی | در رومانی – DORVIA EUROP',
    desc: 'بررسی کامل شهرهای مهم جهت کار و تحصیل نظیر بخارست، کلوژ-نپوکا، تیمیشوارا، یاش و براشوف.'
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = metaMap[params.slug] || {
    title: 'شناخت رومانی | در رومانی – DORVIA EUROP',
    desc: 'اطلاعات عمومی و تخصصی درباره کشور رومانی.'
  };
  return {
    title: meta.title,
    description: meta.desc,
    robots: meta.noindex ? { index: false, follow: true } : undefined,
    alternates: {
      canonical: \`https://dorvia.eu/romania/\${params.slug}\`,
    },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      url: \`https://dorvia.eu/romania/\${params.slug}\`,
    }
  };
}

export default function RomaniaSubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`,

  'services/layout.tsx': `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'خدمات تخصصی مهاجرتی | در رومانی – DORVIA EUROP',
  description: 'خدمات پذیرش تحصیلی، ویزای کار، ثبت شرکت، تایید مدارک و همراهی پس از ورود در کشور رومانی.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://dorvia.eu/services',
  },
  openGraph: {
    title: 'خدمات تخصصی مهاجرتی | در رومانی – DORVIA EUROP',
    description: 'خدمات پذیرش تحصیلی، ویزای کار، ثبت شرکت، تایید مدارک و همراهی پس از ورود در کشور رومانی.',
    url: 'https://dorvia.eu/services',
  }
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`,

  'start-here/layout.tsx': `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شروع از اینجا – راهنمای گام به گام | در رومانی – DORVIA EUROP',
  description: 'راهنمای تعاملی و گام به گام ورود و استقرار در کشور رومانی ویژه دانشجویان، نیروی کار و سرمایه‌گذاران.',
  alternates: {
    canonical: 'https://dorvia.eu/start-here',
  },
  openGraph: {
    title: 'شروع از اینجا – راهنمای گام به گام | در رومانی – DORVIA EUROP',
    description: 'راهنمای تعاملی و گام به گام ورود و استقرار در کشور رومانی ویژه دانشجویان، نیروی کار و سرمایه‌گذاران.',
    url: 'https://dorvia.eu/start-here',
  }
};

export default function StartHereLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`,

  'start-here/[slug]/layout.tsx': `import type { Metadata } from 'next';

const metaMap: Record<string, { title: string; desc: string }> = {
  'planning-to-come': {
    title: 'برنامه‌ریزی قبل از سفر به رومانی | در رومانی – DORVIA EUROP',
    desc: 'مراحل آماده‌سازی مدارک تحصیلی، کاری و هویتی، سوءپیشینه، بیمه مسافرتی و اقدامات پیش از پرواز.'
  },
  'just-arrived': {
    title: 'اقدامات پس از ورود به رومانی | در رومانی – DORVIA EUROP',
    desc: 'اولین اقدامات در فرودگاه، تهیه سیم‌کارت محلی، کارت حمل و نقل شهری و هماهنگی آدرس مسکن.'
  },
  'living-here': {
    title: 'زندگی و استقرار بلندمدت در رومانی | در رومانی – DORVIA EUROP',
    desc: 'راهنمای افتتاح حساب بانکی دائمی، تمدید سالانه اقامت، خرید ملک، قوانین کار و مالیات شخصی.'
  },
  'pre-departure-checklist': {
    title: 'چک‌لیست قبل از پرواز به رومانی | در رومانی – DORVIA EUROP',
    desc: 'لیست لوازم ضروری، ارز مجاز مسافرتی، اسناد و تاییدیه اقامتگاه دانشجویی یا اجاره‌ای قبل از سفر.'
  },
  'first-three-days': {
    title: 'سه روز اول ورود به رومانی | در رومانی – DORVIA EUROP',
    desc: 'اقدامات حیاتی ۷۲ ساعت اول از ترانسفر فرودگاهی تا ثبت حضوری در دانشگاه یا معرفی به محل کار.'
  },
  'first-month': {
    title: 'ماه اول استقرار در رومانی | در رومانی – DORVIA EUROP',
    desc: 'کارهای اداری ماه اول شامل ثبت قرارداد در ANAF، تست‌های پزشکی، و ثبت درخواست کارت اقامت موقت.'
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = metaMap[params.slug] || {
    title: 'شروع از اینجا | در رومانی – DORVIA EUROP',
    desc: 'راهنمای گام به گام ورود و استقرار در کشور رومانی.'
  };
  return {
    title: meta.title,
    description: meta.desc,
    alternates: {
      canonical: \`https://dorvia.eu/start-here/\${params.slug}\`,
    },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      url: \`https://dorvia.eu/start-here/\${params.slug}\`,
    }
  };
}

export default function StartHereSubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`,

  'universities/layout.tsx': `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'دانشگاه‌های معتبر رومانی | در رومانی – DORVIA EUROP',
  description: 'جستجو و بررسی دانشگاه‌های دولتی و تخصصی رومانی بر اساس شهریه، رشته‌ها و شهر محل تحصیل.',
  alternates: {
    canonical: 'https://dorvia.eu/universities',
  },
  openGraph: {
    title: 'دانشگاه‌های معتبر رومانی | در رومانی – DORVIA EUROP',
    description: 'جستجو و بررسی دانشگاه‌های دولتی و تخصصی رومانی بر اساس شهریه، رشته‌ها و شهر محل تحصیل.',
    url: 'https://dorvia.eu/universities',
  }
};

export default function UniversitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`,

  'legal/[slug]/layout.tsx': `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'قوانین و شرایط استفاده | در رومانی – DORVIA EUROP',
  robots: {
    index: false,
    follow: true,
  }
};

export default function LegalSubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`
};

const appDir = path.join(__dirname, '..', 'src', 'app');

for (const [relPath, content] of Object.entries(layouts)) {
  const fullPath = path.join(appDir, relPath);
  const dirPath = path.dirname(fullPath);
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Created layout at: ${relPath}`);
}
