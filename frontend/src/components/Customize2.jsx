import React, { useContext, useState } from 'react'
import UserDataContext from '../context/UserDataContext'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

function Customize2() {
    const{userData, backendImage, selectedImage, serverUrl, setUserData} = useContext(UserDataContext);
    const [assistantName, setAssistanceImage] = useState(userData?.assistantName || "");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpdateAssistant = async() =>{
      setLoading(true)

      try {
        let formData = new FormData();
        formData.append('assistantName',assistantName);
        if(backendImage){
          formData.append('assistantImage', backendImage);
        }else{
          formData.append("imageUrl",selectedImage);
        }
        const result = await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
        setLoading(false)
        console.log(result.data);
        setUserData(result.data.user);
        navigate('/');
      } catch (error) {
        setLoading(false);
        console.log(error);
        
        
      }

    }



  return (
    <div className="w-full h-screen bg-linear-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-5 relative ">
        <MdKeyboardBackspace className='absolute top-10 left-20 text-white w-20 h-10 cursor-pointer' onClick={()=>navigate('/customize')}/>
        <h1  className="text-white text-3xl text-center mb-6">Enter Your <span className="text-blue-200" >Assistant Name</span> </h1>
         <input
          type="text"
          placeholder="eg.shifra"
          className="w-full max-w-150 h-15 outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2.5 rounded-full text-[18px]"
          required
          onChange={(e)=>{setAssistanceImage(e.target.value)}}
          value={assistantName}
        />

       {assistantName &&  <button
        className="min-w-60 h-15 bg-white rounded-full text-xl text-black font-semibold text-4 mt-6 
        transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer" 

        onClick={()=>handleUpdateAssistant()}
        disabled={loading}


      >
        { !loading?"Create Your Assistant.":"Loading..."}
      </button>}


    </div>
  )
}

export default Customize2