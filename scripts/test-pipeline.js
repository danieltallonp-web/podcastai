#!/usr/bin/env node

// Load environment variables FIRST
require('dotenv').config({ path: '.env.local' });

// Now run the TypeScript file
require('tsx').default('./scripts/test-pipeline.ts').catch((err) => {
  console.error('Failed to run test:', err);
  process.exit(1);
});
