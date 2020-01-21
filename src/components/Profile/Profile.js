import React, { useContext, useState, useEffect } from "react";
import { withRouter } from "react-router";

import { AuthContext } from "../../services/Auth";
import app from "../../services/base.js";
import dbServices from "../../services/dbServices";

const Profile = props => {
  const { currentUser } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({});
  const [userJobs, setUserJobs] = useState([]);

  useEffect(() => {
    dbServices
      .getUser(props.match.params.id, currentUser.org)
      .then(snapshot => {
        snapshot.forEach(doc => {
          setUserInfo({
            role: doc.data().role,
            email: doc.data().email,
            name: doc.data().name,
            org: doc.data().org
          });
        });
      });
  }, []);

  if (userInfo && userInfo.role)
    return (
      <div>
        <ul>
          <li>Role: {userInfo.role}</li>
          <li>Email: {userInfo.email}</li>
          <li>Name: {userInfo.name}</li>
          <li>Org: {userInfo.org}</li>
        </ul>
      </div>
    );
  return <></>;
};

export default withRouter(Profile);
