import React from "react";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.config";

export default function ProtectedSite({ children }) {

  const navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    if (user) {
    } else {
      navigate("/login");
    }
  });

  return (
    <div>
      <Nav />
      <div className="w-[90%] mx-auto">{children}</div>
    </div>
  );
}
