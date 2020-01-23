import React, { Component } from 'react'
import { AuthContext } from '../../services/Auth.js'
import dbServices from '../../services/dbServices'
import Loading from '../Loading/Loading'
import NewProject from '../Project/NewProject/NewProject'
import Sidebar from '../Sidebar/Sidebar'
import StyleIcon from '../StyleIcon/StyleIcon'
import ProjectBar from '../Project/ProjectBar/ProjectBar'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'
import './Dashboard.css'

////////////////////////////////////////////////////////////////////
// This component is managed by Dan.  It is MIIIINE!!             //
// Do not change it.  If something doesn't work ask me to fix it. //
////////////////////////////////////////////////////////////////////
export default class Dashboard extends Component {
  static contextType = AuthContext
  state = {
    user: {
      id: null,
      name: null,
      org: null,
      role: null,
    },
    projects: [],
    projectManagers: [],
    loading: true,
    expandProjects: true,
    expandCompleteProjects: false,
    expandPersonnel: true,
    newProj: false,
    error: false,
  }

  errorClose = () => {
    this.setState({
      error: true,
    })
  }

  async componentDidMount() {
    const email = this.context.currentUser.email
    const org = this.context.currentUser.org
    const name = this.context.currentUser.name
    const role = this.context.currentUser.role

    let data = []
    try {
      data = await dbServices.initDashboard(name, role, org)
      // data = await dbServices.initDashboard();
      let sortedProjectsComplete = []
      let sortedProjectsIncomplete = []

      data.projects.map((project, index) => {
        if (project.date_completed || project.autoComplete) {
          return sortedProjectsComplete.push(project)
        } else return sortedProjectsIncomplete.push(project)
      })

      sortedProjectsIncomplete.sort((a, b) => {
        return a.deadline.seconds - b.deadline.seconds
      })
      // let sortedProjects = sortedProjectsIncomplete.concat(
      //   sortedProjectsComplete
      // )
      this.setState({
        user: {
          id: email,
          name: name,
          org: org,
          role: role,
        },
        projects: sortedProjectsIncomplete,
        completeProjects: sortedProjectsComplete,
        projectManagers: data.project_managers,
        loading: false,
      })
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Dashboard failed to load. Please try again.',
        icon: 'error',
        confirmButtonText: 'Close',
        onClose: this.errorClose(),
      })
    }
  }

  toggleExpandProjects = e => {
    e.stopPropagation()
    this.setState({ expandProjects: !this.state.expandProjects })
  }

  toggleExpandCompleteProjects = e => {
    e.stopPropagation()
    this.setState({
      expandCompleteProjects: !this.state.expandCompleteProjects,
    })
  }
  toggleExpandPersonnel = e => {
    e.stopPropagation()
    this.setState({ expandPersonnel: !this.state.expandPersonnel })
  }

  toggleNewProj = e => {
    e.stopPropagation()
    if (this.state.newProj)
      this.setState({ newProj: false, expandProjects: true })
    else this.setState({ newProj: true, expandProjects: false })
  }

  addToProjState = newProj =>
    this.setState({
      projects: [...this.state.projects, newProj],
      newProj: false,
      expandProjects: true,
    })

  updateProjInState = proj => {
    let projects = this.state.projects
    projects = projects.map(p => (p.id === proj.id ? proj : p))
    this.setState({ projects: projects })
  }

  updatePM = (projId, pm) => {
    const projs = this.state.projects
    projs.map(proj => {
      if (proj.id === projId) proj.project_manager = pm
      return proj
    })
    this.setState({ projects: projs })
  }

  render() {
    if (!this.state.error) {
      if (this.state.loading) return <Loading />
      else
        return (
          <section className="Dashboard__container">
            <div className="App__org_header">
              {<h2>{this.state.user.org}</h2>}
              <span className="Dashboard__date">
                {new Date().toDateString()}
              </span>
            </div>

            <div className="Dashboard__main">
              <section className="Dashboard__projects">
                <div
                  className="App__section_header"
                  onClick={this.toggleExpandProjects}
                >
                  <div className="App__fa_h1">
                    {StyleIcon({
                      style: `${this.state.expandProjects ? 'minus' : 'plus'}`,
                    })}
                    <h1>Projects</h1>
                  </div>
                  {this.state.user.role !== 'project worker' && (
                    <button
                      className="Dashboard__new"
                      onClick={this.toggleNewProj}
                    >
                      New
                    </button>
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
                          )
                        })}
                      </ul>
                    ) : (
                      <div className="Dashboard__no_projects">
                        <span className="Dashboard__welcome">Welcome!</span>
                        {this.state.user.role !== 'project worker' ? (
                          <span>
                            You currently have no projects, click the NEW button
                            above to add one.
                          </span>
                        ) : (
                          <span>
                            You are not currently assigned to any projects.
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <div
                  className="App__section_header  App__separate_top_always"
                  onClick={this.toggleExpandCompleteProjects}
                >
                  <div className="App__fa_h1">
                    {StyleIcon({
                      style: `${
                        this.state.expandCompleteProjects ? 'minus' : 'plus'
                      }`,
                    })}
                    <h1>Completed Projects</h1>
                  </div>
                </div>
                {this.state.expandCompleteProjects && (
                  <div className="Dashboard__projects_container">
                    {this.state.completeProjects.length !== 0 ? (
                      <ul className="Dashboard__list"> 
                        {this.state.completeProjects.map(proj => {
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
                          )
                        })}
                      </ul>
                    ) : (
                      <div className="Dashboard__no_projects">
                        <span>
                          You currently have no complete projects. Time to get
                          to work!
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </section>
              <section className="App__personnel App__separate_top">
                <div
                  className="App__section_header"
                  onClick={this.toggleExpandPersonnel}
                >
                  <div className="App__fa_h1">
                    {StyleIcon({
                      style: `${this.state.expandPersonnel ? 'minus' : 'plus'}`,
                    })}
                    <h1>Personnel</h1>
                  </div>
                </div>
                {this.state.expandPersonnel && <Sidebar />}
              </section>
            </div>
          </section>
        )
    } else
      return (
        <body
          alt="something terrible happened"
          background="https://media.giphy.com/media/jWexOOlYe241y/giphy.gif"
        />
      )
  }
}
