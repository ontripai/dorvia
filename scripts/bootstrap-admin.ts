import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function bootstrapOwner() {
  const email = process.argv[2]?.trim().toLowerCase();
  const fullName = process.argv[3]?.trim() || 'DORVIA Owner';

  if (!email || !email.includes('@')) {
    console.error('❌ Usage: npx tsx scripts/bootstrap-admin.ts <owner-email> [fullName]');
    process.exit(1);
  }

  console.log(`=== DORVIA Admin Bootstrap: Registering Owner [${email}] ===`);

  // 1. Resolve 'owner' role from public.roles
  const { data: ownerRole, error: roleError } = await supabaseAdmin
    .from('roles')
    .select('id, key, label_fa')
    .eq('key', 'owner')
    .maybeSingle();

  if (roleError || !ownerRole) {
    console.error('❌ Could not find "owner" role in public.roles:', roleError);
    process.exit(1);
  }

  console.log(`✅ Found role: [${ownerRole.key}] (${ownerRole.id})`);

  // 2. Create or invite user in auth.users
  let authUserId: string | null = null;

  const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || 'https://dorvia.ro';
  console.log(`Attempting to invite/register auth user for: ${email}...`);
  const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
    email,
    {
      redirectTo: `${siteOrigin}/fa/admin/callback`,
    }
  );

  if (!inviteError && inviteData?.user) {
    authUserId = inviteData.user.id;
    console.log(`✅ Auth user invited with ID: ${authUserId}`);
  } else {
    console.log(`Note from invite: ${inviteError?.message || 'None'}`);
    // If user already exists in auth, retrieve their ID
    const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
    const existing = listData?.users?.find((u) => u.email?.toLowerCase() === email);
    if (existing) {
      authUserId = existing.id;
      console.log(`✅ User already exists in auth. Found user ID: ${authUserId}`);
    } else {
      console.error('❌ Failed to locate or create auth user.');
      process.exit(1);
    }
  }

  // 3. Upsert admin_users record
  console.log(`Linking user [${authUserId}] into public.admin_users with role: owner...`);
  const { data: adminRecord, error: adminErr } = await supabaseAdmin
    .from('admin_users')
    .upsert(
      {
        id: authUserId,
        role_id: ownerRole.id,
        full_name: fullName,
        is_active: true,
        permission_overrides: {},
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )
    .select('*')
    .single();

  if (adminErr) {
    console.error('❌ Failed to create/update admin_users record:', adminErr);
    process.exit(1);
  }

  console.log('\n🎉 SUCCESS! Admin user successfully bootstrapped as Owner:');
  console.log({
    id: adminRecord.id,
    full_name: adminRecord.full_name,
    role: ownerRole.key,
    is_active: adminRecord.is_active,
  });
  console.log('\nYou can now log in at /[lang]/admin/login with this email.');
}

bootstrapOwner();
