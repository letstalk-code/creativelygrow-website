-- Run this once in the Supabase SQL editor.
-- Remembers a video's custom poster so it survives the file being replaced.
alter table gallery_videos add column if not exists thumb_path text;
