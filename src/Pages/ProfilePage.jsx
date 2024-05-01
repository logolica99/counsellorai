import { faClose, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase.config";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import * as PDFJS from "/public/pdfjs-dist/build/pdf.min.mjs";

import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { UserContext } from "../contexts/UserContext";
import toast from "react-hot-toast";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { GoogleGenerativeAI } from "@google/generative-ai";
import FileConverter from "./FileConverter";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading, uid, setUid] = useContext(UserContext);
  const [resumePDFImages, setResumePDFImages] = useState([]);
  const [aboutYourself, setAboutYourself] = useState({
    text: "",
    files: [],
  });
  const [userData, setUserData] = useState({
    resumeLink: "",
    aboutYourself: {
      text: "",
      files: [],
    },
    additionalFiles: [],
  });
  const [resumeLink, setResumeLink] = useState("");
  const [resumeFile, setResumeFile] = useState({});

  const [aboutYourselfFiles, setAboutYourselfFiles] = useState([]);

  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [additionalFilesLinks, setAdditionalFilesLinks] = useState([]);
  const uploadAboutYourselfRef = useRef();

  const getUserData = async () => {
    setIsLoading(true);
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    const userDataResponse = docSnap.data();
    console.log(userDataResponse);
    setIsLoading(false);

    setResumeLink(userDataResponse.resumeLink);
    if (userDataResponse.aboutYourself) {
      setAboutYourself(userDataResponse.aboutYourself);
    }
    if (userDataResponse.additionalFilesLinks) {
      setAdditionalFilesLinks(userDataResponse.additionalFilesLinks);
    }
  };

  useEffect(() => {
    if (uid) {
      getUserData();
    }
  }, [uid]);

  const uploadFileToGeminiandGetContext = async () => {
    const resumePdfImages = await pdfToImageConverter();

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);
    console.log("uploading");
    let resumeParts = [];

    resumePdfImages.map((image) => {
      const delimiter = "data:image/png;base64,";
      let temp = {
        inlineData: {
          data: image.slice(delimiter.length),
          mimeType: "image/png",
        },
      };
      resumeParts.push(temp);
    });

    console.log("uploading finished");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const prompt = "Extract every text content from this file as text.";
    console.log("getting response...");
    console.log(resumeParts);
    const result = await model.generateContent([prompt, ...resumeParts]);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return text;
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

  const submitData = () => {
    toast.promise(updateData(), {
      loading: "Saving...",
      success: <b>Profile Updated!</b>,
      error: <b>Could not save.</b>,
    });

    getUserData();
  };

  const updateData = async () => {
    const storage = getStorage();

    const resumeRef = ref(storage, `${uid}/${resumeFile.name}`);
    let resumeText = "";

    if (resumeFile.name) {
      await uploadBytes(resumeRef, resumeFile).then((snapshot) => {
        console.log("Uploaded resume!");
      });

      resumeText = await uploadFileToGeminiandGetContext();
    }

    // await uploadAboutYourselfFiles();

    // await uploadAdditionalFiles();

    await setDoc(doc(db, "users", uid), {
      resumeLink: resumeLink,
      aboutYourself: aboutYourself,
      additionalFilesLinks: additionalFilesLinks,
      resumeText: resumeText,
    });
  };

  const uploadAboutYourselfFiles = async () => {
    const storage = getStorage();
    if (aboutYourselfFiles.length > 0) {
      let temp = Array.from(aboutYourselfFiles);
      const uploadPromises = temp.map(async (file, index) => {
        const fileRef = ref(storage, `${uid}/${file.name}`);

        console.log(`file uploaded ${index}`);
        return uploadBytes(fileRef, file);
      });

      // Wait for all uploads to finish (using Promise.all)
      await Promise.all(uploadPromises);
      console.log("All aboutyourself files uploaded successfully!");
    }
  };
  const uploadAdditionalFiles = async () => {
    const storage = getStorage();
    if (additionalFiles.length > 0) {
      let temp = Array.from(additionalFiles);
      const uploadPromises = temp.map(async (file, index) => {
        const fileRef = ref(storage, `${uid}/${file.name}`);

        console.log(`file uploaded A${index}`);
        return uploadBytes(fileRef, file);
      });

      // Wait for all uploads to finish (using Promise.all)
      await Promise.all(uploadPromises);
      console.log("All additional files uploaded successfully!");
    }
  };

  const pdfToImageConverter = async () => {
    PDFJS.GlobalWorkerOptions.workerSrc =
      "./pdfjs-dist/build/pdf.worker.min.mjs";
    const uri = URL.createObjectURL(resumeFile);
    var pdf = await PDFJS.getDocument({ url: uri }).promise;

    const imagesList = [];
    const canvas = document.createElement("canvas");
    canvas.setAttribute("className", "canv");
    for (let i = 1; i <= pdf.numPages; i++) {
      var page = await pdf.getPage(i);
      var viewport = page.getViewport({ scale: 1 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      var render_context = {
        canvasContext: canvas.getContext("2d"),
        viewport: viewport,
      };
      console.log("page lenght", pdf.numPages);
      await page.render(render_context).promise;
      let img = canvas.toDataURL("image/png");
      imagesList.push(img);
    }

    return imagesList;
  };

  return (
    <div className="mb-32">
      <button
        className="bg-red px-4 py-1 rounded text-white font-bold"
        onClick={() => {
          signOut(auth)
            .then(() => {
              navigate("/");
            })
            .catch((error) => {
              // An error happened.
            });
        }}
      >
        Logout
      </button>
      <h1 className="text-3xl mt-10 font-semibold text-gray">
        Tell us about yourself
      </h1>
      <div className="mt-8">
        <div>
          <p className="text-gray font-semibold">
            Upload you resume / academic CV PDF
          </p>

          <input
            className="mt-4"
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files[0]; // Get the first selected file
              setResumeFile(file);
              setResumeLink(file.name);
            }}
          ></input>

          <div className="mt-4">
            <p className="text-gray text-sm font-bold ">Uploaded files</p>
            {resumeLink && (
              <div className="flex mt-2 rounded justify-between items-center bg-lightCream px-4 py-1 border-b border-[#FFC422] ">
                <p className="text-darkBlue font-bold">{resumeLink}</p>
                <FontAwesomeIcon
                  icon={faClose}
                  onClick={() => {
                    setResumeFile({});
                  }}
                  className="text-darkBlue cursor-pointer p-1 hover:bg-gray/[.1] rounded-full"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <p className="text-gray font-semibold">
            Tell us about yourself - anything that you wish to include in your
            college application - be as detailed as possible.
          </p>
          <div className="w-full  bg-lightCream  rounded mt-4 border px-4 py-4  border-[#D2D2D2]">
            <textarea
              value={aboutYourself.text}
              onChange={(e) => {
                setAboutYourself({ ...aboutYourself, text: e.target.value });
              }}
              placeholder="Type, upload a file or feel free to speak about yourself here "
              className="w-full outline-none bg-lightCream rounded  min-h-[40vh] resize-none "
            ></textarea>
            {/* <div className="flex justify-end mr-1">
              <FontAwesomeIcon
                icon={faUpload}
                className="text-darkBlue text-xl cursor-pointer p-2 rounded-full hover:bg-gray/[.2]"
                onClick={() => {
                  uploadAboutYourselfRef.current.click();
                }}
              />
            </div> */}
          </div>
          {/* <div className="mt-4">
            <p className="text-gray text-sm font-bold ">Uploaded files</p>
            <input
              type="file"
              multiple
              className="hidden"
              ref={uploadAboutYourselfRef}
              onChange={(e) => {
                setAboutYourselfFiles(e.target.files);

                let temp = [];
                Array.from(e.target.files).forEach((file) => {
                  temp.push(file.name);
                });

                setAboutYourself({ ...aboutYourself, files: temp });
              }}
            />
            {aboutYourself?.files?.map((file) => (
              <div className="flex mt-2 rounded justify-between items-center bg-lightCream px-4 py-1 border-b border-[#FFC422] ">
                <p className="text-darkBlue font-bold">{file}</p>
                <FontAwesomeIcon
                  icon={faClose}
                  className="text-darkBlue cursor-pointer p-1 hover:bg-gray/[.1] rounded-full"
                />
              </div>
            ))}
          </div> */}
        </div>

        {/* <div className="mt-8">
          <p className="text-gray font-semibold">Additional Documents</p>
          <input
            className="mt-4"
            type="file"
            multiple
            onChange={(e) => {
              setAdditionalFiles(e.target.files);

              let temp = [];
              Array.from(e.target.files).forEach((file) => {
                temp.push(file.name);
              });

              setAdditionalFilesLinks(temp);
            }}
          />
          <div className="mt-4">
            <p className="text-gray text-sm font-bold ">Uploaded files</p>

            {additionalFilesLinks?.map((file) => (
              <div className="flex mt-2 rounded justify-between items-center bg-lightCream px-4 py-1 border-b border-[#FFC422] ">
                <p className="text-darkBlue font-bold">{file}</p>
                <FontAwesomeIcon
                  icon={faClose}
                  className="text-darkBlue cursor-pointer p-1 hover:bg-gray/[.1] rounded-full"
                />
              </div>
            ))}
          </div>
        </div> */}
      </div>

      <div className="mt-8 fixed w-full left-0 bottom-0 border-t border-[#FFC422] bg-lightCream py-4 px-4 ">
        <div className="flex justify-end">
          <button
            onClick={submitData}
            className="bg-darkBlue focus:ring text-white px-6 py-2 rounded hover:bg-opacity-70 duration-150   ease-in-out"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
