import React, { useEffect, useState } from "react";
import app from "./base";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    app.auth().onAuthStateChanged(user => {
      if (user) {
        app
          .auth()
          .currentUser.getIdTokenResult()
          .then(idTokenResult => {
            if (!!idTokenResult.claims) {
              // console.log(idTokenResult.claims);
              setCurrentUser(idTokenResult.claims);
            } else {
              alert("ruh roh");
            }
          })
          .catch(error => {
            console.warn(error);
          });
      } else {
        setCurrentUser(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
