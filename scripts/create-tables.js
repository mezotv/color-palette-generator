import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

async function createTables() {
  try {
    console.log('[v0] Creating palettes table...')
    await sql`
      CREATE TABLE IF NOT EXISTS palettes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT,
        colors TEXT[] NOT NULL,
        harmony_type TEXT,
        is_favorite BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('[v0] Palettes table created successfully')

    console.log('[v0] Creating collections table...')
    await sql`
      CREATE TABLE IF NOT EXISTS collections (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('[v0] Collections table created successfully')

    console.log('[v0] Creating palette_collections junction table...')
    await sql`
      CREATE TABLE IF NOT EXISTS palette_collections (
        palette_id TEXT REFERENCES palettes(id) ON DELETE CASCADE,
        collection_id TEXT REFERENCES collections(id) ON DELETE CASCADE,
        PRIMARY KEY (palette_id, collection_id)
      )
    `
    console.log('[v0] Palette_collections table created successfully')

    console.log('[v0] Creating indexes...')
    await sql`CREATE INDEX IF NOT EXISTS idx_palettes_user_id ON palettes(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_palettes_created_at ON palettes(created_at DESC)`
    await sql`CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id)`
    console.log('[v0] Indexes created successfully')

    console.log('[v0] All tables created successfully!')
  } catch (error) {
    console.error('[v0] Error creating tables:', error)
    throw error
  }
}

createTables()
