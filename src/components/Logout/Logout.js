import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import FirebaseContext from "../../services/context";

const Logout = props => {
  const fbContext = useContext(FirebaseContext);
  fbContext.doSignOut().then(() => {
    return <Redirect to="/" />;
  });
};

export default Logout;
