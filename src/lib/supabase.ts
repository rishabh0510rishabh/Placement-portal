import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials missing in .env.local')
}

// Fixed-base HTTPS Client (Bypasses Port 5432 / 6543 blocks)
export const supabase = createClient(supabaseUrl, supabaseKey)
