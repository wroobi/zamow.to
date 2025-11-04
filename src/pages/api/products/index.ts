import type { APIRoute } from "astro";
import { z } from "zod";
import { ProductService } from "@/lib/services/product.service";

const GetProductsQuerySchema = z.object({
  search: z.string().optional(),
  category_id: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const GET: APIRoute = async ({ locals, url }) => {
  const { supabase } = locals;
  // Convert query params to correct types for zod validation
  const rawParams = Object.fromEntries(url.searchParams.entries());
  const queryParams = {
    ...rawParams,
    page: rawParams.page ? Number(rawParams.page) : undefined,
    limit: rawParams.limit ? Number(rawParams.limit) : undefined,
  };

  const validationResult = GetProductsQuerySchema.safeParse(queryParams);

  if (!validationResult.success) {
    return new Response(
      JSON.stringify({
        message: "Invalid query parameters.",
        errors: validationResult.error.flatten(),
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { search, category_id, page, limit } = validationResult.data;
  const productService = new ProductService(supabase);

  try {
    const paginatedProducts = await productService.getProducts({
      search,
      categoryId: category_id,
      page,
      limit,
    });

    return new Response(JSON.stringify(paginatedProducts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorDetails = error?.cause
      ? typeof error.cause === "object"
        ? JSON.stringify(error.cause)
        : String(error.cause)
      : String(error);
    return new Response(
      JSON.stringify({
        message: "An internal server error occurred.",
        details: errorDetails,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
