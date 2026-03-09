import React, { useEffect, useState } from "react";
import UserDataContext from "./UserDataContext";
import axios from "axios";

function UserContext({ children }) {
  const serverUrl = "http://localhost:8000";

 

  const [userData, setUserData] = useState(null);

  const handleCurrentUser = async() => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/currentuser`,{
        withCredentials:true
      })
      setUserData(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error)
      
    }
  }

  useEffect(()=>{
    handleCurrentUser();
  },[])

   const value ={
    serverUrl, userData, setUserData
  }

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;