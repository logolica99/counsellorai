import React from "react";
import Nav from "../Components/Nav";
import { Link } from "react-router-dom";


export default function Homepage() {
  return (
    <div className="">
      <Nav />
      <div className="flex flex-col justify-center h-full min-h-[80vh] w-[90%] md:w-[80%] mx-auto">
        <h1 className="text-darkBlue leading-none text-[40px] md:text-[70px] font-bold text-center">
          Craft Your Future <br />
          Today
        </h1>
        <p className="text-base md:text-xl text-red text-center mt-4 font-semibold md:w-[90%] mx-auto">
          Counselor's AI-powered college application assistant helps you
          summarize, write and check your college applications
        </p>
        <div className="flex justify-center mt-12">
          <Link
            to="/dashboard"
            className="text-red border border-cream bg-lightCream/[.6] ease-in-out duration-150 hover:bg-lightCream rounded-lg   px-16 py-2 font-bold "
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
