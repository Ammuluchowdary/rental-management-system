import FlatGrid from "@/components/FlatGrid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { isSupabaseConfigured, createServerClient } from "@/lib/supabase"
import { mockFlats } from "@/lib/mock-data"

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

export default async function FlatsPage() {
  const flats = await getFlats()

  const occupiedFlats = flats.filter((f: any) => f.status === "occupied")
  const vacantFlats = flats.filter((f: any) => f.status === "vacant")
  const maintenanceFlats = flats.filter((f: any) => f.status === "maintenance")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Flats Management</h1>
        <p className="text-muted-foreground">Manage all flats in your building</p>
        {!isSupabaseConfigured() && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Showing sample data. Configure Supabase to connect to your database.
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Occupied ({occupiedFlats.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <FlatGrid flats={occupiedFlats} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-yellow-600">Vacant ({vacantFlats.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <FlatGrid flats={vacantFlats} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Maintenance ({maintenanceFlats.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <FlatGrid flats={maintenanceFlats} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
