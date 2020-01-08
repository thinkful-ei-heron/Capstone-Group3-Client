import React, { Component } from 'react';

export default class ProjectManagerSelector extends Component {
  state = {
    projectManagers: ['Billy', 'Bobby', 'Buddy', 'Beatrice', 'Becky', 'Boris'],
    selectedManager: 'Billy'
  }

  handleSelected = (e) => {
    let selected = e.target.value
    this.setState({
      selectedManager: selected
    })
  }

  renderOptions = () => {
    return this.state.projectManagers.map((manager, index) => {
      return <option key={index} value={manager}>{manager}</option>
    })
  }

  render() {
    return (
      <div>
        <h5>ADD Project Manager</h5>
        <select onChange={e => this.handleSelected(e)}>
          {this.renderOptions()}
        </select>
      </div>
      
    )
  }
}