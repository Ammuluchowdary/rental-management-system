export interface Flat {
  id: string
  flat_number: string
  floor: number
  bedrooms: number
  bathrooms: number
  area_sqft: number
  monthly_rent: number
  status: "vacant" | "occupied" | "maintenance"
  description: string
  created_at: string
}

export interface Tenant {
  id: string
  full_name: string
  email: string
  phone: string
  emergency_contact: string
  emergency_phone: string
  id_number: string
  occupation: string
  created_at: string
}

export interface Lease {
  id: string
  flat_id: string
  tenant_id: string
  start_date: string
  end_date: string
  monthly_rent: number
  security_deposit: number
  status: "active" | "expired" | "terminated"
  created_at: string
  flat?: Flat
  tenant?: Tenant
}

export interface RentPayment {
  id: string
  lease_id: string
  amount: number
  payment_date: string | null
  due_date: string
  payment_method: string
  status: "pending" | "paid" | "overdue"
  notes: string
  created_at: string
  lease?: Lease
}

export interface DashboardStats {
  totalFlats: number
  occupiedFlats: number
  vacantFlats: number
  maintenanceFlats: number
  pendingPayments: number
  overduePayments: number
  totalRentCollected: number
  totalRentPending: number
}
