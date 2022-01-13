import { auth, firestore, persistence } from './FirebaseService';

const UserServices = {

	createUser: (email, password) => {
		return new Promise(async (resolve, reject) => {
			try {
				const {user} = await auth.createUserWithEmailAndPassword(email, password);
		    	const userRef = firestore.doc(`users/${user.uid}`);
		    	const snapshot = await userRef.get();
		    	if (!snapshot.exists) {
		    		const currentTime = Date.now();
				    try {
				    	await userRef.set({
				        	created_at: currentTime,
				        	updated_at: currentTime,
				      	});
				      	resolve(); 
				    } catch (error) {
				      	reject("Error creating user");
				    }
				}
				else {
					reject("Error creating user");
				}
			} catch (error) {
		      	reject(error.message);
		    }
		})
	},
	getUserData: (uid) => {
		return new Promise(async (resolve, reject) => {
			try {
		    	const userRef = firestore.doc(`users/${uid}`);
		    	const snapshot = await userRef.get();
		    	if (!snapshot.exists) {
		    		reject();
				}
				else {
					resolve(snapshot.data());
				}
			} catch (error) {
		      	reject(error.message);
		    }
		})
	},
	login: (email, password) => {
		return new Promise((resolve, reject) => {
			auth.setPersistence(persistence.session)
			.then(() => {
				auth.signInWithEmailAndPassword(email, password)
				.then(() => {
					resolve();
				})
				.catch(error => {
			      	reject(error);
			    });
			})
			.catch(error => {
		      	reject(error);
		    });
		});
	},
	logout: () => {
		return new Promise((resolve, reject) => {
			auth.signOut()
			.then(() => {
				resolve();
			})
			.catch(error => {
		      	reject(error);
		    });
		});
	},
	updateUser: (email, password) => {
		return new Promise((resolve, reject) => {
			var user = auth.currentUser;
			user.updateEmail(email).then(() => {
		    	resolve();
		    })
		    .catch((error) => { 
		    	reject(error)
		    });
		    if(password.length > 0){
		    	user.updatePassword(password).then(() => {
			    	resolve();
			    })
			    .catch((error) => { 
			    	reject(error)
			    });
		    }
		});
	},
	resetPassword: (email) => {
		return new Promise((resolve, reject) => {
			auth
	      	.sendPasswordResetEmail(email)
	      	.then(() => {
	        	resolve();
	      	})
	    	.catch((error) => {
	        	reject(error);
	      	});
		});	
	},
	pay: (user, payment) => {
		return new Promise(async (resolve, reject) => {
			const currentTime = Date.now();
		    try {
		    	const docRef = await firestore.collection('payments').add({
					payment: payment.id,
					uid: user.uid,
					type: payment.type,
					created_at: currentTime,
		        	updated_at: currentTime,
				});
		      	resolve(); 
		    } catch (error) {
		      	reject("Error creating payment");
		    }
		})
	},
	getCurrentPlan: (uid) => {
		return new Promise(async (resolve, reject) => {
			try {
		    	const userRef = firestore.collection('payments')
		    					.where('uid', '==', uid)
		    					.orderBy('created_at', 'desc')
		    					.limit(1);
		    	const snapshot = await userRef.get();
		    	var result = {type: null, expired: true};
		    	snapshot.forEach((doc) => {
		    		const data = doc.data();
		    		const now = Date.now();
		    		var msDiff =  now - data.created_at;
					var daysTill30June2035 = Math.floor(msDiff / (1000 * 60 * 60 * 24));
					if(data.type === '1' && daysTill30June2035 <= 30){ // Monthly
						result = {type: 'Monthly', expired: false}
					}
					else if(data.type === '2' && daysTill30June2035 <= 365){ // Annually
						result = {type: 'Annually', expired: false}
					}
				})
				resolve(result);
			} catch (error) {
		      	reject(error.message);
		    }
		})
	},
}

export default UserServices;