import React from "react";
import Firebase, { FirebaseContext } from "../../services/index";
import Jobs from '../../components/Jobs/Jobs'

class Project extends React.Component {
  state = {
    projects: null,
    jobs: null
  };

  static contextType = FirebaseContext;

  async componentDidMount() {
    await this.context
      .getProjects()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.setState({
            projects: [
              {
                id: doc.id,
                ...doc.data()
              }
            ]
          });
        });
      })
      .catch(error => console.log(error));

    this.state.projects.forEach(project => {
      this.context.getJobs(project.id).then(snapshot => {
        this.setState({
            jobs: snapshot.docs
        })
      });
    });
  }

  estimatedProgress(jobs) {}

  render() {
    return (
      <div className="Project">
        {this.state.projects &&
          this.state.projects.map(project => {
            return (
            <div key={project.id}> 
              <div >
                <h2 className="project_title">{project.name}</h2>
                <h3 className="project_manager">
                  Manager: {project.project_manager}
                </h3>
                <p className="project_description">{project.description}</p>
                <span className="project_estPro">
                  Estimated Progress: {this.estimatedProgress()}
                </span>
                <span>Deadline:</span>
              </div>
              <ul>
               {this.state.jobs &&
               this.state.jobs.map(job => {
                 console.log(job.data())
                  return <Jobs key={job.id} id={job.id} job={job.data()}/>
               })}
              </ul>
            </div>
            );
          })}
      </div>
    );
  }
}

export default Project;
