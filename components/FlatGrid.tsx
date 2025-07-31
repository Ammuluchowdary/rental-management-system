import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Flat, Lease } from "@/lib/types"
import { Bed, Bath, Square } from "lucide-react"

interface FlatWithLease extends Flat {
  current_lease?: Lease & {
    tenant?: {
      full_name: string
    }
  }
}

interface FlatGridProps {
  flats: FlatWithLease[]
}

export default function FlatGrid({ flats }: FlatGridProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "bg-green-100 text-green-800"
      case "vacant":
        return "bg-yellow-100 text-yellow-800"
      case "maintenance":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {flats.map((flat) => (
        <Card key={flat.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Flat {flat.flat_number}</CardTitle>
              <Badge className={getStatusColor(flat.status)}>{flat.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Floor {flat.floor}</p>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{flat.bedrooms} bed</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{flat.bathrooms} bath</span>
              </div>
              <div className="flex items-center gap-1">
                <Square className="h-4 w-4" />
                <span>{flat.area_sqft} sqft</span>
              </div>
            </div>

            <div className="text-lg font-semibold text-green-600">${flat.monthly_rent}/month</div>

            {flat.current_lease?.tenant && (
              <div className="text-sm">
                <p className="font-medium">Tenant:</p>
                <p className="text-muted-foreground">{flat.current_lease.tenant.full_name}</p>
              </div>
            )}

            <p className="text-sm text-muted-foreground">{flat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
