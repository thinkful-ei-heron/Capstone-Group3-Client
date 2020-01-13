import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import FirebaseContext from '../../services/context';
import Person from '../Person/Person';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import Loading from '../Loading/Loading';
import './Dashboard.css';
import { Sidebar } from '../Sidebar/Sidebar';

////////////////////////////////////////////////////////////////////
// This component is managed by Dan.  It is MIIIINE!!             //
// Do not change it.  If something doesn't work ask me to fix it. //
////////////////////////////////////////////////////////////////////
export default class Dashboard extends Component {
  static contextType = FirebaseContext;
  state = {
    loading: true
  };

  render() {
    //console.log('this.context.user', this.context.user);
    console.log('this.context.projects ', this.context.projects);
    console.log('this.context.jobs ', this.context.jobs);
    console.log('this.context.employees', this.context.employees);
    console.log('this.context.project_managers', this.context.project_managers);
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
              <div className="Dashboard__project_header">
                <h1>PROJECTS</h1>
                <Link to="/new_project">
                  <button>NEW</button>
                </Link>
              </div>
              <div className="Dashboard__projects_container">
                <ul className="Dashboard__list">
                  {this.context.projects &&
                    this.context.projects.map((proj, i) => {
                      return (
                        <li>
                          <ul className="Dashboard__project_container">
                            <Link to={`/project/${proj.id}`} key={proj.id}>
                              <li className="Dashboard__li">
                                <span className="Dashboard__proj_name">{proj.name}</span>
                                <span className="Dashboard__proj_mgr">Manager: {proj.project_manager}</span>
                              </li>
                              <li>{proj.description}</li>
                              <li>
                                <div className="Dashboard__proj_prog_date">
                                  <div className="Dashhboard__proj_prog">
                                    Est. Progress <ProgressBar percentage={proj.progress} />
                                  </div>
                                  {new Date(proj.deadline.seconds * 1000).toISOString().slice(0, 10)}
                                </div>
                              </li>
                            </Link>
                          </ul>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </section>
            <section className="Dashboard__personnel">
              <div className="Dashboard__personnnel_header">
                <h1>PERSONNEL</h1>
              </div>
              <ul>
                {this.context.users &&
                  this.context.users.map((user, i) => {
                    return <Person person={user} key={i} />;
                  })}
              </ul>
            </section>
          </section>
          <Sidebar />
        </>
      );
  }
}
