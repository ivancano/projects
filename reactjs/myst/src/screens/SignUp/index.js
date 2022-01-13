import React from 'react';
import './styles.scss';
import Topbar from '../../components/Topbar/index';
import Loading from '../../components/Loading/index';
import UserServices from '../../services/UserServices';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import {
  Link, useHistory
} from "react-router-dom";
import { Formik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
	email: yup
    .string()
    .required()
    .email()
    .label('E-mail'),
   	password: yup
    .string()
    .required()
    .min(8)
    .label('Password'),
    password_confirmation: yup
    .string()
    .required()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .label('Password Confirmation'),
});

class SignUp extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
			showPassword: false,
			showPasswordConfirmation: false,
			email: '',
			password: '',
			password_confirmation: '',
			loading: false
		}
	}

	togglePassword = () => {
		const currentState = this.state.showPassword;
		this.setState({showPassword: !currentState});
	}

	togglePasswordConfirmation = () => {
		const currentState = this.state.showPasswordConfirmation;
		this.setState({showPasswordConfirmation: !currentState});
	}

	handleChange = (event) => {
	    this.setState({[event.target.name]: event.target.value});
	}

	createUser = (email, password) => {
		this.setState({loading: true});
		UserServices.createUser(email, password).then(() => {
			this.setState({loading: false});
			this.props.history.push('/success');
		})
		.catch((error) => {
			this.setState({loading: false});
			alert(error);
		});
	}
  

  	render() {

      	return (
	        <div className="container-sign-up">
	          <Loading show={this.state.loading} />	
	          <Topbar />

	          <div className="sign-up">
		          <Row className="logo">
		          	<Col>
		          		<svg width="72" height="22" viewBox="0 0 72 22" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M15.2227 11.8449L9.58181 0.344727H0V20.7608H6.8V8.0546L13.2136 20.7608H16.7682L23.2204 8.0546V20.7608H30.1364V0.344727H20.9023L15.2227 11.8449Z" fill="white"/>
							<path d="M32.5635 7.15009L31.0567 0.344727H25.8408L29.6658 13.2663V20.7608H35.2681V13.3955L38.8613 0.344727H34.0317L32.5635 7.15009Z" fill="white"/>
							<path d="M49.8611 7.53759L46.3838 7.45145C43.2929 7.3653 42.6361 6.84844 42.6361 6.07315V6.03007C42.6361 5.29785 43.0225 4.73792 45.8816 4.73792H45.9975C49.0884 4.73792 49.4361 5.90086 49.5134 6.63308H58.8634V6.46079C58.8634 3.05811 56.6611 0 47.1566 0H44.452C35.7589 0 33.3248 2.62739 33.3248 6.20236V6.46079C33.3248 9.69119 35.0248 12.577 42.3657 12.7924L45.9975 12.9216C49.4747 13.0508 49.8225 13.6969 49.8225 14.5583V14.6014C49.8225 15.4628 49.2429 16.2381 46.2679 16.2381H46.152C42.9452 16.2381 42.5589 14.6875 42.4816 13.74H32.9771V13.9984C32.9771 16.6258 34.0202 21.1483 44.6838 21.1483H47.4657C57.5111 21.1483 59.4429 17.6595 59.4429 14.1276V13.74C59.5202 9.56197 56.9315 7.75295 49.8611 7.53759Z" fill="white"/>
							<path d="M61.2979 0.344727V4.99649H64.1956V20.7608H69.1024V4.99649H72.0001V0.344727H61.2979Z" fill="white"/>
						</svg>
		          	</Col>
		          </Row>
		          <Row className="text-1">
		          	<Col>
		          		<span>STEP INTO THE UNKNOWN</span>
		          	</Col>
		          </Row>
		          <Row>
		          	<Col>
		          		<Formik
					    	initialValues={{ email: '', password: '', password_confirmation: '' }}
					      	onSubmit={(values, actions) => {
					        	this.createUser(values.email, values.password);
					      	}}
					      	validationSchema={validationSchema}
					    >
					    	{formikProps => (
					    		<div>
							    	<Form.Group>
								    	<Form.Control onChange={formikProps.handleChange('email')} type="email" placeholder="EMAIL ADDRESS" />
								    	<div className="text-danger">{formikProps.touched.email && formikProps.errors.email}</div>
								  	</Form.Group>

								  	<Form.Group className="group-password-sign-up">
								    	{ !this.state.showPassword && (
								    		<Form.Control onChange={formikProps.handleChange('password')} type="password" placeholder="PASSWORD" />
								    	)}
								    	{ this.state.showPassword && (
											<Form.Control onChange={formikProps.handleChange('password')} type="text" placeholder="PASSWORD" />
										)}
								    	{ !this.state.showPassword && (
								    		<a onClick={this.togglePassword}>
										    	<svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-eye" fill="#fff" xmlns="http://www.w3.org/2000/svg">
												  <path fillRule="evenodd" d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.134 13.134 0 0 0 1.66 2.043C4.12 11.332 5.88 12.5 8 12.5c2.12 0 3.879-1.168 5.168-2.457A13.134 13.134 0 0 0 14.828 8a13.133 13.133 0 0 0-1.66-2.043C11.879 4.668 10.119 3.5 8 3.5c-2.12 0-3.879 1.168-5.168 2.457A13.133 13.133 0 0 0 1.172 8z"/>
												  <path fillRule="evenodd" d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
												</svg>
											</a>
										)}
										{ this.state.showPassword && (
											<a onClick={this.togglePassword}>
										    	<svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-eye-slash" fill="#fff" xmlns="http://www.w3.org/2000/svg">
												  <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
												  <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299l.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
												  <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709z"/>
												  <path fillRule="evenodd" d="M13.646 14.354l-12-12 .708-.708 12 12-.708.708z"/>
												</svg>
											</a>
										)}
										<div className="text-danger">{formikProps.touched.password && formikProps.errors.password}</div>
								  	</Form.Group>

								  	<Form.Group className="group-password-sign-up">
								    	{ !this.state.showPasswordConfirmation && (
								    		<Form.Control onChange={formikProps.handleChange('password_confirmation')} type="password" placeholder="REPEAT YOUR PASSWORD" />
								    	)}
								    	{ this.state.showPasswordConfirmation && (
											<Form.Control onChange={formikProps.handleChange('password_confirmation')} type="text" placeholder="REPEAT YOUR PASSWORD" />
										)}	
								    	{ !this.state.showPasswordConfirmation && (
								    		<a onClick={this.togglePasswordConfirmation}>
										    	<svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-eye" fill="#fff" xmlns="http://www.w3.org/2000/svg">
												  <path fillRule="evenodd" d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.134 13.134 0 0 0 1.66 2.043C4.12 11.332 5.88 12.5 8 12.5c2.12 0 3.879-1.168 5.168-2.457A13.134 13.134 0 0 0 14.828 8a13.133 13.133 0 0 0-1.66-2.043C11.879 4.668 10.119 3.5 8 3.5c-2.12 0-3.879 1.168-5.168 2.457A13.133 13.133 0 0 0 1.172 8z"/>
												  <path fillRule="evenodd" d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
												</svg>
											</a>
										)}
										{ this.state.showPasswordConfirmation && (
											<a onClick={this.togglePasswordConfirmation}>
										    	<svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-eye-slash" fill="#fff" xmlns="http://www.w3.org/2000/svg">
												  <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
												  <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299l.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
												  <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709z"/>
												  <path fillRule="evenodd" d="M13.646 14.354l-12-12 .708-.708 12 12-.708.708z"/>
												</svg>
											</a>
										)}
										<div className="text-danger">{formikProps.touched.password_confirmation && formikProps.errors.password_confirmation}</div>
								  	</Form.Group>
								  
								  	<Button onClick={formikProps.handleSubmit}>CONFIRM</Button>    
					      		</div>
					      	)}
					    </Formik>
		          		<Form>
						  	
						</Form>
		          	</Col>
		          </Row>
		        </div>
	        </div>
	    );
  	}
}

export default SignUp;
