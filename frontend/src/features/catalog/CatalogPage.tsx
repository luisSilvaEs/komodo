import { useProducts } from "./useProducts";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

// How many skeleton cards to show while loading —
// matches the expected number of products for a stable layout
const SKELETON_COUNT = 8;

const CatalogPage = () => {
  const { data: products, isLoading, isError } = useProducts();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Our Products
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Browse our catalog and find what you need.
          </p>
        </div>

        {/* Error state */}
        {isError && (
          <div className="flex items-center justify-center py-24">
            <p className="text-sm text-red-500">
              Something went wrong loading the products. Please try again later.
            </p>
          </div>
        )}

        {/* Product grid — skeletons while loading, cards when ready */}
        {!isError && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              : products?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default CatalogPage;
