import UsersTable from "../../components/users/UserTable";
import "./users.css";

export default function Users() {
  return (
    <div className="users">
      <h2 className="users__title">User Profiling</h2>
      <UsersTable />
    </div>
  );
}
