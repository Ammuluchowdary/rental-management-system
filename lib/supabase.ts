import { createClient } from "@supabase/supabase-js"

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  // More strict checking - must have real values, not placeholders
  return (
    url &&
    key &&
    url !== "https://placeholder.supabase.co" &&
    key !== "placeholder-key" &&
    url.includes("supabase.co") && // Must be a real Supabase URL
    key.length > 20 // Real keys are much longer than placeholder
  )
}

// Fallback values for preview/development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with error handling
export const createServerClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

  return createClient(url, key)
}

// Test database connection
export const testDatabaseConnection = async () => {
  if (!isSupabaseConfigured()) {
    return false
  }

  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.from("flats").select("id").limit(1)
    return !error
  } catch (error) {
    return false
  }
}
