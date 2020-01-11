import React from "react";
import myFirebase from "../../services/firebase";
import { Redirect } from "react-router-dom";

const Logout = props => {
  myFirebase.auth().signOut();
  return <Redirect to="/" />;
};

export { Logout };
