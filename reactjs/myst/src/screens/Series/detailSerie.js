import React from 'react';
import './styles.scss';
import Topbar from '../../components/Topbar/index';
import MainItem from '../../components/MainItem/index';
import Cast from '../../components/Cast/index';
import Season from '../../components/Season/index';
import Author from '../../components/Author/index';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import {
  Link
} from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import SerieServices from '../../services/SerieServices';

class DetailSerie extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	mainItem: null
		}
	}

	async componentDidMount(){
		try {
			const serie = await SerieServices.getSerie(this.props.match.params.id);
			if(serie.title){
				this.setState({
					mainItem: {
						image: serie.image,
			    		category: serie.category,
			    		title: serie.title,
			    		author: serie.author,
			    		year: serie.year,
			    		resume: serie.resume,
			    		mins: serie.minutes,
			    		audio: serie.audio.join(', '),
			    		cc: serie.subtitles.join(', '),
			    		cast: serie.cast,
			    		seasons: serie.seasons,
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
	          				<MainItem item={this.state.mainItem} type="detail-serie" />
	          			</Col>
	          		</Row>
	          		<Row>
	          			<Col className="cast-col">
	          				<Season seasons={this.state.mainItem.seasons} serieId={this.props.match.params.id}/>
	          			</Col>
	          		</Row>
	          		<Row>
	          			<Col className="cast-col">
	          				<Cast title="CAST & CREW" cast={this.state.mainItem.cast}/>
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

export default DetailSerie;
