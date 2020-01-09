import React from "react";
import myFirebase from "../../services/firebase";
import { Redirect } from "react-router-dom";

const Logout = props => {
  myFirebase
    .auth()
    .signOut()
    .then(() => {
      props.updateUser({});
    })
    .catch(function(error) {
      throw new Error(error);
    });
  return <Redirect to="/" />;
};

export { Logout };
