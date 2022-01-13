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
import AudioServices from '../../services/AudioServices';

class ListAudios extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	mainItem: null,
	    	lastVisible: null,
	    	audios: []
		}
	}

	async componentDidMount(){
		const featuredAudio = await AudioServices.getFeaturedAudio();
		if(featuredAudio !== null){
			this.setState({
				mainItem: {
					image: featuredAudio.data.image,
		    		category: featuredAudio.data.category,
		    		title: featuredAudio.data.title,
		    		author: featuredAudio.data.author,
		    		year: featuredAudio.data.year,
		    		id: featuredAudio.id,
		    		parts: featuredAudio.data.parts,
		    		minutes: featuredAudio.data.minutes
		    	}
	    	});
		}
		this.fetchData();
	}

	fetchData = async () => {
		const audiosObject = await AudioServices.getAudios(this.state.lastVisible);
		const oldAudios = this.state.audios;
		const newAudios = audiosObject.audios;
		const audios = oldAudios.concat(newAudios);
		this.setState({audios: audios, lastVisible: audiosObject.lastVisible});
	}
  

  	render() {

      	return (
	        <div className="container-list-movies">
	          	<Topbar />

	          	<Container fluid="lg">
	          		{ this.state.mainItem !== null && (
	          		<Row>
	          			<Col>
	          				<Link to={'audio/' + this.state.mainItem.id}><MainItem item={this.state.mainItem} type="list-audios" /></Link>
	          			</Col>
	          		</Row>
	          		)}

	          		<div className="list-movies">
	          			<InfiniteScroll
	        	  			dataLength={this.state.audios.length}
	        	  			next={this.fetchData}
	        	  			hasMore={true}
	        	  			loader={<div></div>}
	        	  		>
		        	  	<Grid container>
	        	  			{
	        	  				this.state.audios.length > 0 && this.state.audios.map((m, k) =>

	        	  				<Grid item xs={12} sm={6} md={4}>
						          	<Link to={'audio/' + m.id}>
							          	<Paper className="movie" style={{backgroundImage: `url(${m.data.image})`}}>
							          		<div className="container-data">
							      				<div className="titleMovie">
								      				{ m.data.title }
								      			</div>
								      			<div className="author">
								      				{ m.data.author[0] }
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

export default ListAudios;
