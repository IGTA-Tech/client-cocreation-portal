-- Fix: Add INSERT policy for users table
-- Without this, new users cannot create their profile during onboarding
-- because RLS blocks the upsert (only SELECT and UPDATE policies existed)

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
