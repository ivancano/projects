import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import './styles.scss';
import Topbar from '../../components/Topbar/index';
import MainItem from '../../components/MainItem/index';
import BannerSubscription from '../../components/BannerSubscription/index';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import {
  Link
} from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieServices from '../../services/MovieServices';

class ListMovies extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	mainItem: null,
	    	lastVisible: null,
	    	movies: []
		}
	}

	async componentDidMount(){
		const featuredMovie = await MovieServices.getFeaturedMovie();
		if(featuredMovie !== null){
			this.setState({
				mainItem: {
					image: featuredMovie.data.image,
		    		category: featuredMovie.data.category,
		    		title: featuredMovie.data.title,
		    		author: featuredMovie.data.cast,
		    		year: featuredMovie.data.year,
		    		id: featuredMovie.id
		    	}
	    	});
		}
		this.fetchData();
	}

	fetchData = async () => {
		const moviesObject = await MovieServices.getMovies(this.state.lastVisible);
		const oldMovies = this.state.movies;
		const newMovies = moviesObject.movies;
		const movies = oldMovies.concat(newMovies);
		this.setState({movies: movies, lastVisible: moviesObject.lastVisible});
	}
  

  	render() {

      	return (
	        <div className="container-list-movies">
	          	<Topbar />

	          	<Container fluid="lg">
	          		{ this.state.mainItem !== null && (
	          		<Row>
	          			<Col>
	          				<Link to={'movie/' + this.state.mainItem.id}><MainItem item={this.state.mainItem} type="list-movies" /></Link>
	          			</Col>
	          		</Row>
	          		)}

	          		<div className="list-movies">
	          			<InfiniteScroll
	        	  			dataLength={this.state.movies.length}
	        	  			next={this.fetchData}
	        	  			hasMore={true}
	        	  			loader={<div></div>}
	        	  		>
		        	  		<Grid container>
		        	  			{
		        	  				this.state.movies.length > 0 && this.state.movies.map((m, k) =>

		        	  				<Grid item xs={12} sm={6} md={4}>
							          	<Link to={'movie/' + m.id}>
								          	<Paper className="movie" style={{backgroundImage: `url(${m.data.image})`}}>
								          		<div className="container-data">
								      				<div className="titleMovie">
									      				{ m.data.title }
									      			</div>
									      			{ m.data.cast && m.data.cast.map((a) => (
									      				<div className="author">
										      				{a}
										      			</div>	
									      			))}
									      			<div className="year">
									      				{ m.data.year }
									      			</div>
								      			</div>
								          	</Paper>
								        </Link>
							        </Grid>
		        	  			)}
		        	  		</Grid>
		          		</InfiniteScroll>
		    		</div>
		    	</Container>
	        </div>
	    );
  	}
}

export default ListMovies;
