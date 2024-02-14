import "./dashboard.css";
import DashboardCard from "../../components/dashboard/DashboardCard";
import { AdminDashboardData } from "./dashboard_data";

export default function AdminDashboard() {
  return (
    <>
      <h2 className="banner__title">Dashboard</h2>
      <div className="dashboard">
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
      </div>
    </>
  );
}
