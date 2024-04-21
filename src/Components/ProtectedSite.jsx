import React from "react";
import Nav from "./Nav";

export default function ProtectedSite({ children }) {
  return (
    <div>
      <Nav />
      <div className="w-[90%] mx-auto">{children}</div>
    </div>
  );
}
