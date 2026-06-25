import type { Product } from "../../types/product";
import { formatMoney } from "../../utils/money";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const isOutOfStock = product.stockQuantity === 0;

  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      {/* Product image */}
      <div className="relative h-56 bg-gray-50 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4">
        {/* Category badge */}
        <span className="w-fit rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-500">
          {product.category}
        </span>

        {/* Name */}
        <h2 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
          {product.name}
        </h2>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        <div className="mt-2 flex items-center justify-between">
          {/* Price */}
          <span className="text-sm font-bold text-gray-900">
            {formatMoney(product.priceInCents, product.currency)}
          </span>

          {/* Add to cart — wired up in Phase 2 */}
          <button
            type="button"
            disabled={isOutOfStock}
            className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
