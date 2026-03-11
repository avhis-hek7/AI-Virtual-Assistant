import React from 'react'
import { useContext } from 'react'
import UserDataContext from '../context/UserDataContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

function Home() {
  const {userData,serverUrl,setUserData,getGeminiResponse} = useContext(UserDataContext);
  const navigate = useNavigate();

  const handleLogout = async() =>{
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true});
      console.log(result)
      setUserData(null);
      navigate('/login');
      


    } catch (error) {
      console.log(error)
      setUserData(null);
    }
  }

  const speak =(text) =>{
    const utterance = new SpeechSynthesisUtterance(text);
     window.speechSynthesis.speak(utterance);
  }

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



  useEffect(()=>{
    const speechRecognition =  window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new speechRecognition();
    recognition.continuous = true, 
    recognition.lang = 'en-US'

    recognition.onresult = async(e) =>{
      const transcript = e.results[e.results.length-1][0].transcript.trim()
      console.log("Heared:",transcript)
     if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
  const data = await getGeminiResponse(transcript);
  console.log(data);
  handleCommand(data);
}
      

    }

    recognition.start();

    
  },[])




  return (
    <div className='w-full h-screen bg-linear-to-t from-[black] to-[#030353] flex justify-center items-center flex-col gap-4'>

      <button className="min-w-37.5 h-15 bg-white rounded-full cursor-pointer absolute top-5 right-5 text-black font-semibold text-4 mt-6 
  transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 px-5 py-2.5"  onClick={()=>navigate('/customize')}>Customize Your Assistant</button>

  <button className="min-w-37.5 h-15 bg-white rounded-full cursor-pointer absolute top-25 right-5 text-black font-semibold text-4 mt-6 
  transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95" onClick={handleLogout}>Log Out</button>

      <div className='w-75 h-100 flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'  >
        <img src={userData?.assistantImage} alt="" className='h-full object-cover' />
      </div>
      <h1 className='text-white text-5 font-semibold'>I'm {userData?.assistantName}</h1>
    </div>
  )
}

export default Home