import React, { useEffect } from "react";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.config";
import { UserContextProvider } from "../contexts/UserContext";

export default function ProtectedSite({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
      } else {
        navigate("/login");
      }
    });
  }, []);

  return (
    <div>
      <Nav />
      <div className="w-[90%] md:w-[85%] lg:w-[50%] mx-auto">{children}</div>
    </div>
  );
}
