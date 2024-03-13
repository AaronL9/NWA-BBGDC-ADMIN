import PropType from "prop-types";
import ImageLoader from "../global/image-loader/ImageLoader.jsx";
import { useState } from "react";

export default function ReportMedia({ url }) {
  const [isImageLoading, setIsImageIsLoading] = useState(true);

  return (
    <div className="report-form__image-wrapper">
      {isImageLoading && <ImageLoader />}
      <a href={url} target="_blank" rel="noreferrer">
        <img
          className={isImageLoading ? "loading" : "loaded"}
          src={url}
          onLoad={() => setIsImageIsLoading(false)}
        />
      </a>
    </div>
  );
}

ReportMedia.propTypes = {
  url: PropType.string,
  loading: PropType.bool,
};
