import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");

    if (!slug) {
      return new Response(JSON.stringify({ error: "Slug is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Generating OG image for slug: ${slug}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch article data
    const { data: article, error: articleError } = await supabase
      .from("articles")
      .select("title, slug, category, published_at, cover_image")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (articleError || !article) {
      console.error("Article not found:", articleError);
      return new Response(JSON.stringify({ error: "Article not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Found article: ${article.title}`);

    // Format date
    const publishedDate = article.published_at 
      ? new Date(article.published_at).toLocaleDateString("sr-Latn-RS", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

    // Get category label
    const categoryLabels: Record<string, string> = {
      istorija: "Istorija",
      kultura: "Kultura",
      ljudi: "Ljudi",
      priroda: "Priroda",
      gastronomija: "Gastronomija",
      arhitektura: "Arhitektura",
    };
    const categoryLabel = article.category ? categoryLabels[article.category] || article.category : "";

    // Generate OG image using Lovable AI
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    
    if (!lovableApiKey) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a prompt for generating an OG image
    const prompt = `Create a professional Open Graph image (1200x630 pixels, 16:9 aspect ratio) for a blog article with the following details:

Title: "${article.title}"
Category: "${categoryLabel}"
Date: "${publishedDate}"
Site: "Selo Šebet"

Design requirements:
- Clean, modern design with a dark gradient background (deep forest green to dark blue)
- The title should be prominently displayed in large, white serif font in the center
- Category badge in the top-left corner with a subtle golden/amber accent
- Date displayed below the title in smaller, light gray text
- "Selo Šebet" branding in the bottom-right corner
- Subtle decorative elements like a thin golden line separator
- Professional typography with good hierarchy
- The image should look like a high-quality blog preview card
- Style similar to Dev.to or Hashnode OG images
- Ultra high resolution`;

    console.log("Sending request to Lovable AI...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", errorText);
      return new Response(JSON.stringify({ error: "Failed to generate image" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    console.log("Received response from Lovable AI");

    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "No image generated" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract base64 data and convert to binary
    const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
    const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    // Upload to Supabase Storage
    const fileName = `og-${slug}-${Date.now()}.png`;
    const filePath = `og-images/${fileName}`;

    console.log(`Uploading to storage: ${filePath}`);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("article-images")
      .upload(filePath, binaryData, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(JSON.stringify({ error: "Failed to upload image" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("article-images")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;
    console.log(`OG image generated successfully: ${publicUrl}`);

    // Update article with OG image URL
    await supabase
      .from("articles")
      .update({ og_image: publicUrl })
      .eq("slug", slug);

    return new Response(JSON.stringify({ 
      success: true, 
      url: publicUrl,
      title: article.title 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating OG image:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
