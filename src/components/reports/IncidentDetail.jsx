import PropType from "prop-types";
import { formatDateReport } from "../../util/dateFormatter";

export default function IncidentDetail({ label, value }) {
  return (
    <div className="report__offense">
      <h3>{label}:</h3>
      <p>{label === "Date" ? formatDateReport(value) : value}</p>
    </div>
  );
}

IncidentDetail.propTypes = {
  label: PropType.string,
  value: PropType.any,
};
