import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = props => {
  // return <p>blah</p>;
  return (
    <ul>
      {props.user.email ? (
        <>
          <li>Hello, {props.user.email}</li>
          <Link to="/logout">
            <li>Log Out</li>
          </Link>
        </>
      ) : (
        <>
          <Link to="/login">
            <li>Log In</li>
          </Link>
          <Link to="/register">
            <li>Register</li>
          </Link>
        </>
      )}
    </ul>
  );
};
// static contextType = FirebaseContext;
// state = {
//   loggedIn: false,
//   userName: "Balay",
//   role: "Project Manager",
// };

// handleLogout = () => {
//   this.setState({
//     loggedIn: !this.state.loggedIn,
//   });
// };

// renderLoginLink() {
//   const { user } = useSession();
//   return (
//     <>
//       <div>Hello, {user.displayName}</div>
//       <ul className="header__login">
// <Link to="/login">
//   <li>Log In</li>
// </Link>
// this.context.auth.currentUser === null ? (
//           <li>
//             <Link to="/register">Register</Link>
//           </li>
//         ) : (
//           <Link to="/logout">
//             <li>Log Out</li>
//           </Link>
//         )}
//       </ul>
//     </>
//   );
// }

//   renderLogoutLink() {
//     return (
//       <ul className="header__logout">
//         <li className="user__info">
//           <span>Welcome, {this.state.userName}!</span>
//           <span>Role: {this.state.role}</span>
//         </li>
//         <Link to="/" onClick={this.handleLogout}>
//           <li>Log Out</li>
//         </Link>
//       </ul>
//     );
//   }

//   render() {
//     return (
//       <>
//         <nav className="app__header">
//           <h1>
//             <Link to="/">
//               <img src="" alt="app__logo" />
//             </Link>
//           </h1>
//           {this.state.loggedIn
//             ? this.renderLogoutLink()
//             : this.renderLoginLink()}
//         </nav>
//       </>
//     );
//   }
// }
export default Header;
