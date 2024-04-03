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
import Analytics from "./pages/analytics/Analytics";
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
import Users from "./pages/users/Users.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import PieChartAnalytics from "./pages/analytics/PieChartAnalytics.jsx";
import BarChartAnalytics from "./pages/analytics/BarChartAnalytics.jsx";
import BarChartAnalyticsSuburban from "./pages/analytics/BarChartAnalyticsSuburban.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<Gate />}>
        <Route path="/" element={<Login />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
      </Route>
      <Route element={<Authorization />}>
        <Route path="/" element={<RootLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/:id" element={<ReportView />} />
          <Route path="analytics" element={<Analytics />}>
            <Route index element={<PieChartAnalytics />} />
            <Route path="barchart" element={<BarChartAnalytics />} />
            <Route
              path="barchart-complaints-suburban"
              element={<BarChartAnalyticsSuburban />}
            />
          </Route>
          <Route path="news" element={<Articles />} />
          <Route path="news/:id" element={<EditArticle />} />
          <Route path="publish-news" element={<PublishArticle />} />
          <Route path="patrollers" element={<PatrollerNavigation />}>
            <Route index element={<Patrollers />} />
            <Route path="send-all" element={<GroupChat />} />
            <Route path="all-location" element={<AllLocation />} />
          </Route>
          <Route path="patrollers/chat/:roomId" element={<PatrollerChat />} />
          <Route
            path="patrollers/location/:id"
            element={<PatrollerLocation />}
          />
          <Route path="users" element={<Users />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
