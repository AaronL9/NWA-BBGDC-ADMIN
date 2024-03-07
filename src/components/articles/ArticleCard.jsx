import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropType from "prop-types";
import { formatDateString } from "../../util/dateFormatter";
import ImageLoader from "../global/image-loader/ImageLoader.jsx";
import { limitString } from "../../util/stringFormatter.js";

export default function ArticleCard({
  title,
  createdAt,
  updatedAt,
  docId,
  imageUrl,
}) {
  const [isImageLoading, setIsImageIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(docId);
  };

  const correctTimeWord = createdAt === updatedAt ? "Posted" : "Updated";

  return (
    <div className="crime-card" onClick={handleClick}>
      <div className="crime-card__image-wrapper">
        {isImageLoading && <ImageLoader />}
        <img
          src={imageUrl[0]}
          alt="image"
          className={
            "crime-card__image" + ` ${isImageLoading ? "loading" : "loaded"}`
          }
          onLoad={() => setIsImageIsLoading(false)}
        />
      </div>
      <div className="crime-card__content">
        <h2 className="crime-card__title">
          <Link>{limitString(title, 32)}</Link>
        </h2>
        <div className="crime-card__date">
          <span>{`${correctTimeWord} on ${formatDateString(updatedAt)}`}</span>
        </div>
      </div>
    </div>
  );
}

ArticleCard.propTypes = {
  title: PropType.string,
  createdAt: PropType.number,
  updatedAt: PropType.number,
  docId: PropType.string,
  imageUrl: PropType.array,
};
