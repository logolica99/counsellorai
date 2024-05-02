import React, { useContext, useEffect, useState } from "react";
import { formatTime, systemInstruction } from "../helpers";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faChevronCircleDown,
  faChevronLeft,
  faLeftLong,
} from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../contexts/UserContext";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function ApplicationPage() {
  const [isLoading, setIsLoading, uid, setUid] = useContext(UserContext);
  let { applicationId } = useParams();
  const [userData, setUserData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [showErrMessage, setShowErrMessage] = useState(false);

  const getAIInput = async () => {
    setIsLoading(true);

    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(API_KEY);

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro-latest",
      });
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: systemInstruction }],
          },
        ],
      });

      const resumePrompt = `Here's my resume information ${userData?.resumeText}.`;

      const prompt = `Here's my resume information ${
        userData?.resumeText
      }. Here are  some personal information about me ${
        userData?.aboutYourself?.text
      }
      You have to answer these questions about me for a university applications ${applicationData?.questions?.join()} , ${
        applicationData?.queries
      }.
     
      return as an array of objects having keys "question" and "answers" or requirements and nothing else, so that i can convert your string response to a json variable
      `;
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      let text = response.text();
      console.log(text);
      text = text.slice(7);
      text = text.slice(0, text.length - 5);
      const responseJson = JSON.parse(text);
      console.log(responseJson);
      // console.log(responseJson);
      setQuestionsAndAnswers(responseJson);
      setIsLoading(false);
      setShowErrMessage(false);
    } catch (err) {
      setIsLoading(false);
      setShowErrMessage(true);
    }
  };

  const getUserData = async () => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    const userDataResponse = docSnap.data();
    console.log("userData loaded");
    setUserData(userDataResponse);
  };

  const getApplicationData = async () => {
    const docRef = doc(db, "applications", uid, uid, applicationId);
    const docSnap = await getDoc(docRef);
    const applicationResonse = docSnap.data();
    setApplicationData(applicationResonse.applicationData);
    console.log("applicationData loaded");
  };

  const getFullData = async () => {
    setIsLoading(true);
    await getUserData();
    await getApplicationData();
    setIsLoading(false);
  };

  useEffect(() => {
    // getAIInput();
    getFullData();
  }, [applicationId, uid]);
  useEffect(() => {
    if (userData.aboutYourself && applicationData.queries) {
      getAIInput();
    }
  }, [userData, applicationData]);

  return (
    <div className="mt-16">
      <div className="flex ">
        <Link
          to="/dashboard"
          className="flex gap-4 items-center  bg-lightCream border border-cream px-4 py-1 rounded "
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-gray" />
          <p className="text-gray font-semibold text-lg">Dashboard</p>
        </Link>
      </div>
      <div className="mt-6">
        <p className="text-center font-bold text-2xl text-darkBlue">
          {applicationData.uniName}
        </p>
      </div>
      {showErrMessage && (
        <div>
          <p className="text-red mt-4 font-bold text-xl text-center">
            There was error retrieving your data. Try refreshing the page.
          </p>
        </div>
      )}
      <div>
        {questionsAndAnswers.map((elem) => (
          <div className="my-8">
            <div className="flex gap-4 items-center">
              <p className="text-xl text-green-700 font-semibold">Question:</p>
              <p className="text-gray font-semibold">{elem.question}</p>
            </div>
            <div className="bg-[#EFFFDA] border-[#D2D2D2] mt-4 p-4 rounded">
              <p className="text-gray font-bold">
                A recommended answer for you
              </p>
              <p className="mt-2 ">{elem.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
