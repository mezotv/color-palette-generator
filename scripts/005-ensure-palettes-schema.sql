-- Ensure palettes table exists with the current app schema
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

-- Backfill/normalize legacy schema variants
ALTER TABLE palettes ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE palettes ADD COLUMN IF NOT EXISTS harmony_type VARCHAR(50);
ALTER TABLE palettes ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false;
ALTER TABLE palettes ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE palettes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE palettes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'palettes' AND column_name = 'generation_type'
  ) THEN
    UPDATE palettes
    SET harmony_type = COALESCE(harmony_type, generation_type)
    WHERE generation_type IS NOT NULL;
  END IF;
END $$;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_palettes_created_at ON palettes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_palettes_favorite ON palettes(is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_palettes_tags ON palettes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_palettes_user_id ON palettes(user_id);
CREATE INDEX IF NOT EXISTS idx_palettes_user_id_created_at ON palettes(user_id, created_at DESC);
