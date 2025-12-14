import React, { useEffect, useState } from "react";
import type { OrderListItemDto } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OrderHistoryList() {
  const [orders, setOrders] = useState<OrderListItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError("Nie udało się pobrać historii zamówień");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) return <div className="p-8 text-center text-neutral-500">Ładowanie historii...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  if (orders.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-neutral-500 mb-4">Brak zamówień w historii.</p>
        <Button asChild>
          <a href="/app">Złóż pierwsze zamówienie</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="hover:bg-neutral-50 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">Zamówienie #{order.id.slice(0, 8)}</p>
              <p className="text-sm text-neutral-500">
                {new Date(order.created_at).toLocaleDateString("pl-PL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{(order.total_amount / 100).toFixed(2)} PLN</p>
              <p className="text-sm text-neutral-500 capitalize">{order.status}</p>
            </div>
            <Button variant="outline" size="sm" asChild className="ml-4">
              <a href={`/app/history/${order.id}`}>Szczegóły</a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
