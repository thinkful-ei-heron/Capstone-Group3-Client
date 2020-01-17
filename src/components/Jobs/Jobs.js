import React, { Component } from 'react';
//import FirebaseContext from '../../services/context.js';
import { AuthContext } from '../../services/Auth';
import Loading from '../Loading/Loading';
import app from '../../services/base';
import './Jobs.css';
import dbServices from '../../services/dbServices';
import JobItem from './JobItem'

export default class Jobs extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.ref = app.firestore().collection('organizations')
    this.state = {
      jobs: [],
      loading: true,
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

  render() {
    const { jobs } = this.state;
    if (this.state.loading) {
      return <Loading />
    } else {
    return (
      <ul>
        {jobs.map(job => <JobItem job={job} key={job.id}/>)}
      </ul>
    );
  }
  }
}
