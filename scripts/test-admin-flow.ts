import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testAdminFlow() {
  console.log('=== DORVIA Phase 4 Admin Panel Flow Verification ===\n');

  const testAdminEmail = 'admin.test.phase4@dorvia.com';

  // 1. Resolve 'owner' role
  const { data: ownerRole, error: roleErr } = await supabaseAdmin
    .from('roles')
    .select('id, key')
    .eq('key', 'owner')
    .single();

  if (roleErr || !ownerRole) {
    console.error('❌ Could not find owner role:', roleErr);
    return;
  }
  console.log('✅ Owner role resolved:', ownerRole.id);

  // 2. Ensure test admin exists in auth.users
  let adminAuthId: string | null = null;
  const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
  const existing = listData?.users?.find((u) => u.email?.toLowerCase() === testAdminEmail);

  if (existing) {
    adminAuthId = existing.id;
    console.log('✅ Existing auth user found for admin:', adminAuthId);
  } else {
    const { data: createdUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: testAdminEmail,
      email_confirm: true,
      user_metadata: { full_name: 'تست ادمین ارشد' },
    });
    if (createErr || !createdUser.user) {
      console.error('❌ Error creating test admin auth user:', createErr);
      return;
    }
    adminAuthId = createdUser.user.id;
    console.log('✅ Created new test admin auth user:', adminAuthId);
  }

  // 3. Upsert admin_users record for test admin
  const { data: adminRecord, error: adminErr } = await supabaseAdmin
    .from('admin_users')
    .upsert({
      id: adminAuthId,
      role_id: ownerRole.id,
      full_name: 'مدیر تستی سیستم DORVIA',
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    .select('id, full_name, role_id, is_active')
    .single();

  if (adminErr) {
    console.error('❌ Error linking admin_users:', adminErr);
    return;
  }
  console.log('✅ admin_users record active:', adminRecord);

  // 4. Verify permission aggregation for owner
  const { data: rolePerms } = await supabaseAdmin
    .from('role_permissions')
    .select('permission_id, permissions(key)')
    .eq('role_id', ownerRole.id);

  const permissions = new Set(rolePerms?.map((rp: any) => rp.permissions?.key).filter(Boolean));
  console.log('\n✅ Compiled Owner Permissions count:', permissions.size);
  console.log('Permissions list:', Array.from(permissions).join(', '));

  const requiredChecks = ['leads.view', 'leads.verify', 'leads.invite', 'messages.send', 'messages.view'];
  for (const perm of requiredChecks) {
    if (!permissions.has(perm)) {
      console.error(`❌ Missing expected permission: ${perm}`);
      return;
    }
  }
  console.log('✅ All core lead permissions present for Owner.');

  // 5. Test permission gating: verify 'agent' role has verify but NOT invite
  const { data: agentRole } = await supabaseAdmin
    .from('roles')
    .select('id, key')
    .eq('key', 'agent')
    .single();

  if (agentRole) {
    const { data: agentPerms } = await supabaseAdmin
      .from('role_permissions')
      .select('permissions(key)')
      .eq('role_id', agentRole.id);

    const agentPermSet = new Set(agentPerms?.map((ap: any) => ap.permissions?.key));
    console.log('\n🔍 Testing Role Gating for "agent":');
    console.log('Agent has leads.verify:', agentPermSet.has('leads.verify'));
    console.log('Agent has leads.invite:', agentPermSet.has('leads.invite'));
    if (agentPermSet.has('leads.verify') && !agentPermSet.has('leads.invite')) {
      console.log('✅ Role gating confirmed: Agents can verify, but CANNOT send portal invites!');
    }
  }

  // 6. Find a test lead to verify & invite
  const { data: leads } = await supabaseAdmin
    .from('leads')
    .select('*')
    .not('email', 'is', null)
    .limit(1);

  const testLead = leads?.[0];
  if (!testLead) {
    console.error('❌ No test lead found with email.');
    return;
  }

  console.log(`\nTesting Lead Gating with lead: ${testLead.id} (${testLead.email})`);

  // 7. Perform verification
  const verifyTimestamp = new Date().toISOString();
  const { data: verifiedLead, error: verifyErr } = await supabaseAdmin
    .from('leads')
    .update({
      verified_at: verifyTimestamp,
      verified_by: adminAuthId,
    })
    .eq('id', testLead.id)
    .select('id, full_name, email, verified_at, verified_by')
    .single();

  if (verifyErr) {
    console.error('❌ Failed to verify lead:', verifyErr);
    return;
  }
  console.log('✅ Step 1: Lead successfully verified:');
  console.log(verifiedLead);

  // 8. Perform portal invite
  const inviteTimestamp = new Date().toISOString();
  const { data: invitedLead, error: inviteErr } = await supabaseAdmin
    .from('leads')
    .update({
      invited_at: inviteTimestamp,
      invited_by: adminAuthId,
    })
    .eq('id', testLead.id)
    .select('id, full_name, email, verified_at, invited_at, invited_by')
    .single();

  if (inviteErr) {
    console.error('❌ Failed to invite lead:', inviteErr);
    return;
  }
  console.log('\n✅ Step 2: Lead portal invitation recorded:');
  console.log(invitedLead);

  // 9. Send admin message
  const { data: msg, error: msgErr } = await supabaseAdmin
    .from('lead_messages')
    .insert([
      {
        lead_id: testLead.id,
        sender_role: 'admin',
        sender_ref: 'مدیر سیستم DORVIA',
        text: 'پیام تست تاییدیه ادمین: مدارک شما تایید شد و دعوت‌نامه پورتال با موفقیت ارسال گردید.',
      },
    ])
    .select('*')
    .single();

  if (msgErr) {
    console.error('❌ Error sending admin message:', msgErr);
    return;
  }
  console.log('\n✅ Step 3: Admin message successfully dispatched:');
  console.log(msg);

  console.log('\n=== All Phase 4 Admin Flow Tests Passed! ===');
}

testAdminFlow();
