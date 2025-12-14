import { useCallback, useEffect, useState } from "react";
import type { CartDto } from "@/types";
import { toast } from "sonner";

export function useCart() {
  const [cart, setCart] = useState<CartDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to fetch cart");
      }
      const data: CartDto = await res.json();
      setCart(data);
      setError(null);
    } catch (err: unknown) {
      setError((err as Error).message || "Nie udało się pobrać koszyka");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      try {
        const res = await fetch(`/api/cart/items/${itemId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        });

        if (!res.ok) throw new Error("Failed to update quantity");

        // Optimistic update or refetch
        setCart((prev) => {
          if (!prev) return null;
          const updatedItems = prev.items.map((item) => (item.id === itemId ? { ...item, quantity } : item));
          // Recalculate total roughly (backend is source of truth, but good for UI responsiveness)
          const updatedTotal = updatedItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

          return { ...prev, items: updatedItems, total_amount: updatedTotal };
        });

        toast.success("Zaktualizowano ilość");
      } catch {
        toast.error("Błąd aktualizacji ilości");
        fetchCart(); // Revert on error
      }
    },
    [fetchCart]
  );

  const removeItem = useCallback(async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to remove item");

      setCart((prev) => {
        if (!prev) return null;
        const updatedItems = prev.items.filter((item) => item.id !== itemId);
        const updatedTotal = updatedItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
        return { ...prev, items: updatedItems, total_amount: updatedTotal };
      });

      toast.success("Usunięto produkt z koszyka");
    } catch {
      toast.error("Błąd usuwania produktu");
    }
  }, []);

  return {
    cart,
    isLoading,
    error,
    updateQuantity,
    removeItem,
    refreshCart: fetchCart,
  };
}
