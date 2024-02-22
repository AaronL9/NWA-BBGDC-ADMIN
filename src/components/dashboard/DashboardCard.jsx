import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getNumberOfReports } from "../../util/reportRequest";
import { SmallLoader } from "../global/loader/Loader";

export default function DashboardCard({ icon, label, path, folder }) {
  const classModifier = label.split(" ").join("-");
  const [size, setSize] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNumber = async () => {
      const number = await getNumberOfReports(folder);
      setSize(number);
      setIsLoading(false);
    };
    fetchNumber();
  }, [folder]);
  return (
    <>
      <div
        className={`dashboard-card dashboard-card--${classModifier.toLowerCase()}`}
      >
        <div className="dashboard-card__icon">
          <img src={icon} />
        </div>
        <div className="dashboard-card__text">
          <h2>{label}</h2>

          <div className="dashboard-card__number-wrapper">
            <div className="dashboard-card__number">
              {isLoading ? <SmallLoader /> : size.totalReports}
            </div>
            {folder === "reports" && (
              <span>
                &#40;{size?.totalNewReports} new, {size?.totalOnprogressReports}{" "}
                pending&#41;{" "}
              </span>
            )}
          </div>

          <div className="line"></div>
          <Link className="dashboard-card__link" to={path}>
            (VIEW ALL)
          </Link>
        </div>
      </div>
    </>
  );
}

DashboardCard.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string,
  path: PropTypes.string,
  folder: PropTypes.string,
};
