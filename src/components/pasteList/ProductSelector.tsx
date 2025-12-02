import React, { useState } from "react";
import type { ParsedListItemDto } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductSelectorProps {
  item: ParsedListItemDto;
  index: number;
  onSelect: (index: number, product: { id: string; name: string }) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
}

function ProductSelector({ item, index, onSelect, onUpdateQuantity }: ProductSelectorProps) {
  const [open, setOpen] = useState(false);
  const [isEditingQuantity, setIsEditingQuantity] = useState(true);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity)) {
      onUpdateQuantity(index, newQuantity);
    }
  };

  const increment = () => onUpdateQuantity(index, (item.quantity || 1) + 1);
  const decrement = () => onUpdateQuantity(index, Math.max(1, (item.quantity || 1) - 1));

  if (item.status === "matched" && item.suggested_product) {
    if (isEditingQuantity) {
      return (
        <div className="flex items-center gap-2 mt-1">
          <Button size="sm" variant="outline" onClick={decrement}>
            -
          </Button>
          <Input
            type="number"
            value={item.quantity || 1}
            onChange={handleQuantityChange}
            className="w-16 text-center"
            min="1"
          />
          <Button size="sm" variant="outline" onClick={increment}>
            +
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setIsEditingQuantity(false)}>
            OK
          </Button>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 mt-1 text-xs">
        <span>Ilość: {item.quantity || 1}</span>
        <Button size="sm" variant="ghost" onClick={() => setIsEditingQuantity(true)}>
          Zmień
        </Button>
      </div>
    );
  }

  if (item.status !== "multiple_matches") return null;

  return (
    <div className="text-[10px] mt-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="px-1 py-0.5 border rounded bg-neutral-50 hover:bg-neutral-100 text-neutral-600"
        aria-expanded={open}
        aria-controls={`selector-${index}`}
      >
        {open ? "Zamknij wybór" : "Wybierz"}
      </button>
      {open && (
        <ul id={`selector-${index}`} className="mt-1 space-y-0.5" aria-label="Możliwe dopasowania">
          {item.potential_matches.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(index, p);
                  setOpen(false);
                }}
                className="w-full text-left px-2 py-0.5 rounded border hover:bg-neutral-100"
              >
                {p.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductSelector;
