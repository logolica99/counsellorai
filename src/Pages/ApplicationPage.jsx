import React, { useContext, useEffect, useState } from "react";
import { formatTime } from "../helpers";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faChevronCircleDown,
  faChevronLeft,
  faLeftLong,
} from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../contexts/UserContext";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";

export default function ApplicationPage() {
  const [isLoading, setIsLoading, uid, setUid] = useContext(UserContext);

  return (
    <div className="mt-16">
      <div className="flex ">
        <Link
          to="/dashboard"
          className="flex gap-4 items-center  bg-lightCream border border-cream px-4 py-1 rounded "
        >
          <FontAwesomeIcon icon={faChevronLeft}  className="text-gray"/>
          <p className="text-gray font-semibold text-lg">Dashboard</p>
        </Link>
      </div>
      <div>
        <p></p>
      </div>
    </div>
  );
}
