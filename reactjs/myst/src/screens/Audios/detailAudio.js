import React from 'react';
import './styles.scss';
import Topbar from '../../components/Topbar/index';
import MainItem from '../../components/MainItem/index';
import Cast from '../../components/Cast/index';
import PartAudio from '../../components/PartAudio/index';
import Author from '../../components/Author/index';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import {
  Link
} from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import AudioServices from '../../services/AudioServices';

class DetailAudio extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	mainItem: null
		}
	}

	async componentDidMount(){
		try {
			const audio = await AudioServices.getAudio(this.props.match.params.id);
			if(audio.title){
				this.setState({
					mainItem: {
						image: audio.image,
			    		category: audio.category,
			    		title: audio.title,
			    		author: audio.author,
			    		year: audio.year,
			    		resume: audio.resume,
			    		minutes: audio.minutes,
			    		audio: audio.audio.join(', '),
			    		cc: audio.subtitles.join(', '),
			    		parts: audio.parts,
			    		cast: audio.cast,
			    		id: this.props.match.params.id
					}
				});
			}
		} catch(err) {
			this.props.history.push('/404');
		}
	}
  

  	render() {

      	return (
	        <div className="container-list-movies">
	          	<Topbar />

	          	{ this.state.mainItem !== null && (
	          	<Container fluid="lg">
	          		<Row>
	          			<Col>
	          				<MainItem item={this.state.mainItem} type="detail-audio" />
	          			</Col>
	          		</Row>
	          		<Row>
	          			<Col className="cast-col">
	          				<PartAudio parts={this.state.mainItem.parts} audioId={this.props.match.params.id}/>
	          			</Col>
	          		</Row>
	          		<Row>
	          			<Col className="cast-col">
	          				<Cast title="AUTHORS" cast={this.state.mainItem.cast} />
	          			</Col>
	          		</Row>
	          		<Row>
	          			<Col className="author-col">
	          				<Author />
	          			</Col>
	          		</Row>
		    	</Container>
		    	)};
	        </div>
	    );
  	}
}

export default DetailAudio;
