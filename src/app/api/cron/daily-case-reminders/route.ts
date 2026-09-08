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

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
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
    const todayDateStr = now.toISOString().split('T')[0];
    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth() + 1;
    const currentDay = now.getUTCDate();
    const targetDate = new Date(now);
    targetDate.setUTCDate(targetDate.getUTCDate() + 1);
    const cutoffDateStr = targetDate.toISOString().split('T')[0];

    let emailsSent = 0;
    let telegramsSent = 0;
    const errors: string[] = [];
    const recipientGroups = new Map<string, { staff: AssignedStaffInfo; items: StageItem[] }>();

    const resend = getResendClient();
    const emailConfig = getResendConfig();
    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dorvia.ro';

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
    if (stages.length > 0) {
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
  }

    // 8. Client Birthday Greetings Automation (dre-p71)
    let clientBirthdaysGreeted = 0;
    try {
      const { data: bdayLeads, error: bdayErr } = await supabaseAdmin
        .from('leads')
        .select('id, full_name, email, date_of_birth, last_birthday_greeted_year')
        .not('date_of_birth', 'is', null)
        .not('email', 'is', null)
        .neq('status', 'closed')
        .neq('status', 'archived');

      if (!bdayErr && bdayLeads && bdayLeads.length > 0) {
        for (const lead of bdayLeads) {
          if (!lead.email || !lead.date_of_birth) continue;
          const [, bMonthStr, bDayStr] = lead.date_of_birth.split('-');
          const bMonth = parseInt(bMonthStr, 10);
          const bDay = parseInt(bDayStr, 10);

          const isMatch = (bMonth === currentMonth && bDay === currentDay) ||
            (bMonth === 2 && bDay === 29 && currentMonth === 2 && currentDay === 28 && !isLeapYear(currentYear));

          if (isMatch) {
            // Deduplication: only send once per year
            if (lead.last_birthday_greeted_year !== currentYear) {
              if (resend && emailConfig.isConfigured) {
                try {
                  await resend.emails.send({
                    from: emailConfig.fromEmail,
                    to: lead.email,
                    subject: '🎉 زادروزتان فرخنده باد — گروه مهاجرتی دورویا (DORVIA)',
                    html: buildClientBirthdayEmailHtml({
                      clientName: lead.full_name || 'همراه گرامی',
                      appBaseUrl,
                    }),
                  });
                } catch (sendErr: any) {
                  errors.push(`Client birthday email error for lead ${lead.id}: ${sendErr?.message}`);
                }
              }

              await supabaseAdmin
                .from('leads')
                .update({ last_birthday_greeted_year: currentYear })
                .eq('id', lead.id);

              clientBirthdaysGreeted++;
            }
          }
        }
      }
    } catch (bdayEx: any) {
      console.error('[Cron] Exception in client birthday automation:', bdayEx);
      errors.push(`Client birthday automation error: ${bdayEx?.message}`);
    }

    // 9. Client Collaboration Anniversary Greetings Automation (dre-p71)
    let clientAnniversariesGreeted = 0;
    try {
      const { data: anniLeads, error: anniErr } = await supabaseAdmin
        .from('leads')
        .select('id, full_name, email, anniversary_date, last_anniversary_greeted_year')
        .not('anniversary_date', 'is', null)
        .not('email', 'is', null)
        .neq('status', 'closed')
        .neq('status', 'archived');

      if (!anniErr && anniLeads && anniLeads.length > 0) {
        for (const lead of anniLeads) {
          if (!lead.email || !lead.anniversary_date) continue;
          const [, aMonthStr, aDayStr] = lead.anniversary_date.split('-');
          const aMonth = parseInt(aMonthStr, 10);
          const aDay = parseInt(aDayStr, 10);

          const isMatch = (aMonth === currentMonth && aDay === currentDay) ||
            (aMonth === 2 && aDay === 29 && currentMonth === 2 && currentDay === 28 && !isLeapYear(currentYear));

          if (isMatch) {
            // Deduplication: only send once per year
            if (lead.last_anniversary_greeted_year !== currentYear) {
              if (resend && emailConfig.isConfigured) {
                try {
                  await resend.emails.send({
                    from: emailConfig.fromEmail,
                    to: lead.email,
                    subject: '💐 سالگرد آغاز همراهی و همکاری‌مان گرامی باد — گروه دورویا (DORVIA)',
                    html: buildClientAnniversaryEmailHtml({
                      clientName: lead.full_name || 'همراه گرامی',
                      appBaseUrl,
                    }),
                  });
                } catch (sendErr: any) {
                  errors.push(`Client anniversary email error for lead ${lead.id}: ${sendErr?.message}`);
                }
              }

              await supabaseAdmin
                .from('leads')
                .update({ last_anniversary_greeted_year: currentYear })
                .eq('id', lead.id);

              clientAnniversariesGreeted++;
            }
          }
        }
      }
    } catch (anniEx: any) {
      console.error('[Cron] Exception in client anniversary automation:', anniEx);
      errors.push(`Client anniversary automation error: ${anniEx?.message}`);
    }

    // 10. Staff Birthday Telegram Greetings Automation (dre-p71)
    let staffBirthdaysGreeted = 0;
    try {
      const teamTelegramChatId = process.env.TEAM_TELEGRAM_CHAT_ID?.trim();
      const { data: staffList, error: staffErr } = await supabaseAdmin
        .from('admin_users')
        .select('id, full_name, date_of_birth, last_birthday_greeted_year, is_active')
        .eq('is_active', true)
        .not('date_of_birth', 'is', null);

      if (!staffErr && staffList && staffList.length > 0) {
        for (const staff of staffList) {
          if (!staff.date_of_birth) continue;
          const [, sMonthStr, sDayStr] = staff.date_of_birth.split('-');
          const sMonth = parseInt(sMonthStr, 10);
          const sDay = parseInt(sDayStr, 10);

          const isMatch = (sMonth === currentMonth && sDay === currentDay) ||
            (sMonth === 2 && sDay === 29 && currentMonth === 2 && currentDay === 28 && !isLeapYear(currentYear));

          if (isMatch) {
            if (staff.last_birthday_greeted_year !== currentYear) {
              if (teamTelegramChatId) {
                try {
                  const staffName = staff.full_name || 'همکار گرامی';
                  const tgText = `🎉🎂 <b>امروز تولد ${escapeHtml(staffName)} عزیز است!</b>\n\nهمکاران گرامی، زادروز ${escapeHtml(staffName)} را تبریک می‌گوییم و برای ایشان سلامتی، نشاط و موفقیت‌های روزافزون در خانواده دورویا آرزومندیم. ✨💐🎈`;
                  const tgRes = await sendTelegramMessage(teamTelegramChatId, tgText, 'HTML');
                  if (!tgRes.success && !tgRes.skipped && tgRes.error) {
                    errors.push(`Team telegram birthday error for ${staff.id}: ${tgRes.error}`);
                  }
                } catch (tgErr: any) {
                  errors.push(`Team telegram birthday exception for ${staff.id}: ${tgErr?.message}`);
                }
              }

              await supabaseAdmin
                .from('admin_users')
                .update({ last_birthday_greeted_year: currentYear })
                .eq('id', staff.id);

              staffBirthdaysGreeted++;
            }
          }
        }
      }
    } catch (stBdayEx: any) {
      console.error('[Cron] Exception in staff birthday automation:', stBdayEx);
      errors.push(`Staff birthday automation error: ${stBdayEx?.message}`);
    }

    return NextResponse.json({
      success: true,
      processedAt: new Date().toISOString(),
      stagesCount: stages.length,
      recipientsCount: recipientGroups.size,
      emailsSent,
      telegramsSent,
      clientBirthdaysGreeted,
      clientAnniversariesGreeted,
      staffBirthdaysGreeted,
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

/**
 * Builds an elegant Persian HTML email template for client birthday greetings.
 * Clean DORVIA brand styling, strictly no case details mentioned.
 */
function buildClientBirthdayEmailHtml(params: {
  clientName: string;
  appBaseUrl: string;
}): string {
  const { clientName, appBaseUrl } = params;

  return `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>زادروزتان فرخنده باد</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:Tahoma,Arial,sans-serif;direction:rtl;text-align:right;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f8fafc;padding:30px 10px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">
          <!-- Header Banner -->
          <tr>
            <td style="background:linear-gradient(135deg, #071B3D 0%, #1e3a8a 100%);padding:36px 30px;text-align:center;">
              <div style="font-size:36px;margin-bottom:12px;">🎉🎂</div>
              <h1 style="color:#ffffff;font-size:24px;margin:0 0 8px 0;font-weight:bold;">زادروزتان فرخنده و همایون باد</h1>
              <p style="color:#93c5fd;font-size:14px;margin:0;font-weight:normal;">گروه خدمات مهاجرتی و سرمایه‌گذاری دورویا (DORVIA)</p>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding:36px 30px;color:#334155;line-height:1.8;font-size:15px;">
              <p style="font-size:16px;font-weight:bold;color:#0f172a;margin-top:0;">
                جناب آقای / سرکار خانم ${escapeHtml(clientName)} گرامی،
              </p>
              <p style="margin:16px 0;color:#475569;">
                فرارسیدن سالروز تولدتان را از صمیم قلب شادباش و تبریک می‌گوییم.
              </p>
              <p style="margin:16px 0;color:#475569;">
                آرزومندیم سال پیش‌رو برای شما آکنده از سلامتی پایدار، روزهای درخشان، آرامش خاطر و دستیابی به والاترین آرزوها و اهداف فردی و حرفه‌ای باشد.
              </p>
              <div style="background-color:#eff6ff;border-right:4px solid #2563eb;padding:16px 20px;border-radius:8px;margin:24px 0;">
                <p style="margin:0;color:#1e40af;font-size:14px;font-style:italic;">
                  «هر آغاز تازه، نویدبخش افق‌هایی روشن‌تر و فرصت‌هایی بی‌کران است.»
                </p>
              </div>
              <p style="margin:24px 0 0 0;color:#64748b;font-size:14px;">
                با کمال احترام و بهترین درودها،<br>
                <strong style="color:#071B3D;">خانواده دورویا (DORVIA)</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f1f5f9;padding:20px 30px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#64748b;">
                بخارست، رومانی | وب‌سایت: <a href="${appBaseUrl}" style="color:#2563eb;text-decoration:none;">dorvia.ro</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Builds an elegant Persian HTML email template for client collaboration anniversary greetings.
 * Clean DORVIA brand styling, celebration of trust and partnership.
 */
function buildClientAnniversaryEmailHtml(params: {
  clientName: string;
  appBaseUrl: string;
}): string {
  const { clientName, appBaseUrl } = params;

  return `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>سالگرد آغاز همکاری‌مان گرامی باد</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:Tahoma,Arial,sans-serif;direction:rtl;text-align:right;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f8fafc;padding:30px 10px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">
          <!-- Header Banner -->
          <tr>
            <td style="background:linear-gradient(135deg, #071B3D 0%, #047857 100%);padding:36px 30px;text-align:center;">
              <div style="font-size:36px;margin-bottom:12px;">💐✨</div>
              <h1 style="color:#ffffff;font-size:24px;margin:0 0 8px 0;font-weight:bold;">سالگرد آغاز همراهی و همکاری‌مان گرامی باد</h1>
              <p style="color:#a7f3d0;font-size:14px;margin:0;font-weight:normal;">گروه دورویا (DORVIA) — همراه مطمئن شما در رومانی</p>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding:36px 30px;color:#334155;line-height:1.8;font-size:15px;">
              <p style="font-size:16px;font-weight:bold;color:#0f172a;margin-top:0;">
                همراه گرامی، جناب آقای / سرکار خانم ${escapeHtml(clientName)}،
              </p>
              <p style="margin:16px 0;color:#475569;">
                امروز، سالروز پیوند اعتماد و آغاز مسیر مشترک همراهی شما با مجموعهٔ دورویا است.
              </p>
              <p style="margin:16px 0;color:#475569;">
                حضور ارزشمند و اعتمادی که در این مسیر به ما سپردید، گرانبهاترین سرمایهٔ ماست. از همراهی مستمر و دلگرم‌کنندهٔ شما بی‌نهایت سپاسگزاریم و افتخار می‌کنیم که در گام‌های مهم زندگی و پیشرفت شما در کنارتان هستیم.
              </p>
              <div style="background-color:#ecfdf5;border-right:4px solid #059669;padding:16px 20px;border-radius:8px;margin:24px 0;">
                <p style="margin:0;color:#065f46;font-size:14px;font-weight:bold;">
                  «تعهد ما، پشتیبانی استوار و ارائه بالاترین استانداردهای همراهی با شماست.»
                </p>
              </div>
              <p style="margin:24px 0 0 0;color:#64748b;font-size:14px;">
                با صمیمانه‌ترین سپاس‌ها و احترام،<br>
                <strong style="color:#071B3D;">تیم و خانواده دورویا (DORVIA)</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f1f5f9;padding:20px 30px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#64748b;">
                بخارست، رومانی | وب‌سایت: <a href="${appBaseUrl}" style="color:#059669;text-decoration:none;">dorvia.ro</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

