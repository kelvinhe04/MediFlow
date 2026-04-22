import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (medicationId: string) => void;
  updateQuantity: (medicationId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.medicationId === item.medicationId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.medicationId === item.medicationId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (medicationId) => {
        set((state) => ({ items: state.items.filter((i) => i.medicationId !== medicationId) }));
      },

      updateQuantity: (medicationId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(medicationId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.medicationId === medicationId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
    }),
    { name: 'mediflow-cart' }
  )
);
