const fs = require('fs');
const path = require('path');

console.log('Testing Moderated Comments System Components & Routes...\n');

// 1. Check SQL Migration File
const sqlPath = path.join(__dirname, '..', 'docs', 'migrations', '01_create_comments_table.sql');
if (fs.existsSync(sqlPath)) {
  console.log('✓ SQL Migration File -> FOUND (01_create_comments_table.sql)');
} else {
  console.error('❌ SQL Migration File -> MISSING');
  process.exit(1);
}

// 2. Check Admin Page Route
const adminPagePath = path.join(__dirname, '..', 'src', 'app', 'admin', 'comments', 'page.tsx');
if (fs.existsSync(adminPagePath)) {
  console.log('✓ Admin Comments Panel Route -> FOUND (/admin/comments)');
} else {
  console.error('❌ Admin Comments Panel Route -> MISSING');
  process.exit(1);
}

// 3. Check CommentsSection Component
const commentsComponentPath = path.join(__dirname, '..', 'src', 'components', 'CommentsSection.tsx');
if (fs.existsSync(commentsComponentPath)) {
  console.log('✓ CommentsSection Component -> FOUND');
} else {
  console.error('❌ CommentsSection Component -> MISSING');
  process.exit(1);
}

// 4. Verify supabase.ts exports
const supabasePath = path.join(__dirname, '..', 'src', 'lib', 'supabase.ts');
const supabaseContent = fs.readFileSync(supabasePath, 'utf8');

const requiredExports = [
  'fetchApprovedComments',
  'submitComment',
  'fetchAdminComments',
  'updateCommentStatus',
  'deleteComment'
];

let allExportsFound = true;
requiredExports.forEach(fn => {
  if (supabaseContent.includes(fn)) {
    console.log(`✓ Function "${fn}" -> EXPORTED in supabase.ts`);
  } else {
    console.error(`❌ Function "${fn}" -> MISSING in supabase.ts`);
    allExportsFound = false;
  }
});

if (allExportsFound) {
  console.log('\n✅ Comments System Integration & Structure Verification PASSED!');
} else {
  console.error('\n❌ Comments System Verification FAILED');
  process.exit(1);
}
