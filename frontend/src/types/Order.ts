export type OrderStatus = 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED';

export interface Order {
  orderId: number;
  status: OrderStatus;
  totalInCents: number;
  clientSecret: string | null;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  items: OrderItemRequest[];
}