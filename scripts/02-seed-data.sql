-- Insert sample flats (20 flats across 4 floors)
INSERT INTO flats (flat_number, floor, bedrooms, bathrooms, area_sqft, monthly_rent, status, description) VALUES
('101', 1, 2, 1, 800, 1200.00, 'occupied', '2BHK with balcony'),
('102', 1, 1, 1, 600, 900.00, 'vacant', '1BHK compact unit'),
('103', 1, 3, 2, 1200, 1800.00, 'occupied', '3BHK family unit'),
('104', 1, 2, 1, 850, 1300.00, 'vacant', '2BHK with garden view'),
('105', 1, 1, 1, 550, 850.00, 'occupied', '1BHK studio style'),

('201', 2, 2, 1, 800, 1250.00, 'occupied', '2BHK with city view'),
('202', 2, 1, 1, 600, 950.00, 'vacant', '1BHK modern unit'),
('203', 2, 3, 2, 1200, 1850.00, 'occupied', '3BHK premium unit'),
('204', 2, 2, 1, 850, 1350.00, 'maintenance', '2BHK under renovation'),
('205', 2, 1, 1, 550, 900.00, 'vacant', '1BHK with balcony'),

('301', 3, 2, 1, 800, 1300.00, 'occupied', '2BHK corner unit'),
('302', 3, 1, 1, 600, 1000.00, 'occupied', '1BHK with parking'),
('303', 3, 3, 2, 1200, 1900.00, 'vacant', '3BHK luxury unit'),
('304', 3, 2, 1, 850, 1400.00, 'occupied', '2BHK with terrace'),
('305', 3, 1, 1, 550, 950.00, 'vacant', '1BHK cozy unit'),

('401', 4, 2, 1, 800, 1350.00, 'occupied', '2BHK top floor'),
('402', 4, 1, 1, 600, 1050.00, 'vacant', '1BHK penthouse style'),
('403', 4, 3, 2, 1200, 2000.00, 'occupied', '3BHK penthouse'),
('404', 4, 2, 1, 850, 1450.00, 'vacant', '2BHK with roof access'),
('405', 4, 1, 1, 550, 1000.00, 'occupied', '1BHK top floor unit');

-- Insert sample tenants
INSERT INTO tenants (full_name, email, phone, emergency_contact, emergency_phone, id_number, occupation) VALUES
('John Smith', 'john.smith@email.com', '+1234567890', 'Jane Smith', '+1234567891', 'ID001', 'Software Engineer'),
('Maria Garcia', 'maria.garcia@email.com', '+1234567892', 'Carlos Garcia', '+1234567893', 'ID002', 'Teacher'),
('David Johnson', 'david.johnson@email.com', '+1234567894', 'Sarah Johnson', '+1234567895', 'ID003', 'Doctor'),
('Lisa Chen', 'lisa.chen@email.com', '+1234567896', 'Michael Chen', '+1234567897', 'ID004', 'Designer'),
('Robert Wilson', 'robert.wilson@email.com', '+1234567898', 'Emma Wilson', '+1234567899', 'ID005', 'Manager'),
('Anna Rodriguez', 'anna.rodriguez@email.com', '+1234567800', 'Luis Rodriguez', '+1234567801', 'ID006', 'Nurse'),
('James Brown', 'james.brown@email.com', '+1234567802', 'Mary Brown', '+1234567803', 'ID007', 'Accountant'),
('Sophie Taylor', 'sophie.taylor@email.com', '+1234567804', 'Tom Taylor', '+1234567805', 'ID008', 'Lawyer'),
('Michael Davis', 'michael.davis@email.com', '+1234567806', 'Linda Davis', '+1234567807', 'ID009', 'Engineer'),
('Emily White', 'emily.white@email.com', '+1234567808', 'John White', '+1234567809', 'ID010', 'Marketing');

-- Insert sample leases for occupied flats
INSERT INTO leases (flat_id, tenant_id, start_date, end_date, monthly_rent, security_deposit, status) VALUES
((SELECT id FROM flats WHERE flat_number = '101'), (SELECT id FROM tenants WHERE full_name = 'John Smith'), '2024-01-01', '2024-12-31', 1200.00, 2400.00, 'active'),
((SELECT id FROM flats WHERE flat_number = '103'), (SELECT id FROM tenants WHERE full_name = 'Maria Garcia'), '2024-02-01', '2025-01-31', 1800.00, 3600.00, 'active'),
((SELECT id FROM flats WHERE flat_number = '105'), (SELECT id FROM tenants WHERE full_name = 'David Johnson'), '2024-01-15', '2024-12-15', 850.00, 1700.00, 'active'),
((SELECT id FROM flats WHERE flat_number = '201'), (SELECT id FROM tenants WHERE full_name = 'Lisa Chen'), '2024-03-01', '2025-02-28', 1250.00, 2500.00, 'active'),
((SELECT id FROM flats WHERE flat_number = '203'), (SELECT id FROM tenants WHERE full_name = 'Robert Wilson'), '2024-01-01', '2024-12-31', 1850.00, 3700.00, 'active'),
((SELECT id FROM flats WHERE flat_number = '301'), (SELECT id FROM tenants WHERE full_name = 'Anna Rodriguez'), '2024-02-15', '2025-02-14', 1300.00, 2600.00, 'active'),
((SELECT id FROM flats WHERE flat_number = '302'), (SELECT id FROM tenants WHERE full_name = 'James Brown'), '2024-01-01', '2024-12-31', 1000.00, 2000.00, 'active'),
((SELECT id FROM flats WHERE flat_number = '304'), (SELECT id FROM tenants WHERE full_name = 'Sophie Taylor'), '2024-03-01', '2025-02-28', 1400.00, 2800.00, 'active'),
((SELECT id FROM flats WHERE flat_number = '401'), (SELECT id FROM tenants WHERE full_name = 'Michael Davis'), '2024-01-01', '2024-12-31', 1350.00, 2700.00, 'active'),
((SELECT id FROM flats WHERE flat_number = '403'), (SELECT id FROM tenants WHERE full_name = 'Emily White'), '2024-02-01', '2025-01-31', 2000.00, 4000.00, 'active');
