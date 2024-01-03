import { useEffect, useState } from "react";
import "./analytics.css";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

import Loader from "../../components/global/loader/Loader.jsx";
import { countOffensesByMonth } from "../../util/analytics";

export default function Analysis() {
  const [monthlyCrime, setMonthlyCrime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResolvedReports = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/report/`);
        const json = await response.json();

        if (response.ok) {
          console.log(countOffensesByMonth(json, "theft"));
          setMonthlyCrime(json);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchResolvedReports();

    setIsLoading(false);
  }, [isLoading]);

  const data = (incidents) => {
    return {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Theft",
          backgroundColor: "rgba(174, 186, 225, 1)",
          data: countOffensesByMonth(incidents, "theft"),
          borderRadius: 15,
        },
        {
          label: "Assault",
          backgroundColor: "rgba(145, 157, 195, 1)",
          data: countOffensesByMonth(incidents, "assault"),
          borderRadius: 15,
        },
        {
          label: "Vandalism",
          backgroundColor: "rgba(86, 98, 136, 1)",
          data: countOffensesByMonth(incidents, "vandalism"),
          borderRadius: 15,
        },
        {
          label: "Fraud",
          backgroundColor: "rgba(28, 39, 76, 1)",
          data: countOffensesByMonth(incidents, "fraud"),
          borderRadius: 15,
        },
      ],
    };
  };
  const options = {};
  return (
    <div className="analysis">
      <div className="analysis--bargraph">
        <h2>Crime Reports</h2>
        {isLoading || !monthlyCrime ? (
          <div className="global-loader">
            <Loader />
          </div>
        ) : (
          <Bar data={data(monthlyCrime)} options={options} />
        )}
      </div>
    </div>
  );
}
