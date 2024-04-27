import React, { useContext, useEffect, useState } from "react";
import { formatTime } from "../helpers";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../contexts/UserContext";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";

export default function DashboardPage() {
  const [isLoading, setIsLoading, uid, setUid] = useContext(UserContext);

  const [applications, setApplications] = useState({});

  const getApplicationsData = async () => {
    const docRef = collection(db, "applications", uid, uid);
    setIsLoading(true);
    const querySnapshot = await getDocs(docRef);

    let temp = {};
    querySnapshot.forEach((doc) => {
      temp[doc.id] = doc.data();
    });
    console.log(temp);
    setApplications(temp);

    setIsLoading(false);
  };

  useEffect(() => {
    getApplicationsData();
  }, [uid]);

  return (
    <div className="mt-16">
      <div>
        <Link
          to="/new-application"
          className="flex mt-6   rounded  items-center bg-lightCream px-6 py-4 border-b border-[#FFC422] hover:bg-opacity-70 duration-100 ease-in-out cursor-pointer"
        >
          <FontAwesomeIcon icon={faAdd} className="text-darkBlue mr-4" />
          <p className="text-darkBlue font-bold">New Application</p>
        </Link>
      </div>

      <h1 className="text-3xl mt-10 font-bold text-gray">Applications</h1>

      <div className="mt-6">
        {Object.keys(applications).length == 0 && (
          <p className="text-gray">No applications were submitted!</p>
        )}
        {Object.keys(applications).map((applciationId) => (
          <Link
            to={`/application/${applciationId}`}
            className="flex mt-6  rounded justify-between items-center bg-lightCream px-6 py-4 border-b border-[#FFC422] hover:bg-opacity-70 duration-100 ease-in-out cursor-pointer"
          >
            <p className="text-darkBlue font-bold">
              {applications[applciationId]?.applicationData?.uniName}
            </p>
            <p className="text-[#8C722C] text-[12px]">
              {formatTime(applications[applciationId]?.applicationData?.createdAt)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
