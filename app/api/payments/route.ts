import { NextResponse } from "next/server"
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase"
import { mockPayments } from "@/lib/mock-data"

export async function GET() {
  try {
    // If Supabase is not configured, return mock data
    if (!isSupabaseConfigured()) {
      return NextResponse.json(mockPayments)
    }

    const supabase = createServerClient()

    const { data: payments, error } = await supabase
      .from("rent_payments")
      .select(`
        *,
        lease:leases(
          *,
          flat:flats(flat_number),
          tenant:tenants(full_name)
        )
      `)
      .order("due_date", { ascending: false })

    if (error) throw error

    return NextResponse.json(payments)
  } catch (error) {
    console.error("Error fetching payments:", error)
    // Return mock data as fallback
    return NextResponse.json(mockPayments)
  }
}

export async function PATCH(request: Request) {
  try {
    // If Supabase is not configured, return success for demo
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true, message: "Payment updated (demo mode)" })
    }

    const { id, status, payment_date } = await request.json()
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("rent_payments")
      .update({
        status,
        payment_date: status === "paid" ? payment_date || new Date().toISOString() : null,
      })
      .eq("id", id)
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error updating payment:", error)
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 })
  }
}
