import React, { Component } from "react";
import { Bar, Line, Pie } from 'react-chartjs-2'
import app from '../../services/base'
import './Statistics.css'
const db = app.firestore();

export default class Statistics extends Component {
  state = {
    jobDue: {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      datasets: [
        {
          label: `Job's Due`,
          data: [
            5,
            1,
            2,
            0,
            3
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ]
        }
      ]
    },
    jobHistory: {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      datasets: [
        {
          label: `Job Completion History (previous week)`,
          data: [
            0,
            1,
            2,
            1,
            4
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ]
        }
      ]
    },
    employeeHours: {
      labels: ['Reif', 'Balay', 'Dan', 'Alex', 'Adam'],
      datasets: [
        {
          label: `Employee Job Hours`,
          data: [
            8,
            8,
            7,
            6,
            3
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ]
        }
      ]
    }
  }

  componentDidMount = () => {
    db.collection('organizations')
      .doc()
  }

  render() {
    return (
      <div className='Statistics'>
        <h5>STATISTICS</h5>
        <Bar
          className='due'
          data= {this.state.jobDue}
        />
        <Line
          className='history' 
          data= {this.state.jobHistory}
        />
        <Pie
          className='employeeHours'
          data= {this.state.employeeHours}
        />
      </div>
    );
  }
}
