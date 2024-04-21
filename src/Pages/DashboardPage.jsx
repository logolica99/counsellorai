import React from "react";
import { formatTime } from "../helpers";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl mt-10 font-bold text-[#5A5959]">Applications</h1>

      <div className="mt-6">
        <Link to="/application/12" className="flex mt-6  rounded justify-between items-center bg-lightCream px-6 py-4 border-b border-[#FFC422] hover:bg-opacity-70 duration-100 ease-in-out cursor-pointer">
          <p className="text-darkBlue font-bold">University of Pennsylvania</p>
          <p className="text-[#8C722C] text-sm">
            {formatTime(new Date().getTime())}
          </p>
        </Link>
        <Link to="/application/12" className="flex  mt-6 rounded justify-between items-center bg-lightCream px-6 py-4 border-b border-[#FFC422] hover:bg-opacity-70 duration-100 ease-in-out cursor-pointer">
          <p className="text-darkBlue font-bold">University of Pennsylvania</p>
          <p className="text-[#8C722C] text-sm">
            {formatTime(new Date().getTime())}
          </p>
        </Link>
        <Link to="/application/12" className="flex  mt-6 rounded justify-between items-center bg-lightCream px-6 py-4 border-b border-[#FFC422] hover:bg-opacity-70 duration-100 ease-in-out cursor-pointer">
          <p className="text-darkBlue font-bold">University of Pennsylvania</p>
          <p className="text-[#8C722C] text-sm">
            {formatTime(new Date().getTime())}
          </p>
        </Link>
        
      </div>
    </div>
  );
}
