import Skeleton from "../ui/Skeleton/Skeleton";

export const CategoryChipSkeleton = ({ count = 8 }) => {
  const widths = ["60px", "80px", "50px", "70px", "90px"];

  return Array.from({ length: count }).map((_, i) => (
    <span
      key={`cat-chip-skeleton-${i}`}
      className="category-naver mb-0 d-inline-flex align-items-center"
      style={{ padding: "0 8px" }}
    >
      <Skeleton
        width={widths[i % widths.length]}
        height="14px"
        borderRadius="4px"
      />
    </span>
  ));
};