import { useMutation } from '@tanstack/react-query';
import type { CreateOrderRequest, Order } from '../types/Order';

async function createOrder(request: CreateOrderRequest): Promise<Order> {
  const response = await fetch('/api/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to create order');
  }

  return response.json();
}

export function useCreateOrder() {
  return useMutation({ mutationFn: createOrder });
}