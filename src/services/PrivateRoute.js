import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from './Auth';

const PrivateRoute = ({
  component: RouteComponent,
  location,
  setPath,
  ...rest
}) => {
  const { currentUser } = useContext(AuthContext);

  if (currentUser) setPath(location.pathname);

  return (
    <Route
      {...rest}
      render={routeProps =>
        !!currentUser ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={'/'} />
        )
      }
    />
  );
};

export default PrivateRoute;
