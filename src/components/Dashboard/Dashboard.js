import React from "react";
// import { Redirect } from "react-router-dom";
import userContext from "../../services/userContext";
import myFirebase from "../../services/firebase";
// import Person from "../Person/Person";
// import Loading from "../Loading/Loading";

const Dashboard = props => {
  const uc = React.useContext(userContext);
  let projects = [];
  const setProjects = (role, name) => {
    myFirebase
      .firestore()
      .collection(`organizations/HkeHO8n1eIaJSu6mnsd5/projects`)
      .get()
      .then(snapshot => {
        if (role === "project worker") {
          snapshot.forEach(doc => {
            if (doc.data().project_workers.includes(name)) {
              projects.push(doc.data());
            }
          });
        } else if (role === "project manager") {
          snapshot.forEach(doc => {
            if (doc.data().project_manager === name) {
              projects.push(doc.data());
            }
          });
        } else {
          snapshot.forEach(doc => {
            projects.push(doc.data());
          });
        }
      })
      .catch(error => console.log(error));
  };

  componentDidMount() {
    let users = [];
    this.context.setUser('adamnewhouser@gmail.com')
    // this.context.getUsers().then(snapshot => {
    //   console.log(snapshot)
    //   snapshot.forEach(doc => {
    //     users.push(doc.data());
    //   });
    //   this.setState({ users: users, loading: false });
    };
  

  render() {
    console.log(this.context.user)
    if (this.state.loading) return <Loading />;
    else
      return (
        <>
          {this.context.auth.currentUser === null ? (
            <Redirect to="/register" />
          ) : (
            <p>Current user's email: {this.context.auth.currentUser.email}</p>
          )}
          <section className="Dashboard__container">
            <div className="Dashboard__header">
              <h2>COMPANY NAME</h2>
              <span className="Dashboard__date">
                {new Date().toLocaleString()}
              </span>
            </div>
            <section className="Dashboard__projects">
              <div>
                <h1>PROJECTS</h1>
                <button>NEW</button>
              </div>
              <div className="Dashboard__projects_container">
                <ul>
                  {this.state.projects.map((proj, i) => {
                    return (
                      <li key={i}>
                        <span>{proj.name}</span>
                        <span>Manager: {proj.project_manager}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
            <section className="Dashboard__personel">
              <h1>PERSONNEL</h1>
              <ul>
                {this.state.users.map((user, i) => {
                  return <Person person={user} key={i} />;
                })}
              </ul>
            </section>
          </section>
        </>
      );
  }
}
