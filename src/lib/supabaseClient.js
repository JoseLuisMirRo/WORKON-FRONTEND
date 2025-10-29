import { createClient } from '@supabase/supabase-js'

// Obtener las variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Validar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Faltan las variables de entorno de Supabase')
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Configurada ✓' : 'NO configurada ✗')
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Configurada ✓' : 'NO configurada ✗')
  console.error('Por favor configura estas variables en Vercel (Settings → Environment Variables)')
}

// Crear y exportar el cliente de Supabase
// Usar valores por defecto si no están configuradas (para evitar errores en build)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

