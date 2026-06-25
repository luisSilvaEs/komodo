export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  category: string;
  priceInCents: number;
  currency: string;
  imageUrl: string;
  stockQuantity: number;
}