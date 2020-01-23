import React from 'react'
import { Route } from 'react-router-dom'


const PublicRoute = ({ component: Component, setPath, ...rest }) => {


  setPath(null)
  localStorage.removeItem('path')


  return (
    <Route
      {...rest}
      render={props =>
        <Component {...props} />
      }
    />
  )
}

export default PublicRoute;
