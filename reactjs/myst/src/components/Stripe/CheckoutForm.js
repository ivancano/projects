import React from 'react';
import {injectStripe} from 'react-stripe-elements';

import CardSection from './CardSection';
import PaymentRequestForm from './PaymentRequestForm';
import UserServices from '../../services/UserServices';

class CheckoutForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loading: false,
      success: null
    }
  }

  handleSubmit = async (ev) => {
    ev.preventDefault();
    this.props.showLoading();
    const cardElement = this.props.elements.getElement('card');
    let _token = await this.props.stripe.createToken();
    if(_token.error){
      this.props.hideLoading();
      this.setState({error: _token.error.message});
    }
    else {
      fetch(process.env.REACT_APP_CLOUDFUNCTIONS_URL+'createStripeCharge?token=' + _token.token.id+'&type='+this.props.type)
      .then(response => response.json())
      .then(data => {console.log(data);
        if(data.status === 'succeeded'){
          UserServices.pay(this.props.user.auth, data)
          .then(() => {
            this.props.hideLoading();
            this.props.loadUserData();
            this.setState({success: 'Payment successfully!', error: null});
          })
          .catch((error) => {
            this.props.hideLoading();
            this.setState({error: error, success: null});
          });
        }
        else {
          this.props.hideLoading();
          this.setState({error: 'Error. Please try again.', success: null});
        }
      });
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <CardSection />
        { this.state.error !== null && (
          <div className="text-danger">{ this.state.error }</div>
        )}
        { this.state.success !== null && (
          <div className="text-success">{ this.state.success }</div>
        )}
        <button>CONFIRM</button>
      </form>
    );
  }
}

export default injectStripe(CheckoutForm);