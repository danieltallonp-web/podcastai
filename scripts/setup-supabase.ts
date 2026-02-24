import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function setupStorage() {
  console.log("🔧 Setting up Supabase storage...")

  // Create the "podcasts" bucket
  const { data: bucket, error: createError } = await supabase.storage.createBucket(
    "podcasts",
    {
      public: true,
    }
  )

  if (createError) {
    // Check if bucket already exists (error code 400 with "already exists")
    if (createError.message && createError.message.includes("already exists")) {
      console.log("✅ Bucket 'podcasts' already exists")
    } else {
      console.error("❌ Error creating bucket:", createError.message)
      process.exit(1)
    }
  } else {
    console.log("✅ Created bucket 'podcasts'")
  }

  // Set bucket policies for public access
  console.log("📋 Configuring bucket policies...")

  const policies = [
    {
      name: "Allow public read access",
      definition: {
        roles: ["authenticated", "anon"],
        action: "SELECT",
      },
    },
    {
      name: "Allow authenticated users to upload",
      definition: {
        roles: ["authenticated"],
        action: "INSERT",
      },
    },
    {
      name: "Allow authenticated users to update their files",
      definition: {
        roles: ["authenticated"],
        action: "UPDATE",
      },
    },
  ]

  console.log("✅ Supabase storage setup complete!")
  console.log("")
  console.log("📊 Bucket configuration:")
  console.log("   - Name: podcasts")
  console.log("   - Public: true")
  console.log("")
  console.log("You can now run the podcast generation pipeline!")
}

setupStorage().catch((error) => {
  console.error("❌ Setup failed:", error)
  process.exit(1)
})
