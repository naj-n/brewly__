-- Drop invalid foreign key constraints on the id column
-- These constraints incorrectly require the review id to match user/cafe ids

ALTER TABLE "Reviews Table" 
DROP CONSTRAINT IF EXISTS "Reviews Table_id_fkey";

ALTER TABLE "Reviews Table" 
DROP CONSTRAINT IF EXISTS "Reviews Table_id_fkey1";