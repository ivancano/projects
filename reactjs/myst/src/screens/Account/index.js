import React, { useContext } from 'react';
import './styles.scss';
import Topbar from '../../components/Topbar/index';
import Loading from '../../components/Loading/index';
import { withContext } from "../../providers/UserContext";
import UserServices from '../../services/UserServices';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import {
  Link
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
    .min(8)
    .label('Password')
});

class Account extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
			showPassword: false,
			email: '',
			password: '',
			loading: false,
			editing: false
		}
	}

	componentDidMount() {
		
	}

	handleChange = (event) => {
	    this.setState({[event.target.name]: event.target.value});
	}

	editAccount = () => {
		this.setState({editing: true});
	}

	saveAccount = (email, password) => {
		this.setState({loading: true});
		UserServices.updateUser(email, password).then(() => {
			this.setState({editing: false, loading: false});	
		}).catch((error) => {
			alert(error)
			this.setState({editing: false, loading: false});	
		});
	}
  

  	render() {

      	return (
	        <div className="container-account">
	        	<Loading show={this.state.loading} />
	          <Topbar />

	          <div className="account">
		          <Row className="logo">
		          	<Col>
		          		<svg width="72" height="22" viewBox="0 0 72 22" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M15.2227 11.8449L9.58181 0.344727H0V20.7608H6.8V8.0546L13.2136 20.7608H16.7682L23.2204 8.0546V20.7608H30.1364V0.344727H20.9023L15.2227 11.8449Z" fill="black"/>
							<path d="M32.5635 7.15009L31.0567 0.344727H25.8408L29.6658 13.2663V20.7608H35.2681V13.3955L38.8613 0.344727H34.0317L32.5635 7.15009Z" fill="black"/>
							<path d="M49.8611 7.53759L46.3838 7.45145C43.2929 7.3653 42.6361 6.84844 42.6361 6.07315V6.03007C42.6361 5.29785 43.0225 4.73792 45.8816 4.73792H45.9975C49.0884 4.73792 49.4361 5.90086 49.5134 6.63308H58.8634V6.46079C58.8634 3.05811 56.6611 0 47.1566 0H44.452C35.7589 0 33.3248 2.62739 33.3248 6.20236V6.46079C33.3248 9.69119 35.0248 12.577 42.3657 12.7924L45.9975 12.9216C49.4747 13.0508 49.8225 13.6969 49.8225 14.5583V14.6014C49.8225 15.4628 49.2429 16.2381 46.2679 16.2381H46.152C42.9452 16.2381 42.5589 14.6875 42.4816 13.74H32.9771V13.9984C32.9771 16.6258 34.0202 21.1483 44.6838 21.1483H47.4657C57.5111 21.1483 59.4429 17.6595 59.4429 14.1276V13.74C59.5202 9.56197 56.9315 7.75295 49.8611 7.53759Z" fill="black"/>
							<path d="M61.2979 0.344727V4.99649H64.1956V20.7608H69.1024V4.99649H72.0001V0.344727H61.2979Z" fill="black"/>
						</svg>
		          	</Col>
		          </Row>
		          <Row className="text-1">
		          	<Col>
		          		<span>STEP INTO THE UNKNOWN</span>
		          	</Col>
		          </Row>
		          <Row className="title-my-account">
		          	<Col>
		          		<span>MY ACCOUNT</span>
		          	</Col>
		          </Row>
		          {this.props.user.plan && !this.props.user.plan.expired && (
			          <Row className="text-subscription">
			          	<Col>
			          		<span>You have the {this.props.user.plan.type} suscription pack.</span>
			          	</Col>
			          </Row>
		          )}
		          {!this.state.editing && (
		          <Row>
		          	<Col>
	          			<Button onClick={() => this.editAccount()}>
	          				EDIT MY ACCOUNT
	          				<svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pencil-square" fill="#fff" xmlns="http://www.w3.org/2000/svg">
							  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
							  <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
							</svg>
	          			</Button>
		          	</Col>
		          </Row>
		          )}
		          {!this.state.editing && (
		          		<Row>
				          	<Col sm={12} md={6}>
			          			<div className="container-field">
			          				<Row>
			          					<Col className="label">
			          						EMAIL ADDRESS
			          					</Col>
			          				</Row>
			          				<Row>
			          					{!this.state.editing && (
				          					<Col className="field">
				          						<svg className="svg-email" width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M15.4062 0H1.59376C0.714907 0 0 0.728924 0 1.62501V11.375C0 12.2711 0.714907 13 1.59376 13H15.4062C16.2851 13 17 12.2711 17 11.375V1.62501C17 0.728924 16.2851 0 15.4062 0ZM15.4062 1.08333C15.4784 1.08333 15.5471 1.0986 15.6099 1.12526L8.5 7.40824L1.39011 1.12526C1.45288 1.09863 1.52155 1.08333 1.59373 1.08333H15.4062ZM15.4062 11.9166H1.59376C1.30064 11.9166 1.0625 11.6739 1.0625 11.375V2.26981L8.15188 8.53441C8.25202 8.62273 8.37601 8.66665 8.5 8.66665C8.62399 8.66665 8.74798 8.62277 8.84812 8.53441L15.9375 2.26981V11.375C15.9375 11.6739 15.6994 11.9166 15.4062 11.9166Z" fill="#680FFB"/>
												</svg>
				          						<Form.Control readOnly name="email" value={(this.props.user.auth !== null) ? this.props.user.auth.email : ''} type="email" placeholder="EMAIL ADDRESS" />
				          					</Col>
			          					)}
			          				</Row>
			          			</div>
				          	</Col>
				          	<Col sm={12} md={6}>
			          			<div className="container-field">
			          				<Row>
			          					<Col className="label">
			          						PASSWORD
			          					</Col>
			          				</Row>
			          				<Row>
			          					{!this.state.editing && (
				          					<Col className="field">
				          						<svg className="svg-password" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
													<g clipPath="url(#clip0)">
														<path d="M15.625 20H4.375C3.34167 20 2.5 19.1592 2.5 18.125V9.375C2.5 8.34083 3.34167 7.5 4.375 7.5H15.625C16.6583 7.5 17.5 8.34083 17.5 9.375V18.125C17.5 19.1592 16.6583 20 15.625 20ZM4.375 8.75C4.03083 8.75 3.75 9.03 3.75 9.375V18.125C3.75 18.47 4.03083 18.75 4.375 18.75H15.625C15.9692 18.75 16.25 18.47 16.25 18.125V9.375C16.25 9.03 15.9692 8.75 15.625 8.75H4.375Z" fill="#680FFB"/>
														<path d="M14.375 8.75C14.03 8.75 13.75 8.47 13.75 8.125V5C13.75 2.9325 12.0675 1.25 10 1.25C7.9325 1.25 6.25 2.9325 6.25 5V8.125C6.25 8.47 5.97 8.75 5.625 8.75C5.28 8.75 5 8.47 5 8.125V5C5 2.2425 7.2425 0 10 0C12.7575 0 15 2.2425 15 5V8.125C15 8.47 14.72 8.75 14.375 8.75Z" fill="#680FFB"/>
														<path d="M9.99967 14.1666C9.08051 14.1666 8.33301 13.4191 8.33301 12.4999C8.33301 11.5808 9.08051 10.8333 9.99967 10.8333C10.9188 10.8333 11.6663 11.5808 11.6663 12.4999C11.6663 13.4191 10.9188 14.1666 9.99967 14.1666ZM9.99967 12.0833C9.77051 12.0833 9.58301 12.2699 9.58301 12.4999C9.58301 12.7299 9.77051 12.9166 9.99967 12.9166C10.2288 12.9166 10.4163 12.7299 10.4163 12.4999C10.4163 12.2699 10.2288 12.0833 9.99967 12.0833Z" fill="#680FFB"/>
														<path d="M10 16.6667C9.655 16.6667 9.375 16.3867 9.375 16.0417V13.75C9.375 13.405 9.655 13.125 10 13.125C10.345 13.125 10.625 13.405 10.625 13.75V16.0417C10.625 16.3867 10.345 16.6667 10 16.6667Z" fill="#680FFB"/>
													</g>
													<defs>
														<clipPath id="clip0">
															<rect width="20" height="20" fill="white"/>
														</clipPath>
													</defs>
												</svg>

				          						<Form.Control readOnly name="password" value="000000000" type="password" placeholder="PASSWORD" />
				          					</Col>
				          				)}
			          				</Row>
			          			</div>
				          	</Col>
			          </Row>
		          )}
		          {this.state.editing && (
		          <Formik
				    	initialValues={{ email: (this.props.user.auth !== null) ? this.props.user.auth.email : '', password: ''}}
				      	onSubmit={(values, actions) => {
				        	this.saveAccount(values.email, values.password);
				      	}}
				      	validationSchema={validationSchema}
				    >
				    {formikProps => (
				    	<>
			          	<Row>
				          	<Col sm={12} md={6}>
			          			<div className="container-field">
			          				<Row>
			          					<Col className="label">
			          						EMAIL ADDRESS
			          					</Col>
			          				</Row>
			          				<Row>
			          					{this.state.editing && (
				          					<Col className="field-editing">
				          						<svg className="svg-email" width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M15.4062 0H1.59376C0.714907 0 0 0.728924 0 1.62501V11.375C0 12.2711 0.714907 13 1.59376 13H15.4062C16.2851 13 17 12.2711 17 11.375V1.62501C17 0.728924 16.2851 0 15.4062 0ZM15.4062 1.08333C15.4784 1.08333 15.5471 1.0986 15.6099 1.12526L8.5 7.40824L1.39011 1.12526C1.45288 1.09863 1.52155 1.08333 1.59373 1.08333H15.4062ZM15.4062 11.9166H1.59376C1.30064 11.9166 1.0625 11.6739 1.0625 11.375V2.26981L8.15188 8.53441C8.25202 8.62273 8.37601 8.66665 8.5 8.66665C8.62399 8.66665 8.74798 8.62277 8.84812 8.53441L15.9375 2.26981V11.375C15.9375 11.6739 15.6994 11.9166 15.4062 11.9166Z" fill="#680FFB"/>
												</svg>
				          						<Form.Control name="email" defaultValue={(this.props.user.auth !== null) ? this.props.user.auth.email : ''} onChange={formikProps.handleChange('email')} type="email" placeholder="EMAIL ADDRESS" />
				          						<div className="text-danger">{formikProps.touched.email && formikProps.errors.email}</div>
				          					</Col>
			          					)}
			          				</Row>
			          			</div>
				          	</Col>
				          	<Col sm={12} md={6}>
			          			<div className="container-field">
			          				<Row>
			          					<Col className="label">
			          						PASSWORD
			          					</Col>
			          				</Row>
			          				<Row>
				          				{this.state.editing && (
				          					<Col className="field-editing">
				          						<svg className="svg-password" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
													<g clipPath="url(#clip0)">
														<path d="M15.625 20H4.375C3.34167 20 2.5 19.1592 2.5 18.125V9.375C2.5 8.34083 3.34167 7.5 4.375 7.5H15.625C16.6583 7.5 17.5 8.34083 17.5 9.375V18.125C17.5 19.1592 16.6583 20 15.625 20ZM4.375 8.75C4.03083 8.75 3.75 9.03 3.75 9.375V18.125C3.75 18.47 4.03083 18.75 4.375 18.75H15.625C15.9692 18.75 16.25 18.47 16.25 18.125V9.375C16.25 9.03 15.9692 8.75 15.625 8.75H4.375Z" fill="#680FFB"/>
														<path d="M14.375 8.75C14.03 8.75 13.75 8.47 13.75 8.125V5C13.75 2.9325 12.0675 1.25 10 1.25C7.9325 1.25 6.25 2.9325 6.25 5V8.125C6.25 8.47 5.97 8.75 5.625 8.75C5.28 8.75 5 8.47 5 8.125V5C5 2.2425 7.2425 0 10 0C12.7575 0 15 2.2425 15 5V8.125C15 8.47 14.72 8.75 14.375 8.75Z" fill="#680FFB"/>
														<path d="M9.99967 14.1666C9.08051 14.1666 8.33301 13.4191 8.33301 12.4999C8.33301 11.5808 9.08051 10.8333 9.99967 10.8333C10.9188 10.8333 11.6663 11.5808 11.6663 12.4999C11.6663 13.4191 10.9188 14.1666 9.99967 14.1666ZM9.99967 12.0833C9.77051 12.0833 9.58301 12.2699 9.58301 12.4999C9.58301 12.7299 9.77051 12.9166 9.99967 12.9166C10.2288 12.9166 10.4163 12.7299 10.4163 12.4999C10.4163 12.2699 10.2288 12.0833 9.99967 12.0833Z" fill="#680FFB"/>
														<path d="M10 16.6667C9.655 16.6667 9.375 16.3867 9.375 16.0417V13.75C9.375 13.405 9.655 13.125 10 13.125C10.345 13.125 10.625 13.405 10.625 13.75V16.0417C10.625 16.3867 10.345 16.6667 10 16.6667Z" fill="#680FFB"/>
													</g>
													<defs>
														<clipPath id="clip0">
															<rect width="20" height="20" fill="white"/>
														</clipPath>
													</defs>
												</svg>

				          						<Form.Control name="password" onChange={formikProps.handleChange('password')} type="password" placeholder="PASSWORD" />
				          						<div className="text-danger">{formikProps.touched.password && formikProps.errors.password}</div>
				          					</Col>
				          				)}
			          				</Row>
			          			</div>
				          	</Col>
			          </Row>
			          <Row>
			          	<Col>
		          			<Button onClick={formikProps.handleSubmit}>
		          				SAVE
		          			</Button>
			          	</Col>
			          </Row>
			          </>
		          )}
		          </Formik>
		          )}
		        </div>
	        </div>
	    );
  	}
}

export default withContext(Account);
