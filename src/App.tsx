/* eslint-disable react-hooks/exhaustive-deps */
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./Components/HomePage";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { refreshToken } from "@helpers/refreshToken";

import "@arcgis/core/assets/esri/themes/light/main.css";
import Dashboard from "Components/DashboardPage";
import TimesliderItemDetailPage from "Components/TimesliderItemDetailPage";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { getBackEndUrl } from "@helpers/getBackEndUrl";

export default function App() {
  useEffect(() => {
    refreshToken();
  }, []);

  const { setUser } = useAuth();

  useEffect(() => {
    fetch(`${getBackEndUrl()}/auth/me`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.user || !data.user.sub) return;

        setUser({
          role: data.roles.realm.find(
            (item) =>
              item.includes("RWS ") ||
              item.includes("EXT ") ||
              item.includes("admin")
          ),
          user_id: data.user.sub,
          user_name: data.user.username,
          email: data.user.email,
        });
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/images" element={<TimesliderItemDetailPage />} />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </Router>
  );
}
