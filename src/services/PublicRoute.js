import React from 'react';
import { Route } from 'react-router-dom';

const PublicRoute = ({ component: Component, setPath, ...rest }) => {
  localStorage.removeItem('path');
  setPath(null);

  return <Route {...rest} render={props => <Component {...props} />} />;
};

export default PublicRoute;
