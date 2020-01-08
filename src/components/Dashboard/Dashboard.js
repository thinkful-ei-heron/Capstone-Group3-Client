import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import FirebaseContext from "../../services/context";
import Person from "../Person/Person";
import Loading from "../Loading/Loading";

export default class Dashboard extends Component {
  static contextType = FirebaseContext;
  state = {
    projects: [
      {
        name: "Project Management App",
        date_created: "January 7, 2020 at 5:00:00 AM UTC-8",
        project_manager: "Manager",
      },
    ],
    users: [],
    loading: true,
  };

  // componentDidMount() {
  //   let users = [];
  //   this.context.getUsers().then(snapshot => {
  //     snapshot.forEach(doc => {
  //       users.push(doc.data());
  //     });
  //     this.setState({ users: users, loading: false });
  //   });
  // }

  render() {
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
