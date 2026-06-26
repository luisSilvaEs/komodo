import { useCartStore } from "../cart/cartStore";

const CartIcon = () => {
  const totalItems = useCartStore((state) => state.totalItems());
  const openDrawer = useCartStore((state) => state.openDrawer);

  return (
    <button
      type="button"
      onClick={openDrawer}
      className="relative p-2 text-gray-600 transition-colors hover:text-gray-900"
      aria-label={`Open cart — ${totalItems} ${totalItems === 1 ? "item" : "items"}`}
    >
      {/* Shopping bag icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>

      {/* Badge — only visible when there are items */}
      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
};

export default CartIcon;
