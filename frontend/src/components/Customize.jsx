import React, { useContext, useRef } from "react";
import Card from "./Card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image4.png";
import image4 from "../assets/image5.png";
import image5 from "../assets/image6.jpeg";
import image6 from "../assets/image7.jpeg";
import image7 from "../assets/authBg.png";
import { FaImages } from "react-icons/fa6";
import UserDataContext from "../context/UserDataContext";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

function Customize() {

  const { frontendImage, setFrontendImage, setBackendImage, selectedImage, setSelectedImage } = useContext(UserDataContext);
  const navigate = useNavigate();

  const inputImage = useRef()

  const handleImage = (e) =>{
      const file = e.target.files[0]
      setBackendImage(file)
      setFrontendImage(URL.createObjectURL(file))
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-4 lg:p-5">

     <div className="w-full flex items-center flex-col gap-3 mb-6">
  
  <MdKeyboardBackspace
    className="text-white w-10 h-10 lg:w-20 lg:h-10 cursor-pointer"
    onClick={() => navigate('/')}
  /><span  className="text-white" >Back To home</span>

  <h1 className="text-white text-xl mt-20 lg:text-3xl">
    Select Your <span className="text-blue-200">Assistant Image</span>
  </h1>

</div>

      {/* Image Cards */}
      <div className="w-full lg:max-w-[60%] flex justify-center items-center flex-wrap gap-4 lg:gap-5">

        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />

        {/* Upload Card */}
        <div
          className={`w-20 h-32 lg:w-40 lg:h-60 bg-[#030326] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${
            selectedImage=="input" ? "border-4 border-white shadow-2xl shadow-blue-950" : null
          }`}
          onClick={()=>{
            inputImage.current.click()
            setSelectedImage("input")
          }}
        >

          {!frontendImage && <FaImages className="text-white w-5 h-5 lg:w-8 lg:h-8" />}
          {frontendImage && <img src={frontendImage} className="h-full object-cover" />}

        </div>

        <input type="file" accept="image/*" ref={inputImage} hidden onChange={handleImage}/>
      </div>

      {/* Next Button */}
      {selectedImage && (
        <button
          className="min-w-30 lg:min-w-37.5 h-12 lg:h-15 bg-white rounded-full text-black font-semibold text-4 mt-6 
          transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer"
          onClick={()=>navigate('/customize2')}
        >
          Next
        </button>
      )}

    </div>
  );
}

export default Customize;