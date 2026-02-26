const { execSync } = require('child_process');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;

// Cambiar puerto del pooler al puerto directo
const directUrl = dbUrl.replace(':6543/', ':5432/');

console.log('📍 Conectando a la base de datos...');

try {
  // Usar curl para ejecutar queries SQL directas via HTTP (no funciona)
  // Mejor: usar fetch con node
  
  console.log('❌ Se requiere psql o herramienta SQL directa');
  console.log('\n✅ Alternativa: Usa Supabase Dashboard');
  console.log('   1. Ve a https://supabase.com');
  console.log('   2. Abre tu proyecto "podcastai"');
  console.log('   3. SQL Editor');
  console.log('   4. Ejecuta: DELETE FROM "Podcast"');
  
} catch (err) {
  console.error('Error:', err.message);
}
