import React from "react";
import { Button } from "@/components/ui/button";

interface Props {
  onProcess: () => void;
  disabled: boolean;
  loading: boolean;
}

function ProcessButton({ onProcess, disabled, loading }: Props) {
  return (
    <Button onClick={onProcess} disabled={disabled} variant="default">
      {loading ? "Przetwarzanie..." : "Przetwórz"}
    </Button>
  );
}

export default ProcessButton;
