import "./dashboard.css";
import DashboardCard from "../../components/dashboard/DashboardCard";
import { AdminDashboardData } from "./dashboard_data";
import DashboardMap from "../../components/dashboard/DashboardMap";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function AdminDashboard() {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchReportMarker = async () => {
      const collectionRef = collection(db, "reports");
      const snapshot = await getDocs(collectionRef);
      setMarkers(snapshot.docs.map((doc) => doc.data().geoPoint));
    };
    fetchReportMarker();
  }, []);

  return (
    <>
      <div className="dashboard">
        <h2 className="dashboard__title">Dashboard</h2>
        <div className="dashboard-content">
          <div className="dashboard-cards">
            {AdminDashboardData.map((data, index) => {
              return (
                <DashboardCard
                  key={index}
                  path={data.path}
                  icon={data.icon}
                  label={data.label}
                  folder={data.collectionRef}
                />
              );
            })}
          </div>
        </div>
        <div className="dashboard-analytics">
          <h2 className="dashboard-map__title">Geographic Information</h2>
          <DashboardMap markers={markers} />
        </div>
      </div>
    </>
  );
}
