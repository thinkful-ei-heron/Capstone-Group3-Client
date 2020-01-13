import React from 'react';
import { FirebaseContext } from '../../services/index';
import Jobs from '../../components/Jobs/Jobs';

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
        //console.log(snapshot);
        const array = [];
        snapshot.forEach(doc => {
          //console.log(doc);
          array.push(doc.data());
          //console.log(array);
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

    // this.state.projects.forEach(project => {
    //   this.context.getJobs(project.id).then(snapshot => {
    //     this.setState({
    //         jobs: snapshot.docs
    //     })
    //   });
    // });
  }

  calculateProgress(jobs) {
    // const totalProgress = []
    // jobs.forEach(job => {
    //   totalProgress.push(job.progress)
    // })
    // return totalProgress.reduce((a, b) => a + b)
  }

  render() {
    return (
      <div className="Project">
        {this.state.projects &&
          this.state.projects.map(project => {
            return (
              <div key={project.id}>
                <div>
                  <h2 className="project_title">{project.name}</h2>
                  <h3 className="project_manager">Manager: {project.project_manager}</h3>
                  <p className="project_description">{project.description}</p>
                  <span className="project_estPro">Estimated Progress: {this.calculateProgress()}</span>
                  <span>Deadline:</span>
                </div>
                <ul>
                  {this.state.jobs &&
                    this.state.jobs.map(job => {
                      return <Jobs key={job.id} id={job.id} job={job.data()} />;
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
