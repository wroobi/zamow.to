import type { APIRoute } from "astro";
import { z } from "zod";
import type { ParsedListDto, ParsedListItemDto } from "@/types";

export const prerender = false;

const BodySchema = z.object({
  text: z.string().min(1, "Lista nie może być pusta").max(1000, "Przekroczono limit 1000 znaków"),
});

function tokenize(raw: string): string[] {
  return raw
    .trim()
    .split(/[\n,;,+|]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

export const POST: APIRoute = async ({ request, locals }) => {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return new Response(JSON.stringify({ message: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return new Response(JSON.stringify({ message: "Validation failed", errors: parsed.error.flatten() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { text } = parsed.data;
  const tokens = tokenize(text);
  if (tokens.length === 0) {
    return new Response(JSON.stringify({ message: "Brak pozycji po parsowaniu" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { supabase } = locals;

  // Multi-word, name+description matching with word overlap scoring.
  const stopWords = new Set(["do", "na", "i", "w", "z", "o", "oraz"]);
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .trim();
  const splitWords = (s: string) =>
    normalize(s)
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !stopWords.has(w));

  const allWords = tokens.flatMap(splitWords);
  const uniqueWords = Array.from(new Set(allWords));
  if (uniqueWords.length === 0) {
    return new Response(JSON.stringify({ message: "Brak znaczących słów do dopasowania" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (uniqueWords.length > 300) {
    return new Response(JSON.stringify({ message: "Zbyt wiele słów do dopasowania (limit 300)." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const orConditions = uniqueWords
    .map((w) => [`name.ilike.%${w}%`, `description.ilike.%${w}%`])
    .flat()
    .join(",");

  const broadQuery = supabase
    .from("products")
    .select("id, name, description")
    .or(orConditions)
    .eq("is_archived", false)
    .limit(1200);

  const broadData = (await broadQuery).data || [];
  interface ProductVector {
    id: string;
    name: string;
    words: Set<string>;
  }
  const productVectors: ProductVector[] = broadData.map((p) => {
    const text = normalize(`${p.name} ${p.description ?? ""}`);
    const words = new Set(text.split(/\s+/));
    return { id: p.id, name: p.name, words };
  });

  const results: ParsedListItemDto[] = [];
  for (const token of tokens) {
    const tokenWords = splitWords(token);
    const scored = productVectors
      .map((pv) => {
        let score = 0;
        for (const w of tokenWords) if (pv.words.has(w)) score++;
        return { id: pv.id, name: pv.name, score };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);

    let status: ParsedListItemDto["status"] = "not_found";
    let suggested: ParsedListItemDto["suggested_product"] = null;
    let potential: ParsedListItemDto["potential_matches"] = [];

    if (scored.length === 1) {
      status = "matched";
      suggested = { id: scored[0].id, name: scored[0].name };
    } else if (scored.length > 1) {
      if (scored[0].score > scored[1].score) {
        status = "matched";
        suggested = { id: scored[0].id, name: scored[0].name };
        potential = scored.slice(0, 6).map((s) => ({ id: s.id, name: s.name }));
      } else {
        status = "multiple_matches";
        suggested = { id: scored[0].id, name: scored[0].name };
        potential = scored.slice(0, 6).map((s) => ({ id: s.id, name: s.name }));
      }
    }

    results.push({
      original_text: token,
      status,
      suggested_product: suggested,
      potential_matches: potential,
    });
  }

  const dto: ParsedListDto = { parsed_items: results };
  return new Response(JSON.stringify(dto), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
