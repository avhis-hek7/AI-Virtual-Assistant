import React from "react";
import UserDataContext from "./UserDataContext";

function UserContext({ children }) {
  const serverUrl = "http://localhost:8000";

  return (
    <UserDataContext.Provider value={{ serverUrl }}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;