import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify user authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Niste prijavljeni" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Authentication failed:", authError?.message);
      return new Response(
        JSON.stringify({ error: "Neovlašćen pristup" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if user has author or admin role
    const { data: hasAuthorRole } = await supabaseAdmin.rpc("has_role", {
      _user_id: user.id,
      _role: "author",
    });

    const { data: hasAdminRole } = await supabaseAdmin.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (!hasAuthorRole && !hasAdminRole) {
      return new Response(
        JSON.stringify({ error: "Nemate dozvolu za ovu akciju" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { pdfBase64, fileName } = await req.json();

    if (!pdfBase64) {
      return new Response(
        JSON.stringify({ error: "PDF sadržaj nije prosleđen" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Parsing PDF: ${fileName}`);

    // Decode base64 to bytes
    const pdfBytes = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));
    
    // Use pdf-parse compatible approach for Deno
    // Extract text using a simple PDF text extraction
    const text = extractTextFromPdf(pdfBytes);
    
    console.log(`Extracted ${text.length} characters from PDF`);

    return new Response(
      JSON.stringify({ 
        content: text.slice(0, 50000), // Limit to 50k chars
        fileName 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("PDF parsing error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Greška pri parsiranju PDF-a",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Simple PDF text extraction function
// This extracts text streams from PDF without external dependencies
function extractTextFromPdf(pdfBytes: Uint8Array): string {
  const pdfString = new TextDecoder('latin1').decode(pdfBytes);
  const textParts: string[] = [];
  
  // Pattern to find text streams in PDF
  // Look for BT (begin text) and ET (end text) blocks
  const streamRegex = /stream\s*([\s\S]*?)\s*endstream/g;
  let match;
  
  while ((match = streamRegex.exec(pdfString)) !== null) {
    const streamContent = match[1];
    
    // Extract text from Tj and TJ operators
    const tjRegex = /\(([^)]*)\)\s*Tj/g;
    let tjMatch;
    while ((tjMatch = tjRegex.exec(streamContent)) !== null) {
      textParts.push(decodeEscapedString(tjMatch[1]));
    }
    
    // Extract text from TJ arrays
    const tjArrayRegex = /\[(.*?)\]\s*TJ/g;
    let tjArrayMatch;
    while ((tjArrayMatch = tjArrayRegex.exec(streamContent)) !== null) {
      const arrayContent = tjArrayMatch[1];
      const stringRegex = /\(([^)]*)\)/g;
      let strMatch;
      while ((strMatch = stringRegex.exec(arrayContent)) !== null) {
        textParts.push(decodeEscapedString(strMatch[1]));
      }
    }
  }
  
  // Also try to find text in content streams directly
  // Some PDFs use different encoding
  const textMatches = pdfString.match(/\([\x20-\x7E]+\)/g);
  if (textMatches && textParts.length === 0) {
    for (const m of textMatches) {
      const inner = m.slice(1, -1);
      if (inner.length > 3 && /[a-zA-Z]/.test(inner)) {
        textParts.push(decodeEscapedString(inner));
      }
    }
  }
  
  let result = textParts.join(' ').trim();
  
  // Clean up the text
  result = result.replace(/\s+/g, ' ');
  result = result.replace(/[^\x20-\x7E\u0100-\u017F\u0400-\u04FF]/g, ' ');
  result = result.trim();
  
  // If extraction failed, provide a helpful message
  if (result.length < 50) {
    return `[PDF tekst nije mogao biti u potpunosti ekstrahovan. PDF fajl "${result || 'nepoznat sadržaj'}"]`;
  }
  
  return result;
}

function decodeEscapedString(str: string): string {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\')
    .replace(/\\([()])/g, '$1');
}
