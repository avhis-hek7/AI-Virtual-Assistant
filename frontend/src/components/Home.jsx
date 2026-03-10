import React from 'react'
import { useContext } from 'react'
import UserDataContext from '../context/UserDataContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const {userData,serverUrl,setUserData} = useContext(UserDataContext);
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