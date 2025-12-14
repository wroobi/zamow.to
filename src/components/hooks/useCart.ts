import { useCallback, useEffect, useState } from "react";
import type { CartDto, CartItemDto } from "@/types";
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
        console.error("Cart fetch error:", errData);
        throw new Error(errData.error || "Failed to fetch cart");
      }
      const data: CartDto = await res.json();
      setCart(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Nie udało się pobrać koszyka");
      console.error(err);
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
      } catch (err) {
        toast.error("Błąd aktualizacji ilości");
        console.error(err);
        fetchCart(); // Revert on error
      }
    },
    [fetchCart]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
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
      } catch (err) {
        toast.error("Błąd usuwania produktu");
        console.error(err);
        fetchCart();
      }
    },
    [fetchCart]
  );

  return {
    cart,
    isLoading,
    error,
    updateQuantity,
    removeItem,
    refreshCart: fetchCart,
  };
}
