import { createClient } from '@supabase/supabase-js'

// This is the anon public key, safe to ship in client code by design —
// access is governed by the table's Row Level Security policies, not by
// keeping this key secret. It reuses the BunnyFocus Supabase project's
// free-tier slot, in a separate `apps` table.
const SUPABASE_URL = 'https://xqjtyjhtbjtaxbzsbigu.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxanR5amh0Ymp0YXhienNiaWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTEyMTEsImV4cCI6MjA5NzQ2NzIxMX0.W7wcPVjiSFIwQcJh35MRuzuH0P6O4_VUdW_SFLMH_IM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
