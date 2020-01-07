import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default class Header extends Component {
  state = {
    loggedIn: false,
    userName: 'Balay', //this will be replaced with context
    role: 'Project Manager' //this will be replaced with context
  }

  handleLogout = () => {
    //this will be replaced with code to handle logout through firebase
    this.setState({
      loggedIn: !this.state.loggedIn
    })
  }

  renderLoginLink() {
    return (
      <ul className="header__login">
        <Link to='/login'>
          <li>Log In</li>
        </Link>
        <Link to='/signup'>
          <li>Sign Up</li>
        </Link>
      </ul>
    )
  }

  renderLogoutLink() {
    return (
      <ul className="header__logout">
        <li className="user__info">
          <span>Welcome, {this.state.userName}!</span>
          <span>Role: {this.state.role}</span>
        </li>
        <Link to="/" onClick={this.handleLogout}>
          <li>Log Out</li>
        </Link>
      </ul>
    )
  }

  render() {
    return (
      <>
        <nav className="app__header">
          <h1>
            <Link to='/'>
              <img src="" alt="app__logo" />
            </Link>
          </h1>
          {this.state.loggedIn ? this.renderLogoutLink() : this.renderLoginLink()}
        </nav>
        <button onClick={this.handleLogout}>toggle login</button>
      </>
    )
  }
}

