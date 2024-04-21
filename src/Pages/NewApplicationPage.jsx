import React from "react";
import { faClose, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NewApplicationPage() {
  return (
    <div className="mb-32">
      <h1 className="text-3xl mt-10 font-semibold text-gray">
        New Application Info
      </h1>
      <div className="mt-8">
        <div>
          <p className="text-gray font-semibold">University Name</p>
          <input className="mt-1 px-4 py-2 bg-lightCream w-full outline-none rounded "></input>
        </div>

        <div className="mt-8">
          <p className="text-gray font-semibold">Program Name</p>
          <input className="mt-1 px-4 py-2 bg-lightCream w-full outline-none rounded "></input>
        </div>
        <div className="mt-8">
          <p className="text-gray font-semibold">Session</p>
          <input className="mt-1 px-4 py-2 bg-lightCream w-full outline-none rounded "></input>
        </div>
      </div>

    
      <div className="mt-8">
        <p className="text-gray font-semibold">
          Upload Screenshots of Admission Queries
        </p>
        <input className="mt-4" type="file"></input>
        <div className="mt-4">
        
          <div className="flex flex-wrap gap-8 mt-2">

          <div className="relative">
            <img
              src="https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg"
              alt=""
              className="w-[200px]"
            />
            <div>
              <FontAwesomeIcon
                icon={faClose}
                className="text-white -right-3 -top-3 bg-red p-1 px-[6px] rounded-full absolute cursor-pointer hover:scale-105"
              />
            </div>
          </div>
          <div className="relative">
            <img
              src="https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg"
              alt=""
              className="w-[200px]"
            />
            <div>
              <FontAwesomeIcon
                icon={faClose}
                className="text-white -right-3 -top-3 bg-red p-1 px-[6px] rounded-full absolute cursor-pointer hover:scale-105"
              />
            </div>
          </div>
          <div className="relative">
            <img
              src="https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg"
              alt=""
              className="w-[200px]"
            />
            <div>
              <FontAwesomeIcon
                icon={faClose}
                className="text-white -right-3 -top-3 bg-red p-1 px-[6px] rounded-full absolute cursor-pointer hover:scale-105"
              />
            </div>
          </div>
          
          </div>
        </div>
      </div>





      <div className="mt-8 fixed w-full left-0 bottom-0 border-t border-[#FFC422] bg-lightCream py-4 px-4 ">
        <div className="flex justify-end">
          <button className="bg-darkBlue text-white px-6 py-2 rounded hover:bg-opacity-70 duration-150   ease-in-out">
            Submit
          </button>
        </div>
      </div>

    </div>
  );
}
