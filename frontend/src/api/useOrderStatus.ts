import { useQuery } from '@tanstack/react-query';
import type { Order, OrderStatus } from '../types/Order';

const TERMINAL_STATUSES: OrderStatus[] = ['CONFIRMED', 'CANCELLED', 'REFUNDED'];

async function fetchOrderStatus(orderId: number): Promise<Order> {
  const response = await fetch(`/api/v1/orders/${orderId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch order status');
  }

  return response.json();
}

export function useOrderStatus(orderId: number | null) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrderStatus(orderId!),
    enabled: orderId !== null,
    // Poll every 2 seconds until the order reaches a terminal status
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status && TERMINAL_STATUSES.includes(status)) return false;
      return 2000;
    },
  });
}