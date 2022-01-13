import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { withContext } from "../providers/UserContext";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={
      props => {
        if (rest.user.auth) {
          return <Component {...rest} {...props} />
        } else {
          return <Redirect to={
            {
              pathname: '/login',
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

export default withContext(ProtectedRoute);