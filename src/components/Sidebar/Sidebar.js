import React, { Component } from "react";
import ContextProvider from "../../services/context.js";

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: "owner",
      employees: [
        {
          Bill: [
            { "project one": "Make Bread" },
            { "project two": "Clean Oven" },
          ],
        },
        { Ben: [{ "project one": "Prepare Egg Wash" }] },
        { Betsy: [{ "project two": "Mop floors" }] },
      ],
      projectManagers: [
        { Dave: ["project one", "project three"] },
        { Darla: ["project two"] },
      ],
      expanded: [],
    };
  }

  static contextType = ContextProvider;

  toggleExpand = e => {
    e.preventDefault();
    console.log(e.target.id);
    if (!this.state.expanded.includes(e.target.id)) {
      let newExpanded = this.state.expanded;
      newExpanded.push(e.target.id);
      this.setState({
        expanded: newExpanded,
      });
    } else {
      let newExpanded = this.state.expanded;
      newExpanded = newExpanded.filter(item => item !== e.target.id);
      this.setState({
        expanded: newExpanded,
      });
    }
  };

  renderSubList = values => {
    if (this.state.userType === "owner" && this.props.view !== "project") {
      return values[0].map((project, index) => {
        console.log(project);
        return <li key={index}>{project}</li>;
      });
    } else {
      return values[0].map((project, index) => {
        return (
          <li key={index}>
            <button
              onClick={e => this.toggleExpand(e)}
              id={Object.keys(project)[0] + index}
            >
              expand
            </button>
            <h6>{Object.keys(project)[0]}</h6>
            {this.state.expanded.includes(Object.keys(project)[0] + index) ? (
              <div>
                <span>{Object.values(project)[0]}</span>
              </div>
            ) : (
              <></>
            )}
          </li>
        );
      });
    }
  };

  renderList = () => {
    if (this.state.userType === "owner" && this.props.view !== "project") {
      return this.state.projectManagers.map((manager, index) => {
        return (
          <li key={index}>
            <button
              onClick={e => this.toggleExpand(e)}
              id={Object.keys(manager)[0] + index}
            >
              expand
            </button>
            <h5>{Object.keys(manager)[0]}</h5>
            {this.state.expanded.includes(Object.keys(manager)[0] + index) ? (
              <ul>{this.renderSubList(Object.values(manager))}</ul>
            ) : (
              <></>
            )}
          </li>
        );
      });
    } else {
      return this.state.employees.map((employee, index) => {
        return (
          <li key={index}>
            <button
              onClick={e => this.toggleExpand(e)}
              id={Object.keys(employee)[0] + index}
            >
              expand
            </button>
            <h5>{Object.keys(employee)[0]}</h5>
            {this.state.expanded.includes(Object.keys(employee)[0] + index) ? (
              <ul>{this.renderSubList(Object.values(employee))}</ul>
            ) : (
              <></>
            )}
          </li>
        );
      });
    }
  };

  render() {
    if (this.state.userType === "employee" && this.props.view !== "project")
      return <></>;
    else {
      return (
        <div>
          {this.state.userType === "owner" && this.props.view !== "project" ? (
            <div>
              <h3>Project Managers</h3>
              <ul>{this.renderList()}</ul>
            </div>
          ) : (
            <div>
              <h3>Employees</h3>
              <ul>{this.renderList()}</ul>
            </div>
          )}
        </div>
      );
    }
  }
}
