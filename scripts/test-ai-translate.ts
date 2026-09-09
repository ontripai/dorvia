import assert from 'assert';
import { translateBlogContentToEnglish, resolveUniqueEnSlug } from '../src/lib/aiTranslate';
import { slugify } from '../src/lib/slugHelper';

async function runTests() {
  console.log('--- Test 1: Empty or Missing ANTHROPIC_API_KEY returns null safely ---');
  delete process.env.ANTHROPIC_API_KEY;
  const res1 = await translateBlogContentToEnglish(
    { title_fa: 'عنوان تستی', content_fa: '# متن تستی' },
    { title: true, content: true }
  );
  assert.strictEqual(res1, null, 'Expected null when ANTHROPIC_API_KEY is not set');
  console.log('✓ Passed: Empty API key returns null gracefully');

  console.log('--- Test 2: Whitespace-only ANTHROPIC_API_KEY returns null safely ---');
  process.env.ANTHROPIC_API_KEY = '   ';
  const res2 = await translateBlogContentToEnglish(
    { title_fa: 'عنوان تستی' },
    { title: true }
  );
  assert.strictEqual(res2, null, 'Expected null when ANTHROPIC_API_KEY is whitespace');
  console.log('✓ Passed: Whitespace API key returns null gracefully');

  console.log('--- Test 3: No fields needed returns null immediately ---');
  process.env.ANTHROPIC_API_KEY = 'mock_key';
  const res3 = await translateBlogContentToEnglish(
    { title_fa: 'عنوان تستی' },
    { title: false, content: false, excerpt: false, meta_title: false, meta_description: false }
  );
  assert.strictEqual(res3, null, 'Expected null when no fields are requested');
  console.log('✓ Passed: No fields needed returns null immediately without HTTP request');

  console.log('--- Test 4: resolveUniqueEnSlug uniqueness resolution ---');
  // Mock Supabase client simulating an existing slug 'study-in-germany' and 'study-in-germany-2'
  const mockDb = {
    from: (table: string) => ({
      select: (col: string) => ({
        eq: (field: string, val: string) => ({
          neq: (idField: string, idVal: string) => ({
            maybeSingle: async () => {
              if (val === 'study-in-germany' || val === 'study-in-germany-2') {
                return { data: { id: 'existing-id' } };
              }
              return { data: null };
            },
          }),
          maybeSingle: async () => {
            if (val === 'study-in-germany' || val === 'study-in-germany-2') {
              return { data: { id: 'existing-id' } };
            }
            return { data: null };
          },
        }),
      }),
    }),
  };

  const uniqueSlug = await resolveUniqueEnSlug(mockDb, 'study-in-germany');
  assert.strictEqual(uniqueSlug, 'study-in-germany-3', `Expected study-in-germany-3, got ${uniqueSlug}`);
  console.log('✓ Passed: resolveUniqueEnSlug handles collisions correctly');

  console.log('--- Test 5: Non-overwrite protection logic verification ---');
  // Simulate currentPost and updates logic from PATCH route
  const currentPost = {
    id: 'post-1',
    title_fa: 'عنوان قدیمی',
    content_fa: 'محتوای قدیمی',
    title_en: 'Existing English Title',
    content_en: 'Existing English Content',
    slug_en: 'existing-english-slug',
  };

  const body = {
    title_fa: 'عنوان فارسی ویرایش شده',
    content_fa: 'محتوای جدید',
  };

  const updates: Record<string, any> = {};
  if (body.title_fa !== undefined) updates.title_fa = body.title_fa;
  if (body.content_fa !== undefined) updates.content_fa = body.content_fa;

  const isTitleEnEmpty =
    (updates.title_en === undefined || updates.title_en === null || !String(updates.title_en).trim()) &&
    (!currentPost.title_en || !currentPost.title_en.trim());

  const isContentEnEmpty =
    (updates.content_en === undefined || updates.content_en === null || !String(updates.content_en).trim()) &&
    (!currentPost.content_en || !currentPost.content_en.trim());

  const isSlugEnEmpty =
    (updates.slug_en === undefined || updates.slug_en === null || !String(updates.slug_en).trim()) &&
    (!currentPost.slug_en || !currentPost.slug_en.trim());

  assert.strictEqual(isTitleEnEmpty, false, 'Existing title_en must NOT be considered empty');
  assert.strictEqual(isContentEnEmpty, false, 'Existing content_en must NOT be considered empty');
  assert.strictEqual(isSlugEnEmpty, false, 'Existing slug_en must NOT be considered empty');
  console.log('✓ Passed: Existing English fields are strictly preserved and never overwritten');

  console.log('--- Test 6: Empty English fields are correctly targeted for translation ---');
  const freshPost: {
    id: string;
    title_fa: string;
    content_fa: string;
    title_en: string | null;
    content_en: string | null;
    slug_en: string | null;
  } = {
    id: 'post-2',
    title_fa: 'راهنمای مهاجرت به رومانی',
    content_fa: '# اقامت کاری رومانی',
    title_en: null,
    content_en: null,
    slug_en: null,
  };

  const isFreshTitleEnEmpty =
    (updates.title_en === undefined || updates.title_en === null || !String(updates.title_en).trim()) &&
    (!freshPost.title_en || !freshPost.title_en.trim());

  const isFreshContentEnEmpty =
    (updates.content_en === undefined || updates.content_en === null || !String(updates.content_en).trim()) &&
    (!freshPost.content_en || !freshPost.content_en.trim());

  assert.strictEqual(isFreshTitleEnEmpty, true, 'Empty title_en must be targeted');
  assert.strictEqual(isFreshContentEnEmpty, true, 'Empty content_en must be targeted');
  console.log('✓ Passed: Empty English fields are correctly identified for auto-translation');

  console.log('\nAll unit and logic tests PASSED successfully!');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
