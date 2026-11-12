import Skeleton from "../Skeleton/Skeleton";

export const Field = ({ loading, width = "100%", height = "20px", children }) =>
  loading ? <Skeleton width={width} height={height} borderRadius="4px" /> : children;