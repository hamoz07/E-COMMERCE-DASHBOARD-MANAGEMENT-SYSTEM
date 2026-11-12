import React from "react";
import "./Skeleton.css";

const Skeleton = ({ width, height, borderRadius = "4px", className = "" }) => {
  return (
    <span
      className={`skeleton ${className}`}
      style={{
        width: width || "100%",
        height: height || "1rem",
        borderRadius,
      }}
    />
  );
};

export default Skeleton;