-- Enable Row Level Security
ALTER TABLE "Reviews Table" ENABLE ROW LEVEL SECURITY;

-- Clear any old or conflicting policies
DROP POLICY IF EXISTS "Public can read reviews" ON "Reviews Table";
DROP POLICY IF EXISTS "Anyone can add a review" ON "Reviews Table";
DROP POLICY IF EXISTS "Users can update their own reviews" ON "Reviews Table";
DROP POLICY IF EXISTS "Users can delete their own reviews" ON "Reviews Table";
DROP POLICY IF EXISTS "allow_insert_reviews_public" ON "Reviews Table";
DROP POLICY IF EXISTS "allow_select_reviews_public" ON "Reviews Table";
DROP POLICY IF EXISTS "Users can update own reviews" ON "Reviews Table";
DROP POLICY IF EXISTS "Users can delete own reviews" ON "Reviews Table";

-- Allow anyone to READ all reviews (public visibility)
CREATE POLICY "Public can read reviews"
ON "Reviews Table"
FOR SELECT
TO public
USING (true);

-- Only authenticated users can INSERT their own reviews
CREATE POLICY "Authenticated users can add reviews"
ON "Reviews Table"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Only review authors can UPDATE or DELETE their own reviews
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

-- Make sure 'user_id' is not null
ALTER TABLE "Reviews Table"
ALTER COLUMN user_id SET NOT NULL;