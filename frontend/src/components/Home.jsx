import React, { useContext, useEffect, useState, useRef } from "react";
import UserDataContext from "../context/UserDataContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ai from "../assets/ai.gif";
import userImage from "../assets/user.gif";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(UserDataContext);
  const navigate = useNavigate();

  const [listening, setListenning] = useState(false);
  const [ham, setHam] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");

  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;

  // Logout
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

  // Speak text
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    isSpeakingRef.current = true;

    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      // Restart recognition after speaking
      setTimeout(() => {
        startRecognitionSafe();
      }, 500);
    };

    synth.cancel();
    synth.speak(utterance);
  };

  // Open URLs safely
  const openURL = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Handle commands
  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);
    console.log("Command:", type, userInput);

    switch (type) {
      case "google_search":
        openURL(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`);
        break;
      case "calculator_open":
        openURL("https://www.calculator.net/");
        break;
      case "instagram_open":
        openURL("https://www.instagram.com/");
        break;
      case "facebook_open":
        openURL("https://www.facebook.com/");
        break;
      case "weather_show":
        openURL("https://www.weather.com/weather/today");
        break;
      case "youtube_search":
      case "youtube_play":
        openURL(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`);
        break;
      default:
        break;
    }
  };

  // Safe recognition start
  const startRecognitionSafe = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognition.start();
        console.log("Recognition started");
      } catch (e) {
        if (e.name !== "InvalidStateError") console.error("Start error:", e);
      }
    }
  };

  // Setup recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("SpeechRecognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    let isMounted = true;
    let restartTimeout = null;

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListenning(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListenning(false);

      if (isMounted && !isSpeakingRef.current) {
        restartTimeout = setTimeout(() => startRecognitionSafe(), 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListenning(false);

      if (event.error === "network") {
        console.warn("Network error: check your internet connection.");
        return; // avoid infinite restart loop
      }

      // Retry for other errors
      restartTimeout = setTimeout(() => startRecognitionSafe(), 1000);
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Heard:", transcript);

      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setUserText(transcript);
        recognition.stop();

        const data = await getGeminiResponse(transcript);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      }
    };

    // Initial greeting
    const greeting = new SpeechSynthesisUtterance(
      `Hello ${userData.name}, what can I help you with?`
    );
    greeting.onend = () => startRecognitionSafe();
    synth.speak(greeting);

    return () => {
      isMounted = false;
      clearTimeout(restartTimeout);
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