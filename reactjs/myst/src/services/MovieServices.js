import { auth, firestore, persistence } from './FirebaseService';

const MovieServices = {

	getMovies: (lastVisible) => {
		return new Promise(async (resolve, reject) => {
			try {
		    	const userRef = firestore.collection('movies')
		    					.orderBy('year')
		    					.startAfter(lastVisible)
		    					.limit(6);
		    	const snapshot = await userRef.get();
		    	var result = {movies: [], lastVisible: null}
		    	snapshot.forEach((doc) => {
		    		const data = doc.data();
		    		if(data.featured !== true){
		    			result.movies.push({id: doc.id, data: data});
		    		}
				});
				result.lastVisible = snapshot.docs[snapshot.docs.length - 1];
				resolve(result);
			} catch (error) {
		      	reject(error.message);
		    }
		})
	},
	getFeaturedMovie: () => {
		return new Promise(async (resolve, reject) => {
			try {
		    	const userRef = firestore.collection('movies')
		    					.where('featured', '==', true)
		    					.limit(1);
		    	const snapshot = await userRef.get();
		    	var result = null;
		    	snapshot.forEach((doc) => {
		    		const data = doc.data();
		    		result = {id: doc.id, data: data};
				});
				resolve(result);
			} catch (error) {
		      	reject(error.message);
		    }
		})
	},
	getMovie: (id) => {
		return new Promise(async (resolve, reject) => {
			try {
		    	const userRef = firestore.collection('movies')
		    					.doc(id);
		    	const snapshot = await userRef.get();
		    	const data = snapshot.data();
				resolve(data);
			} catch (error) {
		      	reject(error.message);
		    }
		})
	},
	/*cloneMovies: () => {
		return new Promise(async (resolve, reject) => {
			try {
		    	const userRef = firestore.collection('movies');
		    	const snapshot = await userRef.get();
		    	var result = [];
		    	snapshot.forEach(async (doc) => {
		    		const data = doc.data();
		    		const docRef = await firestore.collection('movies').add(data);
				})
				resolve(result);
			} catch (error) {
		      	reject(error.message);
		    }
		})
	}*/

}

export default MovieServices;