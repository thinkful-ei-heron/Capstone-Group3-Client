import React from 'react';
import { withRouter, useHistory } from 'react-router';
import app from '../../services/base.js';

const Logout = props => {
  const history = useHistory();
  React.useEffect(() => {
    const signOut = async () => {
      await app
        .auth()
        .signOut()
        .then(() => {
          // props.setPath(null);
          localStorage.removeItem('path');
        });
      history.push('/');
    };
    signOut();
  });
  return <></>;
};

export default withRouter(Logout);
