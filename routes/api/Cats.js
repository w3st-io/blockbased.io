/**
 * %%%%%%%%%%%%%%%%%% *
 * %%% CATS ROUTE %%% *
 * %%%%%%%%%%%%%%%%%% *
*/
/*** [REQUIRE] ***/
const express = require('express')
const mongodb = require('mongodb')

/*** [REQUIRE] Personal ***/
require('dotenv').config()

/*** [INIT] ***/
const router = express.Router()

// [CREATE] //
router.post('/create', async (req, res) => {
	const blocks = await loadBlocksCollection()
	await blocks.insertOne({
		cat_id: req.body.cat_id,
		title: req.body.title,
		createdAt: new Date()
	})

	// Set Status // [RES SEND] //
	res.status(201).send()
})

// [READ ALL] //
router.get('/read-all', async (req, res) => {
	const blocks = await loadBlocksCollection()
	let retrievedData = await blocks.find().project({ ss: 0 }).toArray()

	// [RES SEND] //
	res.send(retrievedData)
})

/*** [FUNCTION] Blocks Collection ***/
async function loadBlocksCollection() {
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'db_name'
	const c_name = 'blocks'
	
	const client = await mongodb.MongoClient.connect(
		uri,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)

	// [RETURN] //
	return client.db(db_name).collection(c_name)
}

/*** [EXPORT] ***/
module.exports = router