import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from './Auth';

const PrivateRoute = ({ component: RouteComponent, location, setPath, ...rest }) => {
  const { currentUser } = useContext(AuthContext);

  console.log(currentUser);
  if (currentUser) setPath(location.pathname);
  else setPath(null);
  console.log('in privateRoute');

  return (
    <Route
      {...rest}
      render={routeProps => (!!currentUser ? <RouteComponent {...routeProps} /> : <Redirect to={'/'} />)}
    />
  );
};

export default PrivateRoute;
