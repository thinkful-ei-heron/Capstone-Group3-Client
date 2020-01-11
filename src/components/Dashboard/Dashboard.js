import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";

import FirebaseContext from "../../services/context";
// import Person from "../Person/Person";
import Loading from "../Loading/Loading";

export default class Dashboard extends Component {
  static contextType = FirebaseContext;
  state = {
    loading: true,
  };

  componentDidMount() {
    let emps = [],
      projs = [],
      jobs = [],
      pms = [];
    // React made me do this...
    try {
      emps = this.context.getEmployees("orgOne");
      projs = this.context.getProjects("orgOne");
      jobs = this.context.getJobs("orgOne");
      pms = this.context.getProjectManagers("orgOne");
    } catch (error) {
      throw new Error(error);
    } finally {
      this.context.setProjectState(projs);
      this.context.setEmployeeState(emps);
      this.context.setJobsState(jobs);
      this.context.setProjectManagersState(pms);
    }
    // sorry not sorry
    // #WorksOnMyMachine
  }

  render() {
    // console.log("this.context.user", this.context.user);
    // console.log("this.context.projects", this.context.projects);
    // console.log("this.context.employees", this.context.employees);
    // console.log("this.context.org", this.context.org);
    if (!this.context.user) return <Loading />;
    else
      return (
        <>
          {false ? (
            <Redirect to="/register" />
          ) : (
            <p>Current user's email: {this.context.user.email}</p>
          )}
          <section className="Dashboard__container">
            <div className="Dashboard__header">
              {/* <h2>{this.context.user.org.name}</h2> */}
              <span className="Dashboard__date">
                {new Date().toLocaleString()}
              </span>
            </div>
            <section className="Dashboard__projects">
              <div>
                <h1>PROJECTS</h1>
                <Link to="/new_project">
                  <button>NEW</button>
                </Link>
              </div>
              <div className="Dashboard__projects_container">
                <ul>
                  {this.context.projects.map((proj, i) => {
                    return (
                      <Link to={`/project/${proj.id}`} key={i}>
                        <li>
                          <span>{proj.name}</span>
                          <span>Manager: {proj.project_manager}</span>
                        </li>
                      </Link>
                    );
                  })}
                </ul>
              </div>
            </section>
            <section className="Dashboard__personel">
              <h1>PERSONNEL</h1>
              <ul>
                {/* {this.context.users.map((user, i) => {
                  return <Person person={user} key={i} />;
                })} */}
              </ul>
            </section>
          </section>
        </>
      );
  }
}
