-- Create palettes table
CREATE TABLE IF NOT EXISTS palettes (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  name VARCHAR(255) NOT NULL,
  colors JSONB NOT NULL,
  harmony_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_favorite BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}'
);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_palettes_created_at ON palettes(created_at DESC);

-- Create index on is_favorite for filtering
CREATE INDEX IF NOT EXISTS idx_palettes_favorite ON palettes(is_favorite) WHERE is_favorite = true;

-- Create GIN index on tags for efficient tag searching
CREATE INDEX IF NOT EXISTS idx_palettes_tags ON palettes USING GIN(tags);
