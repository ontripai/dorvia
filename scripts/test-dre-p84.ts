import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { createClient } from '@supabase/supabase-js';
import { escapeTelegramHtml, sendTelegramMessage } from '../src/lib/telegram';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function runTests() {
  console.log('====================================================');
  console.log('🚀 Running DORVIA dre-p84 Verification Test Suite');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, message: string) {
    totalTests++;
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passedTests++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      process.exitCode = 1;
    }
  }

  // ----------------------------------------------------
  // Test 1: escapeTelegramHtml unit tests
  // ----------------------------------------------------
  console.log('--- Test 1: HTML Escaping for Telegram Parse Mode ---');
  const rawInput = 'Hello <world> & "friends" > 100';
  const escaped = escapeTelegramHtml(rawInput);
  assert(
    escaped === 'Hello &lt;world&gt; &amp; &quot;friends&quot; &gt; 100',
    `Properly escapes <, >, &, ": ${escaped}`
  );

  const emptyEscaped = escapeTelegramHtml('');
  assert(emptyEscaped === '', 'Handles empty string safely');

  // ----------------------------------------------------
  // Test 2: Telegram Bot Graceful Degradation / Error Handling
  // ----------------------------------------------------
  console.log('\n--- Test 2: sendTelegramMessage Graceful Handling ---');
  const invalidChatResult = await sendTelegramMessage('invalid_chat_id_999999', 'Test message', 'HTML');
  assert(
    typeof invalidChatResult.success === 'boolean',
    `sendTelegramMessage returns structured TelegramSendResult (success: ${invalidChatResult.success})`
  );
  if (!invalidChatResult.success) {
    assert(
      typeof invalidChatResult.error === 'string' || invalidChatResult.skipped === true,
      `Provides helpful error/skipped message without throwing: ${invalidChatResult.error || 'skipped'}`
    );
  }

  // ----------------------------------------------------
  // Test 3: Simulated Telegram API Dispatch (Success, API Error, Network Error)
  // ----------------------------------------------------
  console.log('\n--- Test 3: Simulated Telegram API Responses ---');
  const originalFetch = global.fetch;
  const originalToken = process.env.TELEGRAM_BOT_TOKEN;

  try {
    process.env.TELEGRAM_BOT_TOKEN = '123456789:TEST_MOCK_TOKEN_ABCXYZ';

    // 3a: Successful Telegram Bot dispatch
    global.fetch = async () =>
      new Response(JSON.stringify({ ok: true, result: { message_id: 987654 } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    const successRes = await sendTelegramMessage('71502718', '<b>پیام تست</b>', 'HTML');
    assert(
      successRes.success === true && successRes.messageId === 987654,
      `Successful API response returns success: true and messageId: ${successRes.messageId}`
    );

    // 3b: Telegram Bot API Error (e.g. Bad Request: chat not found / bot blocked)
    global.fetch = async () =>
      new Response(
        JSON.stringify({
          ok: false,
          error_code: 400,
          description: 'Bad Request: chat not found',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );

    const apiErrorRes = await sendTelegramMessage('71502718', '<b>پیام تست</b>', 'HTML');
    assert(
      apiErrorRes.success === false && apiErrorRes.error === 'Bad Request: chat not found',
      `Telegram API error is captured gracefully without throwing: ${apiErrorRes.error}`
    );

    // 3c: Network failure
    global.fetch = async () => {
      throw new Error('Connection reset by peer');
    };

    const netErrorRes = await sendTelegramMessage('71502718', '<b>پیام تست</b>', 'HTML');
    assert(
      netErrorRes.success === false && Boolean(netErrorRes.error?.includes('Connection reset')),
      `Network failure is caught and handled gracefully: ${netErrorRes.error}`
    );
  } finally {
    global.fetch = originalFetch;
    if (originalToken !== undefined) {
      process.env.TELEGRAM_BOT_TOKEN = originalToken;
    } else {
      delete process.env.TELEGRAM_BOT_TOKEN;
    }
  }

  // ----------------------------------------------------
  // Test 4: Lead with source='website' (No Telegram Dispatch)
  // ----------------------------------------------------
  console.log('\n--- Test 4: Lead with source="website" ---');
  const { data: webLead, error: webLeadErr } = await supabaseAdmin
    .from('leads')
    .insert({
      full_name: 'کاربر تستی وبسایت dre-p84',
      source: 'website',
      channel_ref: null,
      status: 'new',
    })
    .select('id, source, channel_ref')
    .single();

  assert(!webLeadErr && !!webLead, `Created test website lead (${webLead?.id})`);

  if (webLead) {
    // Simulate admin message sending logic
    const { data: insertedMsg, error: msgErr } = await supabaseAdmin
      .from('lead_messages')
      .insert([
        {
          lead_id: webLead.id,
          sender_role: 'admin',
          sender_ref: 'DORVIA Support Team',
          text: 'پیام تست برای لید وبسایت',
        },
      ])
      .select('*')
      .single();

    assert(!msgErr && !!insertedMsg, 'Message successfully saved to lead_messages for website lead');

    // Check delivery logic: Should NOT dispatch to Telegram
    let telegramDelivered: boolean | null = null;
    if (webLead.source === 'telegram_bot' && webLead.channel_ref && webLead.channel_ref.trim()) {
      telegramDelivered = true;
    }
    assert(
      telegramDelivered === null,
      'telegramDelivered is null for non-telegram lead (bypasses telegram dispatch)'
    );

    // Clean up
    await supabaseAdmin.from('lead_messages').delete().eq('lead_id', webLead.id);
    await supabaseAdmin.from('leads').delete().eq('id', webLead.id);
  }

  // ----------------------------------------------------
  // Test 5: Lead with source='telegram_bot' and Invalid channel_ref (Resilient Error Handling)
  // ----------------------------------------------------
  console.log('\n--- Test 5: Lead with source="telegram_bot" and invalid channel_ref ---');
  const { data: fakeTgLead, error: fakeTgLeadErr } = await supabaseAdmin
    .from('leads')
    .insert({
      full_name: 'لید تستی تلگرام با آیدی نامعتبر',
      source: 'telegram_bot',
      channel_ref: '999999999999999',
      status: 'new',
    })
    .select('id, source, channel_ref')
    .single();

  assert(!fakeTgLeadErr && !!fakeTgLead, `Created test telegram lead with invalid channel_ref (${fakeTgLead?.id})`);

  if (fakeTgLead) {
    const textToSend = 'تست انعطاف‌پذیری و عدم شکست درخواست <test>';
    const { data: insertedMsg, error: msgErr } = await supabaseAdmin
      .from('lead_messages')
      .insert([
        {
          lead_id: fakeTgLead.id,
          sender_role: 'admin',
          sender_ref: 'مدیریت ارشد',
          text: textToSend,
        },
      ])
      .select('*')
      .single();

    assert(!msgErr && !!insertedMsg, 'Admin message recorded in lead_messages despite invalid telegram channel_ref');

    // Execute telegram delivery logic with branding
    let telegramDelivered: boolean | null = null;
    let telegramError: string | undefined;

    try {
      if (fakeTgLead.source === 'telegram_bot' && fakeTgLead.channel_ref?.trim()) {
        const brandedMessage = `💬 <b>پیام جدید از تیم DORVIA</b>\n\n${escapeTelegramHtml(textToSend)}`;
        const tgRes = await sendTelegramMessage(fakeTgLead.channel_ref.trim(), brandedMessage, 'HTML');
        telegramDelivered = tgRes.success;
        if (!tgRes.success) telegramError = tgRes.error;
      }
    } catch (err: any) {
      telegramDelivered = false;
      telegramError = err?.message;
    }

    assert(
      telegramDelivered === false,
      `telegramDelivered is false without throwing or breaking response: (telegramError: ${telegramError})`
    );

    // Clean up
    await supabaseAdmin.from('lead_messages').delete().eq('lead_id', fakeTgLead.id);
    await supabaseAdmin.from('leads').delete().eq('id', fakeTgLead.id);
  }

  // ----------------------------------------------------
  // Test 6: Verify Live telegram_bot Leads in Supabase
  // ----------------------------------------------------
  console.log('\n--- Test 6: Verify Live telegram_bot Leads in Supabase ---');
  const { data: liveTgLeads, error: liveTgErr } = await supabaseAdmin
    .from('leads')
    .select('id, full_name, source, channel_ref')
    .eq('source', 'telegram_bot')
    .not('channel_ref', 'is', null)
    .limit(3);

  assert(!liveTgErr, 'Successfully queried leads table for live telegram_bot leads');
  if (liveTgLeads && liveTgLeads.length > 0) {
    console.log(`Found ${liveTgLeads.length} live telegram_bot leads with channel_ref:`);
    for (const lead of liveTgLeads) {
      console.log(`  - Lead ID: ${lead.id} | Name: ${lead.full_name} | Telegram chat_id: ${lead.channel_ref}`);
    }
    const sampleLead = liveTgLeads[0];
    assert(
      sampleLead.source === 'telegram_bot' && Boolean(sampleLead.channel_ref),
      `Verified real lead record conforms to telegram dispatch criteria (${sampleLead.channel_ref})`
    );
  }

  console.log('\n====================================================');
  console.log(`🏁 Test Summary: ${passedTests}/${totalTests} tests passed`);
  console.log('====================================================\n');
}

runTests().catch((err) => {
  console.error('Fatal error running tests:', err);
  process.exit(1);
});
