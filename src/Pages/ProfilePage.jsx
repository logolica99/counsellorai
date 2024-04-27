import { faClose, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase.config";
import { useContext, useEffect, useState } from "react";
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

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useContext(UserContext);
  const [aboutYourself, setAboutYourself] = useState({
    text: "",
    files: [],
  });
  const [userData, setUserData] = useState({
    resumeLink: "",
    aboutYourself: {
      text: "er",
      files: [],
    },
    additionalFiles: [],
  });

  const getUserData = async () => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    const userDataResponse = docSnap.data();
    console.log(userDataResponse);
    setResumeLink(userDataResponse.resumeLink);
    if (userDataResponse.aboutYourself) {
      setAboutYourself(userDataResponse.aboutYourself);
    }
  };

  useEffect(() => {
    if (user.uid) {
      getUserData();
    }
  }, [user.uid]);

  const [resumeLink, setResumeLink] = useState("");
  const [resumeFile, setResumeFile] = useState({});

  const [additionalFiles, setAdditionalFiles] = useState([]);

  const submitData = () => {
    toast.promise(updateData(), {
      loading: "Saving...",
      success: <b>Profile Updated!</b>,
      error: <b>Could not save.</b>,
    });

    setDoc(doc(db, "users", user.uid), {
      resumeLink: resumeLink,
      aboutYourself: aboutYourself,
    });
    getUserData();
  };

  const updateData = async () => {
    const storage = getStorage();

    const resumeRef = ref(storage, `${user.uid}/${resumeFile.name}`);
    await uploadBytes(resumeRef, resumeFile).then((snapshot) => {
      console.log("Uploaded resume!");
    });
    await setDoc(doc(db, "users", user.uid), {
      resumeLink: resumeLink,
    });
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
            Upload you resume / academic CV
          </p>

          <input
            className="mt-4"
            type="file"
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
