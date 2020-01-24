import React, { useContext, useState, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'

import { AuthContext } from '../../services/Auth'
import app from '../../services/base.js'
import dbServices from '../../services/dbServices'
import Swal from 'sweetalert2'
import { functions } from 'firebase'
import Sidebar from '../Sidebar/Sidebar'
import StyleIcon from '../StyleIcon/StyleIcon'
import './Profile.css'

const Profile = props => {
  const { currentUser } = useContext(AuthContext)
  const [userInfo, setUserInfo] = useState({})
  const [userProjects, setUserProjects] = useState([])
  const [expandPersonnel, setExpandPersonnel] = useState(true)
  const functions = app.functions()

  const handleClick = async event => {
    event.preventDefault()
    const promoteFunc = await functions.httpsCallable('promoteUser')
    console.log(promoteFunc)
    promoteFunc({
      email: userInfo.email,
      org: userInfo.org,
    }).then(() => {
      try {
        dbServices.promoteUser(userInfo.org, userInfo.email).then(() =>
          getUserInfo().then(info => {
            setUserInfo(info)
          })
        )
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to promote employee.',
          icon: 'error',
          confirmButtonText: 'Close',
        })
      }
    })
  }

  const getUserInfo = async () => {
    let info = {}
    try {
      await dbServices
        .getUser(props.match.params.id, currentUser.org)
        .then(snapshot => {
          snapshot.forEach(doc => {
            info = {
              role: doc.data().role,
              email: doc.data().email,
              name: doc.data().name,
              org: doc.data().org,
            }
          })
        })
    } catch (error) {
      console.log('caught error!')
      console.warn(error)
      Swal.fire({
        title: 'Error!',
        text:
          "There was an issue loading this employee's information - please refresh the page and try again.",
        icon: 'error',
        confirmButtonText: 'Close',
      })
    }

    return info
  }

  const getUserProjects = async info => {
    if (info.role === 'project worker')
      try {
        await dbServices
          .getEmployeeProjects(info.name, info.org)
          .then(snapshot => {
            snapshot.forEach(doc => {
              setUserProjects([...userProjects, doc.data()])
            })
          })
      } catch (error) {
        console.warn(error)
        Swal.fire({
          title: 'Error!',
          text:
            "There was an issue loading this employee's project information - please refresh the page and try again.",
          icon: 'error',
          confirmButtonText: 'Close',
        })
      }
    else if (info.role === 'project manager') {
      try {
        await dbServices
          .getManagerProjects(info.name, info.org)
          .then(snapshot => {
            snapshot.forEach(doc => {
              setUserProjects([...userProjects, doc.data()])
            })
          })
      } catch (error) {
        console.warn(error)
        Swal.fire({
          title: 'Error!',
          text:
            "There was an issue loading this employee's project information - please refresh the page and try again.",
          icon: 'error',
          confirmButtonText: 'Close',
        })
      }
    }
  }

  useEffect(() => {
    getUserInfo().then(info => {
      setUserInfo(info)
      getUserProjects(info)
    })
  }, [])

  if (userInfo && userInfo.role)
    return (
      <section className="Profile__container">
        <div className="App__org_header">
          {<h2>{userInfo.org}</h2>}
          <span className="App__date">{new Date().toDateString()}</span>
        </div>
        <div className="Profile__main">
          <section className="Profile__user">
            <div className="App__section_header">
              <h1>{userInfo.name}</h1>
            </div>
            <ul className="Profile__user_info">
              <li>
                <span className="Profile__bold">Role:</span> {userInfo.role}
              </li>
              <li>
                <span className="Profile__bold">Email:</span>
                {userInfo.email}
              </li>
              <li>
                <span className="Profile__bold">Org:</span>
                {userInfo.org}
              </li>
            </ul>
            <h2>User Projects:</h2>
            {userProjects.length > 0 ? (
              <ul className="Profile__user_projects">
                {userProjects.map((proj, i) => {
                  return (
                    <li key={i}>
                      <Link to={`/project/${proj.id}`}>{proj.name}</Link>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p>No Projects assigned.</p>
            )}
            {/* yes I know this is kind of gross. */}
            <div className="App__personnel_promote_button">
              {currentUser &&
                currentUser.role === 'owner' &&
                userInfo &&
                userInfo.role === 'project worker' && (
                  <button
                    className="btn_highlight_color"
                    onClick={event => handleClick(event)}
                  >
                    Promote User
                  </button>
                )}
            </div>
          </section>
          <section className="App__personnel App__separate_top">
            <div
              className="App__section_header"
              onClick={() => setExpandPersonnel(!expandPersonnel)}
            >
              <div className="App__fa_h1">
                {StyleIcon({
                  style: `${expandPersonnel ? 'minus' : 'plus'}`,
                })}
                <h1>Personnel</h1>
              </div>
            </div>
            {expandPersonnel && <Sidebar />}
          </section>
        </div>
      </section>
    )
  return <></>
}

export default withRouter(Profile)
