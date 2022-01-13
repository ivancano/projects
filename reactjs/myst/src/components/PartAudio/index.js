import React from 'react';
import './styles.scss';
import { Button, Row, Col, Container } from 'react-bootstrap';
import {
  Link
} from "react-router-dom";
import Carousel, { consts } from 'react-elastic-carousel';

class PartAudio extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	breakPoints: [
		        { width: 420, itemsToShow: 2 },
		        { width: 576, itemsToShow: 3 },
		        { width: 768, itemsToShow: 5 },
		        { width: 992, itemsToShow: 7 },
		    ],
		    parts: []
		}
	}

	componentDidMount() {
		let parts = [];
		this.props.parts.forEach((s, k) => {
			if(k === 0){
				s.show = true;
			}
			else {
				s.show = false;
			}
			parts.push(s);
		})
		this.setState({parts: parts});
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

    renderCarouselSeason(chapter) {
    	return (
    		<div className="season-box">
		        <img
		          src={chapter.image}
		        />
		        <div className="season-name">{chapter.title} <br /> CHAPTER {chapter.number}</div>
		        <div className="play-button-container">
		        	<Link to={'/player/audio/'+this.props.audioId} className="play-button">
			        	<svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-play-fill" fill="#fff" xmlns="http://www.w3.org/2000/svg">
						  <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
						</svg>
					</Link>	
		        </div>
	      	</div>	
    	);
    }

    selectPart(partNumber) {
    	var parts = this.state.parts;
    	for (var i = parts.length - 1; i >= 0; i--) {
    		parts[i].show = false;
    		if(parts[i].number == partNumber){
    			parts[i].show = true;
    		}
    	}
    	this.setState({parts: parts});
    }
  

  	render() {
    	return (
      		<div className="season">
      			<div className="title">
      				PART 
      				<div className="seasons">
	      				{this.state.parts.length > 0 && this.state.parts.map(s => 
	      					<a className={(!s.show) ? 'number-season' : 'number-season active'} onClick={() => this.selectPart(s.number)}>{s.number}</a>
	      				)}
	      			</div>
      			</div>
      			<div className="carousel-season">
  					{ this.state.parts.map((s, k) => 
						<Carousel className={(!s.show) ? 'd-none' : ''} breakPoints={this.state.breakPoints} pagination={false} renderArrow={this.myArrow}>
							{ s.chapters.map((e) => 
								this.renderCarouselSeason(e)
							)}
						</Carousel>
  					) }
      			</div>
      		</div>
      	);
  	}
}

export default PartAudio;
