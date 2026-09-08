import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { isJobBoardPubliclyEnabled } from '@/lib/jobBoardHelper';

export const dynamic = 'force-dynamic';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * POST /api/jobs/apply
 * Public application endpoint for job listings.
 * 1. Hard-gated by app_settings.job_board_public_enabled (403 if disabled).
 * 2. Rate-limited to 5 applications per 10 minutes per IP.
 * 3. Strictly verifies job exists and status === 'published' (404 if not).
 * 4. Inserts lead with source = 'job_board' and applied_job_listing_id.
 */
export async function POST(request: Request) {
  try {
    const isPublicEnabled = await isJobBoardPubliclyEnabled();
    if (!isPublicEnabled) {
      return NextResponse.json(
        { error: 'Job applications are not currently open.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    // IP-based Rate Limiting (5 requests per 10 minutes)
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const rlData = rateLimitMap.get(ip);
    if (rlData && now < rlData.resetTime) {
      if (rlData.count >= 5) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again in a few minutes.' },
          { status: 429 }
        );
      }
      rlData.count += 1;
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + 10 * 60 * 1000 });
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    // Honeypot check
    if (body._gotcha && String(body._gotcha).trim() !== '') {
      return NextResponse.json({ success: true, message: 'Application submitted successfully.' });
    }

    const {
      job_listing_id,
      full_name,
      phone,
      email,
      current_country,
      english_level,
      experience_years,
      notes,
    } = body;

    // Field validations
    if (!job_listing_id || typeof job_listing_id !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid job_listing_id.' }, { status: 400 });
    }

    if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2) {
      return NextResponse.json({ error: 'Full name must be at least 2 characters.' }, { status: 400 });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
      return NextResponse.json({ error: 'Valid phone or WhatsApp number is required.' }, { status: 400 });
    }

    // Strict Job Existence & Status Verification
    // The listing MUST exist AND have status = 'published'
    const { data: job, error: jobErr } = await supabaseAdmin
      .from('job_listings')
      .select('id, title_fa, title_en, slug_fa, status')
      .eq('id', job_listing_id)
      .maybeSingle();

    if (jobErr || !job || job.status !== 'published') {
      return NextResponse.json(
        { error: 'The requested job listing does not exist or is no longer accepting applications.' },
        { status: 404 }
      );
    }

    const cleanName = full_name.trim().substring(0, 150);
    const cleanPhone = phone.trim().substring(0, 50);
    const cleanEmail = email && typeof email === 'string' ? email.trim().substring(0, 150) : null;
    const cleanCountry = current_country && typeof current_country === 'string' ? current_country.trim().substring(0, 100) : null;
    const cleanEnglish = english_level && typeof english_level === 'string' ? english_level.trim().substring(0, 50) : null;
    const parsedExp = experience_years !== undefined && experience_years !== null && experience_years !== ''
      ? Math.max(0, parseInt(String(experience_years), 10) || 0)
      : null;
    const cleanNotes = notes && typeof notes === 'string' ? notes.trim().substring(0, 2000) : null;

    const leadNotes = [
      `[درخواست استخدام نیروی کار]`,
      `عنوان موقعیت: ${job.title_fa || job.title_en || job_listing_id}`,
      cleanCountry ? `کشور فعلی: ${cleanCountry}` : null,
      cleanEnglish ? `سطح زبان انگلیسی: ${cleanEnglish}` : null,
      parsedExp !== null ? `سابقه کار مرتبط: ${parsedExp} سال` : null,
      cleanNotes ? `توضیحات و پیام متقاضی:\n${cleanNotes}` : null,
    ].filter(Boolean).join('\n');

    const { data: newLead, error: insertErr } = await supabaseAdmin
      .from('leads')
      .insert({
        full_name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        source: 'job_board',
        applied_job_listing_id: job.id,
        status: 'new',
        message: leadNotes,
        consent_terms: true,
        raw_meta: {
          source_detail: 'job_board',
          job_listing_id: job.id,
          job_title_fa: job.title_fa,
          job_title_en: job.title_en,
          job_slug_fa: job.slug_fa,
          current_country: cleanCountry,
          english_level: cleanEnglish,
          experience_years: parsedExp,
          applicant_notes: cleanNotes,
          ip,
          submitted_at: new Date().toISOString(),
        },
      })
      .select('id')
      .single();

    if (insertErr) {
      console.error('Error inserting lead for job application:', insertErr);
      return NextResponse.json({ error: 'Failed to record application.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      lead_id: newLead.id,
      message: 'درخواست شما با موفقیت ثبت شد. کارشناسان ما پس از بررسی با شما تماس خواهند گرفت.',
    });
  } catch (error: any) {
    console.error('Unexpected error in POST /api/jobs/apply:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
