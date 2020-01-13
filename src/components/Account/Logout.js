import React from 'react';
import app from '../../services/base.js';
import { Redirect } from 'react-router-dom';
import FirebaseContext from '../../services/context';

const Logout = async props => {
  const fbContext = React.useContext(FirebaseContext);
  await app.auth().signOut();
  await fbContext.setStateOnLogout();
  return <Redirect to="/" />;
};

export default { Logout };
