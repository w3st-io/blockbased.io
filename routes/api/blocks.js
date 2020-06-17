/**
 * %%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCKS ROUTE %%% *
 * %%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const express = require('express')
const mongodb = require('mongodb')

// [REQUIRE] Personal //
require('dotenv').config()

// [INIT] //
const router = express.Router()


/******************* [CRUD] *******************/
// [CREATE] //
router.post('/create', async (req, res) => {
	const blocks = await loadBlocksCollection()
	await blocks.insertOne({
		createdAt: new Date(),
		cat_id: req.body.cat_id,
		user_id: req.body.user_id,
		email: req.body.email,
		username: req.body.username,
		title: req.body.title,
		voteCount: 0,
		voters: [],
	})

	res.status(201).send()
})


// [READ ALL] //
router.get('/read-all/:cat_id/:amountPerPage/:skip', async (req, res) => {
	let skip = parseInt(req.params.skip)
	let amountPerPage = parseInt(req.params.amountPerPage)
	
	const blocks = await loadBlocksCollection()
	let retrievedData = await blocks.find(
		{ cat_id: req.params.cat_id }
	)
	.skip(skip)
	.limit(amountPerPage)
	.toArray()

	res.send(retrievedData)
})


// [READ] //
router.get(`/read/:block_id`, async (req, res) => {
	const blocks = await loadBlocksCollection()
	let retrievedData = await blocks.findOne(
		{ _id: new mongodb.ObjectID(req.params.block_id) }
	)

	res.send(retrievedData)
})


/******************* [OTHER CRUD] *******************/
// [voters array] //
// [UPDATE] Push + Pull //
router.post('/update/push-voter/:id', async (req, res) => {
	const blocks = await loadBlocksCollection()

	blocks.updateOne(
		{ _id: new mongodb.ObjectID(req.params.id) },
		{ $push:
			{ 
				voters: {
					user_id: req.body.user_id,
					email: req.body.email,
					username: req.body.username,
				} 
			}
		},
		{ upsert: true }
	)

	res.status(201).send()
})
router.post('/update/pull-voter/:id', async (req, res) => {
	const blocks = await loadBlocksCollection()

	blocks.updateOne(
		{ _id: new mongodb.ObjectID(req.params.id) },
		{ $pull: { voters: { user_id: req.body.user_id } } },
		{ upsert: true }
	)

	res.status(201).send()
})


/** [VoteCount number field] **/
// [UPDATE] Increment + Decrement //
router.post('/update/increment-vote-count/:id', async (req, res) => {
	const blocks = await loadBlocksCollection()

	blocks.findOneAndUpdate(
		{ _id: new mongodb.ObjectID(req.params.id) },
		{ $inc: { voteCount: 1 } },
		{ upsert: true }
	)

	res.status(201).send()
})
router.post('/update/decrement-vote-count/:id', async (req, res) => {
	const blocks = await loadBlocksCollection()

	blocks.findOneAndUpdate(
		{ _id: new mongodb.ObjectID(req.params.id) },
		{ $inc: { voteCount: -1 } },
		{ upsert: true }
	)

	res.status(201).send()
})


/******************* [LOAD COLLECTION] blocks *******************/
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

	return client.db(db_name).collection(c_name)
}

// [EXPORT] //
module.exports = router