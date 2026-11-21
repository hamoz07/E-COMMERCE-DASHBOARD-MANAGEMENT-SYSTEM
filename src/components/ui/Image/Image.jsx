// components/ui/Image/Image.jsx
import { useState, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./Image.module.css";

const FALLBACK_SRC = "/assets/placeholder-product.png"; // neutral grey box

/**
 * Builds CDN URL with resize/format params.
 * Swap this for your actual CDN (Cloudinary, Imgix, CloudFront, etc.)
 * If you have no CDN yet, it returns the original src unchanged.
 */
const buildCdnUrl = (src, { width, format = "webp", quality = 80 } = {}) => {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) return src;

  // --- Cloudinary example ---
  // if (src.includes("cloudinary.com")) {
  //   const transforms = [`f_${format}`, `q_${quality}`, width ? `w_${width}` : ""].filter(Boolean).join(",");
  //   return src.replace("/upload/", `/upload/${transforms}/`);
  // }

  // --- Imgix example ---
  // const url = new URL(src);
  // if (width) url.searchParams.set("w", width);
  // url.searchParams.set("fm", format);
  // url.searchParams.set("q", quality);
  // return url.toString();

  // No CDN — return as-is
  return src;
};

/**
 * Builds a srcset string for multiple densities or widths.
 * widths: [320, 640, 960, 1280] → "cdn-url?w=320 320w, cdn-url?w=640 640w, ..."
 */
const buildSrcSet = (src, widths, format) => {
  if (!src || !widths?.length) return undefined;
  return widths
    .map((w) => `${buildCdnUrl(src, { width: w, format })} ${w}w`)
    .join(", ");
};

const Image = ({
  src,
  alt,
  width,
  height,
  sizes,
  srcSetWidths,
  priority = false,   // true = LCP/hero image — no lazy load, fetchpriority high
  lazy = true,
  placeholder = true, // show background while loading
  fallback = FALLBACK_SRC,
  className = "",
  style,
  objectFit = "cover",
  quality = 80,
  onLoad,
  onError: onErrorProp,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const imgRef = useRef(null);

  const resolvedSrc = errored ? fallback : (src || fallback);
  const shouldLazy = !priority && lazy;

  // Build CDN-optimised URLs
  const webpSrc    = buildCdnUrl(resolvedSrc, { format: "webp", quality });
  const avifSrc    = buildCdnUrl(resolvedSrc, { format: "avif", quality });
  const fallbackSrc = buildCdnUrl(resolvedSrc, { format: "jpeg", quality });

  const webpSrcSet  = buildSrcSet(resolvedSrc, srcSetWidths, "webp");
  const avifSrcSet  = buildSrcSet(resolvedSrc, srcSetWidths, "avif");

  const handleLoad = (e) => {
    setLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    if (!errored) {
      setErrored(true); // triggers re-render with fallback src
    }
    onErrorProp?.(e);
  };

  return (
    <picture
      className={`${styles.wrapper} ${!loaded && placeholder ? styles.placeholder : ""} ${className}`}
      style={{ width, height, ...style }}
    >
      {/* AVIF — best compression, newest format */}
      {!errored && (
        <source
          type="image/avif"
          srcSet={avifSrcSet || avifSrc}
          sizes={sizes}
        />
      )}

      {/* WebP — wide support, good compression */}
      {!errored && (
        <source
          type="image/webp"
          srcSet={webpSrcSet || webpSrc}
          sizes={sizes}
        />
      )}

      {/* JPEG/PNG fallback */}
      <img
        ref={imgRef}
        src={fallbackSrc}
        srcSet={buildSrcSet(resolvedSrc, srcSetWidths, "jpeg")}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={shouldLazy ? "lazy" : "eager"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        onLoad={handleLoad}
        onError={handleError}
        className={`
          ${styles.img}
          ${loaded ? styles.loaded : styles.loading}
        `}
        style={{ objectFit }}
        {...rest}
      />
    </picture>
  );
};

Image.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sizes: PropTypes.string,
  srcSetWidths: PropTypes.arrayOf(PropTypes.number),
  priority: PropTypes.bool,
  lazy: PropTypes.bool,
  placeholder: PropTypes.bool,
  fallback: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  objectFit: PropTypes.oneOf(["cover", "contain", "fill", "none", "scale-down"]),
  quality: PropTypes.number,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
};

export default Image;