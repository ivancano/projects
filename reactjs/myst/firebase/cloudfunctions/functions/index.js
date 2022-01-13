const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


const admin = require('firebase-admin');
admin.initializeApp();
const { Logging } = require('@google-cloud/logging');
const logging = new Logging({
  projectId: process.env.GCLOUD_PROJECT,
});
const stripe = require('stripe')(functions.config().stripe.secret);
const cors = require('cors')({origin: true});


exports.createStripeCharge = functions.https.onRequest(async (req, res) => {
	cors(req, res, async () => {
		const token = req.query.token;
		const type = req.query.type;
		let amount = 1999;
		let description = 'Monthly Payment';
		if(type === '2') {
			amount = 19999;
			description = ' Annual Payment';
		}
		const charge = await stripe.charges.create({
					  		amount: amount,
					  		currency: 'usd',
					  		description: description,
					  		source: token,
						});
	    return res.status(200).send({status: charge.status, id: charge.id, type: type});
   	})
});
