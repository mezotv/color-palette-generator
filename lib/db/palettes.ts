import { neon } from '@neondatabase/serverless'
import type { Palette, Collection } from '@/lib/types/color'

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }
  return neon(process.env.DATABASE_URL)
}

// Palette Operations

function mapPaletteRow(row: any): Palette {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    colors: Array.isArray(row.colors) ? row.colors : [],
    harmonyType: row.harmony_type,
    isFavorite: row.is_favorite,
    tags: Array.isArray(row.tags) ? row.tags : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

type PaletteInsert = Omit<Palette, 'id' | 'createdAt' | 'updatedAt' | 'userId'>

export async function createPalette(userId: string, palette: PaletteInsert) {
  const sql = getDb()
  const result = await sql`
    INSERT INTO palettes (user_id, name, colors, harmony_type, is_favorite, tags)
    VALUES (${userId}, ${palette.name}, ${JSON.stringify(palette.colors)}, ${palette.harmonyType}, ${palette.isFavorite}, ${palette.tags ?? []})
    RETURNING *
  `
  return mapPaletteRow(result[0])
}

export async function getAllPalettes(userId: string) {
  const sql = getDb()
  const result = await sql`
    SELECT * FROM palettes
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `
  return result.map(mapPaletteRow)
}

export async function getPaletteById(id: number, userId: string) {
  const sql = getDb()
  const result = await sql`
    SELECT * FROM palettes
    WHERE id = ${id} AND user_id = ${userId}
  `
  if (result.length === 0) return null

  return mapPaletteRow(result[0])
}

export async function updatePalette(id: number, updates: Partial<Palette>, userId: string) {
  const sql = getDb()
  // Build update query dynamically based on provided fields
  if (updates.name !== undefined) {
    const result = await sql`
      UPDATE palettes
      SET name = ${updates.name}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *
    `
    if (result.length === 0) return null
    return mapPaletteRow(result[0])
  }
  
  if (updates.isFavorite !== undefined) {
    const result = await sql`
      UPDATE palettes
      SET is_favorite = ${updates.isFavorite}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *
    `
    if (result.length === 0) return null
    return mapPaletteRow(result[0])
  }
  
  return null
}

export async function deletePalette(id: number, userId: string) {
  const sql = getDb()
  await sql`
    DELETE FROM palettes
    WHERE id = ${id} AND user_id = ${userId}
  `
}

export async function toggleFavorite(id: number, userId: string) {
  const sql = getDb()
  const result = await sql`
    UPDATE palettes
    SET is_favorite = NOT is_favorite, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id} AND user_id = ${userId}
    RETURNING is_favorite
  `
  return result[0]?.is_favorite
}

export async function searchPalettes(query: string, userId: string) {
  const sql = getDb()
  const result = await sql`
    SELECT * FROM palettes
    WHERE user_id = ${userId}
      AND (
        name ILIKE ${`%${query}%`}
       OR ${query} = ANY(tags)
      )
    ORDER BY created_at DESC
  `
  return result.map(mapPaletteRow)
}

export async function getFavoritePalettes(userId: string) {
  const sql = getDb()
  const result = await sql`
    SELECT * FROM palettes
    WHERE user_id = ${userId} AND is_favorite = true
    ORDER BY created_at DESC
  `
  return result.map(mapPaletteRow)
}

// Collection Operations

export async function createCollection(collection: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>) {
  const sql = getDb()
  const result = await sql`
    INSERT INTO collections (name, description, color)
    VALUES (${collection.name}, ${collection.description || null}, ${collection.color})
    RETURNING *
  `
  return result[0]
}

export async function getAllCollections() {
  const sql = getDb()
  const result = await sql`
    SELECT * FROM collections
    ORDER BY created_at DESC
  `
  return result
}

export async function updateCollection(id: number, updates: Partial<Collection>) {
  const sql = getDb()
  if (updates.name !== undefined) {
    const result = await sql`
      UPDATE collections
      SET name = ${updates.name}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return result[0]
  }
  
  if (updates.description !== undefined) {
    const result = await sql`
      UPDATE collections
      SET description = ${updates.description}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return result[0]
  }
  
  if (updates.color !== undefined) {
    const result = await sql`
      UPDATE collections
      SET color = ${updates.color}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return result[0]
  }
  
  return null
}

export async function deleteCollection(id: number) {
  const sql = getDb()
  await sql`
    DELETE FROM collections
    WHERE id = ${id}
  `
}

// Palette-Collection Operations

export async function addPaletteToCollection(paletteId: number, collectionId: number) {
  const sql = getDb()
  await sql`
    INSERT INTO palette_collections (palette_id, collection_id)
    VALUES (${paletteId}, ${collectionId})
    ON CONFLICT DO NOTHING
  `
}

export async function removePaletteFromCollection(paletteId: number, collectionId: number) {
  const sql = getDb()
  await sql`
    DELETE FROM palette_collections
    WHERE palette_id = ${paletteId} AND collection_id = ${collectionId}
  `
}

export async function getPalettesByCollection(collectionId: number) {
  const sql = getDb()
  const result = await sql`
    SELECT p.* FROM palettes p
    JOIN palette_collections pc ON p.id = pc.palette_id
    WHERE pc.collection_id = ${collectionId}
    ORDER BY pc.added_at DESC
  `
  return result.map(row => ({
    id: row.id,
    name: row.name,
    colors: row.colors,
    harmonyType: row.harmony_type,
    isFavorite: row.is_favorite,
    tags: row.tags,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}

export async function getCollectionsByPalette(paletteId: number) {
  const sql = getDb()
  const result = await sql`
    SELECT c.* FROM collections c
    JOIN palette_collections pc ON c.id = pc.collection_id
    WHERE pc.palette_id = ${paletteId}
    ORDER BY pc.added_at DESC
  `
  return result
}
