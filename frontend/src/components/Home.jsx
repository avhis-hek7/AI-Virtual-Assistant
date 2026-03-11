import React from "react";
import { useContext } from "react";
import UserDataContext from "../context/UserDataContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import ai from "../assets/ai.gif";
import userImage from "../assets/user.gif";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(UserDataContext);
  const navigate = useNavigate();
  const [listening, setListenning] = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;
  const [ham, setHam] = useState(false);

  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      console.log(result);
      setUserData(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
      setUserData(null);
    }
  };

  const startRecognition = () => {
    if(!isSpeakingRef.current && isRecognizingRef.current){
      try {
      recognitionRef.current?.start();
      console.log("Recognition requested to start");
    } catch (error) {
      if (error.name !== "InavlidStateError") {
        console.error("Start error:", error);
      }
    }
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);

    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;

      setTimeout(()=>{
          startRecognition();
      },800)
      
    };
    synth.cancel();
    synth.speak(utterance);
  };

  // const handleCommand = (data) => {
  //   const { type, userInput, response } = data;

  //   speak(response);
  //   console.log("Command:", type, userInput);

  //   if (type === "google_search") {
  //     const query = encodeURIComponent(userInput);
  //     window.open(`https://www.google.com/search?q=${query}`, "_blank");
  //   }

  //   if (type === "calculator_open") {
  //     window.open("https://www.calculator.net/", "_blank");
  //   }

  //   if (type === "instagram_open") {
  //     window.open("https://www.instagram.com/", "_blank");
  //   }

  //   if (type === "facebook_open") {
  //     window.open("https://www.facebook.com/", "_blank");
  //   }

  //   if (type === "weather_show") {
  //     window.open("https://www.weather.com/weather", "_blank");
  //   }

  //   if (type === "youtube_search" || type === 'youtube_play') {
  //     const query = encodeURIComponent(userInput);
  //     window.open(
  //       `https://www.youtube.com/results?search_query=${query}`,
  //       "_blank"
  //     );
  //   }
  // };

  // Open Chrome → address bar → click the popup blocked icon

  const handleCommand = (data) => {
    const { type, userInput, response } = data;

    speak(response);
    console.log("Command:", type, userInput);

    const openURL = (url) => {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    if (type === "google_search") {
      const query = encodeURIComponent(userInput);
      openURL(`https://www.google.com/search?q=${query}`);
    }

    if (type === "calculator_open") {
      openURL("https://www.calculator.net/");
    }

    if (type === "instagram_open") {
      openURL("https://www.instagram.com/");
    }

    if (type === "facebook_open") {
      openURL("https://www.facebook.com/");
    }

    if (type === "weather_show") {
      openURL("https://www.weather.com/weather/today");
    }

    if (type === "youtube_search" || type === "youtube_play") {
      const query = encodeURIComponent(userInput);
      openURL(`https://www.youtube.com/results?search_query=${query}`);
    }
  };

  useEffect(() => {
    const speechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new speechRecognition();
    recognition.continuous = true, 
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognitionRef.current = recognition;


    let isMounted = true;

    const startTimeout = setTimeout(()=>{
      if(isMounted && !isSpeakingRef.current && !isRecognizingRef.current){
        try {
          recognition.start();
          console.log("Recognition requested to start");
        } catch (e) {
          if (e.name !== "InvalidStateError") {
            console.error("Start error", e);
          }
        }

      }
    },1000);

    // const safeRecognition = () => {
    //   if (!isSpeakingRef.current && !isRecognizingRef.current) {
    //     try {
    //       recognition.start();
    //       console.log("Recognition requested to start");
    //     } catch (err) {
    //       if (err.name !== "InvalidStateError") {
    //         console.error("Start error", err);
    //       }
    //     }
    //   }
    // };

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListenning(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListenning(false);

      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
         if(isMounted){
          try {
            recognition.start();
            console.log("Recognition restarted")
          } catch (e) {
            if(e.name !== "InvalidStateError"){
              console.error(e)
            }
            
          }
         }
        }, 1000); // delay avoid the rapid loop
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recongition error:", event.error);
      isRecognizingRef.current = false;
      setListenning(false);
      if (event.error !== "aborted" && !isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if(isMounted){
            try {
            recognition.start();
            console.log("Recognition restarted after error")
          } catch (e) {
            if(e.name !== "InvalidStateError"){
              console.error(e)
            }
            
          }

          }
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("headred:", transcript);
      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        setAiText("");
        setUserText(transcript);

        recognition.stop();
        isRecognizingRef.current = false;
        setListenning(false);
        const data = await getGeminiResponse(transcript);
        console.log(data);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      }
    };

  
    const greeting = new SpeechSynthesisUtterance( `Hello ${userData.name}, what can i help you with?`);
    window.speechSynthesis.speak(greeting);


    // const fallback = setInterval(() => {
    //   if (!isSpeakingRef.current && !isRecognizingRef.current) {
    //     safeRecognition();
    //   }
    // }, 10000);
    // safeRecognition();

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListenning(false);
      isRecognizingRef.current = false;
      
    };
  }, []);

  return (
  <div className="w-full h-screen bg-linear-to-t from-[black] to-[#030353] flex justify-center items-center flex-col gap-4">

  {/* Mobile Menu Icon */}
  {!ham && (
    <IoMenu
      className="lg:hidden text-white absolute top-5 right-5 w-6.5 h-6.5 cursor-pointer"
      onClick={() => setHam(true)}
    />
  )}

  {/* Mobile Menu */}
  {ham && (
    <div className="lg:hidden absolute top-0 left-0 w-full h-full bg-[#0000004d] backdrop-blur-lg p-5 flex flex-col gap-5 items-start">

      <RxCross2
        className="text-white absolute top-5 right-5 w-6.5 h-6.5 cursor-pointer"
        onClick={() => setHam(false)}
      />

      <button
        className="min-w-37.5 h-15 bg-white rounded-full cursor-pointer text-black font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 px-5 py-2.5"
        onClick={() => navigate("/customize")}
      >
        Customize Your Assistant
      </button>

      <button
        className="min-w-37.5 h-15 bg-white rounded-full cursor-pointer text-black font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
        onClick={handleLogout}
      >
        Log Out
      </button>

      <div className="w-full h-0.5 bg-gray-400"></div>

      <h1 className="text-white font-semibold text-[19px]">History</h1>

      <div className="w-full h-100 gap-5 overflow-auto flex flex-col">
        {userData?.history?.map((his, index) => (
          <span key={index} className="text-white text-[18px] truncate">
            {his}
          </span>
        ))}
      </div>

    </div>
  )}

  {/* Desktop Buttons */}
  <button
    className="min-w-37.5 h-15 bg-white hidden lg:block rounded-full cursor-pointer absolute top-5 right-5 text-black font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 px-5 py-2.5"
    onClick={() => navigate("/customize")}
  >
    Customize Your Assistant
  </button>

  <button
    className="min-w-37.5 h-15 bg-white hidden lg:block rounded-full cursor-pointer absolute top-25 right-5 text-black font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
    onClick={handleLogout}
  >
    Log Out
  </button>

  {/* Assistant Image */}
  <div className="w-75 h-100 flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
    <img
      src={userData?.assistantImage}
      alt=""
      className="h-full object-cover"
    />
  </div>

  {/* Assistant Name */}
  <h1 className="text-white text-5 font-semibold">
    I'm {userData?.assistantName}
  </h1>

  {/* Speaking Animation */}
  {!aiText && <img src={userImage} alt="" className="w-50" />}
  {aiText && <img src={ai} alt="" className="w-50" />}

  {/* Text */}
  <h1 className="text-white text-[15px] font-semibold text-wrap text-center">
    {userText ? userText : aiText ? aiText : null}
  </h1>

</div>
  );
}

export default Home;
