import React, { useCallback, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { usePasteListParser } from "@/components/hooks/usePasteListParser";
import PasteListTextarea from "./PasteListTextarea";
import ProcessButton from "./ProcessButton";
import HelperText from "./HelperText";
import ShortcutHint from "./ShortcutHint";

function PasteListRoot() {
  const { rawText, setRawText, status, error, processText, validateRawText, metrics } = usePasteListParser();

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

  return (
    <div className="space-y-4" aria-live="polite">
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
          <div className="text-xs text-amber-600" role="status">
            {issues[0]}
          </div>
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
        <div className="mt-6 border rounded p-4">
          <h2 className="text-sm font-medium mb-2">Podgląd przetworzonych pozycji</h2>
          <ul className="text-xs space-y-1 max-h-48 overflow-auto">
            {metrics.itemCountAfterSplit === 0 && <li>Brak pozycji.</li>}
            {rawText
              .trim()
              .split(/[\n,;]+/)
              .map((i) => i.trim())
              .filter(Boolean)
              .slice(0, 20)
              .map((item) => (
                <li key={item} className="truncate">
                  {item}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PasteListRoot;
