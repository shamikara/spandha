export default function SkeletonCard() {
  return (
    <div className="wedding-card p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="skeleton-avatar"></div>
        <div className="flex-1 space-y-2">
          <div className="skeleton-text h-4 w-3/4"></div>
          <div className="skeleton-text h-3 w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="skeleton-text h-3 w-full"></div>
        <div className="skeleton-text h-3 w-5/6"></div>
        <div className="skeleton-text h-3 w-4/6"></div>
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-8 w-24 rounded"></div>
        <div className="skeleton h-8 w-24 rounded"></div>
      </div>
    </div>
  )
}
