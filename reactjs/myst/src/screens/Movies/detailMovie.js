import React from 'react';
import './styles.scss';
import Topbar from '../../components/Topbar/index';
import MainItem from '../../components/MainItem/index';
import Cast from '../../components/Cast/index';
import Author from '../../components/Author/index';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import {
  Link
} from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieServices from '../../services/MovieServices';

class DetailMovie extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	mainItem: null
		}
	}

	async componentDidMount(){
		try {
			const movie = await MovieServices.getMovie(this.props.match.params.id);
			if(movie.title){
				this.setState({
					mainItem: {
						image: movie.image,
			    		category: movie.category,
			    		title: movie.title,
			    		author: movie.author,
			    		year: movie.year,
			    		resume: movie.resume,
			    		mins: movie.minutes,
			    		audio: movie.audio.join(', '),
			    		cc: movie.subtitles.join(', '),
			    		cast: movie.cast,
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
	          				<MainItem item={this.state.mainItem} type="detail-movie" />
	          			</Col>
	          		</Row>
	          		<Row>
	          			<Col className="cast-col">
	          				<Cast title="CAST & CREW" cast={this.state.mainItem.cast} />
	          			</Col>
	          		</Row>
	          		<Row>
	          			<Col className="author-col">
	          				<Author />
	          			</Col>
	          		</Row>
		    	</Container>
		    	)}
	        </div>
	    );
  	}
}

export default DetailMovie;
