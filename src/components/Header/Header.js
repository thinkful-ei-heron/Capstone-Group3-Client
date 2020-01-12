import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import FirebaseContext from '../../services/context';
import './Header.css';

export default class Header extends Component {
  static contextType = FirebaseContext;

  handleLogout = () => {
    //this will be replaced with code to handle logout through firebase
    this.context.doSignOut();
  };

  renderLoginLink() {
    return (
      <div className="Header__sub_container">
        <div className="Header__login">
          <Link className="Header__btn Header__alt" to="/login">
            Log In
          </Link>
          {this.context.user === null ? (
            <Link className="Header__btn" to="/register">
              Register
            </Link>
          ) : (
            <Link className="Header__btn" to="/logout">
              Log Out
            </Link>
          )}
        </div>
      </div>
    );
  }

  renderLogoutLink() {
    return (
      <div className="Header__sub_container">
        <div className="user__info">
          <span>Welcome, {this.context.user.name}!</span>
          <span>Role: {this.context.user.role}</span>
        </div>
        <Link className="Header__btn" to="/" onClick={this.handleLogout}>
          Log Out
        </Link>
      </div>
    );
  }

  render() {
    return (
      <>
        <nav className="Header">
          <h1>
            <Link className="Header__link" to="/">
              <div className="Header__logo"></div>
              <span className="Header__app_name">App Name</span>
            </Link>
          </h1>
          {this.context.user ? this.renderLogoutLink() : this.renderLoginLink()}
        </nav>
      </>
    );
  }
}
