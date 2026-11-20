import Skeleton from "../ui/Skeleton/Skeleton";

export const CategoryCardSkeleton = ({ count = 6 }) => {
  return Array.from({ length: count }).map((_, i) => (
    <div className="col-lg-2 col-md-6 col-12 bg-transparent border-0" key={`cat-card-skeleton-${i}`}>
      <div className="m-1 app-surface border d-flex align-items-center justify-content-start gap-3 rounded p-2 h-100">
        <Skeleton width="50px" height="50px" borderRadius="0.375rem" />
        <Skeleton width="60%" height="16px" borderRadius="4px" />
      </div>
    </div>
  ));
};