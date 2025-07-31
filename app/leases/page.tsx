import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { isSupabaseConfigured, createServerClient } from "@/lib/supabase"
import { mockLeases } from "@/lib/mock-data"
import { format } from "date-fns"
import { Calendar, DollarSign, Shield } from "lucide-react"

async function getLeases() {
  // Always return mock data if Supabase is not properly configured
  if (!isSupabaseConfigured()) {
    console.log("Using mock leases data - Supabase not configured")
    return mockLeases
  }

  try {
    const supabase = createServerClient()

    // Test connection first
    const { data: testData, error: testError } = await supabase.from("leases").select("id").limit(1)

    if (testError) {
      console.log("Database connection failed, using mock data:", testError.message)
      return mockLeases
    }

    const { data: leases, error } = await supabase
      .from("leases")
      .select(`
        *,
        flat:flats(flat_number, floor),
        tenant:tenants(full_name, email, phone)
      `)
      .order("start_date", { ascending: false })

    if (error) {
      console.error("Error fetching leases:", error)
      return mockLeases
    }

    return leases || mockLeases
  } catch (error) {
    console.error("Error fetching leases:", error)
    // Return mock data as fallback
    return mockLeases
  }
}

export default async function LeasesPage() {
  const leases = await getLeases()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "expired":
        return "bg-yellow-100 text-yellow-800"
      case "terminated":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lease Agreements</h1>
        <p className="text-muted-foreground">Manage all lease agreements</p>
        {!isSupabaseConfigured() && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Showing sample data. Configure Supabase to connect to your database.
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {leases.map((lease: any) => (
          <Card key={lease.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Flat {lease.flat?.flat_number} - {lease.tenant?.full_name}
                </CardTitle>
                <Badge className={getStatusColor(lease.status)}>{lease.status}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">Lease Period</p>
                    <p className="text-muted-foreground">
                      {format(new Date(lease.start_date), "MMM dd, yyyy")} -{" "}
                      {format(new Date(lease.end_date), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">Monthly Rent</p>
                    <p className="text-muted-foreground">${lease.monthly_rent.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">Security Deposit</p>
                    <p className="text-muted-foreground">${lease.security_deposit.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm">
                  <span className="font-medium">Tenant Contact:</span> {lease.tenant?.email} | {lease.tenant?.phone}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
