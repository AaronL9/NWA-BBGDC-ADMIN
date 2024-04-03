import { useEffect, useState } from "react";
import PieChartWithCustomizedLabel from "../../components/analytics/PieChart";
import CategoryButton from "./CategoryButton";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function PieChartAnalytics() {
  const [data, setData] = useState([]);
  const [category, setCategory] = useState("all");

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
    <>
      <div className="analytics-container">
        <PieChartWithCustomizedLabel data={data} />
      </div>
      <div className="analytics__area-button">
        <CategoryButton setCategory={setCategory} />
      </div>
    </>
  );
}
