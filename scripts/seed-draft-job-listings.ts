import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface SampleJob {
  category_key: string;
  title_fa: string;
  title_en: string;
  slug_fa: string;
  slug_en: string;
  city: string;
  salary_min: number;
  salary_max: number;
  salary_currency: string;
  contract_type: string;
  positions_available: number;
  accommodation_provided: boolean;
  description_fa: string;
  description_en: string;
  requirements_fa: string;
  requirements_en: string;
}

const SAMPLE_JOBS: SampleJob[] = [
  {
    category_key: 'construction',
    title_fa: 'کارگر ساختمانی عمومی (General Construction Worker)',
    title_en: 'General Construction Worker',
    slug_fa: 'general-construction-worker-bucharest',
    slug_en: 'general-construction-worker-bucharest',
    city: 'بخارست',
    salary_min: 800,
    salary_max: 1200,
    salary_currency: 'EUR',
    contract_type: 'permanent',
    positions_available: 15,
    accommodation_provided: true,
    description_fa: `شرکت‌های معتبر عمرانی و ساختمانی در پایتخت رومانی (بخارست) جهت پروژه‌های توسعه مسکونی و تجاری، نیروی کارگر ساختمانی عمومی استخدام می‌نمایند.

### شرح وظایف:
- آماده‌سازی و جابجایی مصالح ساختمانی در محل کارگاه
- کمک به استادکاران بنایی، قالب‌بندی و آرماتوربندی
- نظافت و سازماندهی ایمن محیط کارگاهی
- رعایت کامل استانداردهای ایمنی بهداشت و محیط زیست (HSE)`,
    description_en: `Leading construction companies in Bucharest, Romania are hiring General Construction Workers for residential and commercial development projects.

### Responsibilities:
- Site preparation and handling construction materials
- Assisting carpenters, formwork specialists, and masons
- Maintaining a clean and safe job site
- Compliance with European health and safety regulations`,
    requirements_fa: `- سن ۱۸ تا ۴۵ سال
- سلامت جسمانی کامل و توانایی کار در محیط ساختمانی
- حداقل ۱ سال تجربه کار ساختمانی مزیت محسوب می‌شود
- عدم سوءپیشینه کیفری`,
    requirements_en: `- Age 18-45 years
- Physical fitness and ability to work on construction sites
- Minimum 1 year relevant site experience preferred
- Clean criminal record`,
  },
  {
    category_key: 'construction',
    title_fa: 'جوشکار حرفه‌ای MAG/CO₂ (Welder)',
    title_en: 'Certified MAG/CO2 Welder',
    slug_fa: 'mag-co2-welder-timisoara',
    slug_en: 'mag-co2-welder-timisoara',
    city: 'تیمیشوارا',
    salary_min: 1000,
    salary_max: 1500,
    salary_currency: 'EUR',
    contract_type: 'permanent',
    positions_available: 8,
    accommodation_provided: true,
    description_fa: `کارخانجات سازه‌های فلزی صنعتی در منطقه صنعتی تیمیشوارا به جوشکاران مسلط به جوشکاری MIG/MAG نیازمندند.

### وظایف:
- جوشکاری اسکلت‌های سنگین فلزی طبق نقشه‌های فنی
- آماده‌سازی درزهای جوش و برش قطعات
- کنترل کیفیت عیوب جوش و تست‌های چشمی
- کار با تجهیزات مدرن جوشکاری اینورتری`,
    description_en: `Industrial steel fabrication plants in Timisoara seek experienced MIG/MAG welders for long-term production contracts.

### Responsibilities:
- Welding structural steel frames according to blueprints
- Beveling, cutting, and fit-up of metal parts
- Visual inspection and quality control of weld seams
- Operation of modern inverter welding equipment`,
    requirements_fa: `- حداقل ۳ سال سابقه کار جوشکاری MAG/CO2
- توانایی پاس کردن تست جوش در محل
- آشنایی اولیه با نقشه‌خوانی فنی`,
    requirements_en: `- Minimum 3 years professional MAG welding experience
- Ability to pass standard welding practical test
- Basic technical blueprint reading skills`,
  },
  {
    category_key: 'horeca',
    title_fa: 'آشپز و کمک‌آشپز رستوران ساحلی (Restaurant Cook)',
    title_en: 'Restaurant Line Cook',
    slug_fa: 'restaurant-cook-constanta',
    slug_en: 'restaurant-cook-constanta',
    city: 'کنستانتسا',
    salary_min: 700,
    salary_max: 1000,
    salary_currency: 'EUR',
    contract_type: 'seasonal',
    positions_available: 6,
    accommodation_provided: true,
    description_fa: `مجموعه هتل‌ها و رستوران‌های ساحلی شهر بندری کنستانتسا جهت فصل گردشگری و قرارداد سالانه آشپز استخدام می‌نمایند.

### شرح کار:
- آماده‌سازی مواد اولیه، سس‌ها و گارنیش
- پخت غذاهای بین‌المللی و گریل
- کنترل نظافت آشپزخانه مطابق الزامات HACCP`,
    description_en: `Coastal restaurant and resort complexes in Constanta seek energetic line cooks for the tourist season and annual contracts.

### Responsibilities:
- Food preparation, mis-en-place, and grilling
- Preparation of international and Mediterranean dishes
- Maintaining strict hygiene standards following HACCP rules`,
    requirements_fa: `- حداقل ۲ سال سابقه در آشپزخانه‌های حرفه‌ای
- مدرک آشپزی یا سابقه کار مستند
- رعایت بهداشت فردی و محیطی`,
    requirements_en: `- Minimum 2 years culinary experience in commercial kitchens
- Culinary certificate or verifiable background
- High standard of personal and food hygiene`,
  },
  {
    category_key: 'horeca',
    title_fa: 'نیروی خدمات و خانه‌داری هتل (Hotel Housekeeping)',
    title_en: 'Hotel Housekeeping Staff',
    slug_fa: 'hotel-housekeeping-brasov',
    slug_en: 'hotel-housekeeping-brasov',
    city: 'براشوف',
    salary_min: 650,
    salary_max: 900,
    salary_currency: 'EUR',
    contract_type: 'seasonal',
    positions_available: 10,
    accommodation_provided: true,
    description_fa: `هتل‌های زنجیره‌ای ۴ ستاره در منطقه توریستی براشوف نیروهای متعهد خانه‌داری و خدمات اتاق جذب می‌کنند.

### وظایف:
- نظافت و شارژ ملزومات اتاق‌های میهمانان
- تعویض ملحفه‌ها و ضدعفونی سطوح
- گزارش خرابی‌ها یا نیازمندی‌های تعمیراتی`,
    description_en: `4-star hotel chains in the mountain tourist hub of Brasov are recruiting dedicated housekeeping staff.

### Responsibilities:
- Daily cleaning, sanitizing, and restocking of guest suites
- Linen changes and laundry handling
- Reporting maintenance issues to floor supervisors`,
    requirements_fa: `- دقت و توجه بالا به جزییات و آراستگی
- توانایی کار در شیفت‌های چرخشی
- روحیه مسئولیت‌پذیری و کار گروهی`,
    requirements_en: `- Attention to detail, neatness, and discretion
- Flexibility to work rotating shifts
- Teamwork spirit and accountability`,
  },
  {
    category_key: 'manufacturing',
    title_fa: 'اپراتور خط تولید قطعات صنعتی (Production Line Operator)',
    title_en: 'Manufacturing Line Operator',
    slug_fa: 'production-line-operator-cluj',
    slug_en: 'production-line-operator-cluj',
    city: 'کلوژ-ناپوکا',
    salary_min: 900,
    salary_max: 1300,
    salary_currency: 'EUR',
    contract_type: 'permanent',
    positions_available: 20,
    accommodation_provided: false,
    description_fa: `کارخانه تولید قطعات الکترومکانیکی و خودرویی در کلوژ-ناپوکا اپراتور خط مونتاژ استخدام می‌کند.

### وظایف:
- مونتاژ قطعات بر روی نوار نقاله
- ثبت رکوردهای کیفی و گزارش توقف خط
- بسته‌بندی اولیه محصول و برچسب‌گذاری`,
    description_en: `Automotive and electromechanical manufacturing plant in Cluj-Napoca is hiring assembly line operators.

### Responsibilities:
- Assembly of parts along conveyor lines
- Quality documentation and defect recording
- Primary packaging and barcode labeling`,
    requirements_fa: `- دیپلم متوسطه
- هماهنگی دست و چشم و سرعت عمل
- توانایی کار در شیفت‌های کاری منظم`,
    requirements_en: `- High school diploma
- Good hand-eye coordination and speed
- Punctuality and readiness for shift work`,
  },
  {
    category_key: 'manufacturing',
    title_fa: 'کارگر بسته‌بندی صنایع غذایی (Food Packaging Worker)',
    title_en: 'Food Packaging Specialist',
    slug_fa: 'food-packaging-worker-pitesti',
    slug_en: 'food-packaging-worker-pitesti',
    city: 'پیتهشتی',
    salary_min: 850,
    salary_max: 1100,
    salary_currency: 'EUR',
    contract_type: 'permanent',
    positions_available: 12,
    accommodation_provided: true,
    description_fa: `شرکت صنایع غذایی و فرآوری لبنیات در پیتهشتی نیروی بسته‌بندی و انبارداری استخدام می‌نماید.

### وظایف:
- بسته‌بندی محصولات در جعبه‌ها و کارتن‌ها
- کنترل تاریخ انقضا و سلامت بسته‌ها
- چیدمان بر روی پالت‌های استاندارد`,
    description_en: `Food processing and dairy production facilities in Pitesti are seeking food packaging personnel.

### Responsibilities:
- Packaging finished goods into commercial boxes
- Inspecting expiration dates and vacuum seals
- Palletizing containers for export distribution`,
    requirements_fa: `- کارت سلامت و گواهی بهداشت
- توانایی ایستادن در طول ساعات کاری
- انضباط کاری و مسئولیت‌پذیری`,
    requirements_en: `- Sanitary card and medical clearance
- Ability to stand during shift hours
- Strong discipline and teamwork`,
  },
  {
    category_key: 'agriculture',
    title_fa: 'کارگر فصلی کشاورزی و گلخانه (Agricultural Worker)',
    title_en: 'Seasonal Greenhouse & Farm Worker',
    slug_fa: 'seasonal-agricultural-worker-olt',
    slug_en: 'seasonal-agricultural-worker-olt',
    city: 'شهرستان الت (Olt)',
    salary_min: 700,
    salary_max: 950,
    salary_currency: 'EUR',
    contract_type: 'seasonal',
    positions_available: 25,
    accommodation_provided: true,
    description_fa: `مجتمع‌های گلخانه‌ای مدرن هیدروپونیک در حوزه کشاورزی شهرستان الت رومانی نیروی فصلی جذب می‌نمایند.

### شرح وظایف:
- کاشت، نگهداری و برداشت محصولات صیفی و گلخانه‌ای
- هرس و بسته‌بندی محصولات تازه
- آبیاری و پایش سلامت بوته‌ها`,
    description_en: `Modern hydroponic greenhouse complexes in Olt County, Romania are hiring seasonal agricultural workers.

### Responsibilities:
- Planting, caring for, and harvesting greenhouse vegetables
- Pruning, sorting, and crate packing
- Irrigation monitoring and plant care`,
    requirements_fa: `- ترجیحاً سابقه کار در مزارع یا گلخانه‌ها
- مقاومت بدنی مناسب برای کار در محیط گلخانه
- همکاری صمیمانه در قالب تیم‌های بین‌المللی`,
    requirements_en: `- Experience in farming or greenhouse operations preferred
- Physical stamina for indoor greenhouse conditions
- Ability to cooperate in diverse international teams`,
  },
  {
    category_key: 'driving',
    title_fa: 'راننده کامیون بین‌المللی ترانزیت C+E (International Truck Driver)',
    title_en: 'International Heavy Truck Driver (C+E)',
    slug_fa: 'international-truck-driver-bucharest',
    slug_en: 'international-truck-driver-bucharest',
    city: 'بخارست',
    salary_min: 1500,
    salary_max: 2200,
    salary_currency: 'EUR',
    contract_type: 'permanent',
    positions_available: 10,
    accommodation_provided: false,
    description_fa: `شرکت‌های لجستیک و حمل و نقل بین‌المللی ترانزیت در بخارست جهت خطوط حمل بار شنگن و رومانی راننده پایه یک استخدام می‌کنند.

### وظایف:
- راندن کشنده‌های یورو ۶ در مسیرهای بین‌المللی
- نظارت بر بارگیری، تخلیه و پلمپ تریلر
- تکمیل اسناد باربری CMR و گزارش‌های روزانه`,
    description_en: `International logistics and freight transport companies in Bucharest are recruiting heavy truck drivers for EU/Schengen transit routes.

### Responsibilities:
- Operating modern Euro 6 tractor-trailers across European routes
- Supervising cargo loading, securing, and customs seal inspection
- Maintaining CMR documentation and tachograph logs`,
    requirements_fa: `- گواهینامه رانندگی معتبر پایه یک (C+E)
- کارت هوشمند و سابقه رانندگی تریلی
- آشنایی با مسیرهای ترانزیتی و زبان انگلیسی در حد ارتباط جاده‌ای`,
    requirements_en: `- Valid C+E heavy commercial driver license
- Digital tachograph driver card and verifiable driving history
- Basic working English for road and border communication`,
  },
  {
    category_key: 'driving',
    title_fa: 'راننده لیفتراک انبار مرکزی (Forklift Operator)',
    title_en: 'Certified Forklift Operator',
    slug_fa: 'forklift-operator-craiova',
    slug_en: 'forklift-operator-craiova',
    city: 'کرایووا',
    salary_min: 900,
    salary_max: 1200,
    salary_currency: 'EUR',
    contract_type: 'permanent',
    positions_available: 5,
    accommodation_provided: true,
    description_fa: `انبار مرکزی توزیع قطعات و کالاهای مصرفی در کرایووا نیازمند اپراتور لیفتراک برقی و دیزلی می‌باشد.

### وظایف:
- بارگیری و تخلیه تریلرها با لیفتراک
- انتقال پالت‌ها به طبقات قفسه‌بندی مرتفع انبار
- بررسی ایمنی روزانه دستگاه قبل از شروع کار`,
    description_en: `Central distribution warehouse in Craiova requires experienced forklift operators for high-rack logistics.

### Responsibilities:
- Loading and unloading trailers with electric/diesel forklifts
- Stacking pallets in high-bay warehouse racking
- Daily equipment safety checklist and battery maintenance`,
    requirements_fa: `- گواهینامه معتبر کار با لیفتراک
- حداقل ۲ سال سابقه رانندگی لیفتراک در انبارهای مرتفع
- رعایت دقیق اصول ایمنی انبارداری`,
    requirements_en: `- Valid forklift operator certificate
- At least 2 years experience operating reach trucks or counterbalanced forklifts
- Strict adherence to warehouse safety protocols`,
  },
];

async function seed() {
  console.log('Seeding 9 sample draft job listings...');

  // 1. Fetch categories
  const { data: categories, error: catErr } = await supabase
    .from('job_categories')
    .select('id, key');

  if (catErr || !categories || categories.length === 0) {
    console.error('Failed to load categories:', catErr);
    process.exit(1);
  }

  const categoryMap = new Map<string, string>();
  categories.forEach((cat) => categoryMap.set(cat.key, cat.id));

  // 2. Fetch an admin id to assign as author
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id')
    .limit(1)
    .maybeSingle();

  const authorId = adminUser?.id || null;

  let insertedCount = 0;
  let updatedCount = 0;

  for (const job of SAMPLE_JOBS) {
    const categoryId = categoryMap.get(job.category_key);
    if (!categoryId) {
      console.warn(`Category ${job.category_key} not found for job ${job.title_fa}`);
      continue;
    }

    // Check if exists
    const { data: existing } = await supabase
      .from('job_listings')
      .select('id, status')
      .eq('slug_fa', job.slug_fa)
      .maybeSingle();

    const record = {
      category_id: categoryId,
      status: 'draft', // STRICTLY DRAFT
      title_fa: job.title_fa,
      title_en: job.title_en,
      slug_fa: job.slug_fa,
      slug_en: job.slug_en,
      city: job.city,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      salary_currency: job.salary_currency,
      contract_type: job.contract_type,
      positions_available: job.positions_available,
      accommodation_provided: job.accommodation_provided,
      description_fa: job.description_fa,
      description_en: job.description_en,
      requirements_fa: job.requirements_fa,
      requirements_en: job.requirements_en,
      is_sample: true,
      author_admin_id: authorId,
    };

    if (existing) {
      const { error: updateErr } = await supabase
        .from('job_listings')
        .update(record)
        .eq('id', existing.id);

      if (updateErr) {
        console.error(`Failed to update ${job.slug_fa}:`, updateErr);
      } else {
        updatedCount++;
      }
    } else {
      const { error: insertErr } = await supabase
        .from('job_listings')
        .insert(record);

      if (insertErr) {
        console.error(`Failed to insert ${job.slug_fa}:`, insertErr);
      } else {
        insertedCount++;
      }
    }
  }

  console.log(`Finished seeding sample jobs. Inserted: ${insertedCount}, Updated: ${updatedCount}`);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
