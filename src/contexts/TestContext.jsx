import React, { useState, createContext } from "react";

export const TestContext = createContext();

export const TestContextProvider = (props) => {
  const [loading, isLoading] = useState();

  return (
    <TestContext.Provider value={[loading, isLoading]}>
      {props.children}
    </TestContext.Provider>
  );
};
