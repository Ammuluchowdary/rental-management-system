import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { isSupabaseConfigured, createServerClient } from "@/lib/supabase"
import { mockTenants } from "@/lib/mock-data"
import { Mail, Phone, User, Briefcase } from "lucide-react"

async function getTenants() {
  // Always return mock data if Supabase is not properly configured
  if (!isSupabaseConfigured()) {
    console.log("Using mock tenants data - Supabase not configured")
    return mockTenants
  }

  try {
    const supabase = createServerClient()

    // Test connection first
    const { data: testData, error: testError } = await supabase.from("tenants").select("id").limit(1)

    if (testError) {
      console.log("Database connection failed, using mock data:", testError.message)
      return mockTenants
    }

    const { data: tenants, error } = await supabase
      .from("tenants")
      .select(`
        *,
        lease:leases!inner(
          *,
          flat:flats(flat_number, monthly_rent)
        )
      `)
      .eq("leases.status", "active")
      .order("full_name")

    if (error) {
      console.error("Error fetching tenants:", error)
      return mockTenants
    }

    return tenants || mockTenants
  } catch (error) {
    console.error("Error fetching tenants:", error)
    // Return mock data as fallback
    return mockTenants
  }
}

export default async function TenantsPage() {
  const tenants = await getTenants()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
        <p className="text-muted-foreground">Manage all tenants in your building</p>
        {!isSupabaseConfigured() && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Showing sample data. Configure Supabase to connect to your database.
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tenants.map((tenant: any) => (
          <Card key={tenant.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{tenant.full_name}</CardTitle>
                <Badge variant="secondary">Flat {tenant.lease[0]?.flat?.flat_number}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{tenant.email}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{tenant.phone}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{tenant.occupation}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>ID: {tenant.id_number}</span>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm font-medium">Rent: ${tenant.lease[0]?.flat?.monthly_rent}/month</p>
                <p className="text-xs text-muted-foreground">
                  Emergency: {tenant.emergency_contact} ({tenant.emergency_phone})
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
