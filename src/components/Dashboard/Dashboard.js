import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../services/Auth.js';
import dbServices from '../../services/dbServices';
import Loading from '../Loading/Loading';
import NewProject from '../NewProject/NewProject';
import { Sidebar } from '../Sidebar/Sidebar';
import StyleIcon from '../StyleIcon/StyleIcon';
import ProjectBar from '../ProjectBar/ProjectBar';
import './Dashboard.css';

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
    loading: true,
    expandProjects: true,
    expandPersonnel: true,
    newProj: false
  };

  async componentDidMount() {
    const projs = [];
    const email = this.context.currentUser.email;
    const org = this.context.currentUser.displayName;
    let name = '';
    let role = '';
    const userSnap = await dbServices.getUser(
      this.context.currentUser.email,
      this.context.currentUser.displayName
    );
    userSnap.forEach(user => {
      name = user.data().name;
      role = user.data().role;
    });

    const projects = await dbServices.getProjectsByRole({ name: name, org: org, role: role });

    projects.forEach(proj => {
      projs.push(proj.data());
    });
    this.setState({
      user: {
        id: email,
        name: name,
        org: org,
        role: role
      },
      projects: projs,
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
    if (this.state.newProj) this.setState({ newProj: false, expandProjects: true });
    else this.setState({ newProj: true, expandProjects: false });
  };

  addToProjState = newProj =>
    this.setState({ projects: [...this.state.projects, newProj], newProj: false, expandProjects: true });

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
              <span className="Dashboard__date">{new Date().toLocaleString()}</span>
            </div>
            <div className="Dashboard__main">
              <section className="Dashboard__projects">
                <div className="Dashboard__project_header" onClick={this.toggleExpandProjects}>
                  <div className="Dashboard__fa_h1">
                    {StyleIcon({
                      style: `${this.state.expandProjects ? 'minus' : 'plus'}`
                    })}
                    <h1>PROJECTS</h1>
                  </div>
                  {this.state.user.role !== 'project worker' && (
                    <button onClick={this.toggleNewProj}>NEW</button>
                  )}
                </div>
                {this.state.newProj && (
                  <NewProject
                    org={this.state.user.org}
                    addToProjState={this.addToProjState}
                    toggleNewProj={this.toggleNewProj}
                  />
                )}
                {this.state.expandProjects && (
                  <div className="Dashboard__projects_container">
                    {this.state.projects.length !== 0 ? (
                      this.state.projects.map((proj, i) => {
                        return (
                          <ul className="Dashboard__list">
                            <li key={i}>
                              <ProjectBar proj={proj} />
                            </li>
                          </ul>
                        );
                      })
                    ) : (
                      <div className="Dashboard__no_projects">
                        <span className="Dashboard__welcome">Welcome!</span>
                        <span>You currently have no projects, click the NEW button above to add one.</span>
                      </div>
                    )}
                  </div>
                )}
              </section>
              <section className="Dashboard__personnel">
                <div className="Dashboard__personnel_header" onClick={this.toggleExpandPersonnel}>
                  <div className="Dashboard__fa_h1">
                    {StyleIcon({
                      style: `${this.state.expandPersonnel ? 'minus' : 'plus'}`
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
