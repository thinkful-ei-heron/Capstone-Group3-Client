import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../services/Auth';
import lazy from '../../images/lazy.svg';
import './Header.css';
import app from '../../services/base';

export default class Header extends Component {
  static contextType = AuthContext;

  renderLoginLink() {
    return (
      <div className="Header__sub_container">
        <div className="Header__login">
          <Link className="Header__btn Header__alt" to="/login">
            Log In
          </Link>
          <Link className="Header__btn Header__primary" to="/register">
            Register
          </Link>
        </div>
      </div>
    );
  }

  renderLogoutLink() {
    return (
      <div className="Header__sub_container">
        <div className="Header__user_info">
          <span>Welcome, {this.context.currentUser.name}!</span>
          <span>Role: {this.context.currentUser.role}</span>
        </div>
        <div className="Header__db_logout">
          <Link to="/dashboard">
            <h3 className="Header__dashboard">Dashboard</h3>
          </Link>
          <Link onClick={this.handleLogout} className="Header__btn  Header__alt" to="/">
            Log Out
          </Link>
        </div>
      </div>
    );
  }

  handleLogout = () => {
    this.props.setPath(null);
    localStorage.removeItem('path');
    app.auth().signOut();
  };

  render() {
    return (
      <>
        <nav className="Header">
          <h1>
            <Link className="Header__link" to="/">
              <img className="Header__logo" src={lazy} alt="man reclining in chair" />
              <span className="Header__app_name">manageLazily</span>
            </Link>
          </h1>
          {this.context.currentUser ? this.renderLogoutLink() : this.renderLoginLink()}
        </nav>
      </>
    );
  }
}
