-- Remove foreign key constraints that require user authentication
-- This allows the MVP to work without user accounts

-- Drop the foreign key constraint on user_id (if it exists)
ALTER TABLE "Reviews Table" 
DROP CONSTRAINT IF EXISTS "Reviews Table_user_id_fkey";

-- Drop the foreign key constraint on cafe_id (if it exists)  
ALTER TABLE "Reviews Table"
DROP CONSTRAINT IF EXISTS "Reviews Table_cafe_id_fkey";

-- Add back cafe_id foreign key but allow it to be NULL or invalid for MVP
-- We'll handle cafe creation in the application layer
ALTER TABLE "Reviews Table"
ADD CONSTRAINT "Reviews Table_cafe_id_fkey" 
FOREIGN KEY (cafe_id) 
REFERENCES "Cafes Table"(id) 
ON DELETE SET NULL;