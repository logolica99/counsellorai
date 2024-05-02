import React from "react";
import Nav from "../Components/Nav";
import { Link } from "react-router-dom";

export default function Homepage() {
  return (
    <div className="h-[100vh] overflow-hidden">
      <Nav />
      <div className="absolute left-0 top-0 ">
        <img
          src="/HomePageBg.png"
          alt=""
          className="w-[100vw] h-[100vh] object-cover  z-[-1]"
        />
      </div>
      <div className="flex flex-col justify-center h-full min-h-[80vh] w-[90%] md:w-[80%] mx-auto z-20 pb-[200px]">
        <h1 className="text-darkBlue  leading-none text-[40px] md:text-[70px] font-bold text-center z-20  ">
          There's nothing <br />
          more powerful than
          <br />a good story
        </h1>
        <p className="text-base md:text-xl text-red text-center mt-8 font-semibold md:w-[90%] mx-auto z-20  ">
          At CounselorAI, we listen to every detail of your journey to craft a
          narrative that showcases the best of you. Our tailored AI-driven
          recommendation transforms your personal experiences into compelling
          college applications. Let us help you articulate your true potential!
        </p>
        <div className="flex justify-center mt-12">
          <Link
            to="/dashboard"
            className=" z-20  text-red border border-cream bg-lightCream/[.6] ease-in-out duration-150 hover:bg-lightCream rounded-lg   px-16 py-2 font-bold "
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
