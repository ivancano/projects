import React from 'react';
import './styles.scss';
import { Button, Row, Col, Container } from 'react-bootstrap';
import {
  Link
} from "react-router-dom";
import Carousel, { consts } from 'react-elastic-carousel';

class Cast extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	breakPoints: [
		        { width: 420, itemsToShow: 2 },
		        { width: 576, itemsToShow: 2 },
		        { width: 768, itemsToShow: 2 },
		        { width: 992, itemsToShow: 4 },
			]
		}
	}

	componentDidMount() {
		
	}

	myArrow({ type, onClick, isEdge }) {
		var pointer = '';
		if(type === consts.PREV){
			pointer = (<svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-chevron-left" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg>)
		}
		else {
			pointer = (<svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-chevron-right" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg>)
		}
      	return (
	       	<a className="arrow-link" onClick={onClick} disabled={isEdge}>
	        	{ pointer }
	        </a>
      	)
    }
  

  	render() {
    	return (
      		<div className="cast">
      			<div className="title">
      				{this.props.title !== undefined && (this.props.title)}
      			</div>
      			<div className="carousel-cast">
      				<Carousel breakPoints={this.state.breakPoints} pagination={false} renderArrow={this.myArrow}>
      					{ this.props.cast.map((c, k) => 
      						<div className="cast-box">
						        <img
						          src={(c.image) ? c.image : process.env.REACT_APP_BASE_URL + 'c1.png'}
						        />
						        <div className="cast-name">{c}</div>
					      	</div>	
      					) }
				    </Carousel>
      			</div>
      		</div>
      	);
  	}
}

export default Cast;
