import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendTelegramMessage } from '@/lib/telegram';
import { getResendClient, getResendConfig } from '@/lib/email/resend';

export const dynamic = 'force-dynamic';

interface AssignedStaffInfo {
  id: string;
  fullName: string | null;
  email: string | null;
  telegramChatId: string | null;
  notifyEmail: boolean;
  notifyTelegram: boolean;
  roleKey: string | null;
}

interface StageItem {
  id: string;
  stageKey: string;
  labelFa: string;
  status: string;
  dueDate: string;
  notes: string | null;
  leadId: string;
  leadName: string;
  leadGoal: string | null;
}

/**
 * GET /api/cron/daily-case-reminders
 * 
 * Scheduled daily cron job that inspects open case stages due today, tomorrow, or overdue,
 * resolves responsible staff members, groups tasks per staff, and dispatches email/telegram reminders.
 * 
 * Security: Protected by Bearer token matching CRON_SECRET.
 */
export async function GET(request: Request) {
  const startTime = Date.now();

  try {
    // 1. Authenticate Vercel Cron Request
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET?.trim();

    if (!cronSecret) {
      console.warn('[Cron] CRON_SECRET is not configured in server environment.');
      return NextResponse.json(
        { error: 'Unauthorized: CRON_SECRET not configured' },
        { status: 401 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.warn('[Cron] Invalid or missing Authorization Bearer token.');
      return NextResponse.json(
        { error: 'Unauthorized: Invalid cron authorization token' },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    // 2. Calculate target date threshold (today + 1 day = end of tomorrow)
    const now = new Date();
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + 1);
    const cutoffDateStr = targetDate.toISOString().split('T')[0];
    const todayDateStr = now.toISOString().split('T')[0];

    // 3. Fetch open stages due on or before cutoff date
    const { data: rawStages, error: stagesErr } = await supabaseAdmin
      .from('case_stages')
      .select(`
        id,
        lead_id,
        stage_key,
        label_fa,
        status,
        due_date,
        responsible_role,
        responsible_staff_id,
        notes,
        leads:leads!case_stages_lead_id_fkey (
          id,
          full_name,
          site_goal,
          unified_category
        )
      `)
      .neq('status', 'done')
      .lte('due_date', cutoffDateStr)
      .order('due_date', { ascending: true });

    if (stagesErr) {
      console.error('[Cron] Error fetching open case stages:', stagesErr);
      return NextResponse.json({ error: 'Failed to query case stages.' }, { status: 500 });
    }

    const stages = rawStages || [];
    if (stages.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No pending or overdue case stages requiring reminders.',
        stagesCount: 0,
        recipientsCount: 0,
        emailsSent: 0,
        telegramsSent: 0,
        durationMs: Date.now() - startTime,
      });
    }

    // 4. Fetch all active staff members and their roles
    const { data: rawStaff, error: staffErr } = await supabaseAdmin
      .from('admin_users')
      .select(`
        id,
        full_name,
        is_active,
        telegram_chat_id,
        notify_email,
        notify_telegram,
        roles (
          id,
          key,
          label_fa
        )
      `)
      .eq('is_active', true);

    if (staffErr || !rawStaff) {
      console.error('[Cron] Error fetching active staff members:', staffErr);
      return NextResponse.json({ error: 'Failed to query staff directory.' }, { status: 500 });
    }

    // Fetch auth emails
    const { data: authData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    const emailMap = new Map<string, string>();
    if (authData?.users) {
      for (const u of authData.users) {
        if (u.email) emailMap.set(u.id, u.email);
      }
    }

    const activeStaffMap = new Map<string, AssignedStaffInfo>();
    const managersAndOwners: AssignedStaffInfo[] = [];

    for (const s of rawStaff) {
      const role = s.roles as any;
      const roleKey = role?.key || null;
      const staffInfo: AssignedStaffInfo = {
        id: s.id,
        fullName: s.full_name,
        email: emailMap.get(s.id) || null,
        telegramChatId: s.telegram_chat_id || null,
        notifyEmail: Boolean(s.notify_email),
        notifyTelegram: Boolean(s.notify_telegram),
        roleKey,
      };

      activeStaffMap.set(s.id, staffInfo);

      if (roleKey === 'owner' || roleKey === 'manager') {
        managersAndOwners.push(staffInfo);
      }
    }

    // 5. Fetch relevant lead assignments
    const leadIds = Array.from(new Set(stages.map((s) => s.lead_id)));
    const { data: rawAssignments } = await supabaseAdmin
      .from('lead_assignments')
      .select('lead_id, staff_id, assigned_role')
      .in('lead_id', leadIds);

    const assignments = rawAssignments || [];

    // 6. Map stages to recipient staff
    const recipientGroups = new Map<string, { staff: AssignedStaffInfo; items: StageItem[] }>();

    for (const stage of stages) {
      const leadData = stage.leads as any;
      const stageItem: StageItem = {
        id: stage.id,
        stageKey: stage.stage_key,
        labelFa: stage.label_fa,
        status: stage.status,
        dueDate: stage.due_date,
        notes: stage.notes,
        leadId: stage.lead_id,
        leadName: leadData?.full_name || 'متقاضی نامشخص',
        leadGoal: leadData?.site_goal || leadData?.unified_category || null,
      };

      let resolvedStaff: AssignedStaffInfo[] = [];

      // Step 2a: If responsible_staff_id is explicitly set
      if (stage.responsible_staff_id && activeStaffMap.has(stage.responsible_staff_id)) {
        resolvedStaff.push(activeStaffMap.get(stage.responsible_staff_id)!);
      }

      // Step 2b: If not resolved yet, check lead_assignments matching responsible_role
      if (resolvedStaff.length === 0 && stage.responsible_role) {
        const matchingAssigns = assignments.filter(
          (a) => a.lead_id === stage.lead_id && a.assigned_role === stage.responsible_role
        );

        for (const assign of matchingAssigns) {
          const staff = activeStaffMap.get(assign.staff_id);
          if (staff && !resolvedStaff.some((rs) => rs.id === staff.id)) {
            resolvedStaff.push(staff);
          }
        }
      }

      // Step 2c: Fallback to all active managers and owners
      if (resolvedStaff.length === 0) {
        resolvedStaff = [...managersAndOwners];
      }

      // Add stage to each resolved recipient group
      for (const recipient of resolvedStaff) {
        if (!recipientGroups.has(recipient.id)) {
          recipientGroups.set(recipient.id, {
            staff: recipient,
            items: [],
          });
        }
        const group = recipientGroups.get(recipient.id)!;
        if (!group.items.some((i) => i.id === stageItem.id)) {
          group.items.push(stageItem);
        }
      }
    }

    // 7. Dispatch grouped notifications
    let emailsSent = 0;
    let telegramsSent = 0;
    const errors: string[] = [];

    const resend = getResendClient();
    const emailConfig = getResendConfig();
    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dorvia.ro';

    for (const group of recipientGroups.values()) {
      const { staff, items } = group;
      if (items.length === 0) continue;

      const overdueCount = items.filter((i) => i.dueDate < todayDateStr).length;
      const todayCount = items.filter((i) => i.dueDate === todayDateStr).length;
      const tomorrowCount = items.filter((i) => i.dueDate > todayDateStr).length;

      // --- Dispatch Email (Resend) ---
      if (staff.notifyEmail && staff.email && resend && emailConfig.isConfigured) {
        try {
          const emailSubject = `⚠️ هشدار روزانه پرونده‌های دورویا: ${items.length} اقدام نیازمند رسیدگی`;
          const emailHtml = buildStaffReminderEmailHtml({
            staffName: staff.fullName || 'همکار گرامی',
            items,
            appBaseUrl,
            todayDateStr,
            overdueCount,
            todayCount,
            tomorrowCount,
          });

          const res = await resend.emails.send({
            from: emailConfig.fromEmail,
            to: staff.email,
            subject: emailSubject,
            html: emailHtml,
          });

          if (res.error) {
            errors.push(`Email error for ${staff.email}: ${res.error.message}`);
          } else {
            emailsSent++;
          }
        } catch (mailErr: any) {
          errors.push(`Email exception for ${staff.email}: ${mailErr?.message}`);
        }
      }

      // --- Dispatch Telegram Message ---
      if (staff.notifyTelegram && staff.telegramChatId) {
        try {
          const telegramText = buildStaffTelegramMessage({
            staffName: staff.fullName || 'همکار گرامی',
            items,
            appBaseUrl,
            todayDateStr,
            overdueCount,
            todayCount,
            tomorrowCount,
          });

          const tgRes = await sendTelegramMessage(staff.telegramChatId, telegramText, 'HTML');
          if (tgRes.success) {
            telegramsSent++;
          } else if (!tgRes.skipped && tgRes.error) {
            errors.push(`Telegram error for chat ${staff.telegramChatId}: ${tgRes.error}`);
          }
        } catch (tgErr: any) {
          errors.push(`Telegram exception for ${staff.telegramChatId}: ${tgErr?.message}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      processedAt: new Date().toISOString(),
      stagesCount: stages.length,
      recipientsCount: recipientGroups.size,
      emailsSent,
      telegramsSent,
      errors: errors.length > 0 ? errors : undefined,
      durationMs: Date.now() - startTime,
    });
  } catch (err: any) {
    console.error('[Cron] Unexpected error during daily case reminders cron execution:', err);
    return NextResponse.json(
      { error: 'Internal server error during reminder dispatch.', details: err?.message },
      { status: 500 }
    );
  }
}

/**
 * Builds a styled Persian HTML email template for daily case milestone alerts.
 */
function buildStaffReminderEmailHtml(params: {
  staffName: string;
  items: StageItem[];
  appBaseUrl: string;
  todayDateStr: string;
  overdueCount: number;
  todayCount: number;
  tomorrowCount: number;
}): string {
  const { staffName, items, appBaseUrl, todayDateStr, overdueCount, todayCount, tomorrowCount } = params;

  const rowsHtml = items
    .map((item) => {
      const isOverdue = item.dueDate < todayDateStr;
      const isToday = item.dueDate === todayDateStr;
      const statusBadge = isOverdue
        ? '<span style="color:#b91c1c;background:#fee2e2;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:bold;">سررسید گذشته</span>'
        : isToday
        ? '<span style="color:#c2410c;background:#ffedd5;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:bold;">سررسید امروز</span>'
        : '<span style="color:#1d4ed8;background:#dbeafe;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:bold;">فردا</span>';

      return `
        <tr style="border-bottom:1px solid #e2e8f0;">
          <td style="padding:12px;font-size:13px;font-weight:bold;color:#0f172a;">${escapeHtml(item.labelFa)}</td>
          <td style="padding:12px;font-size:13px;color:#334155;">${escapeHtml(item.leadName)}</td>
          <td style="padding:12px;font-size:12px;font-family:monospace;color:#475569;">${escapeHtml(item.dueDate)}</td>
          <td style="padding:12px;text-align:center;">${statusBadge}</td>
          <td style="padding:12px;text-align:left;">
            <a href="${appBaseUrl}/fa/admin/leads/${item.leadId}" style="display:inline-block;padding:6px 12px;background:#071B3D;color:#ffffff;text-decoration:none;border-radius:6px;font-size:11px;font-weight:bold;">
              مشاهده پرونده
            </a>
          </td>
        </tr>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
      <meta charset="utf-8">
      <title>هشدار سررسید پرونده‌های دورویا</title>
    </head>
    <body style="font-family:Tahoma,Segoe UI,Arial,sans-serif;background-color:#f8fafc;margin:0;padding:24px;direction:rtl;text-align:right;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
        
        <div style="background:#071B3D;padding:24px 32px;color:#ffffff;">
          <h1 style="margin:0 0 8px 0;font-size:20px;font-weight:800;">هشدار روزانه سررسید پرونده‌ها</h1>
          <p style="margin:0;font-size:13px;color:#cbd5e1;">سامانه مدیریت مهاجرت و حقوقی DORVIA</p>
        </div>

        <div style="padding:28px 32px;">
          <p style="font-size:14px;color:#1e293b;margin:0 0 16px 0;">
            درود <strong>${escapeHtml(staffName)}</strong>،
          </p>
          <p style="font-size:13px;color:#475569;line-height:1.7;margin:0 0 20px 0;">
            تعداد <strong>${items.length}</strong> مرحله از پرونده‌های تحت مسئولیت یا نظارت شما در سررسید امروز، فردا یا دارای تاخیر می‌باشند:
          </p>

          <div style="display:flex;gap:12px;margin-bottom:24px;">
            ${
              overdueCount > 0
                ? `<div style="background:#fef2f2;border:1px solid #fecaca;color:#991b1b;padding:10px 14px;border-radius:10px;font-size:12px;font-weight:bold;">${overdueCount} سررسید گذشته</div>`
                : ''
            }
            ${
              todayCount > 0
                ? `<div style="background:#fff7ed;border:1px solid #ffedd5;color:#9a3412;padding:10px 14px;border-radius:10px;font-size:12px;font-weight:bold;">${todayCount} سررسید امروز</div>`
                : ''
            }
            ${
              tomorrowCount > 0
                ? `<div style="background:#eff6ff;border:1px solid #dbeafe;color:#1e40af;padding:10px 14px;border-radius:10px;font-size:12px;font-weight:bold;">${tomorrowCount} سررسید فردا</div>`
                : ''
            }
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <thead>
              <tr style="background:#f1f5f9;color:#475569;font-size:12px;font-weight:bold;">
                <th style="padding:10px;text-align:right;">عنوان اقدام / مرحله</th>
                <th style="padding:10px;text-align:right;">متقاضی</th>
                <th style="padding:10px;text-align:right;">تاریخ سررسید</th>
                <th style="padding:10px;text-align:center;">وضعیت زمانی</th>
                <th style="padding:10px;text-align:left;">لینک</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div style="text-align:center;padding-top:16px;border-top:1px solid #f1f5f9;">
            <a href="${appBaseUrl}/fa/admin/leads" style="display:inline-block;padding:12px 28px;background:#2F6FED;color:#ffffff;text-decoration:none;border-radius:10px;font-size:13px;font-weight:bold;">
              ورود به کارتابل پرونده‌ها
            </a>
          </div>
        </div>

        <div style="background:#f8fafc;padding:16px 32px;text-align:center;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;">
          این پیام به صورت خودکار توسط سیستم کرون DORVIA ارسال شده است.
        </div>

      </div>
    </body>
    </html>
  `;
}

/**
 * Builds a clean HTML-formatted message for Telegram alerts.
 */
function buildStaffTelegramMessage(params: {
  staffName: string;
  items: StageItem[];
  appBaseUrl: string;
  todayDateStr: string;
  overdueCount: number;
  todayCount: number;
  tomorrowCount: number;
}): string {
  const { staffName, items, appBaseUrl, todayDateStr, overdueCount, todayCount, tomorrowCount } = params;

  let text = `🚨 <b>یادآوری روزانه سررسید پرونده‌ها — دورویا</b>\n`;
  text += `👤 همکار گرامی: <b>${escapeHtml(staffName)}</b>\n\n`;
  text += `📋 شما <b>${items.length} اقدام نیازمند رسیدگی</b> در پرونده‌های تحت نظارت دارید:`;

  if (overdueCount > 0) text += `\n🔴 ${overdueCount} اقدام سررسید گذشته (تاخیردار)`;
  if (todayCount > 0) text += `\n🟠 ${todayCount} اقدام سررسید امروز`;
  if (tomorrowCount > 0) text += `\n🔵 ${tomorrowCount} اقدام سررسید فردا`;

  text += `\n\n──────────────────\n`;

  // List each stage with details
  items.slice(0, 10).forEach((item, idx) => {
    const isOverdue = item.dueDate < todayDateStr;
    const isToday = item.dueDate === todayDateStr;
    const timeIcon = isOverdue ? '⚠️ تاخیر:' : isToday ? '⏰ امروز:' : '📅 فردا:';

    text += `\n<b>${idx + 1}. ${escapeHtml(item.labelFa)}</b>`;
    text += `\n👤 متقاضی: ${escapeHtml(item.leadName)}`;
    text += `\n${timeIcon} <code>${item.dueDate}</code> | وضعیت: <code>${item.status}</code>`;
    text += `\n🔗 <a href="${appBaseUrl}/fa/admin/leads/${item.leadId}">مشاهده پرونده متقاضی</a>\n`;
  });

  if (items.length > 10) {
    text += `\n... و ${items.length - 10} اقدام دیگر در پنل مدیریت.\n`;
  }

  text += `\n──────────────────`;
  text += `\n🌐 <a href="${appBaseUrl}/fa/admin/leads">ورود به فهرست پرونده‌ها</a>`;

  return text;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
