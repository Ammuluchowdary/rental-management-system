"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { mockPayments } from "@/lib/mock-data"
import type { RentPayment } from "@/lib/types"
import { format } from "date-fns"
import { Search, Filter, X } from "lucide-react"

type PaymentStatus = "all" | "paid" | "pending" | "overdue"

export default function PaymentsPage() {
  const [payments, setPayments] = useState<RentPayment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<RentPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [statusFilter, setStatusFilter] = useState<PaymentStatus>("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchPayments()
  }, [])

  useEffect(() => {
    filterPayments()
  }, [payments, statusFilter, searchTerm])

  const fetchPayments = async () => {
    try {
      // If Supabase is not configured, use mock data
      if (!isSupabaseConfigured()) {
        setPayments(mockPayments)
        setIsDemoMode(true)
        setLoading(false)
        return
      }

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

      setPayments(payments || [])
      setIsDemoMode(false)
    } catch (error) {
      console.error("Error fetching payments:", error)
      // Fallback to mock data
      setPayments(mockPayments)
      setIsDemoMode(true)
    } finally {
      setLoading(false)
    }
  }

  const filterPayments = () => {
    let filtered = payments

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((payment) => payment.status === statusFilter)
    }

    // Filter by search term (tenant name or flat number)
    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.lease?.tenant?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.lease?.flat?.flat_number?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredPayments(filtered)
  }

  const updatePaymentStatus = async (id: string, status: string) => {
    try {
      if (isDemoMode) {
        // In demo mode, just update the local state
        setPayments((prev) =>
          prev.map((payment) =>
            payment.id === id ? { ...payment, status: status as any, payment_date: new Date().toISOString() } : payment,
          ),
        )
        return
      }

      const { data, error } = await supabase
        .from("rent_payments")
        .update({
          status,
          payment_date: status === "paid" ? new Date().toISOString() : null,
        })
        .eq("id", id)
        .select()

      if (error) throw error

      fetchPayments() // Refresh the list
    } catch (error) {
      console.error("Error updating payment:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusCounts = () => {
    const counts = {
      all: payments.length,
      paid: payments.filter((p) => p.status === "paid").length,
      pending: payments.filter((p) => p.status === "pending").length,
      overdue: payments.filter((p) => p.status === "overdue").length,
    }
    return counts
  }

  const clearFilters = () => {
    setStatusFilter("all")
    setSearchTerm("")
  }

  const statusCounts = getStatusCounts()

  if (loading) return <div>Loading payments...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rent Payments</h1>
        <p className="text-muted-foreground">Manage rent payments and track payment status</p>
        {isDemoMode && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Showing sample data. Configure Supabase to connect to your database.
            </p>
          </div>
        )}
      </div>

      {/* Filters Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={(value: PaymentStatus) => setStatusFilter(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments ({statusCounts.all})</SelectItem>
                    <SelectItem value="paid">Paid ({statusCounts.paid})</SelectItem>
                    <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
                    <SelectItem value="overdue">Overdue ({statusCounts.overdue})</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Filter */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by tenant or flat number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[250px]"
                />
              </div>
            </div>

            {/* Clear Filters */}
            {(statusFilter !== "all" || searchTerm) && (
              <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2 bg-transparent">
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Filter Summary */}
          <div className="mt-4 flex flex-wrap gap-2">
            {statusFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter("all")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm("")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredPayments.length} of {payments.length} payments
        </p>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-50">
            Paid: {statusCounts.paid}
          </Badge>
          <Badge variant="outline" className="bg-yellow-50">
            Pending: {statusCounts.pending}
          </Badge>
          <Badge variant="outline" className="bg-red-50">
            Overdue: {statusCounts.overdue}
          </Badge>
        </div>
      </div>

      {/* Payments List */}
      <div className="grid gap-4">
        {filteredPayments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No payments found matching your filters.</p>
              {(statusFilter !== "all" || searchTerm) && (
                <Button variant="outline" onClick={clearFilters} className="mt-2 bg-transparent">
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredPayments.map((payment) => (
            <Card key={payment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Flat {payment.lease?.flat?.flat_number}</h3>
                      <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Tenant: {payment.lease?.tenant?.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Due: {format(new Date(payment.due_date), "MMM dd, yyyy")}
                    </p>
                    {payment.payment_date && (
                      <p className="text-sm text-muted-foreground">
                        Paid: {format(new Date(payment.payment_date), "MMM dd, yyyy")}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">Method: {payment.payment_method}</p>
                  </div>

                  <div className="text-right space-y-2">
                    <div className="text-lg font-semibold">${payment.amount.toLocaleString()}</div>
                    {payment.status !== "paid" && (
                      <Button size="sm" onClick={() => updatePaymentStatus(payment.id, "paid")}>
                        Mark as Paid
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
