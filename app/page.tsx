import { Suspense } from "react"
import DashboardStats from "@/components/DashboardStats"
import FlatGrid from "@/components/FlatGrid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { isSupabaseConfigured, createServerClient } from "@/lib/supabase"
import { mockDashboardStats, mockFlats } from "@/lib/mock-data"
import type { DashboardStats as DashboardStatsType } from "@/lib/types"

async function getDashboardStats(): Promise<DashboardStatsType> {
  // Always return mock data if Supabase is not properly configured
  if (!isSupabaseConfigured()) {
    console.log("Using mock dashboard stats - Supabase not configured")
    return mockDashboardStats
  }

  try {
    const supabase = createServerClient()

    // Test connection first
    const { data: testData, error: testError } = await supabase.from("flats").select("id").limit(1)

    if (testError) {
      console.log("Database connection failed, using mock data:", testError.message)
      return mockDashboardStats
    }

    // Get flat statistics
    const { data: flats, error: flatsError } = await supabase.from("flats").select("status")

    if (flatsError) {
      console.error("Error fetching flats for stats:", flatsError)
      return mockDashboardStats
    }

    // Get payment statistics
    const { data: payments, error: paymentsError } = await supabase
      .from("rent_payments")
      .select("status, amount")
      .gte("due_date", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

    if (paymentsError) {
      console.error("Error fetching payments for stats:", paymentsError)
      return mockDashboardStats
    }

    // Calculate statistics
    const totalFlats = flats?.length || 0
    const occupiedFlats = flats?.filter((f) => f.status === "occupied").length || 0
    const vacantFlats = flats?.filter((f) => f.status === "vacant").length || 0
    const maintenanceFlats = flats?.filter((f) => f.status === "maintenance").length || 0

    const pendingPayments = payments?.filter((p) => p.status === "pending").length || 0
    const overduePayments = payments?.filter((p) => p.status === "overdue").length || 0
    const totalRentCollected = payments?.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0) || 0
    const totalRentPending =
      payments?.filter((p) => p.status === "pending" || p.status === "overdue").reduce((sum, p) => sum + p.amount, 0) ||
      0

    return {
      totalFlats,
      occupiedFlats,
      vacantFlats,
      maintenanceFlats,
      pendingPayments,
      overduePayments,
      totalRentCollected,
      totalRentPending,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    // Always return mock data as fallback
    return mockDashboardStats
  }
}

async function getFlats() {
  // Always return mock data if Supabase is not properly configured
  if (!isSupabaseConfigured()) {
    console.log("Using mock flats data - Supabase not configured")
    return mockFlats
  }

  try {
    const supabase = createServerClient()

    // Test connection first
    const { data: testData, error: testError } = await supabase.from("flats").select("id").limit(1)

    if (testError) {
      console.log("Database connection failed, using mock data:", testError.message)
      return mockFlats
    }

    // First, get all flats
    const { data: allFlats, error: flatsError } = await supabase.from("flats").select("*").order("flat_number")

    if (flatsError) {
      console.error("Error fetching flats:", flatsError)
      return mockFlats
    }

    // Then get active leases with tenant information
    const { data: activeLeases, error: leasesError } = await supabase
      .from("leases")
      .select(`
        flat_id,
        tenants!inner(full_name)
      `)
      .eq("status", "active")

    if (leasesError) {
      console.error("Error fetching leases:", leasesError)
      // Continue without lease data but don't fail completely
    }

    // Combine the data
    const flatsWithLeases =
      allFlats?.map((flat) => {
        const activeLease = activeLeases?.find((lease) => lease.flat_id === flat.id)
        return {
          ...flat,
          current_lease: activeLease
            ? {
                tenant: {
                  full_name: activeLease.tenants.full_name,
                },
              }
            : undefined,
        }
      }) || []

    return flatsWithLeases
  } catch (error) {
    console.error("Error fetching flats:", error)
    // Always return mock data as fallback
    return mockFlats
  }
}

export default async function Dashboard() {
  const [stats, flats] = await Promise.all([getDashboardStats(), getFlats()])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your rental property management</p>
        {!isSupabaseConfigured() && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Showing sample data. Configure Supabase to connect to your database.
            </p>
          </div>
        )}
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <DashboardStats stats={stats} />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Flats</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading flats...</div>}>
                <FlatGrid flats={flats} />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <p className="font-medium">Occupied Flats: {stats.occupiedFlats}</p>
                <p className="font-medium">Vacant Flats: {stats.vacantFlats}</p>
                <p className="font-medium">Maintenance: {stats.maintenanceFlats}</p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-red-600">{stats.overduePayments} Overdue Payments</p>
                <p className="text-sm font-medium text-yellow-600">{stats.pendingPayments} Pending Payments</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
