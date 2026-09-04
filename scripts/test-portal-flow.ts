import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(url, key);

async function runManualTest() {
  console.log('=== DORVIA Lead Portal Phase 2 End-to-End Test ===');

  const testEmail = 'lead.test.phase2@dorvia.com';

  const { data: allExisting } = await supabaseAdmin.from('leads').select('id, email, full_name, user_id, invited_at, source').limit(5);
  console.log('Current existing leads in DB:', allExisting);

  // 1. Pick one of the 4 existing leads in DB and set test email + invited_at
  const targetLeadId = allExisting?.[0]?.id;
  if (!targetLeadId) {
    console.error('No existing leads found in DB');
    return;
  }

  console.log(`Updating existing lead ${targetLeadId} with email: ${testEmail} and invited_at`);
  const { data: updatedInitialLead, error: updateErr } = await supabaseAdmin
    .from('leads')
    .update({
      email: testEmail,
      invited_at: new Date().toISOString(),
      raw_meta: {
        profileScore: 88,
        leadTemperature: 'hot',
        primaryRoute: 'study',
        secondaryRoute: 'work',
      },
    })
    .eq('id', targetLeadId)
    .select('*')
    .single();

  if (updateErr) {
    console.error('Error updating existing lead:', updateErr);
    return;
  }

  const leadId = updatedInitialLead.id;
  console.log('✅ Existing lead updated with ID:', leadId, 'and invited_at set.');

  // 2. Generate magic link using supabaseAdmin.auth.admin
  console.log('\nGenerating invitation magic link for:', testEmail);
  const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: testEmail,
    options: {
      redirectTo: 'http://localhost:3000/fa/portal/callback',
    },
  });

  if (linkErr || !linkData?.properties?.action_link) {
    console.error('❌ Failed to generate magic link:', linkErr);
    return;
  }

  const actionLink = linkData.properties.action_link;
  console.log('✅ Magic Link successfully generated:');
  console.log(actionLink);

  // 3. Verify user was created in auth.users
  const authUserId = linkData.user?.id;
  console.log('\nAuth User ID:', authUserId);

  // 4. Simulate what /portal/callback does:
  // Link leads.user_id = auth.users.id
  console.log('\nSimulating /portal/callback database linkage...');
  const { data: updatedLead, error: linkLeadErr } = await supabaseAdmin
    .from('leads')
    .update({ user_id: authUserId })
    .eq('id', leadId)
    .select('id, full_name, email, user_id, invited_at')
    .single();

  if (linkLeadErr) {
    console.error('❌ Failed to link lead with user_id:', linkLeadErr);
    return;
  }
  console.log('✅ Successfully linked lead to user_id:');
  console.log(updatedLead);

  // 5. Simulate sending a message via lead_messages (like POST /api/portal/messages)
  console.log('\nSimulating user sending message via lead_messages...');
  const { data: msg, error: msgErr } = await supabaseAdmin
    .from('lead_messages')
    .insert([
      {
        lead_id: leadId,
        sender_role: 'user',
        sender_ref: testEmail,
        text: 'درود، مدارک تحصیلی من آماده است. چه زمانی برای ارسال ترجمه‌ها مناسب است؟',
      },
    ])
    .select('*')
    .single();

  if (msgErr) {
    console.error('❌ Error sending message:', msgErr);
    return;
  }
  console.log('✅ Message successfully inserted:');
  console.log(msg);

  // 6. Simulate DORVIA team replying to the user
  console.log('\nSimulating DORVIA team reply...');
  const { data: reply, error: replyErr } = await supabaseAdmin
    .from('lead_messages')
    .insert([
      {
        lead_id: leadId,
        sender_role: 'admin',
        sender_ref: 'DORVIA Support Team',
        text: 'درود بر شما، لطفاً مدارک را تا پایان هفته ارسال فرمایید تا جهت اخذ پذیرش دانشگاه بررسی شود.',
      },
    ])
    .select('*')
    .single();

  if (replyErr) {
    console.error('❌ Error inserting team reply:', replyErr);
    return;
  }
  console.log('✅ Team reply successfully inserted:');
  console.log(reply);

  // 7. Verify all messages for this lead
  const { data: allMsgs } = await supabaseAdmin
    .from('lead_messages')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: true });

  console.log('\n✅ Total messages in thread:', allMsgs?.length);
  for (const m of allMsgs || []) {
    console.log(`[${m.sender_role.toUpperCase()}] ${m.text}`);
  }

  console.log('\n=== All Phase 2 End-to-End Tests Passed! ===');
}

runManualTest();
