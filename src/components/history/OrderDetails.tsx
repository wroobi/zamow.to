import React, { useEffect, useState } from "react";
import type { OrderDetailDto } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function OrderDetails({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) throw new Error("Failed to fetch order details");
        const data = await res.json();
        setOrder(data);
      } catch {
        setError("Nie udało się pobrać szczegółów zamówienia");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (isLoading) return <div className="p-8 text-center text-neutral-500">Ładowanie szczegółów...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!order) return <div className="p-8 text-center">Nie znaleziono zamówienia.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <a href="/app/history">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Zamówienie #{order.id.slice(0, 8)}</h1>
          <p className="text-sm text-neutral-500">Złożone: {new Date(order.created_at).toLocaleString("pl-PL")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Podsumowanie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-neutral-600">Status:</span>
            <span className="font-medium capitalize">{order.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Wartość całkowita:</span>
            <span className="font-bold">{(order.total_amount / 100).toFixed(2)} PLN</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pozycje zamówienia</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-neutral-100">
            {order.items.map((item) => (
              <li key={item.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-neutral-500">
                    {item.quantity} x {(item.price_per_unit / 100).toFixed(2)} PLN
                  </p>
                </div>
                <div className="font-medium">{((item.quantity * item.price_per_unit) / 100).toFixed(2)} PLN</div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
