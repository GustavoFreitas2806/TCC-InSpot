import { createClient } from '@supabase/supabase-js';

// Use exatamente esses nomes. O TypeScript vai buscar os valores no arquivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltam as variáveis de ambiente do Supabase!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);