import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

import RootLayout from "./layouts/RootLayout";
import Reports from "./pages/reports/Reports";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Investigation from "./pages/investigation/Investigation";
import Analytics from "./pages/analytics/Analytics";
import Users from "./pages/users/Users";
import Articles from "./pages/articles/Articles";
import Login from "./pages/auth/AdminLogin";
import Authorization from "./security/Authorization";
import Gate from "./security/Gate";
import PublishArticle from "./pages/articles/publish/PublishArticle";
import EditArticle from "./pages/articles/edit/EditArticle";
import Patrollers from "./pages/patrollers/Tabs/Patrollers.jsx";
import PatrollerChat from "./pages/patrollers/PatrollerChat.jsx";
import ReportView from "./pages/reports/ReportView.jsx";
import PatrollerLocation from "./pages/patrollers/PatrollerLocation.jsx";
import PatrollerNavigation from "./pages/patrollers/PatrollerNavigation.jsx";
import GroupChat from "./pages/patrollers/Tabs/GroupChat.jsx";
import AllLocation from "./pages/patrollers/Tabs/AllLocation.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<Gate />}>
        <Route path="/" element={<Login />}></Route>
      </Route>
      <Route element={<Authorization />}>
        <Route path="/" element={<RootLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/:id" element={<ReportView />} />
          <Route path="action" element={<Investigation />} />
          <Route path="action/:id" element={<ReportView />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="users" element={<Users />} />
          <Route path="articles" element={<Articles />} />
          <Route path="articles/:id" element={<EditArticle />} />
          <Route path="publish-article" element={<PublishArticle />} />
          <Route path="patrollers" element={<PatrollerNavigation />}>
            <Route index element={<Patrollers />} />
            <Route path="send-all" element={<GroupChat />} />
            <Route path="all-location" element={<AllLocation />} />
          </Route>
          <Route path="patrollers/chat/:name/:id" element={<PatrollerChat />} />
          <Route
            path="patrollers/location/:id"
            element={<PatrollerLocation />}
          />
        </Route>
      </Route>
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
