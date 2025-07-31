-- Rental Management System Database Schema
-- Run this script in your Supabase SQL Editor

-- Enable Row Level Security (RLS) for all tables
-- This is a Supabase best practice for security

-- Users table (for admin authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'manager')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flats table
CREATE TABLE IF NOT EXISTS flats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flat_number TEXT UNIQUE NOT NULL,
  floor INTEGER NOT NULL CHECK (floor > 0),
  bedrooms INTEGER NOT NULL CHECK (bedrooms > 0),
  bathrooms INTEGER NOT NULL CHECK (bathrooms > 0),
  area_sqft INTEGER CHECK (area_sqft > 0),
  monthly_rent DECIMAL(10,2) NOT NULL CHECK (monthly_rent > 0),
  status TEXT DEFAULT 'vacant' CHECK (status IN ('vacant', 'occupied', 'maintenance')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  id_number TEXT UNIQUE,
  occupation TEXT,
  date_of_birth DATE,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leases table
CREATE TABLE IF NOT EXISTS leases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flat_id UUID NOT NULL REFERENCES flats(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  monthly_rent DECIMAL(10,2) NOT NULL CHECK (monthly_rent > 0),
  security_deposit DECIMAL(10,2) NOT NULL CHECK (security_deposit >= 0),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'terminated')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure end_date is after start_date
  CONSTRAINT valid_lease_period CHECK (end_date > start_date),
  
  -- Ensure only one active lease per flat at a time
  CONSTRAINT unique_active_lease_per_flat EXCLUDE USING gist (
    flat_id WITH =,
    daterange(start_date, end_date, '[]') WITH &&
  ) WHERE (status = 'active')
);

-- Rent payments table
CREATE TABLE IF NOT EXISTS rent_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lease_id UUID NOT NULL REFERENCES leases(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  payment_date DATE,
  due_date DATE NOT NULL,
  payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'bank_transfer', 'check', 'online')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'partial')),
  notes TEXT,
  receipt_number TEXT,
  late_fee DECIMAL(10,2) DEFAULT 0 CHECK (late_fee >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_flats_status ON flats(status);
CREATE INDEX IF NOT EXISTS idx_flats_floor ON flats(floor);
CREATE INDEX IF NOT EXISTS idx_leases_flat_id ON leases(flat_id);
CREATE INDEX IF NOT EXISTS idx_leases_tenant_id ON leases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leases_status ON leases(status);
CREATE INDEX IF NOT EXISTS idx_leases_dates ON leases(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_rent_payments_lease_id ON rent_payments(lease_id);
CREATE INDEX IF NOT EXISTS idx_rent_payments_status ON rent_payments(status);
CREATE INDEX IF NOT EXISTS idx_rent_payments_due_date ON rent_payments(due_date);
CREATE INDEX IF NOT EXISTS idx_tenants_email ON tenants(email);

-- Create updated_at triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flats_updated_at BEFORE UPDATE ON flats 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leases_updated_at BEFORE UPDATE ON leases 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rent_payments_updated_at BEFORE UPDATE ON rent_payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE flats ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE rent_payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all operations for now - customize as needed)
-- Users policies
CREATE POLICY "Enable all operations for users" ON users FOR ALL USING (true);

-- Flats policies
CREATE POLICY "Enable all operations for flats" ON flats FOR ALL USING (true);

-- Tenants policies
CREATE POLICY "Enable all operations for tenants" ON tenants FOR ALL USING (true);

-- Leases policies
CREATE POLICY "Enable all operations for leases" ON leases FOR ALL USING (true);

-- Rent payments policies
CREATE POLICY "Enable all operations for rent_payments" ON rent_payments FOR ALL USING (true);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database schema created successfully!';
    RAISE NOTICE 'Tables created: users, flats, tenants, leases, rent_payments';
    RAISE NOTICE 'Indexes and triggers applied';
    RAISE NOTICE 'Row Level Security enabled with permissive policies';
    RAISE NOTICE 'Ready for data seeding!';
END $$;
