const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-16 h-16 rounded-full bg-gray-200" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
    <div className="h-3 bg-gray-200 rounded w-full mb-2" />
    <div className="h-3 bg-gray-200 rounded w-5/6 mb-4" />
    <div className="flex gap-2">
      <div className="h-6 bg-gray-200 rounded-full w-16" />
      <div className="h-6 bg-gray-200 rounded-full w-20" />
    </div>
  </div>
);

const Loader = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const InlineLoader = () => (
  <div className="flex justify-center items-center py-12">
    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default Loader;
