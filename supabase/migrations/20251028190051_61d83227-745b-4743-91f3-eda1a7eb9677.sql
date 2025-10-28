-- Add reviewer name and email to Reviews Table for MVP (no auth required)
ALTER TABLE "Reviews Table"
  ADD COLUMN reviewer_name TEXT,
  ADD COLUMN reviewer_email TEXT,
  ALTER COLUMN user_id DROP NOT NULL;

-- Add constraints for MVP reviewer info
ALTER TABLE "Reviews Table"
  ADD CONSTRAINT reviewer_name_length CHECK (char_length(reviewer_name) <= 100),
  ADD CONSTRAINT reviewer_email_length CHECK (char_length(reviewer_email) <= 255),
  ADD CONSTRAINT reviewer_email_format CHECK (reviewer_email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$');

-- Update RLS policies for public MVP access
-- Allow anyone to insert reviews (no auth required)
DROP POLICY IF EXISTS "allow_insert_reviews" ON "Reviews Table";
CREATE POLICY "allow_insert_reviews_public"
ON "Reviews Table"
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to read reviews
DROP POLICY IF EXISTS "allow_select_reviews" ON "Reviews Table";
CREATE POLICY "allow_select_reviews_public"
ON "Reviews Table"
FOR SELECT
TO anon, authenticated
USING (true);

-- Remove auth-dependent UPDATE/DELETE policies for MVP
DROP POLICY IF EXISTS "Users can update their own reviews" ON "Reviews Table";
DROP POLICY IF EXISTS "Users can delete their own reviews" ON "Reviews Table";

-- Allow public read access to cafes
DROP POLICY IF EXISTS "allow_select_cafes" ON "Reviews Table";
CREATE POLICY "allow_select_cafes_public"
ON "Cafes Table"
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow anyone to insert cafes (for new cafe submissions)
CREATE POLICY "allow_insert_cafes_public"
ON "Cafes Table"
FOR INSERT
TO anon, authenticated
WITH CHECK (true);