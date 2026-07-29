import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./Components/HomePage";
import { Toaster } from "react-hot-toast";

import "@arcgis/core/assets/esri/themes/light/main.css";
import Dashboard from "Components/DashboardPage";
import { useAuth } from "hooks/zustand/ui";
import { getBackEndUrl } from "@helpers/http/getBackEndUrl";
import TimesliderItemDetailPage from "Components/TimesliderItemDetailPage";
import ArcGISAuthProvider from "Components/Common/ArcGISAuthProvider";
import InstallationsPage from "Components/InstallationsPage";
import DevicesUpdatesPage from "Components/DevicesUpdatesPage";
import PostLoginRedirect from "Components/Common/PostLoginRedirect";
import { applyAuthMeBootstrap } from "./bootstrapAuthMe";

export default function App() {
  const { setUser } = useAuth();
  const [pendingClientPath, setPendingClientPath] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${getBackEndUrl()}/auth/me`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        applyAuthMeBootstrap(data, { setPendingClientPath, setUser });
      });
  }, [setUser]);

  return (
    <Router>
      <PostLoginRedirect pendingClientPath={pendingClientPath} />
      <ArcGISAuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/images" element={<TimesliderItemDetailPage />} />
          <Route path="/installations" element={<InstallationsPage />} />
          <Route path="/devices-updates" element={<DevicesUpdatesPage />} />
        </Routes>

        <Toaster position="top-center" reverseOrder={false} />
      </ArcGISAuthProvider>
    </Router>
  );
}
