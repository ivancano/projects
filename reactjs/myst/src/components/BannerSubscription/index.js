import React from 'react';
import './styles.scss';
import { Button, Row, Col, Container } from 'react-bootstrap';
import {
  Link
} from "react-router-dom";

class BannerSubscription extends React.Component {

	constructor(props) {
	    super(props);
	    
	}
  

  	render() {
    	return (
      		<div className="banner-subscription d-none d-md-block">
      			<Container>
      				<Row>
      					<Col md="12" lg="8" className="mb-md-3">
      						<span className="title-1">STEP INTO THE UNKNOWN</span>
      						<br/>
      						<span className="title-2">SUBSCRIBE TO THE BEST and EERIE AUDIOs, SERIES & MOVIES</span>
      					</Col>
      					<Col className="col-button">
      						<Button className="button-try-free">TRY 14 DAYS FREE</Button>
      					</Col>
      				</Row>
      			</Container>
      		</div>
      	);
  	}
}

export default BannerSubscription;
