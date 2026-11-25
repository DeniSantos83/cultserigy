import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
export const base = import.meta.env.BASE_URL;
export const redirect = path => new URL(base + path, location.origin).href;
