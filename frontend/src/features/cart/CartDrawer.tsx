import { useCartStore } from "./cartStore";
import { formatMoney } from "../../utils/money";

const CartDrawer = () => {
  const items = useCartStore((state) => state.items);
  const totalInCents = useCartStore((state) => state.totalInCents());
  const isDrawerOpen = useCartStore((state) => state.isDrawerOpen);
  const closeDrawer = useCartStore((state) => state.closeDrawer);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  // Infer currency from first item — all products share the same currency in Module 1
  const currency = items[0]?.product.currency ?? "MXN";

  return (
    <>
      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="text-base font-semibold text-gray-900">
            Your cart
            {items.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.25}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className="text-sm font-medium text-gray-500">
              Your cart is empty
            </p>
            <p className="text-xs text-gray-400">
              Add something from the catalog to get started.
            </p>
            <button
              type="button"
              onClick={closeDrawer}
              className="mt-2 rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-gray-700"
            >
              Browse products
            </button>
          </div>
        ) : (
          <>
            {/* Item list */}
            <ul className="flex-1 divide-y divide-gray-50 overflow-y-auto px-6">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4 py-5">
                  {/* Product image */}
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-sm font-medium leading-snug text-gray-900 line-clamp-2">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-400">{product.category}</p>

                    <div className="mt-auto flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(product.id, quantity - 1)
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Decrease quantity"
                          disabled={quantity <= 1}
                        >
                          <span className="text-sm leading-none">−</span>
                        </button>

                        <span className="w-5 text-center text-sm font-medium text-gray-900">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(product.id, quantity + 1)
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Increase quantity"
                          disabled={quantity >= product.stockQuantity}
                        >
                          <span className="text-sm leading-none">+</span>
                        </button>
                      </div>

                      {/* Line total + remove */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatMoney(
                            product.priceInCents * quantity,
                            product.currency,
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(product.id)}
                          className="text-gray-300 transition-colors hover:text-red-400"
                          aria-label={`Remove ${product.name}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer — subtotal + checkout */}
            <div className="border-t border-gray-100 px-6 py-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="text-base font-bold text-gray-900">
                  {formatMoney(totalInCents, currency)}
                </span>
              </div>
              <p className="mb-4 text-xs text-gray-400">
                Taxes and shipping calculated at checkout.
              </p>
              <button
                type="button"
                className="w-full rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
                // onClick will navigate to /checkout in Phase 3
              >
                Proceed to checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
