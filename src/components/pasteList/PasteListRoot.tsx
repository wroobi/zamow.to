import React, { useCallback, useEffect } from "react";
import type { ParsedListItemDto } from "@/types";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { usePasteListParser } from "@/components/hooks/usePasteListParser";
import PasteListTextarea from "./PasteListTextarea";
import ProcessButton from "./ProcessButton";
import HelperText from "./HelperText";
import ShortcutHint from "./ShortcutHint";
import ProductSelector from "./ProductSelector";
import { Button } from "@/components/ui/button";

function PasteListRoot() {
  const {
    rawText,
    setRawText,
    status,
    error,
    processText,
    validateRawText,
    metrics,
    parsedItems,
    selectProduct,
    updateQuantity,
    confirmProducts,
    confirmedItems,
  } = usePasteListParser();

  const onProcess = useCallback(async () => {
    await processText();
  }, [processText]);

  // Toast notifications on status change / error
  useEffect(() => {
    if (status === "success") {
      toast.success(`Przetworzono ${metrics.itemCountAfterSplit} pozycji`);
    }
  }, [status, metrics.itemCountAfterSplit]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  // Ctrl+Enter shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        onProcess();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onProcess]);

  const issues = validateRawText();
  const isProcessing = status === "processing";
  const disabled = isProcessing || issues.length > 0;
  const canConfirm = parsedItems.some((item) => item.status === "matched");

  return (
    <div className="space-y-4" aria-live="polite">
      {confirmedItems.length > 0 && (
        <div className="border rounded p-4" role="region" aria-label="Zatwierdzone produkty">
          <h2 className="text-sm font-medium mb-4">Zatwierdzone produkty ({confirmedItems.length})</h2>
          <ul className="text-xs space-y-1">
            {confirmedItems.map((item, index) => (
              <li key={`${item.original_text}-${index}`} className="flex justify-between">
                <span>
                  {item.suggested_product?.name} (x{item.quantity || 1})
                </span>
                <span className="text-neutral-500">{item.original_text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="space-y-2">
        <PasteListTextarea
          value={rawText}
          onChange={setRawText}
          disabled={isProcessing}
          aria-invalid={issues.length > 0 ? true : undefined}
        />
        <HelperText />
        <ShortcutHint />
        <div className="text-xs text-neutral-500">
          Znaki: {metrics.charCount} • Wiersze: {metrics.lineCount} • Pozycje: {metrics.itemCountAfterSplit}
        </div>
        {issues.length > 0 && (
          <ul className="text-xs text-amber-600 list-disc pl-4" role="status" aria-label="Błędy walidacji">
            {issues.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        )}
        {error && (
          <div role="alert" className="text-xs text-red-600">
            {error.message}
          </div>
        )}
      </div>
      <ProcessButton onProcess={onProcess} disabled={disabled} loading={isProcessing} />
      <Toaster />
      {status === "success" && (
        <div className="mt-6 border rounded p-4" role="region" aria-label="Wyniki dopasowania">
          <h2 className="text-sm font-medium mb-4 flex items-center gap-2">
            Wyniki ({parsedItems.length})
            <span className="ml-auto flex gap-2 text-[10px] font-normal text-neutral-500" aria-label="Legenda statusów">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />✓
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-yellow-500" />~
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500" />✕
              </span>
            </span>
          </h2>
          <ul className="text-xs space-y-1 max-h-64 overflow-auto">
            {parsedItems.slice(0, 50).map((item: ParsedListItemDto, idx) => (
              <li key={item.original_text} className="py-0.5">
                <div className="flex justify-between gap-4">
                  <span className="truncate" title={item.original_text}>
                    {item.original_text}
                    {item.suggested_product && (
                      <span className="ml-2 text-[10px] text-neutral-500" title={item.suggested_product.name}>
                        → {item.suggested_product.name}
                      </span>
                    )}
                  </span>
                  <span
                    className={
                      item.status === "matched"
                        ? "inline-flex items-center gap-1 text-green-600"
                        : item.status === "multiple_matches"
                          ? "inline-flex items-center gap-1 text-yellow-600"
                          : "inline-flex items-center gap-1 text-red-600"
                    }
                  >
                    <span
                      className={
                        item.status === "matched"
                          ? "h-2 w-2 rounded-full bg-green-500"
                          : item.status === "multiple_matches"
                            ? "h-2 w-2 rounded-full bg-yellow-500"
                            : "h-2 w-2 rounded-full bg-red-500"
                      }
                    />
                    {item.status === "matched" && "✓"}
                    {item.status === "multiple_matches" && "~"}
                    {item.status === "not_found" && "✕"}
                  </span>
                </div>
                <ProductSelector item={item} index={idx} onSelect={selectProduct} onUpdateQuantity={updateQuantity} />
              </li>
            ))}
          </ul>
          {parsedItems.length > 50 && <p className="mt-2 text-[10px] text-neutral-400">(Wyświetlono pierwsze 50)</p>}
          {canConfirm && (
            <div className="mt-4">
              <Button onClick={confirmProducts}>Zatwierdź produkty</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PasteListRoot;
