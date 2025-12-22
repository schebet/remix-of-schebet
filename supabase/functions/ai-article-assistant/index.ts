import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { action, title, content, category } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
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

Uvek vraćaš JSON sa poljem "content" (tekst članka) i "excerpt" (kratak opis do 160 karaktera).`;

      userPrompt = `Napiši članak sa naslovom: "${title}"${category ? ` u kategoriji "${category}"` : ""}.

Članak treba da ima:
- Uvod koji privlači pažnju
- 2-3 sekcije sa podnaslovima
- Zaključak

Vrati isključivo validan JSON format:
{"content": "tekst članka u Markdown formatu", "excerpt": "kratak opis"}`;
    } else if (action === "improve") {
      systemPrompt = `Ti si profesionalni urednik i lektor za srpski jezik (latinica). Tvoj zadatak je da poboljšaš tekst tako da bude:
- Gramatički ispravan
- Stilski dotjeran
- Čitljiviji i zanimljiviji
- Bolje strukturiran

Zadržavaš originalni smisao i ton teksta.
Uvek vraćaš JSON sa poljem "content" (poboljšan tekst).`;

      userPrompt = `Poboljšaj sledeći tekst:

${content}

Vrati isključivo validan JSON format:
{"content": "poboljšan tekst u Markdown formatu"}`;
    } else {
      throw new Error("Nepoznata akcija");
    }

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
