import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Users, CreditCard, AlertTriangle } from "lucide-react"
import type { DashboardStats } from "@/lib/types"

interface DashboardStatsProps {
  stats: DashboardStats
}

export default function DashboardStatsComponent({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Flats</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalFlats}</div>
          <p className="text-xs text-muted-foreground">
            {stats.occupiedFlats} occupied, {stats.vacantFlats} vacant
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round((stats.occupiedFlats / stats.totalFlats) * 100)}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.occupiedFlats} out of {stats.totalFlats} flats
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rent Collected</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalRentCollected.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">This month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.pendingPayments + stats.overduePayments}</div>
          <p className="text-xs text-muted-foreground">${stats.totalRentPending.toLocaleString()} pending</p>
        </CardContent>
      </Card>
    </div>
  )
}
