/* eslint-disable no-loop-func */
import React, { Component } from 'react'
import { Bar, Line, Pie } from 'react-chartjs-2'
import { AuthContext } from '../../services/Auth'
import app from '../../services/base'
import './Statistics.css'
const db = app.firestore()

export default class Statistics extends Component {
  static contextType = AuthContext
  state = {
    jobDue: {
      labels: [
        `${new Date(Date.now()).getMonth() + 1}/${new Date(
          Date.now()
        ).getDate()}/${new Date(Date.now()).getFullYear()}`,
        `${new Date(Date.now() + 86400000).getMonth() + 1}/${new Date(
          Date.now() + 86400000
        ).getDate()}/${new Date(Date.now() + 86400000).getFullYear()}`,
        `${new Date(Date.now() + 86400000 * 2).getMonth() + 1}/${new Date(
          Date.now() + 86400000 * 2
        ).getDate()}/${new Date(Date.now() + 86400000 * 2).getFullYear()}`,
        `${new Date(Date.now() + 86400000 * 3).getMonth() + 1}/${new Date(
          Date.now() + 86400000 * 3
        ).getDate()}/${new Date(Date.now() + 86400000 * 3).getFullYear()}`,
        `${new Date(Date.now() + 86400000 * 4).getMonth() + 1}/${new Date(
          Date.now() + 86400000 * 4
        ).getDate()}/${new Date(Date.now() + 86400000 * 4).getFullYear()}`,
        `${new Date(Date.now() + 86400000 * 5).getMonth() + 1}/${new Date(
          Date.now() + 86400000 * 5
        ).getDate()}/${new Date(Date.now() + 86400000 * 5).getFullYear()}`,
        `${new Date(Date.now() + 86400000 * 6).getMonth() + 1}/${new Date(
          Date.now() + 86400000 * 6
        ).getDate()}/${new Date(Date.now() + 86400000 * 6).getFullYear()}`,
      ],
      datasets: [
        {
          label: `Tasks Due`,
          data: [],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(255, 99, 132, 0.8)',
          ],
        },
      ],
    },
    jobHistory: {
      labels: [
        `${new Date(Date.now() - 86400000).getMonth() + 1}/${new Date(
          Date.now() - 86400000 * 7
        ).getDate()}/${new Date(Date.now() - 86400000).getFullYear()}`,
        `${new Date(Date.now() - 86400000).getMonth() + 1}/${new Date(
          Date.now() - 86400000 * 6
        ).getDate()}/${new Date(Date.now() - 86400000).getFullYear()}`,
        `${new Date(Date.now() - 86400000).getMonth() + 1}/${new Date(
          Date.now() - 86400000 * 5
        ).getDate()}/${new Date(Date.now() - 86400000).getFullYear()}`,
        `${new Date(Date.now() - 86400000).getMonth() + 1}/${new Date(
          Date.now() - 86400000 * 4
        ).getDate()}/${new Date(Date.now() - 86400000).getFullYear()}`,
        `${new Date(Date.now() - 86400000).getMonth() + 1}/${new Date(
          Date.now() - 86400000 * 3
        ).getDate()}/${new Date(Date.now() - 86400000).getFullYear()}`,
        `${new Date(Date.now() - 86400000).getMonth() + 1}/${new Date(
          Date.now() - 86400000 * 2
        ).getDate()}/${new Date(Date.now() - 86400000).getFullYear()}`,
        `${new Date(Date.now() - 86400000).getMonth() + 1}/${new Date(
          Date.now() - 86400000
        ).getDate()}/${new Date(Date.now() - 86400000).getFullYear()}`,
      ],
      datasets: [
        {
          label: `Task Completion History (7 days)`,
          data: [],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(255, 99, 132, 0.8)',
          ],
        },
      ],
    },
  }

  populateStats = async () => {
    let jobDue = new Array(this.state.jobDue.labels.length)
    let jobHistory = new Array(this.state.jobDue.labels.length)
    for (let i = 0; i < this.state.jobDue.labels.length; i++) {
      await db
        .collection('organizations')
        .doc(this.context.currentUser.org)
        .collection('projects')
        .doc(this.props.id)
        .collection('jobs')
        .get()
        .then(snapshot => {
          let jobDueCount = 0
          let jobHistoryCount = 0
          snapshot.docs.forEach(doc => {
            if (!doc.data().date_completed) {
              if (
                this.state.jobDue.labels[i] ===
                `${new Date(doc.data().deadline.seconds * 1000).getMonth() +
                  1}/${new Date(
                  doc.data().deadline.seconds * 1000
                ).getDate()}/${new Date(
                  doc.data().deadline.seconds * 1000
                ).getFullYear()}`
              ) {
                jobDueCount++
              }
            }
            if (doc.data().date_completed) {
              if (
                this.state.jobHistory.labels[i] ===
                  `${new Date(
                    doc.data().date_completed.seconds * 1000
                  ).getMonth() + 1}/${new Date(
                    doc.data().date_completed.seconds * 1000
                  ).getDate()}/${new Date(
                    doc.data().date_completed.seconds * 1000
                  ).getFullYear()}` &&
                doc.data().status === 'completed'
              ) {
                jobHistoryCount++
              }
            }
          })
          jobDue[i] = jobDueCount
          jobHistory[i] = jobHistoryCount
        })
      if (jobDue.every(item => item === 0)) {
        jobDue = []
      }
      if (jobHistory.every(item => item === 0)) {
        jobHistory = []
      }
    }
    this.setState({
      jobDue: {
        labels: this.state.jobDue.labels,
        datasets: [
          {
            label: this.state.jobDue.datasets[0].label,
            data: jobDue,
            backgroundColor: this.state.jobDue.datasets[0].backgroundColor,
          },
        ],
      },
      jobHistory: {
        labels: this.state.jobHistory.labels,
        datasets: [
          {
            label: this.state.jobHistory.datasets[0].label,
            data: jobHistory,
            backgroundColor: this.state.jobHistory.datasets[0].backgroundColor,
          },
        ],
      },
    })
    if (this.props.updated) this.props.turnOffUpdate()
  }

  componentDidMount = async () => {
    this.populateStats()
  }

  render() {
    if (this.props.updated) this.populateStats()
    return (
      <div className="Statistics">
        {this.state.jobDue.datasets[0].data.length !== 0 ? (
          <Bar
            className="due"
            data={this.state.jobDue}
            options={{
              legend: {
                labels: {
                  fontSize: 30,
                },
              },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                      callback: function(value) {
                        if (value % 1 === 0) {
                          return value
                        }
                      },
                      fontSize: 20,
                    },
                  },
                ],
                xAxes: [
                  {
                    ticks: {
                      fontSize: 20,
                    },
                  },
                ],
              },
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        ) : (
          <span>You have no tasks due soon</span>
        )}
        {this.state.jobHistory.datasets[0].data.length !== 0 ? (
          <Bar
            className="history"
            data={this.state.jobHistory}
            options={{
              legend: {
                labels: {
                  fontSize: 30,
                },
              },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                      callback: function(value) {
                        if (value % 1 === 0) {
                          return value
                        }
                      },
                      fontSize: 20,
                    },
                  },
                ],
                xAxes: [
                  {
                    ticks: {
                      fontSize: 20,
                    },
                  },
                ],
              },
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        ) : (
          <span className="Statistics__no_tasks">
            You have not completed any tasks in the last 7 days
          </span>
        )}
      </div>
    )
  }
}
