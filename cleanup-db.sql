-- Listar todos los podcasts
SELECT id, "userId", title, status, "createdAt" FROM "Podcast" LIMIT 20;

-- Contar total de podcasts por usuario
SELECT "userId", COUNT(*) as total FROM "Podcast" GROUP BY "userId";

-- Borrar todos los podcasts (comentado por seguridad)
-- DELETE FROM "Podcast";
