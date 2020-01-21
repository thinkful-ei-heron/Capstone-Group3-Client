import React, { useContext, useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";

import { AuthContext } from "../../services/Auth";
import app from "../../services/base.js";
import dbServices from "../../services/dbServices";
import Swal from "sweetalert2";
import { functions } from "firebase";

const Profile = props => {
  const { currentUser } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({});
  const [userProjects, setUserProjects] = useState([]);
  const functions = app.functions();

  const handleClick = async event => {
    event.preventDefault();
    const promoteFunc = await functions.httpsCallable("promoteUser");
    promoteFunc({
      email: userInfo.email,
      org: userInfo.org
    }).then(() => {
      dbServices.promoteUser(userInfo.org, userInfo.email).then(() =>
        getUserInfo().then(info => {
          setUserInfo(info);
        })
      )
      .catch(error => {
        console.warn(error)
        Swal.fire({
          title: "Error!",
          text: 'There was an issue promoting this employee - please refresh the page and try again.',
          icon: 'error',
          confirmButtonText: 'Close'
        })
      });
    });
  };

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
      })
      .catch(error => {
        console.warn(error)
        Swal.fire({
          title: "Error!",
          text: 'There was an issue loading this employee\'s information - please refresh the page and try again.',
          icon: 'error',
          confirmButtonText: 'Close'
        })
      });
    return info;
  };

  const getUserProjects = async info => {
    if (info.role === "project worker")
      dbServices.getEmployeeProjects(info.name, info.org).then(snapshot => {
        snapshot.forEach(doc => {
          setUserProjects([...userProjects, doc.data()]);
        });
      })
      .catch(error => {
        console.warn(error)
        Swal.fire({
          title: "Error!",
          text: 'There was an issue loading this employee\'s information - please refresh the page and try again.',
          icon: 'error',
          confirmButtonText: 'Close'
        })
      });
    else if (info.role === "project manager") {
      dbServices.getManagerProjects(info.name, info.org).then(snapshot => {
        snapshot.forEach(doc => {
          setUserProjects([...userProjects, doc.data()]);
        });
      })
      .catch(error => {
        console.warn(error)
        Swal.fire({
          title: "Error!",
          text: 'There was an issue loading this employee\'s information - please refresh the page and try again.',
          icon: 'error',
          confirmButtonText: 'Close'
        })
      });
    }
  };

  useEffect(() => {
    getUserInfo().then(info => {
      setUserInfo(info);
      getUserProjects(info);
    });
  }, []);

  if (userInfo && userInfo.role)
    return (
      <>
        <div>
          <h3>User Info:</h3>
          <ul>
            <li>Role: {userInfo.role}</li>
            <li>Email: {userInfo.email}</li>
            <li>Name: {userInfo.name}</li>
            <li>Org: {userInfo.org}</li>
          </ul>
          <h3>User Projects:</h3>
          {userProjects.length > 0 ? (
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
        {/* yes I know this is kind of gross. */}
        <div>
          {currentUser &&
          currentUser.role === "owner" &&
          userInfo &&
          userInfo.role === "project worker" ? (
            <button onClick={event => handleClick(event)}>Promote User</button>
          ) : (
            <></>
          )}
        </div>
      </>
    );
  return <></>;
};

export default withRouter(Profile);
