import { useCartStore } from "../cart/cartStore";
import { formatMoney } from "../../utils/money";
import type { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const openDrawer = useCartStore((state) => state.openDrawer);
  const cartItems = useCartStore((state) => state.items);

  const isOutOfStock = product.stockQuantity === 0;

  // How many of this product are already in the cart
  const cartItem = cartItems.find((i) => i.product.id === product.id);
  const quantityInCart = cartItem?.quantity ?? 0;
  const isAtStockLimit = quantityInCart >= product.stockQuantity;

  function handleAddToCart() {
    addItem(product);
    openDrawer();
  }

  return (
    <div className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      {/* Product image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gray-100" />
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          {product.category}
        </span>

        <h2 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
          {product.name}
        </h2>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        <div className="mt-2 flex items-center justify-between">
          {/* Price */}
          <span className="text-sm font-bold text-gray-900">
            {formatMoney(product.priceInCents, product.currency)}
          </span>

          {/* Add to cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAtStockLimit}
            className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isAtStockLimit && !isOutOfStock ? "Max reached" : "Add to cart"}
          </button>
        </div>

        {/* Quantity in cart indicator */}
        {quantityInCart > 0 && (
          <p className="text-[10px] text-gray-400">{quantityInCart} in cart</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
