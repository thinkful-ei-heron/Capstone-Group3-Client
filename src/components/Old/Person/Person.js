import React, { Component } from "react";
import PersonDetails from "../PersonDetails/PersonDetails";

export default class Person extends Component {
  state = {
    expanded: false
  };

  handleClick() {
    //console.log("person was clicked");
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    return (
      <li key={this.props.ind} onClick={() => this.handleClick()}>
        {this.props.person.name}
        {this.state.expanded && <PersonDetails person={this.props.person} />}
      </li>
    );
  }
}
