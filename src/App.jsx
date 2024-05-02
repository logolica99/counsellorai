import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./Pages/Homepage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import NewApplicationPage from "./Pages/NewApplicationPage.jsx";
import ApplicationPage from "./Pages/ApplicationPage.jsx";
import ProtectedSite from "./Components/ProtectedSite.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import DashboardPage from "./Pages/DashboardPage.jsx";
import { app } from "./firebase.config.js";
import EditApplicationPage from "./Pages/EditApplicationPage.jsx";

function App() {
  return (
    <div className="font-raleway">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedSite>
                <ProfilePage />
              </ProtectedSite>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedSite>
                <DashboardPage />
              </ProtectedSite>
            }
          />
          <Route
            path="/new-application"
            element={
              <ProtectedSite>
                <NewApplicationPage />
              </ProtectedSite>
            }
          />
          <Route
            path="/application/:applicationId"
            element={
              <ProtectedSite>
                <ApplicationPage />
              </ProtectedSite>
            }
          />
          <Route
            path="/edit-application/:applicationId"
            element={
              <ProtectedSite>
                <EditApplicationPage />
              </ProtectedSite>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
