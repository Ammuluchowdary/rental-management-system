-- Create Rent Payments for Current and Previous Months
-- Run this script after creating tables and seeding basic data

-- Create rent payments for current month (January 2024)
INSERT INTO rent_payments (lease_id, amount, payment_date, due_date, status, payment_method, notes, receipt_number) 
SELECT 
  l.id as lease_id,
  l.monthly_rent as amount,
  CASE 
    -- 70% of payments are already made
    WHEN random() > 0.3 THEN DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '3 days' + (random() * INTERVAL '10 days')
    ELSE NULL
  END as payment_date,
  DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day' as due_date,
  CASE 
    WHEN random() > 0.3 THEN 'paid'
    ELSE 'pending'
  END as status,
  CASE 
    WHEN random() > 0.6 THEN 'bank_transfer'
    WHEN random() > 0.3 THEN 'online'
    ELSE 'cash'
  END as payment_method,
  'Monthly rent payment for ' || TO_CHAR(CURRENT_DATE, 'Month YYYY') as notes,
  'RCP-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD((ROW_NUMBER() OVER())::text, 4, '0') as receipt_number
FROM leases l
WHERE l.status = 'active';

-- Create some overdue payments from previous month
INSERT INTO rent_payments (lease_id, amount, payment_date, due_date, status, payment_method, notes, late_fee, receipt_number) 
SELECT 
  l.id as lease_id,
  l.monthly_rent as amount,
  NULL as payment_date,
  DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 day' as due_date,
  'overdue' as status,
  'cash' as payment_method,
  'Previous month rent - OVERDUE' as notes,
  CASE 
    WHEN l.monthly_rent > 1500 THEN 100.00
    WHEN l.monthly_rent > 1000 THEN 75.00
    ELSE 50.00
  END as late_fee,
  'RCP-' || TO_CHAR(CURRENT_DATE - INTERVAL '1 month', 'YYYY') || '-' || LPAD((1000 + ROW_NUMBER() OVER())::text, 4, '0') as receipt_number
FROM leases l
WHERE l.status = 'active' 
  AND random() > 0.7  -- Only 30% have overdue payments
ORDER BY random()
LIMIT 3;

-- Create historical payments for the past 3 months
INSERT INTO rent_payments (lease_id, amount, payment_date, due_date, status, payment_method, notes, receipt_number)
SELECT 
  l.id as lease_id,
  l.monthly_rent as amount,
  (DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '2 months') + INTERVAL '2 days' + (random() * INTERVAL '15 days') as payment_date,
  (DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '2 months') + INTERVAL '1 month' - INTERVAL '1 day' as due_date,
  'paid' as status,
  CASE 
    WHEN random() > 0.5 THEN 'bank_transfer'
    WHEN random() > 0.25 THEN 'online'
    ELSE 'cash'
  END as payment_method,
  'Monthly rent payment for ' || TO_CHAR(CURRENT_DATE - INTERVAL '2 months', 'Month YYYY') as notes,
  'RCP-' || TO_CHAR(CURRENT_DATE - INTERVAL '2 months', 'YYYY') || '-' || LPAD((2000 + ROW_NUMBER() OVER())::text, 4, '0') as receipt_number
FROM leases l
WHERE l.status = 'active'
  AND l.start_date <= (CURRENT_DATE - INTERVAL '2 months');

-- Create payments for 3 months ago
INSERT INTO rent_payments (lease_id, amount, payment_date, due_date, status, payment_method, notes, receipt_number)
SELECT 
  l.id as lease_id,
  l.monthly_rent as amount,
  (DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '3 months') + INTERVAL '1 day' + (random() * INTERVAL '20 days') as payment_date,
  (DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '3 months') + INTERVAL '1 month' - INTERVAL '1 day' as due_date,
  'paid' as status,
  CASE 
    WHEN random() > 0.4 THEN 'bank_transfer'
    WHEN random() > 0.2 THEN 'online'
    ELSE 'cash'
  END as payment_method,
  'Monthly rent payment for ' || TO_CHAR(CURRENT_DATE - INTERVAL '3 months', 'Month YYYY') as notes,
  'RCP-' || TO_CHAR(CURRENT_DATE - INTERVAL '3 months', 'YYYY') || '-' || LPAD((3000 + ROW_NUMBER() OVER())::text, 4, '0') as receipt_number
FROM leases l
WHERE l.status = 'active'
  AND l.start_date <= (CURRENT_DATE - INTERVAL '3 months');

-- Update flat status based on lease status
UPDATE flats 
SET status = 'occupied' 
WHERE id IN (
  SELECT DISTINCT flat_id 
  FROM leases 
  WHERE status = 'active'
);

-- Success message with statistics
DO $$
DECLARE
  total_payments INTEGER;
  paid_payments INTEGER;
  pending_payments INTEGER;
  overdue_payments INTEGER;
  total_amount DECIMAL(10,2);
BEGIN
  SELECT COUNT(*) INTO total_payments FROM rent_payments;
  SELECT COUNT(*) INTO paid_payments FROM rent_payments WHERE status = 'paid';
  SELECT COUNT(*) INTO pending_payments FROM rent_payments WHERE status = 'pending';
  SELECT COUNT(*) INTO overdue_payments FROM rent_payments WHERE status = 'overdue';
  SELECT SUM(amount) INTO total_amount FROM rent_payments WHERE status = 'paid';
  
  RAISE NOTICE 'Rent payments created successfully!';
  RAISE NOTICE 'Total payments: %', total_payments;
  RAISE NOTICE 'Paid: %, Pending: %, Overdue: %', paid_payments, pending_payments, overdue_payments;
  RAISE NOTICE 'Total rent collected: $%', total_amount;
  RAISE NOTICE 'Database setup complete!';
END $$;
