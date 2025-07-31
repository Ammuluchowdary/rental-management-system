-- Seed Sample Data for Rental Management System
-- Run this script after creating the tables

-- Insert sample flats (20 flats across 4 floors)
INSERT INTO flats (flat_number, floor, bedrooms, bathrooms, area_sqft, monthly_rent, status, description) VALUES
-- Floor 1
('101', 1, 2, 1, 800, 1200.00, 'occupied', '2BHK with balcony and garden view'),
('102', 1, 1, 1, 600, 900.00, 'vacant', '1BHK compact unit with modern fixtures'),
('103', 1, 3, 2, 1200, 1800.00, 'occupied', '3BHK family unit with spacious living room'),
('104', 1, 2, 1, 850, 1300.00, 'vacant', '2BHK with garden view and parking'),
('105', 1, 1, 1, 550, 850.00, 'occupied', '1BHK studio style with kitchenette'),

-- Floor 2
('201', 2, 2, 1, 800, 1250.00, 'occupied', '2BHK with city view and balcony'),
('202', 2, 1, 1, 600, 950.00, 'vacant', '1BHK modern unit with updated kitchen'),
('203', 2, 3, 2, 1200, 1850.00, 'occupied', '3BHK premium unit with master suite'),
('204', 2, 2, 1, 850, 1350.00, 'maintenance', '2BHK under renovation - new flooring'),
('205', 2, 1, 1, 550, 900.00, 'vacant', '1BHK with balcony and storage'),

-- Floor 3
('301', 3, 2, 1, 800, 1300.00, 'occupied', '2BHK corner unit with extra windows'),
('302', 3, 1, 1, 600, 1000.00, 'occupied', '1BHK with dedicated parking space'),
('303', 3, 3, 2, 1200, 1900.00, 'vacant', '3BHK luxury unit with walk-in closet'),
('304', 3, 2, 1, 850, 1400.00, 'occupied', '2BHK with private terrace access'),
('305', 3, 1, 1, 550, 950.00, 'vacant', '1BHK cozy unit with built-in storage'),

-- Floor 4 (Top Floor - Premium)
('401', 4, 2, 1, 800, 1350.00, 'occupied', '2BHK top floor with panoramic views'),
('402', 4, 1, 1, 600, 1050.00, 'vacant', '1BHK penthouse style with high ceilings'),
('403', 4, 3, 2, 1200, 2000.00, 'occupied', '3BHK penthouse with rooftop access'),
('404', 4, 2, 1, 850, 1450.00, 'vacant', '2BHK with roof access and city views'),
('405', 4, 1, 1, 550, 1000.00, 'occupied', '1BHK top floor unit with skylight');

-- Insert sample tenants
INSERT INTO tenants (full_name, email, phone, emergency_contact, emergency_phone, id_number, occupation, date_of_birth, address) VALUES
('John Smith', 'john.smith@email.com', '+1-555-0101', 'Jane Smith', '+1-555-0102', 'ID001', 'Software Engineer', '1985-03-15', '123 Tech Street, Silicon Valley'),
('Maria Garcia', 'maria.garcia@email.com', '+1-555-0103', 'Carlos Garcia', '+1-555-0104', 'ID002', 'High School Teacher', '1990-07-22', '456 Education Ave, Downtown'),
('David Johnson', 'david.johnson@email.com', '+1-555-0105', 'Sarah Johnson', '+1-555-0106', 'ID003', 'Emergency Room Doctor', '1982-11-08', '789 Medical Center Blvd'),
('Lisa Chen', 'lisa.chen@email.com', '+1-555-0107', 'Michael Chen', '+1-555-0108', 'ID004', 'UX Designer', '1988-05-30', '321 Creative District'),
('Robert Wilson', 'robert.wilson@email.com', '+1-555-0109', 'Emma Wilson', '+1-555-0110', 'ID005', 'Project Manager', '1983-09-12', '654 Business Park'),
('Anna Rodriguez', 'anna.rodriguez@email.com', '+1-555-0111', 'Luis Rodriguez', '+1-555-0112', 'ID006', 'Registered Nurse', '1987-01-25', '987 Healthcare Plaza'),
('James Brown', 'james.brown@email.com', '+1-555-0113', 'Mary Brown', '+1-555-0114', 'ID007', 'Senior Accountant', '1980-04-18', '147 Financial District'),
('Sophie Taylor', 'sophie.taylor@email.com', '+1-555-0115', 'Tom Taylor', '+1-555-0116', 'ID008', 'Corporate Lawyer', '1986-12-03', '258 Legal Center'),
('Michael Davis', 'michael.davis@email.com', '+1-555-0117', 'Linda Davis', '+1-555-0118', 'ID009', 'Civil Engineer', '1984-08-27', '369 Engineering Way'),
('Emily White', 'emily.white@email.com', '+1-555-0119', 'John White', '+1-555-0120', 'ID010', 'Marketing Director', '1989-06-14', '741 Marketing Square');

-- Insert sample leases for occupied flats
INSERT INTO leases (flat_id, tenant_id, start_date, end_date, monthly_rent, security_deposit, status, notes) VALUES
-- Active leases
((SELECT id FROM flats WHERE flat_number = '101'), (SELECT id FROM tenants WHERE full_name = 'John Smith'), '2024-01-01', '2024-12-31', 1200.00, 2400.00, 'active', 'Initial lease - excellent tenant'),
((SELECT id FROM flats WHERE flat_number = '103'), (SELECT id FROM tenants WHERE full_name = 'Maria Garcia'), '2024-02-01', '2025-01-31', 1800.00, 3600.00, 'active', 'Family with two children'),
((SELECT id FROM flats WHERE flat_number = '105'), (SELECT id FROM tenants WHERE full_name = 'David Johnson'), '2024-01-15', '2024-12-15', 850.00, 1700.00, 'active', 'Doctor - works night shifts'),
((SELECT id FROM flats WHERE flat_number = '201'), (SELECT id FROM tenants WHERE full_name = 'Lisa Chen'), '2024-03-01', '2025-02-28', 1250.00, 2500.00, 'active', 'Designer - works from home'),
((SELECT id FROM flats WHERE flat_number = '203'), (SELECT id FROM tenants WHERE full_name = 'Robert Wilson'), '2024-01-01', '2024-12-31', 1850.00, 3700.00, 'active', 'Project manager - travels frequently'),
((SELECT id FROM flats WHERE flat_number = '301'), (SELECT id FROM tenants WHERE full_name = 'Anna Rodriguez'), '2024-02-15', '2025-02-14', 1300.00, 2600.00, 'active', 'Nurse - very quiet tenant'),
((SELECT id FROM flats WHERE flat_number = '302'), (SELECT id FROM tenants WHERE full_name = 'James Brown'), '2024-01-01', '2024-12-31', 1000.00, 2000.00, 'active', 'Accountant - always pays early'),
((SELECT id FROM flats WHERE flat_number = '304'), (SELECT id FROM tenants WHERE full_name = 'Sophie Taylor'), '2024-03-01', '2025-02-28', 1400.00, 2800.00, 'active', 'Lawyer - professional tenant'),
((SELECT id FROM flats WHERE flat_number = '401'), (SELECT id FROM tenants WHERE full_name = 'Michael Davis'), '2024-01-01', '2024-12-31', 1350.00, 2700.00, 'active', 'Engineer - loves the top floor view'),
((SELECT id FROM flats WHERE flat_number = '403'), (SELECT id FROM tenants WHERE full_name = 'Emily White'), '2024-02-01', '2025-01-31', 2000.00, 4000.00, 'active', 'Marketing director - penthouse tenant');

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Sample data inserted successfully!';
    RAISE NOTICE 'Created: 20 flats, 10 tenants, 10 active leases';
    RAISE NOTICE 'Flat distribution: 10 occupied, 9 vacant, 1 maintenance';
    RAISE NOTICE 'Ready to create rent payments!';
END $$;
