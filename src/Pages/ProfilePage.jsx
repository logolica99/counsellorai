import { faClose, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ProfilePage() {
  return (
    <div className="mb-32">
      <h1 className="text-3xl mt-10 font-semibold text-gray">
        Tell us about yourself
      </h1>
      <div className="mt-8">
        <div>
          <p className="text-gray font-semibold">
            Upload you resume / academic CV
          </p>
          <input className="mt-4" type="file"></input>

          <div className="mt-4">
            <p className="text-gray text-sm font-bold ">Uploaded files</p>
            <div className="flex mt-2 rounded justify-between items-center bg-lightCream px-4 py-1 border-b border-[#FFC422] ">
              <p className="text-darkBlue font-bold">Resume.pdf</p>
              <FontAwesomeIcon
                icon={faClose}
                className="text-darkBlue cursor-pointer p-1 hover:bg-gray/[.1] rounded-full"
              />
            </div>
          </div>
        </div>
        <div className="mt-8">
          <p className="text-gray font-semibold">
            Tell us about yourself - anything that you wish to include in your
            college application - be as detailed as possible.
          </p>
          <div className="w-full  bg-lightCream  rounded mt-4 border px-4 py-4  border-[#D2D2D2]">
            <textarea
              placeholder="Type, upload a file or feel free to speak about yourself here "
              className="w-full outline-none bg-lightCream rounded  min-h-[40vh] resize-none "
            ></textarea>
            <div className="flex justify-end mr-1">
              <FontAwesomeIcon
                icon={faUpload}
                className="text-darkBlue text-xl"
              />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray text-sm font-bold ">Uploaded files</p>
            <div className="flex mt-2 rounded justify-between items-center bg-lightCream px-4 py-1 border-b border-[#FFC422] ">
              <p className="text-darkBlue font-bold">Essay.pdf</p>
              <FontAwesomeIcon
                icon={faClose}
                className="text-darkBlue cursor-pointer p-1 hover:bg-gray/[.1] rounded-full"
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-gray font-semibold">Additional Documents</p>
          <input className="mt-4" type="file"></input>
          <div className="mt-4">
            <p className="text-gray text-sm font-bold ">Uploaded files</p>
            <div className="flex mt-2 rounded justify-between items-center bg-lightCream px-4 py-1 border-b border-[#FFC422] ">
              <p className="text-darkBlue font-bold">SOP.pdf</p>
              <FontAwesomeIcon
                icon={faClose}
                className="text-darkBlue cursor-pointer p-1 hover:bg-gray/[.1] rounded-full"
              />
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
