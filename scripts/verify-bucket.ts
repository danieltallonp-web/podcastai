import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function verifyBucket() {
  console.log("🔍 Verifying Supabase bucket...\n")

  try {
    // List all buckets
    const { data: buckets, error } = await supabase.storage.listBuckets()

    if (error) {
      console.error("❌ Error listing buckets:", error.message)
      process.exit(1)
    }

    console.log("📊 Available buckets:")
    buckets?.forEach((bucket) => {
      console.log(`   - ${bucket.name} (id: ${bucket.id})`)
    })

    console.log("")

    // Check specifically for "podcasts" bucket
    const podcastsBucket = buckets?.find((b) => b.name === "podcasts")
    if (podcastsBucket) {
      console.log("✅ Bucket 'podcasts' exists!")
      console.log("")

      // Try uploading a test file
      console.log("🧪 Testing file upload...")
      const testContent = "This is a test file"
      const testPath = `test-${Date.now()}.txt`

      const { error: uploadError } = await supabase.storage
        .from("podcasts")
        .upload(testPath, Buffer.from(testContent, "utf-8"), {
          contentType: "text/plain",
        })

      if (uploadError) {
        console.error("❌ Upload test failed:", uploadError.message)
        process.exit(1)
      }

      console.log("✅ Successfully uploaded test file!")

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("podcasts")
        .getPublicUrl(testPath)

      console.log("✅ Public URL:", urlData.publicUrl)

      // Cleanup
      await supabase.storage.from("podcasts").remove([testPath])
      console.log("✅ Test file cleaned up")
      console.log("")
      console.log("🎉 Supabase bucket is ready for production!")
    } else {
      console.error("❌ Bucket 'podcasts' not found")
      process.exit(1)
    }
  } catch (error) {
    console.error("❌ Verification failed:", error)
    process.exit(1)
  }
}

verifyBucket()
