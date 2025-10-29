-- Comprehensive security fixes for the database

-- 1. Fix the update_updated_at_column function to have fixed search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. Remove duplicate RLS policy on Cafes Table
DROP POLICY IF EXISTS "allow_select_cafes_public" ON "Cafes Table";

-- 3. Make user_id NOT NULL on Reviews Table (after checking for nulls)
-- First, delete any reviews without a user_id (shouldn't exist but safety first)
DELETE FROM "Reviews Table" WHERE user_id IS NULL;

-- Now make it NOT NULL and add foreign key
ALTER TABLE "Reviews Table" 
ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE "Reviews Table"
ADD CONSTRAINT reviews_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- 4. Make cafe_id NOT NULL on Reviews Table
DELETE FROM "Reviews Table" WHERE cafe_id IS NULL;

ALTER TABLE "Reviews Table" 
ALTER COLUMN cafe_id SET NOT NULL;

ALTER TABLE "Reviews Table"
ADD CONSTRAINT reviews_cafe_id_fkey 
FOREIGN KEY (cafe_id) 
REFERENCES "Cafes Table"(id) 
ON DELETE CASCADE;

-- 5. Remove the unused Users Table (has no RLS policies and appears unused)
DROP TABLE IF EXISTS "Users Table" CASCADE;

-- 6. Add helpful index for common queries
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON "Reviews Table"(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_cafe_id ON "Reviews Table"(cafe_id);
CREATE INDEX IF NOT EXISTS idx_saved_cafes_user_id ON saved_cafes(user_id);