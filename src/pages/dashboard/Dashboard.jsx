import "./dashboard.css";
import DashboardCard from "../../components/dashboard/DashboardCard";
import { AdminDashboardData } from "./dashboard_data";

export default function AdminDashboard() {
  return (
    <>
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
                />
              );
            })}
          </div>
        </div>
        <img
          src="/images/BG.png"
          alt=""
          style={{
            width: "90%",
            marginInline: "auto",
            marginBlock: "2rem",
            borderRadius: "1rem",
            height: "350px",
            objectFit: "cover",
          }}
        />
      </div>
    </>
  );
}
