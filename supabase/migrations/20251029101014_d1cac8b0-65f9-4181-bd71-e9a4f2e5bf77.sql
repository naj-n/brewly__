-- Fix critical security issues: Enable RLS and remove redundant personal data columns

-- 1. Enable Row Level Security on Reviews Table
ALTER TABLE "Reviews Table" ENABLE ROW LEVEL SECURITY;

-- 2. Remove redundant reviewer_email and reviewer_name columns
-- These are no longer needed since we use user_id with authentication
ALTER TABLE "Reviews Table" 
DROP COLUMN IF EXISTS reviewer_email,
DROP COLUMN IF EXISTS reviewer_name;

-- Note: Existing RLS policies will continue to work:
-- - allow_select_reviews_public: Allows public reading of reviews
-- - allow_insert_reviews_public: Allows authenticated users to insert reviews
-- - Users can update own reviews: Uses user_id for authorization
-- - Users can delete own reviews: Uses user_id for authorization