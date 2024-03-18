import "./dashboard.css";
import DashboardCard from "../../components/dashboard/DashboardCard";
import { AdminDashboardData } from "./dashboard_data";
import DashboardMap from "../../components/dashboard/DashboardMap";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function AdminDashboard() {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchReportMarker = async () => {
      const collectionRef = collection(db, "reports");
      const q = query(
        collectionRef,
        where("status", "in", ["report", "ongoing"])
      );
      const snapshot = await getDocs(q);
      setMarkers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          coords: doc.data().geoPoint,
          offense: doc.data().offense,
          date: doc.data().date,
          status: doc.data().status,
        }))
      );
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <h2 className="dashboard-map__title">Report Mapping</h2>
            <ul style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <li style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div className="dashboard-map_pin-point pin-point-report"></div>
                <span>Report</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div className="dashboard-map_pin-point pin-point-ongoing"></div>
                <span>Ongoing</span>
              </li>
            </ul>
          </div>
          <DashboardMap markers={markers} />
        </div>
      </div>
    </>
  );
}
