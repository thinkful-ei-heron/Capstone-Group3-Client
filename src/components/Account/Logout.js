import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import FirebaseContext from "../../services/context";

const Logout = props => {
  const fbContext = useContext(FirebaseContext);
  return fbContext.doSignOut().then(() => {
    return <Redirect to="/" />;
  });
};

export { Logout };
