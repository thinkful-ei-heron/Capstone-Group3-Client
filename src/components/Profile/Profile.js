import React, { useContext, useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";

import { AuthContext } from "../../services/Auth";
import app from "../../services/base.js";
import dbServices from "../../services/dbServices";

const Profile = props => {
  const { currentUser } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({});
  // const [userJobs, setUserJobs] = useState([]);
  const [userProjects, setUserProjects] = useState([]);

  const getUserInfo = async () => {
    let info = {};
    await dbServices
      .getUser(props.match.params.id, currentUser.org)
      .then(snapshot => {
        snapshot.forEach(doc => {
          info = {
            role: doc.data().role,
            email: doc.data().email,
            name: doc.data().name,
            org: doc.data().org
          };
        });
      });
    return info;
  };

  const getUserProjects = async info => {
    dbServices.getEmployeeProjects(info.name, info.org).then(snapshot => {
      snapshot.forEach(doc => {
        setUserProjects([...userProjects, doc.data()]);
      });
    });
  };

  useEffect(() => {
    getUserInfo().then(info => {
      setUserInfo(info);
      getUserProjects(info);
    });
  }, []);

  if (userInfo && userInfo.role)
    return (
      <div>
        <h3>User Info:</h3>
        <ul>
          <li>Role: {userInfo.role}</li>
          <li>Email: {userInfo.email}</li>
          <li>Name: {userInfo.name}</li>
          <li>Org: {userInfo.org}</li>
        </ul>
        <h3>User Projects:</h3>
        {userProjects ? (
          <ul>
            {userProjects.map((proj, i) => {
              return (
                <li key={i}>
                  <Link to={`/project/${proj.id}`}>{proj.name}</Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No Projects assigned.</p>
        )}
      </div>
    );
  return <></>;
};

export default withRouter(Profile);
