# 🏢 Supabase Setup Guide for Rental Management System

This guide will walk you through setting up your Supabase database for the rental management application.

## 📋 Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Project Created**: Create a new Supabase project

## 🚀 Step-by-Step Setup

### Step 1: Create Your Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `rental-management` (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your location
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

### Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **Service role key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Step 3: Configure Environment Variables

Create a `.env.local` file in your project root:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### Step 4: Run the Database Scripts

Execute these scripts **in order** in your Supabase SQL Editor:

#### 4.1 Create Tables and Schema
1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Copy and paste the content from `scripts/01-create-tables.sql`
4. Click "Run" (▶️)
5. ✅ You should see: "Database schema created successfully!"

#### 4.2 Seed Sample Data
1. Create another new query
2. Copy and paste the content from `scripts/02-seed-sample-data.sql`
3. Click "Run" (▶️)
4. ✅ You should see: "Sample data inserted successfully!"

#### 4.3 Create Rent Payments
1. Create another new query
2. Copy and paste the content from `scripts/03-create-rent-payments.sql`
3. Click "Run" (▶️)
4. ✅ You should see: "Rent payments created successfully!"

#### 4.4 Create Admin User (Optional)
1. Create another new query
2. Copy and paste the content from `scripts/04-create-admin-user.sql`
3. Click "Run" (▶️)
4. ✅ You should see: "Admin user created successfully!"

### Step 5: Verify Your Setup

1. Go to **Table Editor** in Supabase
2. You should see these tables:
   - ✅ `flats` (20 rows)
   - ✅ `tenants` (10 rows)
   - ✅ `leases` (10 rows)
   - ✅ `rent_payments` (30+ rows)
   - ✅ `users` (1 row)

### Step 6: Test Your Application

1. Restart your Next.js development server:
   \`\`\`bash
   npm run dev
   \`\`\`
2. Visit `http://localhost:3000`
3. You should see **real data** instead of the demo mode message!

## 🔧 Troubleshooting

### Common Issues

#### ❌ "relation does not exist" error
- **Solution**: Make sure you ran `01-create-tables.sql` first
- Check that all scripts completed successfully

#### ❌ Environment variables not working
- **Solution**: 
  - Restart your development server after adding `.env.local`
  - Make sure there are no spaces around the `=` signs
  - Verify your Supabase URL and keys are correct

#### ❌ RLS (Row Level Security) blocking queries
- **Solution**: The scripts include permissive RLS policies
- For production, customize the RLS policies in `01-create-tables.sql`

#### ❌ Foreign key constraint errors
- **Solution**: Run scripts in the correct order (01 → 02 → 03 → 04)

### Getting Help

If you encounter issues:

1. **Check Supabase Logs**: Go to **Logs** → **Database** in your Supabase dashboard
2. **Verify Environment Variables**: Make sure your `.env.local` file is correct
3. **Check Network**: Ensure your Supabase project is accessible

## 🎯 What You Get

After successful setup:

### 📊 **Dashboard**
- Real occupancy statistics
- Actual rent collection data
- Live payment status

### 🏠 **20 Sample Flats**
- 4 floors with 5 flats each
- Mix of 1BHK, 2BHK, and 3BHK units
- Various statuses: occupied, vacant, maintenance

### 👥 **10 Sample Tenants**
- Complete contact information
- Emergency contacts
- Professional details

### 📋 **10 Active Leases**
- Realistic lease terms
- Security deposits
- Lease periods

### 💰 **30+ Payment Records**
- Current month payments (mix of paid/pending)
- Historical payments (3 months)
- Some overdue payments for testing

## 🔒 Security Notes

### For Production:

1. **Customize RLS Policies**: The current policies allow all operations
2. **Use Supabase Auth**: Replace the `users` table with Supabase Auth
3. **Environment Variables**: Use proper secret management
4. **Database Backups**: Enable automatic backups in Supabase

### Current Setup:
- ✅ Row Level Security enabled
- ✅ Proper foreign key constraints
- ✅ Data validation checks
- ✅ Indexes for performance
- ⚠️ Permissive policies (customize for production)

## 🎉 Success!

Your rental management system is now connected to a real database! 

The application will automatically detect the Supabase connection and switch from demo mode to live data mode.

---

**Need help?** Check the troubleshooting section above or review the Supabase documentation at [supabase.com/docs](https://supabase.com/docs).
