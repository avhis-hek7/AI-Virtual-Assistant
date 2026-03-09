import React from "react";
import Card from "./Card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image4.png";
import image4 from "../assets/image5.png";
import image5 from "../assets/image6.jpeg";
import image6 from "../assets/image7.jpeg";
import image7 from "../assets/authBg.png";
import { FaImages } from "react-icons/fa6";

function Customize() {
  return (
    <div className="w-full h-screen bg-linear-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-5 ">
      <h1 className="text-white text-2xl text-center mb-6">Select your <span className="text-blue-200">Assistant Image</span> </h1>  
      <div className="w-full max-w-[60%] flex justify-center items-center flex-wrap  gap-5">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />

        <div className=" w-20 h-40 lg:w-40 lg:h-60 bg-[#030326] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center">
          <FaImages className="text-white w-5 h-5 " />
        </div>
      </div>
    </div>
  );
}

export default Customize;
