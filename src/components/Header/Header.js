import React, { Component } from "react";
import { Link } from "react-router-dom";

import FirebaseContext from "../../services/context";
import "./Header.css";

export default class Header extends Component {
  static contextType = FirebaseContext;

  handleLogout = () => {
    //this will be replaced with code to handle logout through firebase
    this.context.doSignOut();
  };

  renderLoginLink() {
    return (
      <ul className="header__login">
        <Link to="/login">
          <li>Log In</li>
        </Link>
        {this.context.user === null ? (
          <li>
            <Link to="/register">Register</Link>
          </li>
        ) : (
          <Link to="/logout">
            <li>Log Out</li>
          </Link>
        )}
      </ul>
    );
  }

  renderLogoutLink() {
    return (
      <ul className="header__logout">
        <li className="user__info">
          <span>Welcome, {this.context.user.name}!</span>
          <span>Role: {this.context.user.role}</span>
        </li>
        <Link to="/" onClick={this.handleLogout}>
          <li>Log Out</li>
        </Link>
      </ul>
    );
  }

  render() {
    return (
      <>
        <nav className="app__header">
          <h1>
            <Link to="/">
              <img src="" alt="app__logo" />
            </Link>
          </h1>
          {this.context.user.email
            ? this.renderLogoutLink()
            : this.renderLoginLink()}
        </nav>
      </>
    );
  }
}
