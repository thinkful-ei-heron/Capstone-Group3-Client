import React, { Component } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../services/Auth";
import "./Header.css";
import JobNotification from "../JobNotification/JobNotification";

export default class Header extends Component {
  static contextType = AuthContext;

  renderLoginLink() {
    return (
      <div className="Header__sub_container">
        <div className="Header__login">
          <Link className="Header__btn Header__alt" to="/login">
            Log In
          </Link>
          {this.context.currentUser === null ? (
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
          <span>Welcome, {this.props.userName}!</span>
          <span>Role: {this.props.role}</span>
        </div>
        <div className="Header__db_logout">
          <Link to="/dashboard">
            <h3>Dashboard</h3>
          </Link>
          <Link className="Header__btn" to="/logout">
            Log Out
          </Link>
        </div>
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
              <span className="Header__app_name">ManageLazily</span>
            </Link>
          </h1>
          {this.context.currentUser
            ? this.renderLogoutLink()
            : this.renderLoginLink()}
        </nav>
      </>
    );
  }
}
