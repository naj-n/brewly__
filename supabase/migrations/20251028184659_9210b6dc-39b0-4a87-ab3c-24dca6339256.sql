-- Fix Security Issue #1: Remove dangerous default values from Reviews Table
-- The gen_random_uuid() defaults create orphaned data not linked to real users/cafes
ALTER TABLE "Reviews Table" 
  ALTER COLUMN user_id DROP DEFAULT,
  ALTER COLUMN cafe_id DROP DEFAULT;

-- Fix Security Issue #2: Add missing UPDATE and DELETE policies for Reviews Table
-- Allow review authors to edit and delete their own reviews
CREATE POLICY "Users can update their own reviews"
ON "Reviews Table"
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
ON "Reviews Table"
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Fix Security Issue #3: Add server-side input validation constraints
-- Add length limits to prevent oversized data attacks
ALTER TABLE "Reviews Table"
  ADD CONSTRAINT notes_length_limit CHECK (char_length(notes) <= 2000),
  ADD CONSTRAINT noise_level_valid CHECK (noise_level IN ('quiet', 'medium', 'loud')),
  ADD CONSTRAINT ambience_valid CHECK (ambience IN ('cozy', 'bright', 'minimal', 'busy')),
  ADD CONSTRAINT overall_rating_valid CHECK (overall_rating >= 1 AND overall_rating <= 5),
  ADD CONSTRAINT rush_hours_length_limit CHECK (char_length(rush_hours) <= 500);

ALTER TABLE "Users Table"
  ADD CONSTRAINT name_length_limit CHECK (char_length(name) <= 100),
  ADD CONSTRAINT email_length_limit CHECK (char_length(email) <= 255),
  ADD CONSTRAINT email_format_valid CHECK (email ~* '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$');

ALTER TABLE "Cafes Table"
  ADD CONSTRAINT name_length_limit CHECK (char_length(name) <= 200),
  ADD CONSTRAINT address_length_limit CHECK (char_length(address) <= 500);

-- Add NOT NULL constraints to critical fields
-- Note: user_id will need to be set explicitly in application code using auth.uid()
ALTER TABLE "Reviews Table"
  ALTER COLUMN overall_rating SET NOT NULL;

ALTER TABLE "Users Table"
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN name SET NOT NULL;

ALTER TABLE "Cafes Table"
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN address SET NOT NULL;