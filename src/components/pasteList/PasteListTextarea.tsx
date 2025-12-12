import React, { useEffect, useRef } from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

function PasteListTextarea({ value, onChange, disabled, ...rest }: Props) {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <textarea
      id="paste-list"
      ref={ref}
      className="w-full min-h-[200px] rounded border border-neutral-300 p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-50"
      aria-describedby="paste-list-help"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Wklej tutaj listę produktów..."
      disabled={disabled}
      {...rest}
    />
  );
}

export default PasteListTextarea;
