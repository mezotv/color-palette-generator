-- Create palettes table
CREATE TABLE IF NOT EXISTS palettes (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  colors JSONB NOT NULL DEFAULT '[]'::jsonb,
  harmony_type TEXT NOT NULL,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create palette_collections junction table
CREATE TABLE IF NOT EXISTS palette_collections (
  palette_id INTEGER NOT NULL REFERENCES palettes(id) ON DELETE CASCADE,
  collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (palette_id, collection_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_palettes_user_id ON palettes(user_id);
CREATE INDEX IF NOT EXISTS idx_palettes_created_at ON palettes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_palettes_is_favorite ON palettes(is_favorite);
CREATE INDEX IF NOT EXISTS idx_palette_collections_palette_id ON palette_collections(palette_id);
CREATE INDEX IF NOT EXISTS idx_palette_collections_collection_id ON palette_collections(collection_id);
