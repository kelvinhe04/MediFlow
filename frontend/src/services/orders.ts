import { apiClient } from '../shared/apiClient';
import type { CreateOrderResponse, Order } from '../types';

export function createOrder(
  items: Array<{ medicationId: string; quantity: number }>,
  token: string
): Promise<CreateOrderResponse> {
  return apiClient<CreateOrderResponse>('/orders', {
    method: 'POST',
    body: JSON.stringify({ items }),
    token,
  });
}

export function getOrder(id: string, token: string): Promise<Order> {
  return apiClient<Order>(`/orders/${id}`, { token });
}
