const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="h-56 bg-gray-200" />

      <div className="flex flex-col gap-3 p-4">
        {/* Category badge placeholder */}
        <div className="h-4 w-16 rounded-full bg-gray-200" />

        {/* Name placeholder */}
        <div className="h-5 w-3/4 rounded bg-gray-200" />

        {/* Description placeholders */}
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 w-full rounded bg-gray-200" />
          <div className="h-3.5 w-5/6 rounded bg-gray-200" />
        </div>

        <div className="mt-2 flex items-center justify-between">
          {/* Price placeholder */}
          <div className="h-5 w-24 rounded bg-gray-200" />
          {/* Button placeholder */}
          <div className="h-9 w-28 rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
