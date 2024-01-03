import { useEffect, useState } from "react";
import { getDocs, collection, query, orderBy, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import "./reports.css";

// component
import ReportCard from "../../components/reports/ReportCard";
import Loader from "../../components/global/loader/Loader.jsx";
import Nothing from "./Nothing.jsx";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(
        query(
          collection(db, "reports"),
          where("status", "==", "report"),
          orderBy("date", "desc")
        )
      );
      const data = [];
      querySnapshot.forEach((doc) => {
        const obj = doc.data();
        obj.id = doc.id;
        data.push(obj);
      });
      setReports(data);
    };
    fetchReport();
    setLoading(false);
  }, []);

  console.log(reports);
  return (
    <div className="reports">
      {loading ? (
        <div className="global-loader">
          <Loader />
        </div>
      ) : !reports.length ? (
        <Nothing label="reports" />
      ) : (
        <div className="reports__cards-container">
          <div className="reports__cards-container--overlay"></div>
          {reports.map((report, index) => (
            <ReportCard key={index} data={report} />
          ))}
        </div>
      )}
    </div>
  );
}
