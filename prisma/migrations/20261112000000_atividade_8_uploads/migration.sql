-- Atividade 8: alterações aditivas para imagens e propriedade de restaurantes.
-- Colunas novas nullable preservam registros já existentes.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "ownerId" INTEGER;
ALTER TABLE "Dish" ADD COLUMN IF NOT EXISTS "category" TEXT;
CREATE INDEX IF NOT EXISTS "Restaurant_ownerId_idx" ON "Restaurant"("ownerId");
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Restaurant_ownerId_fkey') THEN
  ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
 END IF;
END $$;
