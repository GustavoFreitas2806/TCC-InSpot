export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="h-52 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/5" />
        </div>
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded-full w-24" />
        </div>
      </div>
    </div>
  );
}
