import React, { Component } from "react";
import FirebaseContext from "../../services/context.js";
import { db } from '../../services/firebase'

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

  static contextType = FirebaseContext;

  toggleExpand = e => {
    e.preventDefault();
    //console.log(e.target.id);
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
      if(!values[0]) return <span>No Projects Assigned</span>
      else {
      return values[0].map((project, index) => {
        return <li key={index}>{project}</li>;
      })};
    } else {
      if(!values[0]) return <span>No Jobs Assigned</span>
      else {
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
      })};
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

  populateProjects = (name) => {
    try{
        console.log(name)
        // let projectArray = []
        // db.collection('projects').where('project_manager','==',name).get().then(snapshot => console.log(snapshot.doc.data()))
        // return projectArray
    } catch(error) { console.log(error) }
    
  }

  populateLists = () => {
    let newEmployees = []
    let newProjectManagers = []
    this.context.employees.map((employee) => {
      if(employee.role === 'project worker') {
        let newEntry = {[employee.name]: null}
        newEmployees.push(newEntry)
      } else if(employee.role === 'project manager') {
        let newProjects = this.populateProjects(employee.name)
        let newEntry = {[employee.name]: newProjects}
        newProjectManagers.push(newEntry)
      }
      return this.setState({
        employees: newEmployees,
        projectManagers: newProjectManagers
      })
    })
  }

  componentDidMount() {
    this.populateLists()
  }

  render() {
    if (this.state.userType === "project worker" && this.props.view !== "project")
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
