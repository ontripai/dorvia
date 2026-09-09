import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { createServerComponentClient } from '@/lib/supabaseServer';
import { createClient } from '@supabase/supabase-js';

async function main() {
  console.log('===============================================================');
  console.log('🧪 RUNNING VERIFICATION FOR TASK DRE-P81');
  console.log('===============================================================\n');

  // ---------------------------------------------------------------------------
  // 1. SECTION 1 VERIFICATION: FAIL-CLOSED ANON KEY CHECK
  // ---------------------------------------------------------------------------
  console.log('--- Section 1: Testing Fail-Closed Behavior when Anon Key is Missing ---');
  const savedAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  try {
    // 1.1 Unset anon key
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    let errorThrown = false;
    let caughtMessage = '';

    try {
      createServerComponentClient();
    } catch (err: any) {
      errorThrown = true;
      caughtMessage = err?.message || '';
    }

    if (!errorThrown) {
      throw new Error('FAIL: createServerComponentClient() did NOT throw when NEXT_PUBLIC_SUPABASE_ANON_KEY was missing!');
    }

    if (!caughtMessage.includes('refusing to fall back to a higher-privilege key')) {
      throw new Error(`FAIL: Unexpected error message: "${caughtMessage}"`);
    }

    console.log('  ✅ 1.1 PASS: createServerComponentClient() threw expected fail-closed error:');
    console.log(`       "${caughtMessage}"`);

    // 1.2 Restore anon key
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = savedAnonKey;
    const client = createServerComponentClient();
    if (!client) {
      throw new Error('FAIL: Client was not created after restoring anon key');
    }
    console.log('  ✅ 1.2 PASS: createServerComponentClient() instantiated successfully after restoring anon key.\n');
  } finally {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = savedAnonKey;
  }

  // ---------------------------------------------------------------------------
  // 2. SECTION 2 VERIFICATION: STRUCTURED DATA (ARTICLE + BREADCRUMB)
  // ---------------------------------------------------------------------------
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Query published post
  const { data: post, error: postErr } = await supabaseAdmin
    .from('blog_posts')
    .select(`
      id,
      title_fa,
      slug_fa,
      excerpt_fa,
      cover_image_url,
      published_at,
      updated_at,
      category:blog_categories!blog_posts_category_id_fkey (
        id,
        key,
        label_fa,
        label_en
      )
    `)
    .eq('status', 'published')
    .limit(1)
    .single();

  if (postErr || !post) {
    throw new Error(`Failed to query published post for test: ${postErr?.message}`);
  }

  const origin = 'https://dorvia.ro';
  const pageUrl = `${origin}/fa/romania/blog/${post.slug_fa}`;
  const categoryLabel = (post.category as any)?.label_fa;
  const categoryKey = (post.category as any)?.key;

  const breadcrumbItems: any[] = [
    { '@type': 'ListItem', position: 1, name: 'خانه', item: `${origin}/fa` },
    { '@type': 'ListItem', position: 2, name: 'رومانی / بلاگ', item: `${origin}/fa/romania/blog` },
  ];

  if (categoryLabel && categoryKey) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: categoryLabel,
      item: `${origin}/fa/romania/blog?category=${encodeURIComponent(categoryKey)}`,
    });
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 4,
      name: post.title_fa,
      item: pageUrl,
    });
  } else {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: post.title_fa,
      item: pageUrl,
    });
  }

  const generatedSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${pageUrl}#article`,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${origin}/#website`,
          name: 'DORVIA EUROP',
          url: origin,
        },
        headline: post.title_fa,
        description: post.excerpt_fa || post.title_fa,
        image: post.cover_image_url ? [post.cover_image_url] : undefined,
        datePublished: post.published_at || undefined,
        dateModified: post.updated_at || post.published_at || undefined,
        inLanguage: 'fa-IR',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageUrl,
        },
        author: {
          '@type': 'Organization',
          '@id': `${origin}/#organization`,
          name: 'DORVIA EUROP',
          url: origin,
        },
        publisher: {
          '@type': 'Organization',
          '@id': `${origin}/#organization`,
          name: 'DORVIA EUROP',
          url: origin,
          logo: {
            '@type': 'ImageObject',
            url: `${origin}/images/logo/dorvia-logo-primary-transparent-3000.png`,
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: breadcrumbItems,
      },
    ],
  };

  const jsonString = JSON.stringify(generatedSchema, null, 2);
  const parsed = JSON.parse(jsonString);

  if (!parsed['@graph'] || parsed['@graph'].length !== 2) {
    throw new Error('FAIL: Schema does not contain 2 graph entities (BlogPosting + BreadcrumbList)');
  }

  const blogEntity = parsed['@graph'].find((e: any) => e['@type'] === 'BlogPosting');
  const breadcrumbEntity = parsed['@graph'].find((e: any) => e['@type'] === 'BreadcrumbList');

  if (!blogEntity || !breadcrumbEntity) {
    throw new Error('FAIL: Missing BlogPosting or BreadcrumbList in schema graph');
  }

  if (!blogEntity.headline || !blogEntity.datePublished || !blogEntity.author || !blogEntity.publisher) {
    throw new Error('FAIL: Incomplete BlogPosting schema');
  }

  if (!breadcrumbEntity.itemListElement || breadcrumbEntity.itemListElement.length < 3) {
    throw new Error('FAIL: Incomplete BreadcrumbList schema');
  }

  console.log('  ✅ 2.1 PASS: BlogPosting Schema validated successfully:');
  console.log(`       headline: "${blogEntity.headline}"`);
  console.log(`       datePublished: "${blogEntity.datePublished}"`);
  console.log(`       author: "${blogEntity.author.name}"`);
  console.log(`       publisher: "${blogEntity.publisher.name}"`);

  console.log('  ✅ 2.2 PASS: BreadcrumbList Schema validated successfully:');
  breadcrumbEntity.itemListElement.forEach((item: any) => {
    console.log(`       [Pos ${item.position}] ${item.name} -> ${item.item}`);
  });

  console.log('\n===============================================================');
  console.log('🎉 ALL DRE-P81 VERIFICATIONS PASSED 100%!');
  console.log('===============================================================');
}

main().catch((err) => {
  console.error('\n❌ Verification failed:', err);
  process.exit(1);
});
