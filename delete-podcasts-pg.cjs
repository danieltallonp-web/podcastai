const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

async function main() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Get users
    const usersRes = await client.query('SELECT id, email FROM "User"');
    const users = usersRes.rows;
    
    if (users.length === 0) {
      console.log('❌ No users found');
      return;
    }
    
    for (const user of users) {
      console.log(`\n📋 User: ${user.email}`);
      
      // Count podcasts
      const countRes = await client.query(
        'SELECT COUNT(*) FROM "Podcast" WHERE "userId" = $1',
        [user.id]
      );
      const count = parseInt(countRes.rows[0].count, 10);
      
      if (count === 0) {
        console.log('   ✓ No podcasts found');
        continue;
      }
      
      console.log(`   Found ${count} podcast(s)`);
      
      // Delete podcasts
      const deleteRes = await client.query(
        'DELETE FROM "Podcast" WHERE "userId" = $1',
        [user.id]
      );
      
      console.log(`   ✅ Deleted ${deleteRes.rowCount} podcast(s)`);
    }
    
    console.log('\n✅ All done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

main();
