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
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([
    {
      question:
        "If you have been competitively awarded any fellowships or other honors, briefly describe (e.g. McNair Scholar, Mellon Mays Fellow, Gates Millennial Scholar, etc.)",
      answer:
        "While I haven't been awarded any specific fellowships like the McNair or Mellon Mays programs, I have consistently demonstrated academic excellence throughout my undergraduate journey. I am a recipient of the Dean's List Award and the University Merit Scholarship at BUET, both awarded for maintaining a high CGPA and academic standing. Additionally, I was a finalist for the prestigious Honda Young Engineers and Scientists Award in 2024, recognizing my potential in the field of engineering and research.",
    },
    {
      question:
        "How will you explore community at Penn? Consider how Penn will help shape your perspective, and how your experiences and perspective will help shape Penn. (150-200 words)",
      answer:
        "Penn's vibrant and diverse community, coupled with its strong emphasis on interdisciplinary collaboration, deeply resonates with me. I'm particularly drawn to opportunities like the Engineering Entrepreneurship program and the GRASP Lab, where I can connect with like-minded individuals passionate about robotics and innovation. I envision myself actively contributing to these communities, sharing my experiences from Team Interplanetar and the BUET Mars Rover Team. My unique perspective from Bangladesh and my involvement in projects like EcoChill, addressing sustainability challenges, will add to the richness of discussions and collaborations at Penn.  I believe that Penn's global outlook and commitment to social impact align perfectly with my aspirations to make a meaningful difference in the world through engineering and technology.",
    },
    {
      question: "Write something about your strengths.",
      answer:
        "My strengths lie in my ability to bridge the gap between theoretical knowledge and practical application.  I'm a skilled problem solver with a passion for hands-on projects, as evidenced by my involvement in robotics, research, and design initiatives.  I excel in teamwork and leadership, having led diverse teams in both technical and extracurricular settings. My experience fostering collaboration within Team Interplanetar and organizing events for the IMechE BUET Student Chapter demonstrates my ability to bring people together and achieve common goals.  Additionally, I possess strong communication skills, honed through presentations, workshops, and technical documentation.  My dedication to continuous learning and my ability to adapt to new challenges make me a valuable asset to any team or community.",
    },
    {
      question:
        "Write something about why you want to get admitted to this university.",
      answer:
        "I aspire to join Penn's esteemed engineering program because it offers an unparalleled environment for intellectual growth and innovation. The university's focus on interdisciplinary research, coupled with its world-renowned faculty and state-of-the-art facilities, aligns perfectly with my academic aspirations. I'm particularly interested in exploring the intersection of robotics, artificial intelligence, and sustainable design, and I believe that Penn's resources and collaborative spirit will provide the ideal platform for me to pursue these interests.  Moreover, Penn's commitment to social impact and global engagement resonates deeply with my values. I'm eager to contribute to a community that actively seeks solutions to real-world challenges and prepares students to become responsible leaders in a rapidly changing world.",
    },
  ]);

  const getAIInput = async () => {
    setIsLoading(true);
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
    text = text.slice(7);
    text = text.slice(0, text.length - 5);
    const responseJson = JSON.parse(text);
    console.log(responseJson);
    // console.log(responseJson);
    setQuestionsAndAnswers(responseJson);
    setIsLoading(false);
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
        <p className="text-center font-bold text-2xl text-darkBlue">{applicationData.uniName}</p>
      </div>
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
