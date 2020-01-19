import React, { Component } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../services/Auth.js";
import dbServices from "../../services/dbServices";
import Loading from "../Loading/Loading";
import NewProject from "../NewProject/NewProject";
import { Sidebar } from "../Sidebar/Sidebar";
import StyleIcon from "../StyleIcon/StyleIcon";
import ProjectBar from "../ProjectBar/ProjectBar";
import "./Dashboard.css";

////////////////////////////////////////////////////////////////////
// This component is managed by Dan.  It is MIIIINE!!             //
// Do not change it.  If something doesn't work ask me to fix it. //
////////////////////////////////////////////////////////////////////
export default class Dashboard extends Component {
  static contextType = AuthContext;
  state = {
    user: {
      id: null,
      name: null,
      org: null,
      role: null
    },
    projects: [],
    projectManagers: [],
    loading: true,
    expandProjects: true,
    expandPersonnel: true,
    newProj: false
  };

  async componentDidMount() {
    const user = this.context.currentUser;

    const data = await dbServices.initDashboard(user.name, user.role, user.org);

    this.setState({
      user: {
        id: user.email,
        name: data.name,
        org: user.org,
        role: data.role
      },
      projects: data.projects,
      projectManagers: data.project_managers,
      loading: false
    });
  }

  toggleExpandProjects = e => {
    e.stopPropagation();
    this.setState({ expandProjects: !this.state.expandProjects });
  };

  toggleExpandPersonnel = e => {
    e.stopPropagation();
    this.setState({ expandPersonnel: !this.state.expandPersonnel });
  };

  toggleNewProj = e => {
    e.stopPropagation();
    if (this.state.newProj)
      this.setState({ newProj: false, expandProjects: true });
    else this.setState({ newProj: true, expandProjects: false });
  };

  addToProjState = newProj =>
    this.setState({
      projects: [...this.state.projects, newProj],
      newProj: false,
      expandProjects: true
    });

  updateProjInState = proj => {
    let projects = this.state.projects;
    projects = projects.map(p => (p.id === proj.id ? proj : p));
    this.setState({ projects: projects });
  };

  updatePM = (projId, pm) => {
    const projs = this.state.projects;
    projs.map(proj => {
      if (proj.id === projId) proj.project_manager = pm;
      return proj;
    });
    this.setState({ projects: projs });
  };

  render() {
    // console.log('this.state.user', this.state.user);
    //console.log('this.state.projects ', this.state.projects);
    // console.log('this.context.jobs ', this.context.jobs);
    // console.log('this.context.employees', this.context.employees);
    // console.log('this.context.project_managers', this.context.project_managers);
    if (this.state.loading) return <Loading />;
    else
      return (
        <>
          <section className="Dashboard__container">
            <div className="Dashboard__header">
              {<h2>{this.state.user.org}</h2>}
              <span className="Dashboard__date">
                {new Date().toLocaleString()}
              </span>
            </div>
            <div className="Dashboard__main">
              <section className="Dashboard__projects">
                <div
                  className="Dashboard__project_header"
                  onClick={this.toggleExpandProjects}
                >
                  <div className="Dashboard__fa_h1">
                    {StyleIcon({
                      style: `${this.state.expandProjects ? "minus" : "plus"}`
                    })}
                    <h1>PROJECTS</h1>
                  </div>
                  {this.state.user.role !== "project worker" && (
                    <button onClick={this.toggleNewProj}>NEW</button>
                  )}
                </div>
                {this.state.newProj && (
                  <NewProject
                    org={this.state.user.org}
                    addToProjState={this.addToProjState}
                    toggleForm={this.toggleNewProj}
                  />
                )}
                {this.state.expandProjects && (
                  <div className="Dashboard__projects_container">
                    {this.state.projects.length !== 0 ? (
                      <ul className="Dashboard__list">
                        {this.state.projects.map(proj => {
                          return (
                            <li key={proj.id}>
                              <ProjectBar
                                proj={proj}
                                role={this.state.user.role}
                                projectManagers={this.state.projectManagers}
                                updatePM={this.updatePM}
                                updateProjInState={this.updateProjInState}
                              />
                            </li>
                          );
                        })}{" "}
                      </ul>
                    ) : (
                      <div className="Dashboard__no_projects">
                        <span className="Dashboard__welcome">Welcome!</span>
                        <span>
                          You currently have no projects, click the NEW button
                          above to add one.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </section>
              <section className="Dashboard__personnel">
                <div
                  className="Dashboard__personnel_header"
                  onClick={this.toggleExpandPersonnel}
                >
                  <div className="Dashboard__fa_h1">
                    {StyleIcon({
                      style: `${this.state.expandPersonnel ? "minus" : "plus"}`
                    })}
                    <h1>PERSONNEL</h1>
                  </div>
                </div>
                {/*this.state.expandPersonnel && <Sidebar />*/}
              </section>
            </div>
          </section>
        </>
      );
  }
}
