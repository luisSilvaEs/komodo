import { useQuery } from "@tanstack/react-query";
import type { Product } from "../../types/product";

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
}