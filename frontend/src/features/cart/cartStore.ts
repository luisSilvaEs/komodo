import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "../../types/Cart";
import type { Product } from "../../types/product";

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;

  // Derived values
  totalItems: () => number;
  totalInCents: () => number;

  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      totalItems() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      totalInCents() {
        return get().items.reduce(
          (sum, item) => sum + item.product.priceInCents * item.quantity,
          0
        );
      },

      addItem(product) {
        const items = get().items;
        const existing = items.find((i) => i.product.id === product.id);

        if (existing) {
          // Cap at the product's stock quantity
          const newQuantity = Math.min(
            existing.quantity + 1,
            product.stockQuantity
          );
          set({
            items: items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: newQuantity }
                : i
            ),
          });
        } else {
          // Only add if stock is available
          if (product.stockQuantity > 0) {
            set({ items: [...items, { product, quantity: 1 }] });
          }
        }
      },

      removeItem(productId) {
        set({ items: get().items.filter((i) => i.product.id !== productId) });
      },

      updateQuantity(productId, quantity) {
        if (quantity < 1) {
          // Treat setting to 0 as removal
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((i) => {
            if (i.product.id !== productId) return i;
            // Cap at stock quantity
            const capped = Math.min(quantity, i.product.stockQuantity);
            return { ...i, quantity: capped };
          }),
        });
      },

      clearCart() {
        set({ items: [] });
      },

      openDrawer() {
        set({ isDrawerOpen: true });
      },

      closeDrawer() {
        set({ isDrawerOpen: false });
      },
    }),
    {
      name: "komodo-cart", // localStorage key
      // Only persist the items array — drawer state should not survive a refresh
      partialize: (state) => ({ items: state.items }),
    }
  )
);