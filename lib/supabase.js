import { createBrowserClient } from '@supabase/ssr'

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return null
  return { url, anonKey }
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseConfig())
}

/** Returns a browser Supabase client, or null if env vars are missing. */
export function createClient() {
  const config = getSupabaseConfig()
  if (!config) return null
  return createBrowserClient(config.url, config.anonKey)
}

let _client
export function getSupabase() {
  if (_client) return _client
  _client = createClient()
  return _client
}
