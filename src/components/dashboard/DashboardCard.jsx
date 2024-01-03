import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function DashboardCard({ icon, label, path }) {
  const classModifier = label.split(" ").join("-");
  return (
    <>
      <Link to={path}>
        <div
          className={`dashboard-card dashboard-card--${classModifier.toLowerCase()}`}
        >
          <img src={icon} />
          <div className="dashboard-card__text">
            <h2>{label}</h2>
          </div>
        </div>
      </Link>
    </>
  );
}

DashboardCard.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string,
  path: PropTypes.string,
};
