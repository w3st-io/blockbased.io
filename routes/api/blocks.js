/**
 * %%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
require('dotenv').config()


// [REQUIRE] Personal //
const rateLimiter = require('../../rate-limiters')
const blocksCollection = require('../../server-collections/blocksCollection')
const blockFollowersCollection = require('../../server-collections/blockFollowersCollection')
const blockLikesCollection = require('../../server-collections/blockLikesCollection')
const commentsCollection = require('../../server-collections/commentsCollection')
const Auth = require('../../server-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userToken(),
	rateLimiter.blockLimiter,
	async (req, res) => {
		const returned = await blocksCollection.c_create(
			req.decoded._id,
			req.body.cat_id,
			req.body.title
		)
		const returned2 = await commentsCollection.c_create(
			req.decoded._id,
			returned.createdBlock._id,
			req.body.text
		)

		const created = {
			status: true,
			created: [returned, returned2],
		}

		res.status(201).send(created)
	}
)


// [READ-ALL] Within Cat //
router.get(
	'/read-all/:cat_id/:amount/:skip',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		const returned = await blocksCollection.c_readAll(
			req.params.cat_id,
			req.params.skip,
			req.params.amount
		)

		// For Each Block in Blocks //
		for (let i = 0; i < returned.blocks.length; i++) {
			// Like Count //
			try {
				const count = await blockLikesCollection.c_countAll(
					returned.blocks[i]._id
				)

				returned.blocks[i].likeCount = count.count
			}
			catch (e) { console.log(`Caught Error --> ${e}`) }

			// Follow Count //
			try {
				const count = await blockFollowersCollection.c_countAll(
					returned.blocks[i]._id
				)

				returned.blocks[i].followersCount = count.count
			}
			catch (e) { console.log(`Caught Error --> ${e}`) }

			// Comment Count //
			try {
				const count = await commentsCollection.c_countAll(
					returned.blocks[i]._id
				)

				returned.blocks[i].commentCount = count.count
			}
			catch (e) { console.log(`Caught Error --> ${e}`) }

			// If User Logged In.. //
			if (req.decoded) {
				// Liked Status //
				const liked = await blockLikesCollection.c_existance(
					req.decoded._id,
					returned.blocks[i]._id
				)

				// Follwed Status //
				const followed = await blockFollowersCollection.c_existance(
					req.decoded._id,
					returned.blocks[i]._id
				)
				
				returned.blocks[i].liked = liked.existance
				returned.blocks[i].followed = followed.existance
			}
		}

		// Set Total Blocks & Total Pages //
		returned.totalBlocks = 12
	
		res.status(200).send(returned)
	}
)


// [READ] Single Block //
router.get(
	'/read/:_id',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		let returned = await blocksCollection.c_read(req.params._id)

		// Set Like Count //
		try {
			const count = await blockLikesCollection.c_countAll(
				returned.block._id
			)

			returned.block.likeCount = count.count
		}
		catch (e) { console.log(`Caught Error --> ${e}`) }

		// Follow Count //
		try {
			const count = await blockFollowersCollection.c_countAll(
				returned.block._id
			)

			returned.block.followersCount = count.count
		}
		catch (e) { console.log(`Caught Error --> ${e}`) }

		// If User Logged In.. //
		if (req.decoded) {
			// Liked Status //
			const liked = await blockLikesCollection.c_existance(
				req.decoded._id,
				returned.block._id
			)

			returned.block.liked = liked.existance

			// Follwed Status //
			try {
				const followed = await blockFollowersCollection.c_existance(
					req.decoded._id,
					returned.block._id
				)

				returned.block.followed = followed.existance
			}
			catch (e) { console.log(e) }
		}

		res.status(200).send(returned)
	},
)

// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.userToken(),
	async (req, res) => {
		const ownership = await blocksCollection.c_ownership(
			req.decoded._id,
			req.params._id
		)
		
		if (ownership.status && ownership.ownership) {
			const returned = await blocksCollection.c_delete(req.params._id)
			const returned2 = await blockLikesCollection.c_deleteAll(req.params._id)

			res.status(200).send([returned, returned2])
			
		}
		else { res.status(400).send(ownership) }
	},
)


/******************* [LIKE SYSTEM] *******************/
// [LIKE] Auth Required //
router.post(
	'/like/:_id',
	Auth.userToken(),
	rateLimiter.likeLimiter,
	async (req, res) => {
		// [CREATE] blockLike //
		const returned = await blockLikesCollection.c_create(
			req.decoded._id,
			req.params._id
		)
		
		res.status(201).send(returned)
	},
)

// [UNLIKE] Auth Required //
router.post(
	'/unlike/:_id',
	rateLimiter.likeLimiter,
	Auth.userToken(),
	async (req, res) => {
		// [UPDATE] block Likers // [DELETE] blockLike //
		const returned = await blockLikesCollection.c_delete(
			req.decoded._id,
			req.params._id
		)
		
		res.status(201).send(returned)
	},
)


/******************* [FOLLOW SYSTEM] *******************/
// [FOLLOW] Auth Required //
router.post(
	'/follow/:_id',
	Auth.userToken(),
	rateLimiter.followLimiter,
	async (req, res) => {
		const returned = await blockFollowersCollection.c_create(
			req.decoded._id,
			req.params._id
		)
		
		res.status(201).send(returned)
	},
)

// [UNFOLLOW] Auth Required //
router.post(
	'/unfollow/:_id',
	rateLimiter.followLimiter,
	Auth.userToken(),
	async (req, res) => {
		const returned = await blockFollowersCollection.c_delete(
			req.decoded._id,
			req.params._id
		)
		
		res.status(201).send(returned)
	},
)


/******************* [EXISTANCE + OWNERSHIP] *******************/
// [EXISTANCE] //
router.get(
	'/existance/:_id',
	async (req, res) => {
		const existance = await blocksCollection.c_existance(req.params._id)

		if (existance.status) {
			if (existance.existance) { res.status(200).send(true) }
			else { res.status(200).send(false) }
		}
		else { res.status(400).send(existance.message) }
	},
)


/******************* [COUNT] *******************/
router.get(
	'/count/:cat_id',
	async (req, res) => {
		const x = await blocksCollection.c_count(req.params.cat_id)

		if (x.status) { res.status(200).send(x.count.toString()) }
		else { res.status(200).send(x.message.toString()) }
	},
)


// [EXPORT] //
module.exports = router