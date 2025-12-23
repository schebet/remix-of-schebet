import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AIResource {
  name: string;
  content: string;
  type: string;
}

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

    // Extract the JWT token from the Authorization header
    const token = authHeader.replace("Bearer ", "");
    
    // Create a service role client to verify the token and get user info
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

    // Verify the JWT and get the user
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

    console.log("Authenticated user:", user.email);

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
      console.error("User lacks required role:", user.id);
      return new Response(
        JSON.stringify({ error: "Nemate dozvolu za korišćenje AI asistenta" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Role check passed for:", user.email);

    const { action, title, content, category, resources } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build resources context if provided
    let resourcesContext = "";
    if (resources && Array.isArray(resources) && resources.length > 0) {
      console.log(`Processing ${resources.length} resource(s)`);
      resourcesContext = "\n\n--- DODATNI RESURSI ZA KORIŠĆENJE ---\n";
      (resources as AIResource[]).forEach((resource, index) => {
        resourcesContext += `\n[Resurs ${index + 1}: ${resource.name}]\n`;
        resourcesContext += resource.content;
        resourcesContext += "\n---\n";
      });
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "generate") {
      systemPrompt = `Ti si iskusan novinar i pisac za portal sela Šebet. Pišeš zanimljive, informativne i čitljive članke na srpskom jeziku (latinica).
      
Tvoj stil:
- Koristiš jednostavan, ali bogat jezik
- Pišeš u trećem licu
- Uključuješ lokalne detalje i kontekst
- Članci su strukturirani sa jasnim paragrafima
- Koristiš Markdown formatiranje (## za podnaslove, **bold** za isticanje)
${resourcesContext ? "\nIMAS PRISTUP DODATNIM RESURSIMA KOJE SI DOBIO. KORISTI TE INFORMACIJE ZA PISANJE ČLANKA. Integriši te podatke prirodno u tekst." : ""}

Uvek vraćaš JSON sa poljem "content" (tekst članka) i "excerpt" (kratak opis do 160 karaktera).`;

      userPrompt = `Napiši članak sa naslovom: "${title}"${category ? ` u kategoriji "${category}"` : ""}.

Članak treba da ima:
- Uvod koji privlači pažnju
- 2-3 sekcije sa podnaslovima
- Zaključak
${resourcesContext ? `\nKoristi sledeće resurse kao izvor informacija:${resourcesContext}` : ""}

Vrati isključivo validan JSON format:
{"content": "tekst članka u Markdown formatu", "excerpt": "kratak opis"}`;
    } else if (action === "improve") {
      systemPrompt = `Ti si profesionalni urednik i lektor za srpski jezik (latinica). Tvoj zadatak je da poboljšaš tekst tako da bude:
- Gramatički ispravan
- Stilski dotjeran
- Čitljiviji i zanimljiviji
- Bolje strukturiran
${resourcesContext ? "\nIMAS PRISTUP DODATNIM RESURSIMA KOJE SI DOBIO. KORISTI TE INFORMACIJE ZA OBOGAĆIVANJE I POBOLJŠANJE TEKSTA. Dodaj relevantne informacije iz resursa ako su prikladne." : ""}

Zadržavaš originalni smisao i ton teksta.
Uvek vraćaš JSON sa poljem "content" (poboljšan tekst).`;

      userPrompt = `Poboljšaj sledeći tekst:

${content}
${resourcesContext ? `\nMožeš koristiti sledeće resurse za obogaćivanje teksta:${resourcesContext}` : ""}

Vrati isključivo validan JSON format:
{"content": "poboljšan tekst u Markdown formatu"}`;
    } else {
      throw new Error("Nepoznata akcija");
    }

    console.log("Calling AI gateway with action:", action, resourcesContext ? `(with ${resources.length} resources)` : "(no resources)");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Previše zahteva. Pokušajte ponovo za minut.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "AI krediti su potrošeni.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI servis nije dostupan");
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("Prazan odgovor od AI-ja");
    }

    // Parse JSON from AI response
    let result;
    try {
      // Try to extract JSON from the response (sometimes wrapped in markdown code blocks)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = JSON.parse(aiResponse);
      }
    } catch (e) {
      console.error("Failed to parse AI response:", aiResponse);
      // If parsing fails, return the raw content
      result = { content: aiResponse };
    }

    console.log("AI response processed successfully");

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI assistant error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Nepoznata greška",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
