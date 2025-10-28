-- Enable real-time updates for the Reviews Table
ALTER TABLE "Reviews Table" REPLICA IDENTITY FULL;

-- Add the Reviews Table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE "Reviews Table";