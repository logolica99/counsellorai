import React from "react";
import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <div>
      <div className="flex mt-8 mb-6 w-[90%] mx-auto items-center justify-between ">
        <Link
          to="/"
          className="bg-red text-white font-semibold px-4 md:px-8 py-1 rounded-lg text-sm md:text-xl"
        >
          Counsellorai
        </Link>

        {true ? (
          <div>
            <Link
              to="/dashboard"
              className="text-darkBlue font-bold px-4 md:px-8 py-2 md:py-3 hover:opacity-45 ease-in-out text-sm md:text-base"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="text-red bg-lightCream font-bold px-4 md:px-8 py-2 md:py-3 hover:opacity-70 rounded-lg ease-in-out text-sm md:text-base"
            >
              John Doe
            </Link>
          </div>
        ) : (
          <div>
            <Link
              to="/login"
              className="text-darkBlue font-bold px-4 md:px-8 py-2 md:py-3 hover:opacity-70 ease-in-out text-sm md:text-base rounded-lg"
            >
              LOGIN
            </Link>
            <Link
              to="/login"
              className="text-darkBlue bg-cream font-bold px-4 md:px-8 py-2 md:py-3  hover:opacity-70 ease-in-out text-sm md:text-base rounded-lg"
            >
              SIGN UP
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
