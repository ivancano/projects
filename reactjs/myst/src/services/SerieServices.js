import { auth, firestore, persistence } from './FirebaseService';

const SerieServices = {

	getSeries: (lastVisible) => {
		return new Promise(async (resolve, reject) => {
			try {
		    	const userRef = firestore.collection('series')
		    					.orderBy('year')
		    					.startAfter(lastVisible)
		    					.limit(6);
		    	const snapshot = await userRef.get();
		    	var result = {series: [], lastVisible: null}
		    	snapshot.forEach((doc) => {
		    		const data = doc.data();
		    		if(data.featured !== true){
		    			result.series.push({id: doc.id, data: data});
		    		}
				});
				result.lastVisible = snapshot.docs[snapshot.docs.length - 1];
				resolve(result);
			} catch (error) {
		      	reject(error.message);
		    }
		})
	},
	getFeaturedSerie: () => {
		return new Promise(async (resolve, reject) => {
			try {
		    	const userRef = firestore.collection('series')
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
	getSerie: (id) => {
		return new Promise(async (resolve, reject) => {
			try {
		    	const userRef = firestore.collection('series')
		    					.doc(id);
		    	const snapshot = await userRef.get();
		    	const data = snapshot.data();
				resolve(data);
			} catch (error) {
		      	reject(error.message);
		    }
		})
	},
	/*cloneSeries: () => {
		return new Promise(async (resolve, reject) => {
			try {
		    	const userRef = firestore.collection('series');
		    	const snapshot = await userRef.get();
		    	var result = [];
		    	snapshot.forEach(async (doc) => {
		    		const data = doc.data();
		    		const docRef = await firestore.collection('series').add({
		    			audio: ['English', 'Spanish'],
		    			author: ["Vince Gilligan", "Michelle MacLaren"],
		    			cast: ["Bryan Cranston", "Aaron Paul", "Anna Gunn"],
		    			category: "Thriller - Drama",
		    			image: "https://firebasestorage.googleapis.com/v0/b/tribesmedia-myst.appspot.com/o/breaking_bad_tv_series-504442815-large.jpg?alt=media&token=370e3a4c-8f14-450a-9e25-854de7c2dae0",
		    			minutes: '45',
		    			quality: 'HD',
		    			year: '2008',
		    			subtitles: ['Spanish', 'English'],
		    			title: 'Breaking Bad',
		    			resume: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		    			seasons: [
		    				{ 
		    					number: '01', 
		    					episodes: [
		    						{
		    							number: '01',
		    							title: "Pilot",
		    							image: "https://firebasestorage.googleapis.com/v0/b/tribesmedia-myst.appspot.com/o/breaking_bad_tv_series-504442815-large.jpg?alt=media&token=370e3a4c-8f14-450a-9e25-854de7c2dae0",
		    						},
		    						{
		    							number: '02',
		    							title: "Cat's in the Bag...",
		    							image: "https://firebasestorage.googleapis.com/v0/b/tribesmedia-myst.appspot.com/o/breaking_bad_tv_series-504442815-large.jpg?alt=media&token=370e3a4c-8f14-450a-9e25-854de7c2dae0",
		    						},
		    						{
		    							number: '03',
		    							title: "...And the Bag's in the River",
		    							image: "https://firebasestorage.googleapis.com/v0/b/tribesmedia-myst.appspot.com/o/breaking_bad_tv_series-504442815-large.jpg?alt=media&token=370e3a4c-8f14-450a-9e25-854de7c2dae0",
		    						}
		    					]
		    				},
		    				{ 
		    					number: '02', 
		    					episodes: [
		    						{
		    							number: '01',
		    							title: "Seven Thirty-Seven",
		    							image: "https://firebasestorage.googleapis.com/v0/b/tribesmedia-myst.appspot.com/o/breaking_bad_tv_series-504442815-large.jpg?alt=media&token=370e3a4c-8f14-450a-9e25-854de7c2dae0",
		    						},
		    						{
		    							number: '02',
		    							title: "Grilled",
		    							image: "https://firebasestorage.googleapis.com/v0/b/tribesmedia-myst.appspot.com/o/breaking_bad_tv_series-504442815-large.jpg?alt=media&token=370e3a4c-8f14-450a-9e25-854de7c2dae0",
		    						},
		    						{
		    							number: '03',
		    							title: "Bit by a Dead Bee",
		    							image: "https://firebasestorage.googleapis.com/v0/b/tribesmedia-myst.appspot.com/o/breaking_bad_tv_series-504442815-large.jpg?alt=media&token=370e3a4c-8f14-450a-9e25-854de7c2dae0",
		    						}
		    					]
		    				},
		    				{ 
		    					number: '03', 
		    					episodes: [
		    						{
		    							number: '01',
		    							title: "No Más",
		    							image: "https://firebasestorage.googleapis.com/v0/b/tribesmedia-myst.appspot.com/o/breaking_bad_tv_series-504442815-large.jpg?alt=media&token=370e3a4c-8f14-450a-9e25-854de7c2dae0",
		    						},
		    						{
		    							number: '02',
		    							title: "Caballo sin Nombre",
		    							image: "https://firebasestorage.googleapis.com/v0/b/tribesmedia-myst.appspot.com/o/breaking_bad_tv_series-504442815-large.jpg?alt=media&token=370e3a4c-8f14-450a-9e25-854de7c2dae0",
		    						},
		    						{
		    							number: '03',
		    							title: "I.F.T.",
		    							image: "https://firebasestorage.googleapis.com/v0/b/tribesmedia-myst.appspot.com/o/breaking_bad_tv_series-504442815-large.jpg?alt=media&token=370e3a4c-8f14-450a-9e25-854de7c2dae0",
		    						}
		    					]
		    				}
		    			]
		    		});
				})
				resolve(result);
			} catch (error) {
		      	reject(error.message);
		    }
		})
	}*/

}

export default SerieServices;