import React, { useContext, useEffect, useState } from "react";
import { formatTime, systemInstruction } from "../helpers";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faChevronCircleDown,
  faChevronLeft,
  faLeftLong,
} from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../contexts/UserContext";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import CustomLoader from "../Components/CustomLoader";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

export default function ApplicationPage() {
  const [isLoading, setIsLoading, uid, setUid] = useContext(UserContext);
  const [isCustomLoading, setIsCustomLoading] = useState(false);
  let { applicationId } = useParams();
  const [userData, setUserData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [showErrMessage, setShowErrMessage] = useState(false);

  let [searchParams, setSearchParams] = useSearchParams();

  const getAIInput = async () => {
    setIsCustomLoading(true);

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
      You have to provide suggestions for  these questions and provide bullet points about what should i include  about me based on my CV and my personal information for a university applications and don't answer anything directly, ${applicationData?.questions?.join()} , ${
        applicationData?.queries
      }.
     
      return as an array of objects having keys "question" and "answer" as requirements and nothing else, so that i can convert your string response to a json variable. make sure I can run JSON.parse() on your response . 
. Return answer in markdown. .Make the  headings bold and italic using markdown.
     in the "answer" you should include your suggestions.
      `;
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      let text = response.text();
      console.log(text);
      if (text.includes("json")) {
        text = text.slice(7);
        text = text.slice(0, text.length - 5);
      }
      const responseJson = JSON.parse(text);
      console.log(responseJson);
      // console.log(responseJson);
      setQuestionsAndAnswers(responseJson);
      setIsCustomLoading(false);
      setShowErrMessage(false);
      await saveAIResponse(responseJson);
    } catch (err) {
      console.log(err);
      setIsCustomLoading(false);
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

    if (applicationResonse.applicationData.questionsAndAnswers) {
      setQuestionsAndAnswers(
        applicationResonse.applicationData.questionsAndAnswers
      );
    }
    console.log("applicationData loaded");
  };

  const saveAIResponse = async (responseJson) => {
    if (applicationData.questions) {
      console.log("saving AI response");

      const docRef = await setDoc(
        doc(db, "applications", uid, uid, applicationId),
        {
          applicationData: {
            ...applicationData,
            questionsAndAnswers: responseJson,
          },
        }
      );
      console.log("AI response saved");
    }
  };

  const getFullData = async () => {
    setIsCustomLoading(true);
    await getUserData();
    await getApplicationData();
    setIsCustomLoading(false);
  };

  const generateSuggestions = async (question, answer, myAnswer) => {
    setIsCustomLoading(true);

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

      const prompt = `Here's my resume information ${userData?.resumeText}. Here are  some personal information about me ${userData?.aboutYourself?.text}
      You have to check my answer for a university application question and give feedback as how can i improve my answer in markdown. Make the keypoint headings italic and bold  using markdown..  The question is ${question}, your previously suggested answer is ${answer}, My typed answer is ${myAnswer}
      .
      just return me the feedback.
      `;
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      let text = response.text();
      console.log(text);
      // if (text.includes("json")) {
      //   text = text.slice(7);
      //   text = text.slice(0, text.length - 5);
      // }
      // const responseJson = JSON.parse(text);
      // console.log(responseJson);

      // console.log(responseJson);
      // setQuestionsAndAnswers(responseJson);
      setIsCustomLoading(false);
      return text;
      // await saveAIResponse(responseJson);
    } catch (err) {
      console.log(err);
      setIsCustomLoading(false);
      toast.error("Error generating answer! Please Submit again!");
    }
  };

  useEffect(() => {
    // getAIInput();
    getFullData();
  }, [applicationId, uid]);
  useEffect(() => {
    if (
      userData.aboutYourself &&
      applicationData.uniName &&
      !applicationData.questionsAndAnswers
    ) {
      getAIInput();
    } else if (
      userData.aboutYourself &&
      applicationData.uniName &&
      searchParams.get("generate") == "true"
    ) {
      getAIInput();
    }
  }, [userData, applicationData, searchParams]);

  return (
    <div className="mt-16">
      <CustomLoader isLoading={isCustomLoading} />
      <div className="flex justify-between gap-8 flex-wrap">
        <Link
          to="/dashboard"
          className="flex gap-4 items-center  bg-lightCream border border-cream px-4 py-1 rounded "
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-gray" />
          <p className="text-gray font-semibold text-lg">Dashboard</p>
        </Link>

        <Link
          to={`/edit-application/${applicationId}`}
          className="flex gap-4 items-center  bg-lightCream border border-cream px-4 py-1 rounded "
        >
          <p className="text-gray font-semibold text-lg">
            Edit your application
          </p>
        </Link>
      </div>
      <div className="mt-6">
        <p className="text-center font-bold text-2xl text-darkBlue">
          {applicationData.uniName}
        </p>
        <div className="text-center mt-2">
          <p className="text-gray font-semibold">{applicationData.programName}</p>
          <p className="text-gray font-semibold">{applicationData.session}</p>
        </div>
      </div>
      {showErrMessage && (
        <div>
          <p className="text-red mt-4 font-bold text-xl text-center">
            There was error retrieving your data. Try refreshing the page.
          </p>
        </div>
      )}
      <div>
        {questionsAndAnswers.map((elem, index) => (
          <div className="my-8 border rounded-lg p-3 border-gray/[.2] font-inter">
            <div className="flex flex-col md:flex-row gap-1 md:gap-4 md:items-center">
              <p className="text-xl text-green-700 font-semibold">Question:</p>
              <p className="text-gray font-semibold">{elem.question}</p>
            </div>
            <div className="bg-[#EFFFDA] border-[#D2D2D2] mt-4 p-6 rounded">
              <p className="text-gray font-bold">Some recommendations for you:</p>
              <p className="mt-2 leading-7 text-lg text-green-900">
                <Markdown>{elem.answer}</Markdown>
              </p>
            </div>
            <div className="p-6  bg-lightCream mt-2 rounded-lg">
              <p className="text-gray font-bold mb-2">Your draft answer:</p>
              <textarea
                value={elem?.suggestiveAnswer}
                onChange={(e) => {
                  setQuestionsAndAnswers((prevState) => {
                    const newItems = [...prevState];
                    newItems[index] = {
                      ...newItems[index],
                      suggestiveAnswer: e.target.value,
                    };
                    return newItems;
                  });
                }}
                placeholder="Type your draft answer here"
                className="leading-6 w-full text-[#3D3929] outline-none bg-lightCream rounded  min-h-[18vh] resize-none  "
              ></textarea>
              <div className="flex justify-end mt-8">
                <button
                  className="bg-darkBlue text-white px-6 py-2 rounded hover:bg-opacity-70 duration-150   ease-in-out"
                  onClick={async () => {
                    const feedbackResponse = await generateSuggestions(
                      elem.question,
                      elem.answer,
                      elem.suggestiveAnswer
                    );
                    if (feedbackResponse) {
                      setQuestionsAndAnswers((prevState) => {
                        const newItems = [...prevState];
                        newItems[index] = {
                          ...newItems[index],
                          feedback: feedbackResponse,
                        };
                        return newItems;
                      });
                    }
                  }}
                >
                  View feedback
                </button>
              </div>
            </div>
            {elem.feedback && (
              <div className="bg-[#DAEBF2] border-[#D2D2D2] mt-4 p-6 rounded">
                <p className="text-gray font-bold">Points of improvement:</p>
                <p className="mt-2 leading-7 text-lg text-[#0B6683]">
                  <Markdown>{elem.feedback}</Markdown>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
