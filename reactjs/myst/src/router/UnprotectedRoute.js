import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { withContext } from "../providers/UserContext";


const UnprotectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={
      props => {
        if (rest.user.auth == null) {
          return <Component {...rest} {...props} />
        } else {
          return <Redirect to={
            {
              pathname: '/',
              state: {
                from: props.location
              }
            }
          } />
        }
      }
    } />
  )
}

export default withContext(UnprotectedRoute);