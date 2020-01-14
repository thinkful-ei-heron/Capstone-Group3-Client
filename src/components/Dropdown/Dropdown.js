import React, { Component } from "react";
import Select from "react-select";
import FirebaseContext from "../../services/context";

export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null
    };
  }

  static contextType = FirebaseContext;

  componentDidMount() {
    if (this.props.defaultValue) {
      this.setState({
        selectedOption: this.props.defaultValue
      })
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
    const { selectedOption } = this.state;
    return (
      <Select
        value={selectedOption}
        onChange={this.handleChange}
        options={this.populateOptions(this.props.employees)}
        isMulti={this.props.isMulti ? true : false}
        isSearchable={true}
        // defaultValue={this.props.defaultValue ? this.props.defaultValue : false}
        placeholder={
          this.props.placeholder ? this.props.placeholder : "Select..."
        }
      />
    );
  }
}
