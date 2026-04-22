import { apiClient } from '../shared/apiClient';
import type { CheckoutSession } from '../types';

export function createCheckoutSession(orderId: string, token: string): Promise<CheckoutSession> {
  return apiClient<CheckoutSession>('/checkout', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
    token,
  });
}
