import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nqdhgkycozipmwrtvkga.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xZGhna3ljb3ppcG13cnR2a2dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwODU2ODksImV4cCI6MjEwNDY2MTY4OX0.W1OyJYJXteJQDFcRe4_IK98RiU5vu89gocYKcTmTmzc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
