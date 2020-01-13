import React from 'react';
import app from '../../services/base.js';
import { Redirect } from 'react-router-dom';

const Logout = props => {
  app.auth().signOut();
  return <Redirect to="/" />;
};

export { Logout };
