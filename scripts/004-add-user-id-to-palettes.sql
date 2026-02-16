-- Add owner to palettes so records are scoped per authenticated user
ALTER TABLE palettes
ADD COLUMN IF NOT EXISTS user_id TEXT;

-- Speed up per-user listing and filtering
CREATE INDEX IF NOT EXISTS idx_palettes_user_id ON palettes(user_id);
CREATE INDEX IF NOT EXISTS idx_palettes_user_id_created_at ON palettes(user_id, created_at DESC);
