import React from 'react';
import FirebaseContext from '../../services/context';
import { withRouter, Redirect } from 'react-router';
import app from '../../services/base.js';

const Logout = props => {
  const fbContext = React.useContext(FirebaseContext);

  React.useEffect(() => {
    const signOut = async () => {
      await app.auth().signOut();
      props.setPath(null);
      localStorage.removeItem('path');
    };
    signOut();
    fbContext.setStateOnLogout();
  });
  return <Redirect to="/" />;
};

export default withRouter(Logout);
