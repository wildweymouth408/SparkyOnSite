const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local if exists
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables.');
  console.error('Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ensureIndexes() {
  console.log('Checking conversations table indexes...');

  // Create index on user_id for faster filtering
  const { error: idx1 } = await supabase.rpc('create_index_if_not_exists', {
    table_name: 'conversations',
    column_name: 'user_id',
    index_name: 'conversations_user_id_idx'
  });
  if (error) {
    // If RPC not available, try raw SQL (requires supabase admin)
    console.log('RPC not available, trying raw SQL...');
    // We'll need to execute SQL via supabase.sql – but requires admin role
    // For now, just log that index creation skipped.
    console.warn('Index creation skipped. Please manually create index on conversations(user_id).');
  } else {
    console.log('Index on user_id ensured.');
  }

  // Create index on created_at for ordering
  const { error: idx2 } = await supabase.rpc('create_index_if_not_exists', {
    table_name: 'conversations',
    column_name: 'created_at',
    index_name: 'conversations_created_at_idx'
  });
  if (error) {
    console.warn('Index on created_at skipped.');
  } else {
    console.log('Index on created_at ensured.');
  }

  // Composite index for user_id + created_at (common query)
  const { error: idx3 } = await supabase.rpc('create_index_if_not_exists', {
    table_name: 'conversations',
    column_name: 'user_id,created_at',
    index_name: 'conversations_user_id_created_at_idx'
  });
  if (error) {
    console.warn('Composite index skipped.');
  } else {
    console.log('Composite index on (user_id, created_at) ensured.');
  }

  console.log('Done.');
}

ensureIndexes().catch(err => {
  console.error(err);
  process.exit(1);
});