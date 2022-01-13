import React from 'react';
import './styles.scss';
import { Row, Col, Container } from 'react-bootstrap';
import {
  Link
} from "react-router-dom";
import { Player } from 'bitmovin-player';

class PlayerComponent extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	player: null
		}
	}

	playerConfig = {
      	key: process.env.REACT_APP_BITMOVIN_LICENSE,
      	location: {
        	ui: process.env.REACT_APP_BASE_URL + 'bitmovin/bitmovinplayer-ui.min.js',
	        ui_css: process.env.REACT_APP_BASE_URL + 'bitmovin/bitmovinplayer-ui.min.css',
      	},
  	};

	playerSource = {
      	//dash: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd',
      	hls: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
      	//progressive: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/MI201109210084_mpeg-4_hd_high_1080p25_10mbits.mp4',
      	poster: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/poster.jpg'
	};

	componentDidMount() {
    	this.setupPlayer();
	}

	componentWillUnmount() {
    this.destroyPlayer();
	}

	setupPlayer() {
  		const player = new Player(document.getElementById('player'), this.playerConfig);
  		player.load(this.playerSource).then(() => {
          	this.setState({
          		...this.state,
              	player
          	});
          	console.log('Successfully loaded source');
      	}, () => {
      		console.log('Error while loading source');
      	});
  	}

  	destroyPlayer() {
      	if (this.state.player != null) {
          	this.state.player.destroy();
          	this.setState({
              	...this.state,
              	player: null
          	});
      	}
  	}
  

  	render() {
        var linkGoBack = '/movie/' + this.props.match.params.id;
        if(this.props.match.params.episode !== undefined){
          linkGoBack = '/serie/' + this.props.match.params.id;
        }
        if(this.props.match.path === '/player/audio/:id'){
          linkGoBack = '/audio/' + this.props.match.params.id;
        }
      	return (
	        <div className="player-container">
	        	<Link to={linkGoBack} className="goBack">
	        		<svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-arrow-left-square" fill="#fff" xmlns="http://www.w3.org/2000/svg">
    					  <path fillRule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
    					  <path fillRule="evenodd" d="M8.354 11.354a.5.5 0 0 0 0-.708L5.707 8l2.647-2.646a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708 0z"/>
    					  <path fillRule="evenodd" d="M11.5 8a.5.5 0 0 0-.5-.5H6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 .5-.5z"/>
    					</svg>
	        	</Link>
    		    <div id="player"></div>      	
	        </div>
	    );
  	}
}

export default PlayerComponent;
