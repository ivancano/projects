import React from 'react';
import './styles.scss';
import { Button, Row, Col, Container } from 'react-bootstrap';
import {
  Link
} from "react-router-dom";

class MainItem extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	heightScreen: 0,
    		image: '',
    		category: '',
    		title: '',
    		author: [],
    		year: '',
    		resume: '',
    		minutes: '',
    		audio: '',
    		cc: '',
    		seasons: ''
		}
	}

	componentDidMount() {
		this.updateWindowDimensions();
  		window.addEventListener('resize', this.updateWindowDimensions);
		
		if(this.props.item){
			this.setState({
				image: this.props.item.image,
	    		category: this.props.item.category,
	    		title: this.props.item.title,
	    		author: this.props.item.author,
	    		year: this.props.item.year,
	    		resume: (this.props.item.resume) ? this.props.item.resume : '',
	    		minutes: (this.props.item.minutes) ? this.props.item.minutes : '',
	    		audio: (this.props.item.audio) ? this.props.item.audio : '',
	    		cc: (this.props.item.cc) ? this.props.item.cc : '',
	    		seasons: (this.props.item.seasons) ? this.props.item.seasons : '',
			});
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions = () => {
	  	this.setState({ heightScreen: window.innerHeight });
	}
  

  	render() {
  		var link = '/player/movie/' + this.props.item.id;
  		if(this.props.type === 'detail-serie' && this.state.seasons.length > 0){
  			link = '/player/serie/' + this.props.item.id + '/episode/' + this.state.seasons[0].episodes[0].number;
  		}
  		if(this.props.type === 'detail-audio'){
  			link = '/player/audio/' + this.props.item.id;
  		}
    	return (
      		<div className="main-item" style={{backgroundImage: `url(${this.state.image})`, height: (this.state.heightScreen / 1.5 )}}>
      			<Row>
      				<Col className="container-data">
      					{ (this.props.type === 'list-audios' || this.props.type === 'list-movies' || this.props.type === 'list-series') && (
		      				<div className="category">
			      				{ this.state.category }
			      			</div>
		      			)}
		      			{ (this.props.type === 'detail-movie' || this.props.type === 'detail-serie' || this.props.type === 'detail-audio') && (
		      				<Row className="row-play-category">
		      					<Col>
		      						<div className="category">
					      				{ this.state.category }
					      			</div>
		      					</Col>
		      					<Col>
		      						<Link to={link} className="play-button">
					      				<div className="play">
					      					<svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-play-fill" fill="#fff" xmlns="http://www.w3.org/2000/svg">
											  <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
											</svg>
										</div>
										<div className="label">
											PLAY
										</div>
					      			</Link>
		      					</Col>
		      				</Row>
		      			)}
		      			<div className="title">
		      				{ this.state.title }
		      			</div>
		      			{ (this.props.type === 'list-movies' || this.props.type === 'list-audios' || this.props.type === 'detail-audio') && this.state.author && this.state.author.map((a) => (
		      				<div className="author">
			      				{a}
			      			</div>	
		      			))}
		      			{ this.props.type === 'list-series' && (
			      			<div className="author">
			      				{ this.state.seasons.length } SEASONS
			      			</div>
		      			)}
		      			{ (this.props.type === 'list-movies' || this.props.type === 'list-series' || this.props.type === 'list-audios') && (
			      			<div className="year list-year">
			      				{ this.state.year }
			      			</div>
		      			)}
		      			{ this.props.type === 'detail-movie' && (
			      			<div className="year detail-year">
			      				{ this.state.year }
			      			</div>
		      			)}
		      			{ this.props.type === 'list-audios' && (
			      			<div className="year list-year">
			      				{ this.state.minutes } MINUTES
			      			</div>
		      			)}
		      			{ this.props.type === 'detail-serie' && (
			      			<div className="year detail-year">
			      				{ this.state.year } { this.state.seasons.length } SEASONS
			      			</div>
		      			)}
		      			{ (this.props.type === 'detail-movie' || this.props.type === 'detail-serie' || this.props.type === 'detail-audio') && (
			      			<div className="resume">
			      				{ this.state.resume }
			      			</div>
		      			)}
		      			{ (this.props.type === 'detail-movie' || this.props.type === 'detail-serie') && (
			      			<div className="extra">
			      				<div className="quality">
			      					<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-badge-hd-fill" fill="#fff" xmlns="http://www.w3.org/2000/svg">
									  <path d="M10.53 5.968h-.843v4.06h.843c1.117 0 1.622-.667 1.622-2.02 0-1.354-.51-2.04-1.622-2.04z"/>
									  <path fillRule="evenodd" d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm5.396 3.001V11H6.209V8.43H3.687V11H2.5V5.001h1.187v2.44h2.522V5h1.187zM8.5 11V5.001h2.188c1.824 0 2.685 1.09 2.685 2.984C13.373 9.893 12.5 11 10.69 11H8.5z"/>
									</svg>
			      				</div>
			      				<div className="mins">
		      						<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-clock" fill="#fff" xmlns="http://www.w3.org/2000/svg">
									  <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm8-7A8 8 0 1 1 0 8a8 8 0 0 1 16 0z"/>
									  <path fillRule="evenodd" d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"/>
									</svg>
			      					{ this.state.minutes }'
			      				</div>
			      				<div className="audio">
			      					<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-volume-down-fill" fill="#fff" xmlns="http://www.w3.org/2000/svg">
									  <path fillRule="evenodd" d="M8.717 3.55A.5.5 0 0 1 9 4v8a.5.5 0 0 1-.812.39L5.825 10.5H3.5A.5.5 0 0 1 3 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
									  <path d="M10.707 11.182A4.486 4.486 0 0 0 12.025 8a4.486 4.486 0 0 0-1.318-3.182L10 5.525A3.489 3.489 0 0 1 11.025 8c0 .966-.392 1.841-1.025 2.475l.707.707z"/>
									</svg>
			      					{ this.state.audio }
			      				</div>
			      				<div className="cc">
			      					<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-badge-cc-fill" fill="#fff" xmlns="http://www.w3.org/2000/svg">
									  <path fillRule="evenodd" d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm3.027 4.002c-.83 0-1.319.642-1.319 1.753v.743c0 1.107.48 1.727 1.319 1.727.69 0 1.138-.435 1.186-1.05H7.36v.114c-.057 1.147-1.028 1.938-2.342 1.938-1.613 0-2.518-1.028-2.518-2.729v-.747C2.5 6.051 3.414 5 5.018 5c1.318 0 2.29.813 2.342 2v.11H6.213c-.048-.638-.505-1.108-1.186-1.108zm6.14 0c-.831 0-1.319.642-1.319 1.753v.743c0 1.107.48 1.727 1.318 1.727.69 0 1.139-.435 1.187-1.05H13.5v.114c-.057 1.147-1.028 1.938-2.342 1.938-1.613 0-2.518-1.028-2.518-2.729v-.747c0-1.7.914-2.751 2.518-2.751 1.318 0 2.29.813 2.342 2v.11h-1.147c-.048-.638-.505-1.108-1.187-1.108z"/>
									</svg>
			      					{ this.state.cc }
			      				</div>
			      			</div>
		      			)}
		      			{ (this.props.type === 'detail-audio') && (
			      			<div className="extra">
			      				<div className="mins">
		      						<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-clock" fill="#fff" xmlns="http://www.w3.org/2000/svg">
									  <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm8-7A8 8 0 1 1 0 8a8 8 0 0 1 16 0z"/>
									  <path fillRule="evenodd" d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"/>
									</svg>
			      					{ this.state.minutes }'
			      				</div>
			      				<div className="audio">
			      					<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-volume-down-fill" fill="#fff" xmlns="http://www.w3.org/2000/svg">
									  <path fillRule="evenodd" d="M8.717 3.55A.5.5 0 0 1 9 4v8a.5.5 0 0 1-.812.39L5.825 10.5H3.5A.5.5 0 0 1 3 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
									  <path d="M10.707 11.182A4.486 4.486 0 0 0 12.025 8a4.486 4.486 0 0 0-1.318-3.182L10 5.525A3.489 3.489 0 0 1 11.025 8c0 .966-.392 1.841-1.025 2.475l.707.707z"/>
									</svg>
			      					{ this.state.audio }
			      				</div>
			      			</div>
		      			)}
      				</Col>
      			</Row>
      		</div>
      	);
  	}
}

export default MainItem;
