import { NextResponse } from "next/server"
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase"
import { mockFlats } from "@/lib/mock-data"

export async function GET() {
  try {
    // If Supabase is not configured, return mock data
    if (!isSupabaseConfigured()) {
      return NextResponse.json(mockFlats)
    }

    const supabase = createServerClient()

    const { data: flats, error } = await supabase
      .from("flats")
      .select(`
        *,
        current_lease:leases!inner(
          *,
          tenant:tenants(full_name)
        )
      `)
      .eq("leases.status", "active")
      .order("flat_number")

    if (error) throw error

    // Also get flats without active leases
    const { data: allFlats, error: allFlatsError } = await supabase.from("flats").select("*").order("flat_number")

    if (allFlatsError) throw allFlatsError

    // Merge the data
    const flatsWithLeases = allFlats.map((flat) => {
      const flatWithLease = flats.find((f) => f.id === flat.id)
      return flatWithLease || flat
    })

    return NextResponse.json(flatsWithLeases)
  } catch (error) {
    console.error("Error fetching flats:", error)
    // Return mock data as fallback
    return NextResponse.json(mockFlats)
  }
}
