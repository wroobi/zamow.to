import type { SupabaseClient } from "@/db/supabase.client";
import type { PaginatedResponse, ProductListItemDto } from "@/types";
import { z } from "zod";

const GetProductsParams = z.object({
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

type GetProductsParams = z.infer<typeof GetProductsParams>;

export class ProductService {
  constructor(private supabase: SupabaseClient) {}

  async getProducts(params: GetProductsParams): Promise<PaginatedResponse<ProductListItemDto>> {
    const { search, categoryId, page, limit } = GetProductsParams.parse(params);

    let query = this.supabase
      .from("products")
      .select("id, name, description, price, sku, category_id", {
        count: "exact",
      })
      .eq("is_archived", false);

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data, error, count } = await query.range((page - 1) * limit, page * limit - 1);

    if (error) {
      console.error("Error fetching products:", error);
      throw new Error("Could not fetch products.");
    }

    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
      },
    };
  }
}
