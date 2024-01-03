import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropType from "prop-types";
import { formatTimestamp } from "../../util/dateFormatter";
import { Timestamp } from "firebase/firestore";
import ImageLoader from "../global/image-loader/ImageLoader.jsx";

export default function ArticleCard({ title, createdAt, docId, imageUrl }) {
  const [isImageLoading, setIsImageIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(docId);
  };

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
          <Link>{title}</Link>
        </h2>
        <div className="crime-card__date">
          <span>{`Posted at ${formatTimestamp(createdAt)}`}</span>
        </div>
      </div>
    </div>
  );
}

ArticleCard.propTypes = {
  title: PropType.string,
  createdAt: PropType.instanceOf(Timestamp),
  docId: PropType.string,
  imageUrl: PropType.array,
};
