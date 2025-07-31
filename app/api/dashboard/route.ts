import { NextResponse } from "next/server"
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase"
import { mockDashboardStats } from "@/lib/mock-data"

export async function GET() {
  try {
    // If Supabase is not configured, return mock data
    if (!isSupabaseConfigured()) {
      return NextResponse.json(mockDashboardStats)
    }

    const supabase = createServerClient()

    // Get flat statistics
    const { data: flats, error: flatsError } = await supabase.from("flats").select("status")

    if (flatsError) throw flatsError

    // Get payment statistics
    const { data: payments, error: paymentsError } = await supabase
      .from("rent_payments")
      .select("status, amount")
      .gte("due_date", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

    if (paymentsError) throw paymentsError

    // Calculate statistics
    const totalFlats = flats.length
    const occupiedFlats = flats.filter((f) => f.status === "occupied").length
    const vacantFlats = flats.filter((f) => f.status === "vacant").length
    const maintenanceFlats = flats.filter((f) => f.status === "maintenance").length

    const pendingPayments = payments.filter((p) => p.status === "pending").length
    const overduePayments = payments.filter((p) => p.status === "overdue").length
    const totalRentCollected = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)
    const totalRentPending = payments
      .filter((p) => p.status === "pending" || p.status === "overdue")
      .reduce((sum, p) => sum + p.amount, 0)

    const stats = {
      totalFlats,
      occupiedFlats,
      vacantFlats,
      maintenanceFlats,
      pendingPayments,
      overduePayments,
      totalRentCollected,
      totalRentPending,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    // Return mock data as fallback
    return NextResponse.json(mockDashboardStats)
  }
}
