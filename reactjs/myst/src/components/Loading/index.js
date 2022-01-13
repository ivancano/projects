import React from 'react';
import './styles.scss';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import variables from '../../styles/_variables.scss';

class Loading extends React.Component {
  
	
  render() {
      return (
        <div className={this.props.show ? 'loading-container' : 'loading-container d-none'}>
        	<Loader
		        type="Puff"
		        color={variables.primary_color}
		        height={100}
		        width={100}
		 
		    />
        </div>
      );
  }
}

export default Loading;
