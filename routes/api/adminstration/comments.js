/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION COMMENT ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const aCommentsCollection = require('../../../server-collections/administration/commentsCollection')
const commentsCollection = require('../../../server-collections/commentsCollection')
const commentLikesCollection = require('../../../server-collections/commentLikesCollection')
const notificationsCollection = require('../../../server-collections/notificationsCollection')
const Auth = require('../../../server-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ-ALL-ALL] //
router.get(
	'/read-all-all/:amount/:skip',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await commentsCollection.c_readAllAll(
			req.params.skip,
			req.params.amount
		)

		res.status(200).send(returnedData)
	}
)


// [READ-ALL] Auth Required - Within a Block //
router.get(
	'/read-all/:block_id/:amount/:skip',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await commentsCollection.c_readAll(
			req.params.block_id,
			req.params.skip,
			req.params.amount
		)

		res.status(200).send(returnedData)
	}
)


// [READ] Auth Required //
router.get(
	'/read/:_id',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await commentsCollection.c_read(req.params._id)

		res.status(200).send(returnedData)
	}
)


// [UPDATE] Auth Required //
router.post(
	'/update/:_id',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await commentsCollection.c_update(
			req.params._id,
			req.body.text
		)

		res.status(201).send(returnedData)
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.adminToken(),
	async (req, res) => {
		const returnedData = await aCommentsCollection.c_delete(req.params._id)
		const returnedData2 = await commentLikesCollection.c_deleteAll(req.params._id)
		const returnedData3 = await notificationsCollection.c_deleteAll(req.params._id)

		res.status(200).send([returnedData, returnedData2, returnedData3])
	}
)


// [EXPORT] //
module.exports = router