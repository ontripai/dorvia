/**
 * Server-only AI Translation Service for Dorvia Blog CMS.
 *
 * Uses Anthropic Claude API (via standard HTTPS fetch) to translate Persian blog
 * content to high quality, fluent, natural English with Markdown formatting preserved.
 *
 * CRITICAL ARCHITECTURAL RULE:
 * This file is STRICTLY SERVER-SIDE. It must NEVER be re-exported through shared/barrel
 * helpers imported by client components ('use client') to prevent leaking server configuration.
 */

import { slugify } from '@/lib/slugHelper';

export interface BlogFaFields {
  title_fa?: string | null;
  content_fa?: string | null;
  excerpt_fa?: string | null;
  meta_title_fa?: string | null;
  meta_description_fa?: string | null;
}

export interface BlogEnFields {
  title_en?: string | null;
  slug_en?: string | null;
  excerpt_en?: string | null;
  content_en?: string | null;
  meta_title_en?: string | null;
  meta_description_en?: string | null;
}

export interface FieldsToTranslate {
  title?: boolean;
  content?: boolean;
  excerpt?: boolean;
  meta_title?: boolean;
  meta_description?: boolean;
}

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const REQUEST_TIMEOUT_MS = 25000;

/**
 * Extracts and safely parses JSON from Claude response, handling code fences or extra whitespace.
 */
function extractJsonFromClaudeText(raw: string): any {
  const trimmed = raw.trim();

  // Strip markdown code fences if present (e.g. ```json ... ```)
  const fenceRegex = /^```(?:json)?\s*([\s\S]*?)\s*```$/i;
  const match = trimmed.match(fenceRegex);
  const text = match ? match[1].trim() : trimmed;

  try {
    return JSON.parse(text);
  } catch {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1));
    }
    throw new Error('Claude response does not contain valid JSON object');
  }
}

/**
 * Automatically translates Persian blog fields to English using Anthropic Claude API.
 * Only translates the fields flagged in `needed`.
 *
 * If ANTHROPIC_API_KEY is not configured or any network/API error occurs,
 * logs the issue safely (without leaking keys) and returns null so the main
 * blog creation/update flow never fails.
 */
export async function translateBlogContentToEnglish(
  fa: BlogFaFields,
  needed: FieldsToTranslate
): Promise<BlogEnFields | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    // API key not set — gracefully skip without crashing or warning excessively
    console.info('[aiTranslate] ANTHROPIC_API_KEY is not configured. Skipping automatic English translation.');
    return null;
  }

  // Determine if any field actually requires translation
  const hasWork =
    (needed.title && Boolean(fa.title_fa?.trim())) ||
    (needed.content && Boolean(fa.content_fa?.trim())) ||
    (needed.excerpt && Boolean(fa.excerpt_fa?.trim())) ||
    (needed.meta_title && Boolean(fa.meta_title_fa?.trim())) ||
    (needed.meta_description && Boolean(fa.meta_description_fa?.trim()));

  if (!hasWork) {
    return null;
  }

  // Current active Claude model: claude-haiku-4-5 is Anthropic's official current fast model
  const model = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5';

  const systemPrompt = `You are an expert bilingual translator, senior editor, and SEO copywriter for Dorvia, an international legal, immigration, and educational portal.
Your task is to translate Persian blog content into fluent, natural, publication-ready English.

Guidelines:
1. Translate naturally and idiomatically — avoid literal, robotic word-for-word translations.
2. If content_fa is provided, PRESERVE ALL Markdown formatting intact: headings (#, ##, ###), bullet lists, numbered lists, bold text (**), blockquotes, links, and code blocks.
3. If title_fa is provided, also provide an SEO-friendly slug_en consisting of 2 to 6 lowercase English words separated by hyphens (e.g. "guide-to-german-student-visa").
4. For excerpt_en, provide an engaging 1-2 sentence English summary.
5. For meta_title_en, provide an SEO-friendly title under 60 characters.
6. For meta_description_en, provide a compelling meta description under 160 characters.
7. Return ONLY a single raw JSON object matching the requested schema. No code fences, no markdown formatting around the JSON, and no introductory or explanatory text.`;

  const payloadToTranslate: Record<string, string> = {};
  if (needed.title && fa.title_fa?.trim()) {
    payloadToTranslate.title_fa = fa.title_fa.trim();
  }
  if (needed.content && fa.content_fa?.trim()) {
    payloadToTranslate.content_fa = fa.content_fa;
  }
  if (needed.excerpt && fa.excerpt_fa?.trim()) {
    payloadToTranslate.excerpt_fa = fa.excerpt_fa.trim();
  }
  if (needed.meta_title && fa.meta_title_fa?.trim()) {
    payloadToTranslate.meta_title_fa = fa.meta_title_fa.trim();
  }
  if (needed.meta_description && fa.meta_description_fa?.trim()) {
    payloadToTranslate.meta_description_fa = fa.meta_description_fa.trim();
  }

  const requestedFields: string[] = [];
  if (needed.title) {
    requestedFields.push('"title_en": string', '"slug_en": string (seo-friendly hyphenated phrase)');
  }
  if (needed.content) {
    requestedFields.push('"content_en": string (markdown)');
  }
  if (needed.excerpt) {
    requestedFields.push('"excerpt_en": string');
  }
  if (needed.meta_title) {
    requestedFields.push('"meta_title_en": string');
  }
  if (needed.meta_description) {
    requestedFields.push('"meta_description_en": string');
  }

  const userMessage = `Translate the following Persian blog fields into English according to the system instructions:

${JSON.stringify(payloadToTranslate, null, 2)}

Respond with a JSON object containing only the following fields:
{
  ${requestedFields.join(',\n  ')}
}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey.trim(),
        'anthropic-version': ANTHROPIC_VERSION,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 8192,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error(
        `[aiTranslate] Anthropic API HTTP error ${response.status}: ${response.statusText}`,
        errorText.slice(0, 300)
      );
      return null;
    }

    const data = await response.json();
    const contentBlock = data?.content?.[0];
    if (!contentBlock || contentBlock.type !== 'text' || typeof contentBlock.text !== 'string') {
      console.error('[aiTranslate] Anthropic API returned unexpected response format');
      return null;
    }

    const parsed = extractJsonFromClaudeText(contentBlock.text);

    return {
      title_en: typeof parsed.title_en === 'string' && parsed.title_en.trim() ? parsed.title_en.trim() : null,
      slug_en: typeof parsed.slug_en === 'string' && parsed.slug_en.trim() ? slugify(parsed.slug_en) : null,
      excerpt_en: typeof parsed.excerpt_en === 'string' && parsed.excerpt_en.trim() ? parsed.excerpt_en.trim() : null,
      content_en: typeof parsed.content_en === 'string' ? parsed.content_en : null,
      meta_title_en:
        typeof parsed.meta_title_en === 'string' && parsed.meta_title_en.trim() ? parsed.meta_title_en.trim() : null,
      meta_description_en:
        typeof parsed.meta_description_en === 'string' && parsed.meta_description_en.trim()
          ? parsed.meta_description_en.trim()
          : null,
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error(`[aiTranslate] Translation request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`);
    } else {
      console.error('[aiTranslate] Unexpected error calling Anthropic API:', error?.message || error);
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Ensures an English slug is unique within the blog_posts table by querying
 * existing rows and appending numeric suffixes (-1, -2, ...) if collision occurs.
 */
export async function resolveUniqueEnSlug(
  supabase: any,
  baseSlug: string,
  excludePostId?: string
): Promise<string> {
  const cleanBase = slugify(baseSlug) || `article-${Date.now()}`;
  let candidate = cleanBase;
  let counter = 1;

  while (true) {
    let query = supabase.from('blog_posts').select('id').eq('slug_en', candidate);

    if (excludePostId) {
      query = query.neq('id', excludePostId);
    }

    const { data: existing } = await query.maybeSingle();

    if (!existing) {
      return candidate;
    }

    counter++;
    candidate = `${cleanBase}-${counter}`;
    if (counter > 100) {
      return `${cleanBase}-${Date.now()}`;
    }
  }
}
