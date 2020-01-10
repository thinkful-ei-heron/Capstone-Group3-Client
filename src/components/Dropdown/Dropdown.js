import React, { Component } from "react";
import MultiSelectReact from "multi-select-react";

export default class Dropdown extends Component {
  constructor() {
    super();
    this.state = {
      multiSelect: [],
      isSingleSelect: false,
      userRole: "owner"
    };
  }

  populateOptions = array => {
    let selectArray = [];
    array.map((name, index) => {
      let newObj = { label: name, id: index };
      return selectArray.push(newObj);
    });
    console.log(selectArray);
    return selectArray;
  };

  componentDidMount() {
    if (
      this.state.userRole === "project manager" &&
      this.props.path === "dash"
    ) {
      this.setState({
        isSingleSelect: false
      });
    } else {
      this.setState({
        isSingleSelect: true
      });
    }
    this.setState({
      multiSelect: this.populateOptions(["Bill", "Dave", "Steve", "Yes"])
    });
  }

  render() {
    const selectedOptionsStyles = {
      color: "#3c763d",
      backgroundColor: "#dff0d8"
    };
    const optionsListStyles = {
      backgroundColor: "#dff0d8",
      color: "#3c763d"
    };
    return (
      <MultiSelectReact
        options={this.state.multiSelect}
        optionClicked={this.optionClicked.bind(this)}
        selectedBadgeClicked={this.selectedBadgeClicked.bind(this)}
        selectedOptionsStyles={selectedOptionsStyles}
        optionsListStyles={optionsListStyles}
        isSingleSelect={this.state.isSingleSelect}
      />
    );
  }

  optionClicked(optionsList) {
    this.setState({ multiSelect: optionsList });
  }
  selectedBadgeClicked(optionsList) {
    this.setState({ multiSelect: optionsList });
  }
}
