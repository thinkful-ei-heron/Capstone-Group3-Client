import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import app from "../../services/base";
import dbServices from "../../services/dbServices";
import { Label, Input } from "../Form/Form";
import useFormValidation from "../../hooks/useFormValidation";
import validateInput from "../../hooks/validateInput";
import Swal from "sweetalert2";

const SignUp = ({ history }, props) => {
  const functions = app.functions();

  const inputValues = {
    email: "",
    name: "",
    password: "",
    orgName: ""
  };

  const [orgList, setOrgList] = useState([]);

  const getOrgs = async () => {
    let orgs = [];
    const dborgs = await dbServices.getAllOrgs();
    dborgs.forEach(item => orgs.push(item.data().name));
    return orgs;
  };

  useEffect(() => {
    getOrgs().then(list => setOrgList(list));
  }, []);

  const handleSignUp = async () => {
    const { email, name, password, orgName } = values;
    const registerOwner = await functions.httpsCallable("registerOwner");
    const registerWorker = await functions.httpsCallable("registerWorker");
    const registerProjectManager = await functions.httpsCallable(
      "registerProjectManager"
    );
    let info = {
      email: email,
      password: password,
      name: name,
      org: orgName,
      displayName: name
    };
    let infoNoPass = {
      email: email,
      name: name,
      org: orgName,
      displayName: name
    };
    switch (history.location.pathname) {
      case "/owner-signup":
        registerOwner(info)
          .then(() =>
            dbServices.createOwner({ ...infoNoPass, role: "owner" }, info.org)
          )
          .catch(error => {
            console.warn(error)
            Swal.fire({
              title: "Error!",
              text: 'There was an issue with registration - please refresh the page and try again.',
              icon: 'error',
              confirmButtonText: 'Close'
            })
          });
        break;
      case "/worker-signup":
        registerWorker(info).then(() =>
          dbServices
            .createUserInOrg({ ...infoNoPass, role: "project worker" }, orgName)
        )
        .catch(error => {
          console.warn(error)
          Swal.fire({
            title: "Error!",
            text: 'There was an issue with registration - please refresh the page and try again.',
            icon: 'error',
            confirmButtonText: 'Close'
          })
        });
        break;
      case "/manager-signup":
        registerProjectManager(info).then(() =>
          dbServices
            .createUserInOrg(
              { ...infoNoPass, role: "project manager" },
              orgName
            )
        )
        .catch(error => {
          console.warn(error)
          Swal.fire({
            title: "Error!",
            text: 'There was an issue with registration - please refresh the page and try again.',
            icon: 'error',
            confirmButtonText: 'Close'
          })
        });
    }
    history.push("/login");
    return `${email} signed up`;
  };

  const { handleSubmit, errors, handleChange, values, handleBlur, isSubmitting } = useFormValidation(
    inputValues,
    validateInput.validateSignup,
    handleSignUp
  );

  return (
    <div className="Login">
      <h1>Sign up</h1>
      <form className="Login__form" onSubmit={handleSubmit}>
        <Label>
          email
          <Input
            name="email"
            type="email"
            onChange={handleChange}
            value={values.email}
            onBlur={handleBlur}
            placeholder="Email"
          />
          {errors.email && <p>*{errors.email}</p>}
        </Label>
        <Label>
          Password
          <Input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
          />
          {errors.password && <p>*{errors.password}</p>}
        </Label>
        <Label htmlFor="username">
          Username
          <Input
            type="text"
            name="name"
            onChange={handleChange}
            value={values.name}
            onBlur={handleBlur}
            placeholder="Username"
          />
          {errors.name && <p>*{errors.name}</p>}
        </Label>
        <Label htmlFor="orgName">
          Organization Name
          <select
            type="text"
            name="orgName"
            onChange={handleChange}
            value={values.orgName}
            onBlur={handleBlur}
            placeholder="Organization name"
          >
            {orgList && orgList.length > 0 ? (
              orgList.map((item, i) => {
                return (
                  <option key={i} value={item}>
                    {item}
                  </option>
                );
              })
            ) : (
              <></>
            )}
          </select>
          {errors.orgName && <p>*{errors.orgName}</p>}
        </Label>
        <button type="submit" disabled={isSubmitting}>Sign Up</button>
      </form>
    </div>
  );
};

export default withRouter(SignUp);