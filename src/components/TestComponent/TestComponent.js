import React, { Component } from 'react';
//import FirebaseContext from "../../services/context";

export default class TestComponent extends Component {
  //static contextType = FirebaseContext;

  async getUser() {
    this.context.setUser('rbannal@gmail.com');
  }

  async getProjects() {
    this.context.setProjects(this.context.user.role, this.context.user.name);
  }

  async getJobs() {
    this.context.setJobs(this.context.user.role, this.context.user.name);
  }

  async getOrgId() {
    this.context.setOrgId('EI35 - Group 3');
  }

  async getEmployees() {
    this.context.setEmployees('EI35 - Group 3');
  }

  async loadContext(e) {
    e.preventDefault();
    this.getUser()
      .then(this.context.setOrgId('EI35 - Group 3'))
      .then(this.context.setEmployees('EI35 - Group 3'))
      .then(this.context.setProjects(this.context.user.role, this.context.user.name))
      .then(this.context.setJobs(this.context.user.role, this.context.user.name));
  }

  render() {
    return (
      <div>
        <button onClick={e => this.loadContext(e)}>TEST ME</button>
      </div>
    );
  }
}
