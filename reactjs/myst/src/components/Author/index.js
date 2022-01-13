import React from 'react';
import './styles.scss';
import { Button, Row, Col, Container } from 'react-bootstrap';
import {
  Link
} from "react-router-dom";
import Carousel, { consts } from 'react-elastic-carousel';

class Author extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	content: 'A new gothic Victorian tale from Laura Purcell, set on the atmospheric Cornish coast in a rambling house by the sea in which a maid cares for a mute old woman with a mysterious past, alongside her superstitious staff.'
		}
	}

	componentDidMount() {
		
	}
  

  	render() {
    	return (
      		<div className="author-detail">
      			<Row>
      				<Col className="col-icon" md="2" lg="2">
      					<svg width="62" height="53" viewBox="0 0 62 53" fill="none" xmlns="http://www.w3.org/2000/svg">
							<g clip-path="url(#clip0)">
							<path d="M3.30174 12.1787H0V44.1854H3.30174V12.1787Z" fill="white"/>
							<path d="M52.1146 40.9925H43.682V32.0396H40.3802V40.9925H17.6643V44.6856C17.6643 47.0358 16.3766 49.5702 13.656 49.5702C11.0146 49.5702 9.37033 47.0555 9.37033 44.6856V11.0661H40.3868V12.1786H43.6886V10.625V9.42032V1.64576C43.6886 0.7373 42.949 0 42.0377 0H1.65087C0.739589 0 0 0.7373 0 1.64576V8.86734H3.30174V3.29152H40.3802V7.77456H7.71286C6.80158 7.77456 6.06199 8.51186 6.06199 9.42032V44.6856C6.06199 48.7737 9.04015 52.1771 12.9494 52.8683C12.956 52.8683 12.956 52.8683 12.9626 52.8749C12.9956 52.8815 13.022 52.8815 13.0551 52.8881C13.2598 52.921 13.4579 52.9539 13.6626 52.9671C13.9135 52.9934 14.1578 53.0066 14.4022 53.0066H43.2593H43.7612C48.3704 53.0066 52.108 49.2806 52.108 44.6856V40.9925H52.1146Z" fill="white"/>
							<path d="M31.5189 17.708H16.0205V20.9995H31.5189V17.708Z" fill="#5E00F6"/>
							<path d="M23.7661 27.6426H17.123V30.9341H23.7661V27.6426Z" fill="#5E00F6"/>
							<path d="M50.2398 10.3227L34.0938 23.335L38.7768 29.1099L54.9228 16.0977L50.2398 10.3227Z" fill="white"/>
							<path d="M31.5381 25.4238L28.6523 32.494L36.1935 31.1642L31.5381 25.4238Z" fill="#5E00F6"/>
							<path d="M60.5275 11.6128C62.2378 10.2304 62.502 7.72223 61.1152 6.01722L61.0492 5.93822C60.3756 5.10876 59.4247 4.59528 58.3616 4.48337C57.2984 4.37146 56.2617 4.68086 55.4296 5.35233L53.8646 6.61628L52.0553 8.14354L57.0079 14.2855C58.1371 15.5429 57.4239 17.0438 57.1201 17.5507L43.8604 28.0243L45.914 30.6048L59.3917 19.9535C59.5106 19.8613 59.6162 19.7494 59.7087 19.6243C60.686 18.2617 61.8812 15.036 59.6625 12.3106L60.5275 11.6128ZM58.4474 9.052L56.8824 10.3159L55.9513 9.17049L57.5163 7.90655C57.6748 7.78147 57.8333 7.75514 57.9522 7.75514C57.9786 7.75514 58.005 7.75514 58.0248 7.76172C58.1305 7.77489 58.3352 7.82097 58.487 8.01188L58.5465 8.09087C58.7908 8.38053 58.7446 8.81501 58.4474 9.052Z" fill="white"/>
							</g>
							<defs>
							<clipPath id="clip0">
							<rect width="62" height="53" fill="white"/>
							</clipPath>
							</defs>
						</svg>

      				</Col>
      				<Col className="col-content">
      					<div className="title-author">
      						ABOUT THE AUTHOR(S)
      					</div>
      					<div className="content-author">
      						{ this.state.content }
      					</div>
      					<div className="more-author">
      						MORE...
      					</div>
      				</Col>
      			</Row>
      		</div>
      	);
  	}
}

export default Author;
