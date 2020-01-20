import React, { Component } from "react";
import Select from "react-select";
import { AuthContext } from "../../services/Auth";
import dbServices from "../../services/dbServices";

export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null,
      employees: []
    };
  }

  static contextType = AuthContext;

  async componentDidMount() {
    let employees = [];

    if (this.props.pm) {
      await dbServices
        .getProjectManagers(this.context.currentUser.org)
        .then(snapshot => {
          snapshot.forEach(doc => {
            employees.push(doc.data().name);
          });
        });
    }

    if (!this.props.pm) {
      await dbServices
        .getEmployees(this.context.currentUser.org)
        .then(snapshot => {
          snapshot.forEach(doc => {
            employees.push(doc.data().name);
          });
        });
    }

    this.setState({ employees });

    if (this.props.defaultValue) {
      this.setState({
        selectedOption: this.props.defaultValue
      });
    }
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    this.props.setSelected(selectedOption);
  };

  populateOptions = array => {
    let selectArray = [];
    array.map(name => {
      let newObj = { value: name, label: name };
      return selectArray.push(newObj);
    });
    return selectArray;
  };

  render() {
    const { selectedOption, employees } = this.state;
    return (
      <Select
        value={selectedOption}
        onChange={this.handleChange}
        options={this.populateOptions(employees)}
        isMulti={this.props.isMulti ? true : false}
        isSearchable={true}
        defaultValue={this.props.defaultValue ? this.props.defaultValue : false}
        placeholder={
          this.props.placeholder ? this.props.placeholder : "Select..."
        }
      />
    );
  }
}
