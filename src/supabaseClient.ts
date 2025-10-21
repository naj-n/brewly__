import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jnkcyebdrxjqkjulbnow.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impua2N5ZWJkcnhqcWtqdWxibm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTg3MzYsImV4cCI6MjA3NjE5NDczNn0.f22KSB668RUvHjj8_l_zA3zRBekV_Yhg7p8JvpP3H4I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
