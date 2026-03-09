import React, { useState } from "react";
import bg from "../assets/authBg.png";
import { useNavigate } from 'react-router-dom';
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useContext } from "react";

import UserDataContext from "../context/UserDataContext";

function Login() {
  const [visiblePassword, setVisiblePassword] = useState(false);
  const { serverUrl, userData, setUserData } = useContext(UserDataContext);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async(e)=>{
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
        let result = await axios.post(`${serverUrl}/api/auth/login`,{
        // let result = await axios.post("http://localhost:8000/api/auth/login",{
            email,password
        },{withCredentials:true})
        setUserData(result.data)
        setLoading(false)
    } catch (error) {
        setUserData(null)     
        console.log(error)
        setLoading(false)
        setErr(error.response.data.message)
        
        
    }

  }

  const navigate = useNavigate();
  return (
    <div
      className="w-full h-screen bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form className="w-[90%] h-150 max-w-125 bg-[#0000007c] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-5 px-5" onSubmit={handleLogin}>
        <h1 className="text-white text-[30px] font-semibold mb-7.5">
          Login to <span className="text-blue-400">Virtual Assistant</span>
        </h1>
    
        <input
          type="email"
          placeholder="Email"
          className="w-full h-15 outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2.5 rounded-full text-[18px]"
          required
          onChange={(e)=>setEmail(e.target.value)}
          value={email}
        />

        <div className="w-full h-15 border-2 border-white bg-transparent text-white rounded-full text-[18px] relative">
          <input
            type={visiblePassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-5 py-2.5 "
            required
          onChange={(e)=>setPassword(e.target.value)}
          value={password}
          />

          {!visiblePassword && (
            <IoEyeSharp
              className="absolute top-5 right-6 text-white w-5 h-5 cursor-pointer"
              onClick={() => setVisiblePassword(true)}
            />
          )}

          {visiblePassword && (
            <FaEyeSlash
              className="absolute top-5 right-6 text-white w-5 h-5 cursor-pointer"
              onClick={() => setVisiblePassword(false)}
            />
          )}
        </div>
        {err.length >0 && <p className="text-red-700 text-[17px]">*{err}</p> }
        <button className="min-w-37.5 h-15 bg-white rounded-full text-black font-semibold text-4 mt-6" disabled={loading}>{loading?"Loading...":"Log In"}</button>
        <p className="text-white text-[18px] cursor-pointer" onClick={()=>navigate('/signup')}>Don't have an account? <span className="text-blue-400">Sign Up</span></p>
      </form>
    </div>
  );
}

export default Login;
