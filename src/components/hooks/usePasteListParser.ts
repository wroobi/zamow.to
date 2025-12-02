import { useCallback, useMemo, useState } from "react";
import type { ParsedListDto, ParsedListItemDto, ProcessListCommand } from "@/types";

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
  confirmedItems: ParsedListItemDto[];
  metrics: Metrics;
  setRawText: (v: string) => void;
  validateRawText: () => string[];
  processText: () => Promise<void>;
  selectProduct: (index: number, product: { id: string; name: string }) => void;
  updateQuantity: (index: number, quantity: number) => void;
  confirmProducts: () => void;
  reset: () => void;
}

export function usePasteListParser(): UsePasteListParserResult {
  const [rawText, setRawText] = useState("");
  const [status, setStatus] = useState<ParserStatus>("idle");
  const [error, setError] = useState<ParserErrorState | null>(null);
  const [parsedItems, setParsedItems] = useState<ParsedListItemDto[]>([]);
  const [confirmedItems, setConfirmedItems] = useState<ParsedListItemDto[]>([]);

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
    const issues = validateRawText();
    if (issues.length) {
      setStatus("error");
      setError({ message: issues[0], code: "VALIDATION" });
      return;
    }
    setStatus("processing");
    try {
      const body: ProcessListCommand = { text: rawText.trim() };
      const res = await fetch("/api/parser/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        if (res.status === 400) {
          const errJson = await res.json().catch(() => ({}));
          setStatus("error");
          setError({ message: errJson.message || "Błąd walidacji", code: "VALIDATION" });
          return;
        }
        setStatus("error");
        setError({ message: "Błąd serwera", code: "SERVER" });
        return;
      }
      const dto: ParsedListDto = await res.json();
      setParsedItems(dto.parsed_items);
      setStatus("success");
      setError(null);
    } catch {
      setStatus("error");
      setError({ message: "Błąd sieci", code: "NETWORK" });
    }
  }, [rawText, validateRawText]);

  const reset = useCallback(() => {
    setRawText("");
    setParsedItems([]);
    setStatus("idle");
    setError(null);
  }, []);

  const confirmProducts = useCallback(() => {
    const confirmed = parsedItems.filter((item) => item.status === "matched" && item.suggested_product);
    setConfirmedItems((prev) => [...prev, ...confirmed]);
    setParsedItems([]);
    setRawText("");
    setStatus("idle");
  }, [parsedItems]);

  const updateQuantity = useCallback((index: number, quantity: number) => {
    setParsedItems((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      const next = [...prev];
      const current = next[index];
      next[index] = {
        ...current,
        quantity: Math.max(1, quantity),
      };
      return next;
    });
  }, []);

  const selectProduct = useCallback((index: number, product: { id: string; name: string }) => {
    setParsedItems((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      const next = [...prev];
      const current = next[index];
      next[index] = {
        ...current,
        status: "matched",
        suggested_product: { id: product.id, name: product.name },
      };
      return next;
    });
  }, []);

  return {
    rawText,
    status,
    error,
    parsedItems,
    confirmedItems,
    metrics,
    setRawText,
    validateRawText,
    processText,
    selectProduct,
    updateQuantity,
    confirmProducts,
    reset,
  };
}

export const PASTE_LIST_CONSTANTS = { MAX_CHARS, SPLIT_REGEX } as const;
