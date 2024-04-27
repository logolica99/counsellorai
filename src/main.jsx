import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./Pages/Homepage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import NewApplicationPage from "./Pages/NewApplicationPage.jsx";
import ApplicationPage from "./Pages/ApplicationPage.jsx";
import ProtectedSite from "./Components/ProtectedSite.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import DashboardPage from "./Pages/DashboardPage.jsx";
import { app } from "./firebase.config.js";
import { UserContextProvider } from "./contexts/UserContext.jsx";
import Loader from "./Components/Loader.jsx";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  { path: "/login", element: <LoginPage /> },
  {
    path: "/profile",
    element: (
      <ProtectedSite>
        <ProfilePage />
      </ProtectedSite>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedSite>
        <DashboardPage />
      </ProtectedSite>
    ),
  },
  {
    path: "/new-application",
    element: (
      <ProtectedSite>
        <NewApplicationPage />
      </ProtectedSite>
    ),
  },
  {
    path: "/application/:id",
    element: (
      <ProtectedSite>
        <ApplicationPage />
      </ProtectedSite>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserContextProvider>
      <Loader />
      <Toaster/>
      <div className="font-raleway">
        <RouterProvider router={router} />
      </div>
    </UserContextProvider>
  </React.StrictMode>
);
