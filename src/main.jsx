import "./init";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { UserContextProvider } from "./contexts/UserContext.jsx";
import Loader from "./Components/Loader.jsx";
import { Toaster } from "react-hot-toast";
import { TestContextProvider } from "./contexts/TestContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.Fragment>
    <UserContextProvider>
      <TestContextProvider>
        <Loader />
        <Toaster />
        <App />
      </TestContextProvider>
    </UserContextProvider>
  </React.Fragment>
);
