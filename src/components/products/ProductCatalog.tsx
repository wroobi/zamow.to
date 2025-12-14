import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { ProductListItemDto, PaginatedResponse } from "@/types";

export default function ProductCatalog() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<ProductListItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({ limit: "20" });
        if (debouncedSearch) params.set("search", debouncedSearch);

        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch products");

        const data: PaginatedResponse<ProductListItemDto> = await res.json();
        setProducts(data.data);
      } catch {
        toast.error("Błąd pobierania produktów");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearch]);

  const addToCart = async (product: ProductListItemDto) => {
    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      toast.success(`Dodano do koszyka: ${product.name}`);
    } catch {
      toast.error("Nie udało się dodać produktu");
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
        <Input
          placeholder="Szukaj produktów..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="text-center text-neutral-500 py-8">Ładowanie...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-neutral-500 py-8">Nie znaleziono produktów.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-neutral-500 line-clamp-2 mt-1">{product.description || "Brak opisu"}</p>
                    <p className="text-xs text-neutral-400 mt-2">SKU: {product.sku || "-"}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-semibold mb-2">{(product.price / 100).toFixed(2)} PLN</div>
                    <Button size="sm" variant="secondary" onClick={() => addToCart(product)}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Dodaj
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
