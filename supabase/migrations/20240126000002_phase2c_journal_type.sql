-- Add type column to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS "type" text NOT NULL DEFAULT 'blog';

-- Add check constraint to ensure only valid types
ALTER TABLE posts 
ADD CONSTRAINT posts_type_check CHECK (type IN ('blog', 'journal'));

-- Create index for faster filtering by type
CREATE INDEX IF NOT EXISTS posts_type_idx ON posts (type);
