import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import FirebaseContext from '../../services/context';
import Loading from '../Loading/Loading';
import './Dashboard.css';
import { Sidebar } from '../Sidebar/Sidebar';
import StyleIcon from '../StyleIcon/StyleIcon';
import ProjectBar from '../ProjectBar/ProjectBar';

////////////////////////////////////////////////////////////////////
// This component is managed by Dan.  It is MIIIINE!!             //
// Do not change it.  If something doesn't work ask me to fix it. //
////////////////////////////////////////////////////////////////////
export default class Dashboard extends Component {
  static contextType = FirebaseContext;
  state = {
    loading: true,
    expandProjects: true,
    expandPersonnel: true
  };

  toggleExpandProjects = e => {
    e.stopPropagation();
    this.setState({ expandProjects: !this.state.expandProjects });
  };

  toggleExpandPersonnel = e => {
    e.stopPropagation();
    this.setState({ expandPersonnel: !this.state.expandPersonnel });
  };

  render() {
    // console.log('this.context.user', this.context.user);
    // console.log('this.context.projects ', this.context.projects);
    // console.log('this.context.jobs ', this.context.jobs);
    // console.log('this.context.employees', this.context.employees);
    // console.log('this.context.project_managers', this.context.project_managers);
    if (!this.context.user) return <Loading />;
    else
      return (
        <>
          {!this.context.user && <Redirect to="/register" />}
          <section className="Dashboard__container">
            <div className="Dashboard__header">
              {<h2>{this.context.user.org}</h2>}
              <span className="Dashboard__date">{new Date().toLocaleString()}</span>
            </div>
            <section className="Dashboard__projects">
              <div className="Dashboard__project_header" onClick={this.toggleExpandProjects}>
                <div className="Dashboard__fa_h1">
                  {StyleIcon({ style: `${this.state.expandProjects ? 'minus' : 'plus'}` })}
                  <h1>PROJECTS</h1>
                </div>
                {this.context.user.role !== 'project worker' && (
                  <Link to="/new_project">
                    <button>NEW</button>
                  </Link>
                )}
              </div>
              {this.state.expandProjects && (
                <div className="Dashboard__projects_container">
                  <ul className="Dashboard__list">
                    {this.context.projects &&
                      this.context.projects.map((proj, i) => {
                        return (
                          <li>
                            <ProjectBar proj={proj} />
                          </li>
                        );
                      })}
                  </ul>
                </div>
              )}
            </section>
            <section className="Dashboard__personnel">
              <div className="Dashboard__personnel_header" onClick={this.toggleExpandPersonnel}>
                <div className="Dashboard__fa_h1">
                  {StyleIcon({ style: `${this.state.expandPersonnel ? 'minus' : 'plus'}` })}
                  <h1>PERSONNEL</h1>
                </div>
              </div>
              {this.state.expandPersonnel && <Sidebar />}
            </section>
          </section>
        </>
      );
  }
}
