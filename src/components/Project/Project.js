import React from "react";
import FirebaseContext from "../../services/context";
import Firebase from '../../services/index'



class Project extends React.Component {
  state = {
    projects: {},
  };

  static contextType = FirebaseContext;

  
  componentDidMount() {
    Firebase.db.collection('organizations')
        .get()
        .then(snapshot => {
            console.log(snapshot)
        })
        .catch (error => console.log(error))
  }

  estimatedProgress(jobs) {}

  render() {
    const projects = this.state.projects;
    const jobs = this.state.projects.jobs;
    return (
        <div></div>
    )
    // projects.map(project => {
    //   return (
    //     <div className="Project">
    //       {/* <h2 className="project_title">{project.name}</h2>
    //       <h3 className="project_manager">Manager:{project.manager}</h3>
    //       <p className="project_description">{project.description}</p>
    //       <span className="project_estPro">
    //         Estimated Progress: {this.estimatedProgress(jobs)}
    //       </span>
    //       <span>Deadline: {project.deadline}</span>
    //       <label htmlFor='add_employees'>Add Employees</label> */}
    //     </div>
    //   );
    // });
  }
}

export default Project;