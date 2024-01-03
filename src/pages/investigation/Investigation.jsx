import { useState, useEffect } from "react";
import Loader from "../../components/global/loader/Loader.jsx";
import Nothing from "../reports/Nothing.jsx";
import InvestigateCard from "../../components/action/InvestigateCard";
import "./investigation.css";
import { getInterventions } from "../../util/interventions.js";

export default function UnderInvestagion() {
  const [reports, setReports] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      try {
        await getInterventions(setReports);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchReport();
    setIsLoading(false);
  }, []);
  return (
    <>
      {isLoading || !reports ? (
        <div className="global-loader">
          <Loader />
        </div>
      ) : !reports.length ? (
        <Nothing label={"assesing report"} />
      ) : (
        <div className="action">
          <div className="action__outer-container">
            <div className="action-overlay"></div>
            <div className="action__card-container">
              {reports.map((report, index) => (
                <InvestigateCard key={index} data={report} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
