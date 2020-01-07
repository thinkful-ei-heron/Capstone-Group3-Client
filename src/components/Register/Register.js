import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import { FirebaseContext } from "../../services";

const Top = () => {
  const fbContext = useContext(FirebaseContext);
  const [userEmail, setUserInput] = useState("email");
  const [userPassword, setUserPassword] = useState("password");
  const [toDashboard, setToDashboard] = useState(false);

  const onChange = event => {
    event.preventDefault();
    setUserInput(event.target.value);
  };
  const onPass = event => {
    event.preventDefault();
    setUserPassword(event.target.value);
  };
  const submitUser = event => {
    event.preventDefault();
    fbContext
      .doCreateUserWithEmailAndPassword(userEmail, userPassword)
      .then(() => {
        fbContext
          .doSignInWithEmailAndPassword(userEmail, userPassword)
          .then(res => {
            fbContext.loggedIn = true;
            fbContext.userEmail = res.user.email;
            setTimeout(setToDashboard(true), 1000);
          });
      });
  };

  return (
    <Headline
      email={userEmail}
      onChangeEmail={onChange}
      pass={userPassword}
      onPassChange={onPass}
      submitUser={submitUser}
      toDashboard={toDashboard}
    />
  );
};

const Headline = ({
  email,
  onChangeEmail,
  pass,
  onPassChange,
  submitUser,
  toDashboard,
}) => (
  <div>
    <form onSubmit={submitUser}>
      <input
        name="userEmail"
        value={email}
        onChange={onChangeEmail}
        type="email"
        placeholder="Email Address"
        required
      />
      <p>{email}</p>
      <label htmlFor="password">password: </label>
      <input
        name="password"
        value={pass}
        onChange={onPassChange}
        type="password"
        placeholder="password"
        minLength="8"
        maxLength="12"
        required
        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$"
      />
      <p>{pass}</p>
      <button type="submit">Register</button>
    </form>
    {toDashboard ? <Redirect to="/dashboard" /> : null}
  </div>
);

export default Top;
