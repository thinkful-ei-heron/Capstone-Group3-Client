import React, { Component } from 'react';

export default class PersonDetails extends Component {
  render() {
    return (
      <ul>
        <li>Email: {this.props.person.email}</li>
        <li>Role: {this.props.person.role}</li>
      </ul>
    );
  }
}
