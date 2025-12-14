import React, { useState } from "react";
import { useCart } from "@/components/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function CartList() {
  const { cart, isLoading, error, updateQuantity, removeItem } = useCart();
  const [isOrdering, setIsOrdering] = useState(false);

  const handlePlaceOrder = async () => {
    if (!confirm("Czy na pewno chcesz złożyć zamówienie?")) return;

    setIsOrdering(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to place order");
      }

      const order = await res.json();
      toast.success("Zamówienie złożone pomyślnie!");

      // Redirect to order details or history
      window.location.href = `/app/history/${order.id}`;
    } catch (err: unknown) {
      toast.error((err as Error).message || "Błąd składania zamówienia");
      setIsOrdering(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-neutral-500">Ładowanie koszyka...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-neutral-500 mb-4">Twój koszyk jest pusty.</p>
        <Button asChild>
          <a href="/app">Wróć do wklejania listy</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {cart.items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-sm text-neutral-500">SKU: {item.product.sku || "-"}</p>
                <p className="text-sm font-medium mt-1">{(item.product.price / 100).toFixed(2)} PLN</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    className="w-16 h-8 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Suma:</span>
            <span>{(cart.total_amount / 100).toFixed(2)} PLN</span>
          </div>
        </CardContent>
        <CardFooter className="bg-neutral-50 p-4 flex justify-end gap-4">
          <Button variant="outline" asChild>
            <a href="/app">Kontynuuj zakupy</a>
          </Button>
          <Button onClick={handlePlaceOrder} disabled={isOrdering}>
            {isOrdering ? "Przetwarzanie..." : "Złóż zamówienie"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
