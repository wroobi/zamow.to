import { useCallback, useMemo, useState } from "react";
import type { ParsedListDto, ParsedListItemDto } from "@/types";

export type ParserStatus = "idle" | "validating" | "processing" | "success" | "error";
export interface ParserErrorState {
  message: string;
  code?: "VALIDATION" | "NETWORK" | "SERVER";
}

const MAX_CHARS = 500;
const SPLIT_REGEX = /[\n,;]+/;

interface Metrics {
  charCount: number;
  lineCount: number;
  itemCountAfterSplit: number;
}

interface UsePasteListParserResult {
  rawText: string;
  status: ParserStatus;
  error: ParserErrorState | null;
  parsedItems: ParsedListItemDto[];
  metrics: Metrics;
  setRawText: (v: string) => void;
  validateRawText: () => string[];
  processText: () => Promise<void>;
  reset: () => void;
}

export function usePasteListParser(): UsePasteListParserResult {
  const [rawText, setRawText] = useState("");
  const [status, setStatus] = useState<ParserStatus>("idle");
  const [error, setError] = useState<ParserErrorState | null>(null);
  const [parsedItems, setParsedItems] = useState<ParsedListItemDto[]>([]);

  const metrics: Metrics = useMemo(() => {
    const trimmed = rawText.trim();
    const charCount = trimmed.length;
    const lineCount = trimmed === "" ? 0 : trimmed.split(/\n/).length;
    const tokens =
      trimmed === ""
        ? []
        : trimmed
            .split(SPLIT_REGEX)
            .map((t) => t.trim())
            .filter(Boolean);
    return { charCount, lineCount, itemCountAfterSplit: tokens.length };
  }, [rawText]);

  const validateRawText = useCallback((): string[] => {
    const issues: string[] = [];
    const t = rawText.trim();
    if (t.length === 0) {
      issues.push("Lista jest pusta");
      return issues;
    }
    if (t.length > MAX_CHARS) {
      issues.push(`Przekroczono limit znaków (${MAX_CHARS})`);
    }
    const items = t
      .split(SPLIT_REGEX)
      .map((i) => i.trim())
      .filter(Boolean);
    if (items.length === 0) {
      issues.push("Brak pozycji po podzieleniu");
    }
    return issues;
  }, [rawText]);

  const processText = useCallback(async () => {
    // Placeholder implementation (API integration will be added in next steps)
    const issues = validateRawText();
    if (issues.length) {
      setStatus("error");
      setError({ message: issues[0], code: "VALIDATION" });
      return;
    }
    setStatus("processing");
    try {
      // Future: fetch('/api/parser/process')...
      const t = rawText.trim();
      const items = t
        .split(SPLIT_REGEX)
        .map((i) => i.trim())
        .filter(Boolean);
      const fakeParsed: ParsedListItemDto[] = items.map((txt) => ({
        original_text: txt,
        status: "not_found",
        suggested_product: null,
        potential_matches: [],
      }));
      const dto: ParsedListDto = { parsed_items: fakeParsed };
      setParsedItems(dto.parsed_items);
      setStatus("success");
      setError(null);
    } catch (e) {
      setStatus("error");
      setError({ message: "Nieoczekiwany błąd", code: "SERVER" });
    }
  }, [rawText, validateRawText]);

  const reset = useCallback(() => {
    setRawText("");
    setParsedItems([]);
    setStatus("idle");
    setError(null);
  }, []);

  return { rawText, status, error, parsedItems, metrics, setRawText, validateRawText, processText, reset };
}

export const PASTE_LIST_CONSTANTS = { MAX_CHARS, SPLIT_REGEX } as const;
