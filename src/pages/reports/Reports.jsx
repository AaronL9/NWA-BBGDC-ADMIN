import "./reports.css";

// component
import ReportTable from "./ReportTable.jsx";

export default function Reports() {
  return (
    <>
      <h2 className="banner__title">Reports</h2>
      <div className="reports">
        <div className="reports__cards-container">
          <div className="reports__cards-container--overlay"></div>
          <ReportTable />
        </div>
      </div>
    </>
  );
}
