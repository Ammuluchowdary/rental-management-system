-- Create Admin User (Optional)
-- Run this script if you want to create an admin user in the users table

-- Insert admin user (you should change these values)
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@rentalmanager.com', '$2b$10$example_hash_replace_with_real_hash', 'System Administrator', 'admin');

-- Note: In a real application, you would:
-- 1. Use Supabase Auth instead of this users table
-- 2. Hash passwords properly using bcrypt or similar
-- 3. Set up proper authentication flows

-- For now, this is just for demonstration purposes
DO $$
BEGIN
    RAISE NOTICE 'Admin user created successfully!';
    RAISE NOTICE 'Email: admin@rentalmanager.com';
    RAISE NOTICE 'Note: Use Supabase Auth for production applications';
END $$;
