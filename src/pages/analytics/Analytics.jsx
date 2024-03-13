import { useEffect, useState } from "react";
// import BarsDataset from "../../components/analytics/BarsDataSet";
import PieChartWithCustomizedLabel from "../../components/analytics/PieChart";
import "./analytics.css";
import CategoryButton from "./CategoryButton";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function Analytics() {
  const [category, setCategory] = useState("all");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(
        collection(db, "report_analytics", category, "report_type")
      );
      const data = querySnapshot.docs.map((doc) => doc.data());
      setData(data);
    };
    fetchData();
  }, [category]);

  return (
    <div className="analytics">
      <h2 className="banner__title">Analytics</h2>
      <div className="analytics-container">
        <PieChartWithCustomizedLabel data={data} />
      </div>
      <div className="analytics__area-button">
        <CategoryButton setCategory={setCategory} />
      </div>
      <br />
    </div>
  );
}
