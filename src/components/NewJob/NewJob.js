import React from "react";
import JobForm from "../JobForm/JobForm";

export default class NewJob extends React.Component {
  render() {
    console.log(this.props)
    return (
      <>
        <h1>NewJob</h1>
        <JobForm project_id={this.props.location.state.project_id} project_manager={this.props.location.state.project_manager} {...this.props}/>
      </>
    );
  }
}
