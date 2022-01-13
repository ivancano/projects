import React from 'react';
import {Elements} from 'react-stripe-elements';

import InjectedCheckoutForm from './CheckoutForm';

class MyStoreCheckout extends React.Component {
  render() {
    return (
      <Elements>
        <InjectedCheckoutForm 
        	type={this.props.type} 
        	showLoading={this.props.showLoading} 
        	hideLoading={this.props.hideLoading} 
        	user={this.props.user}
          loadUserData={this.props.loadUserData}
        />
      </Elements>
    );
  }
}

export default MyStoreCheckout;