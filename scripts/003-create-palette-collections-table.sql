-- Create palette_collections junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS palette_collections (
  palette_id INTEGER NOT NULL REFERENCES palettes(id) ON DELETE CASCADE,
  collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (palette_id, collection_id)
);

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_palette_collections_palette_id ON palette_collections(palette_id);
CREATE INDEX IF NOT EXISTS idx_palette_collections_collection_id ON palette_collections(collection_id);
