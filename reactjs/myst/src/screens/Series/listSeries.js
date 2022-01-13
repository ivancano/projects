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
import SerieServices from '../../services/SerieServices';

class ListSeries extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	mainItem: null,
	    	lastVisible: null,
	    	series: []
		}
	}

	async componentDidMount(){
		const featuredSerie = await SerieServices.getFeaturedSerie();
		if(featuredSerie !== null){
			this.setState({
				mainItem: {
					image: featuredSerie.data.image,
		    		category: featuredSerie.data.category,
		    		title: featuredSerie.data.title,
		    		author: featuredSerie.data.cast,
		    		year: featuredSerie.data.year,
		    		id: featuredSerie.id,
		    		seasons: featuredSerie.data.seasons
		    	}
	    	});
		}
		this.fetchData();
	}

	fetchData = async () => {
		const seriesObject = await SerieServices.getSeries(this.state.lastVisible);
		const oldSeries = this.state.series;
		const newSeries = seriesObject.series;
		const series = oldSeries.concat(newSeries);
		this.setState({series: series, lastVisible: seriesObject.lastVisible});
	}
  

  	render() {

      	return (
	        <div className="container-list-movies">
	          	<Topbar />

	          	<Container fluid="lg">
	          		{ this.state.mainItem !== null && (
	          		<Row>
	          			<Col>
	          				<Link to={'serie/' + this.state.mainItem.id}><MainItem item={this.state.mainItem} type="list-series" /></Link>
	          			</Col>
	          		</Row>
	          		)}

	          		<div className="list-movies">
	          			<InfiniteScroll
	        	  			dataLength={this.state.series.length}
	        	  			next={this.fetchData}
	        	  			hasMore={true}
	        	  			loader={<div></div>}
	        	  		>
        	  			<Grid container>
	        	  			{
	        	  				this.state.series.length > 0 && this.state.series.map((m, k) =>

	        	  				<Grid item xs={12} sm={6} md={4}>
						          	<Link to={'serie/' + m.id}>
							          	<Paper className="movie" style={{backgroundImage: `url(${m.data.image})`}}>
							          		<div className="container-data">
							      				<div className="titleMovie">
								      				{ m.data.title }
								      			</div>
								      			<div className="author">
								      				{ m.data.seasons.length } SEASONS
								      			</div>
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

export default ListSeries;
