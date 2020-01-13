import React from "react";
import FirebaseContext from "../../services/context";
import { withRouter, Redirect } from "react-router";

const Logout = props => {
  const fbContext = React.useContext(FirebaseContext);
  React.useEffect(() => {
    fbContext.setStateOnLogout();
  });
  return <Redirect to="/" />;
};

export default withRouter(Logout);
