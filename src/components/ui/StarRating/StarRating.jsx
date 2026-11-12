import { faStar as solid } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export const StarRating = ({ rating = 0 }) => {
  // Clamp rating safely between 0 and 5
  const rounded = Math.max(0, Math.min(Math.round(rating), 5));

  return (
    <span className="single-product__stars" aria-label={`${rounded} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => {
        const isFilled = index < rounded;
        return (
          <FontAwesomeIcon
            key={index} // Safe because it's a single 5-item array loop
            icon={isFilled ? solid : regularStar}
            className={`single-product__star ${isFilled ? "single-product__star--filled" : ""}`}
          />
        );
      })}
    </span>
  );
};