import React, { useState, createContext } from "react";

export const UserContext = createContext();

export const UserContextProvider = (props) => {


  const [isLoading, setIsLoading] = useState(false);
  const [uid, setUid] = useState("");

 

  return (
    <UserContext.Provider value={[isLoading, setIsLoading, uid, setUid]}>
      {props.children}
    </UserContext.Provider>
  );
};
