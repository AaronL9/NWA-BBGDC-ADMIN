import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { limitString } from "../../util/stringFormatter";
import { formatDateReport } from "../../util/dateFormatter";

export default function InvestigateCard({ data }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/action/${data.id}`);
  };
  console.log(data.date);
  return (
    <div onClick={handleClick} className="investigate-card">
      <div className="card__content-upper">
        <h3 className="card__title">{data.offense}</h3>
        <p className="card__content">{limitString(data.description, 70)}</p>
      </div>
      <div className="card__content-bottom">
        <div className="card__handler">
          <strong>reportee:&nbsp;</strong>
          {data.reporteeName}{" "}
        </div>
        <div className="card__date">{formatDateReport(data.date)}</div>
      </div>

      <div className="card__arrow">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          height={15}
          width={15}
        >
          <path
            fill="#fff"
            d="M13.4697 17.9697C13.1768 18.2626 13.1768 18.7374 13.4697 19.0303C13.7626 19.3232 14.2374 19.3232 14.5303 19.0303L20.3232 13.2374C21.0066 12.554 21.0066 11.446 20.3232 10.7626L14.5303 4.96967C14.2374 4.67678 13.7626 4.67678 13.4697 4.96967C13.1768 5.26256 13.1768 5.73744 13.4697 6.03033L18.6893 11.25H4C3.58579 11.25 3.25 11.5858 3.25 12C3.25 12.4142 3.58579 12.75 4 12.75H18.6893L13.4697 17.9697Z"
          />
        </svg>
      </div>
    </div>
  );
}

InvestigateCard.propTypes = {
  data: PropTypes.object,
};
