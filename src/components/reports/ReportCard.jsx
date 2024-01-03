import PropTypes from "prop-types";
import { formatTimestamp } from "../../util/dateFormatter";
import { useNavigate } from "react-router-dom";

const ReportCard = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="report-card">
      <dl className="report-card__details">
        <dt>Offense:</dt>
        <dd>{data.offense}</dd>

        <dt>Location:</dt>
        <dd>{data.location}</dd>

        <dt>Reportee:</dt>
        <dd>{data.reporteeName}</dd>

        <dt>Time:</dt>
        <dd>{formatTimestamp(data.date)}</dd>
      </dl>
      <button onClick={() => navigate(data.id)}>View</button>
    </div>
  );
};

export default ReportCard;

ReportCard.propTypes = {
  data: PropTypes.object,
};
