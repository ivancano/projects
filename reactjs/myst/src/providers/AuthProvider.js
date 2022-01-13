import React, { Component, createContext } from "react";
import { auth, firestore } from '../services/FirebaseService';
import UserServices from '../services/UserServices';
import { UserProvider } from './UserContext';

export const UserContext = createContext({ user: null });

class AuthProvider extends Component {
	  state = {
    	user: {
        auth: null,
        data: null,
        plan: null
      }
  	};

  	componentDidMount = () => {
    	auth.onAuthStateChanged(userAuth => {
          let currentUser = this.state.user;
          currentUser.auth = userAuth;
          this.setState({ user: currentUser}, () => {
            this.loadUserData();
          });
    	});
  	};

    loadUserData = () => {
      if(this.state.user.auth !== null){
        UserServices.getUserData(this.state.user.auth.uid).then((res) => {
          let currentUser = this.state.user;
          currentUser.data = res;
          this.setState({ user: currentUser});
          UserServices.getCurrentPlan(this.state.user.auth.uid).then((res2) => {
            let currentUser = this.state.user;
            currentUser.plan = res2;
            this.setState({ user: currentUser});
          })
        }); 
      }
    }

  	render() {
  		return (
  			<UserProvider value={{user: this.state.user, loadUserData: this.loadUserData}}>
  				{this.props.children}
  			</UserProvider>
  		);
  	}
}

export default AuthProvider;