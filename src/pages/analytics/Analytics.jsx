import BarsDataset from "../../components/analytics/BarsDataSet";
import PieChartWithCustomizedLabel from "../../components/analytics/PieChart";
import "./analytics.css";

export default function Analytics() {
  return (
    <div className="analytics">
      <h2 className="banner__title">Analytics</h2>
      <div className="analytics-container">
        <PieChartWithCustomizedLabel />
      </div>
      <br />
      <div className="analytics-container">
        <BarsDataset />
      </div>
    </div>
  );
}
