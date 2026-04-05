import { supabase } from './src/lib/supabase';

async function check() {
  const { data, error } = await supabase.from('StudentProfile').select('branch').limit(5);
  console.log('Real Branches in DB:', data?.map(d => d.branch));
  if (error) console.error('Error:', error);
}

check();
