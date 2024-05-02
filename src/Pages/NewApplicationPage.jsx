import React, { useContext, useEffect, useState } from "react";
import { faClose, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, doc } from "firebase/firestore";
import { UserContext } from "../contexts/UserContext";
import toast from "react-hot-toast";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function NewApplicationPage() {
  const [isLoading, setIsLoading, uid, setUid] = useContext(UserContext);
  const [applicationId, setApplicationId] = useState("");
  const navigate = useNavigate();

  const [applicationData, setApplicationData] = useState({
    uniName: "",
    programName: "",
    session: "",
    queries: "",
    queryPictures: [],
  });

  const [queryFiles, setQueryFiles] = useState([]);

  const submitData = () => {
    toast.promise(updateData(), {
      loading: "Uploading...",
      success: <b>Application Uploaded!</b>,
      error: <b>Could not upload application!</b>,
    });
  };
  const uploadFileToGeminiandGetContext = async () => {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);
    console.log("uploading");
    const queryParts = await Promise.all(
      [...queryFiles].map(fileToGenerativePart)
    );

    console.log("uploading finished");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const prompt =
      "can you extract questions or the things that are required as texts from this images and return as an array of questions or requirements and nothing else, so that i can convert your string response to a json variable";
    console.log("getting response...");

    const result = await model.generateContent([prompt, ...queryParts]);
    const response = await result.response;
    let text = response.text();

    if (text.includes("json")) {
      text = text.slice(7);
      text = text.slice(0, text.length - 5);
    }
    const questionArray = JSON.parse(text);
    console.log(questionArray);
    return questionArray;
  };

  async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }

  const updateData = async () => {
    await uploadQueryFiles();
    const questionArray = await uploadFileToGeminiandGetContext();
    const docRef = await addDoc(collection(db, "applications", uid, uid), {
      applicationData: {
        ...applicationData,
        questions: questionArray,
        createdAt: new Date().getTime(),
      },
    });

    setApplicationId(docRef.id);
  };

  const uploadQueryFiles = async () => {
    const storage = getStorage();

    if (queryFiles.length > 0) {
      let temp = Array.from(queryFiles);
      const uploadPromises = temp.map(async (file, index) => {
        const fileRef = ref(storage, `${uid}/${file.name}`);

        console.log(`file uploaded ${index}`);
        return uploadBytes(fileRef, file);
      });

      // Wait for all uploads to finish (using Promise.all)
      await Promise.all(uploadPromises);
      console.log("All query files uploaded successfully!");
    }
  };

  useEffect(() => {
    if (applicationId.length > 0) {
      navigate(`/application/${applicationId}`);
    }
  }, [applicationId]);

  return (
    <div className="pb-32">
      <h1 className="text-3xl mt-10 font-semibold text-gray">
        New Application Info
      </h1>
      <div className="mt-8">
        <div>
          <p className="text-gray font-semibold">University Name</p>
          <input
            className="mt-1 px-4 py-2 bg-lightCream w-full outline-none rounded "
            value={applicationData.uniName}
            onChange={(e) => {
              setApplicationData((prev) => ({
                ...prev,
                uniName: e.target.value,
              }));
            }}
          ></input>
        </div>

        <div className="mt-8">
          <p className="text-gray font-semibold">Program Name</p>
          <input
            className="mt-1 px-4 py-2 bg-lightCream w-full outline-none rounded "
            value={applicationData.programName}
            onChange={(e) => {
              setApplicationData((prev) => ({
                ...prev,
                programName: e.target.value,
              }));
            }}
          ></input>
        </div>
        <div className="mt-8">
          <p className="text-gray font-semibold">Session</p>
          <input
            className="mt-1 px-4 py-2 bg-lightCream w-full outline-none rounded "
            value={applicationData.session}
            onChange={(e) => {
              setApplicationData((prev) => ({
                ...prev,
                session: e.target.value,
              }));
            }}
          ></input>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-gray font-semibold text-xl">Admission Queries</p>
        <p className=" text-gray mt-4 text-base font-semibold">
          Upload Screenshots
        </p>
        <input
          className="mt-2"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            setQueryFiles(e.target.files);
            let temp = [];
            Array.from(e.target.files).map((file) => {
              temp.push(file.name);
            });
            setApplicationData((prev) => ({ ...prev, queryPictures: temp }));
          }}
        ></input>

        <div className="mt-4">
          <div className="flex flex-wrap gap-8 mt-2">
            {Array.from(queryFiles).map((file, index) => (
              <div className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="w-[200px]"
                />
                <div>
                  <FontAwesomeIcon
                    icon={faClose}
                    onClick={() => {
                      let tempQueryFiles = Array.from(queryFiles);
                      tempQueryFiles = tempQueryFiles.filter(
                        (item, itemIndex) => itemIndex !== index
                      );
                      console.log(tempQueryFiles);
                      setQueryFiles(tempQueryFiles);
                    }}
                    className="text-white -right-3 -top-3 bg-red p-1 px-[6px] rounded-full absolute cursor-pointer hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <div className="h-[1px] bg-gray w-full"></div>
          <p className="text-gray text-center text-xl font-semibold">Or</p>
          <div className="h-[1px] bg-gray w-full"></div>
        </div>

        <p className=" text-gray mt-4 text-base font-semibold">
          Text input separted by commas
        </p>
        <textarea
          value={applicationData.queries}
          onChange={(e) => {
            setApplicationData((prev) => ({
              ...prev,
              queries: e.target.value,
            }));
          }}
          placeholder="Type the questions you see in your portal separted by commas"
          className="w-full text-[#3D3929] outline-none bg-lightCream rounded  min-h-[40vh] resize-none  p-4 mt-2"
        ></textarea>

        <div className="flex justify-end mt-8">
          <button
            onClick={submitData}
            className="bg-darkBlue text-white px-6 py-2 rounded hover:bg-opacity-70 duration-150   ease-in-out"
          >
            Submit
          </button>
        </div>
      </div>

      {/* <div className="mt-8 fixed w-full left-0 bottom-0 border-t  bg-darkBlue py-4 px-4 ">
        <div className="flex justify-end">
          <button
            onClick={submitData}
            className="bg-red text-white px-6 py-2 rounded hover:bg-opacity-70 duration-150   ease-in-out"
          >
            Submit
          </button>
        </div>
      </div> */}
    </div>
  );
}
