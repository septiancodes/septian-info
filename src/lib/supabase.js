import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://enazqqacrtcpzspupldy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_mi5EqdlP4Hv-Oah8Uoyu1w_o8YehaiI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
