import React, { Component } from 'react';
import { AuthContext } from '../../services/Auth';
import Loading from '../Loading/Loading';
import app from '../../services/base';
import './Jobs.css';
import JobItem from './JobItem'
import LogHours from '../LogHours/LogHours';

export default class Jobs extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.ref = app.firestore().collection('organizations')
    this.state = {
      jobs: [],
      loading: true,
      showLogHours: false,
      user: 'project manager'
    };
  }

  static contextType = AuthContext;

  onJobsUpdate = (querySnapshot) => {
    const jobs = [];
    querySnapshot.forEach((doc) => {
      jobs.push(doc.data())
    })
    this.setState({ 
      jobs, 
      loading: false 
    })
  }

  componentDidMount() {
    this.unsubscribe = this.ref.doc(this.context.currentUser.displayName)
      .collection('projects')
      .doc(this.props.projectId)
      .collection('jobs')
      .onSnapshot(this.onJobsUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  renderLogHoursForm = () => {
    this.setState({
      showLogHours: !this.state.showLogHours
    })
  }

  render() {
    const { jobs, user } = this.state;
    if (this.state.loading) {
      return <Loading />
    } else {
    return (
      <>
      <div>
          <h2>
              {user === "project worker" ? (
                <button onClick={this.renderLogHoursForm}>
                  LOG HOURS
                </button>
              ) : (
                <></>
              )}
            </h2>
            {this.state.showLogHours ? (
              <LogHours jobs={jobs} renderLogHoursForm={this.renderLogHoursForm}/>
            ) : (
              <></>
            )}
      </div>
      <ul>
        {jobs.map(job => <JobItem job={job} key={job.id}/>)}
      </ul>
      </>
    );
  }
  }
}
