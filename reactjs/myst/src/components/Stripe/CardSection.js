import React from 'react';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import { CardElement, CardNumberElement, CardExpiryElement, CardCvcElement } from 'react-stripe-elements';

class CardSection extends React.Component {
  render() {
    return (
    	<div className="card-form">
    		<Row>
    			<Col>
    				<span>CARD DETAILS</span>
    			</Col>
    		</Row>
    		<Row>
    			<Col>
    				<label>Card Number</label>
    			</Col>
    		</Row>
    		<Row>
    			<Col>
    				<CardNumberElement className="card-form-input" />
    			</Col>
    		</Row>
    		<Row>
    			<Col>
    				<label>Card Expiry</label>
    			</Col>
    		</Row>
    		<Row>
    			<Col>
    				<CardExpiryElement className="card-form-input" />
    			</Col>
    		</Row>
    		<Row>
    			<Col>
    				<label>Card CVC</label>
    			</Col>
    		</Row>
    		<Row>
    			<Col>
    				<CardCvcElement className="card-form-input" />
    			</Col>
    		</Row>
    	</div>
    );
  }
}

export default CardSection;