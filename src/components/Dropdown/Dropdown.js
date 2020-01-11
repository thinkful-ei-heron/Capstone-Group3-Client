import React, { Component } from "react";
import Select from 'react-select';
import FirebaseContext from "../../services/context";

export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null
    };
  }

  static contextType = FirebaseContext;


  handleChange = selectedOption => {
    this.setState({ selectedOption })
    this.props.setSelected(selectedOption);
  }

  populateOptions = array => {
    let selectArray = [];
    array.map(name => {
      let newObj = { value: name, label: name };
      return selectArray.push(newObj);
    });
    return selectArray;
  };

  render() {
    const { selectedOption } = this.state;
    return (
      <Select
        value={selectedOption}
        onChange={this.handleChange}
        options={this.populateOptions(this.props.employees)}
        isMulti={this.props.isMulti ? true : false}
      />
    )
  }
}
