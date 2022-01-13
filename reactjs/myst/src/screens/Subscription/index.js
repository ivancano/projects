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

class Subscription extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
			loading: false,
			currentPack: ''
		}
	}

	componentDidMount() {
		
	}
  

  	render() {

      	return (
	        <div className="container-subscription">
	        	<Loading show={this.state.loading} />
	          <Topbar />

	          <div className="subscription">
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
		          {this.props.user.plan && !this.props.user.plan.expired && (
		          <Row className="current-pack">
		          	<Col>
		          		<span>{this.props.user.plan.type}</span>
		          	</Col>
		          </Row>
		          )}
		          <Row className="title-subscription">
		          	<Col>
		          		<span>SUBSCRIPTION</span>
		          	</Col>
		          </Row>
		          {this.props.user.plan && !this.props.user.plan.expired && (
		          <Row className="text-subscription">
		          	<Col>
		          		<span>You have the {this.props.user.plan.type} suscription pack.</span>
		          	</Col>
		          </Row>
		          )}
		          <Row className="features">
		          	<Col>
		          		<div className="feature">
		          			<svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M1 7L7.5 14L15 1" stroke="#680FFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
							<span>Many contents per month</span>
		          		</div>
		          	</Col>
		          	<Col>
		          		<div className="feature">
		          			<svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M1 7L7.5 14L15 1" stroke="#680FFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
							<span>Watch on any device</span>
		          		</div>
		          	</Col>
		          	<Col>
		          		<div className="feature">
		          			<svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M1 7L7.5 14L15 1" stroke="#680FFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
							<span>Unlimited entertaiment</span>
		          		</div>
		          	</Col>
		          </Row>
		          <Row className="text-subscription">
		          	<Col>
		          		<span>If you want an upgrade, select the plan that works for you.</span>
		          	</Col>
		          </Row>
		          <Row className="plans">
		          	<Col sm={12} md={6} className="col-plan">
		          		<div className="plan">
		          			<div className="box">
		          				ANNUALLY <br /> $ 199.99
		          			</div>
		          			<Link to="/subscription/2"><Button>UPDATE</Button></Link>
		          		</div>
		          	</Col>
		          	<Col sm={12} md={6} className="col-plan">
		          		<div className="plan">
		          			<div className="box">
		          				MONTHLY <br /> $ 19.99
		          			</div>
		          			<Link to="/subscription/1"><Button>UPDATE</Button></Link>
		          		</div>
		          	</Col>
		          </Row>
		          <Row className="text-subscription last-item">
		          	<Col>
		          		<span>You may always <Link>cancel your subscription</Link></span>
		          	</Col>
		          </Row>
		        </div>
	        </div>
	    );
  	}
}

export default withContext(Subscription);
