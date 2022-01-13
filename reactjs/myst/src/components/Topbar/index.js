import React from 'react';
import './styles.scss';
import { Navbar, Nav, Button, Row, Col, Container, NavDropdown, Dropdown, DropdownButton } from 'react-bootstrap';
import {
	Link
} from "react-router-dom";
import { withContext } from "../../providers/UserContext";
import UserServices from "../../services/UserServices";

class Topbar extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		//console.log(this.props.user);
	}

	logout = () => {
		UserServices.logout().then(() => {
			window.location.href = '/';
		})
		.catch((error) => {
			alert(error)
		});
	}

	render() {
		return (
			<Navbar id="navbar" className="justify-content-between" expand="lg" variant="dark" sticky="top">
				<Container>
					<Navbar.Brand href="/">
						<svg width="72" height="22" viewBox="0 0 72 22" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M15.2227 11.8449L9.58181 0.344727H0V20.7608H6.8V8.0546L13.2136 20.7608H16.7682L23.2204 8.0546V20.7608H30.1364V0.344727H20.9023L15.2227 11.8449Z" fill="white"/>
							<path d="M32.5635 7.15009L31.0567 0.344727H25.8408L29.6658 13.2663V20.7608H35.2681V13.3955L38.8613 0.344727H34.0317L32.5635 7.15009Z" fill="white"/>
							<path d="M49.8611 7.53759L46.3838 7.45145C43.2929 7.3653 42.6361 6.84844 42.6361 6.07315V6.03007C42.6361 5.29785 43.0225 4.73792 45.8816 4.73792H45.9975C49.0884 4.73792 49.4361 5.90086 49.5134 6.63308H58.8634V6.46079C58.8634 3.05811 56.6611 0 47.1566 0H44.452C35.7589 0 33.3248 2.62739 33.3248 6.20236V6.46079C33.3248 9.69119 35.0248 12.577 42.3657 12.7924L45.9975 12.9216C49.4747 13.0508 49.8225 13.6969 49.8225 14.5583V14.6014C49.8225 15.4628 49.2429 16.2381 46.2679 16.2381H46.152C42.9452 16.2381 42.5589 14.6875 42.4816 13.74H32.9771V13.9984C32.9771 16.6258 34.0202 21.1483 44.6838 21.1483H47.4657C57.5111 21.1483 59.4429 17.6595 59.4429 14.1276V13.74C59.5202 9.56197 56.9315 7.75295 49.8611 7.53759Z" fill="white"/>
							<path d="M61.2979 0.344727V4.99649H64.1956V20.7608H69.1024V4.99649H72.0001V0.344727H61.2979Z" fill="white"/>
						</svg>
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
						<Nav className="mr-auto links">
							<Link className="nav-link" to="/movies">MOVIES</Link>
							<Link className="nav-link" to="/series">SERIES</Link>
							<Link className="nav-link" to="/audios">AUDIO</Link>
						</Nav>
						{!this.props.user.auth && (
							<Nav className="mr-auto buttons">
								<Link to="/login"><Button className="login">LOG IN</Button></Link>
								<Link to="/sign-up"><Button className="signup">SIGN UP</Button></Link>
								<svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-bell" fill="#fff" xmlns="http://www.w3.org/2000/svg">
									<path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2z"/>
									<path fillRule="evenodd" d="M8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
								</svg>
							</Nav>
						)}
						{this.props.user.auth && (
							<Nav className="mr-auto buttons">
								<DropdownButton title="MY ACCOUNT" className="my-account" id="my-account-dropdown">
						        	<Link to="/account"><Dropdown.Item as="button" className="my-account-option">EDIT ACCOUNT</Dropdown.Item></Link>
						        	<Dropdown.Divider />
						        	<Link to="/subscription"><Dropdown.Item as="button" className="my-account-option">SUBSCRIPTION</Dropdown.Item></Link>
						        	<Dropdown.Divider />
						        	<Dropdown.Item onClick={() => this.logout()} as="button" className="my-account-option">LOG OUT</Dropdown.Item>
						      	</DropdownButton>
								<svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-bell" fill="#fff" xmlns="http://www.w3.org/2000/svg">
									<path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2z"/>
									<path fillRule="evenodd" d="M8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
								</svg>
							</Nav>
						)}
					</Navbar.Collapse>
				</Container>
			</Navbar>
		);
	}
}

export default withContext(Topbar);
