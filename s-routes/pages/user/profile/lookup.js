/**
 * %%%%%%%%%%%%%%%%%%%
 * %%% USER ROUTES %%%
 * %%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const commentsCollection = require('../../../../s-collections/commentsCollection')
const usersCollection = require('../../../../s-collections/usersCollection')

// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/
// [READ] Params //
router.get(
	'/:user_id',
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (mongoose.isValidObjectId(req.params.user_id)) {
				const userObj = await usersCollection.c_readSensitive(
					req.params.user_id,
					'username created_at profileImg'
				)

				if (userObj.status) {
					const commentCount = await commentsCollection.c_countAllByUser(
						req.params.user_id
					)
					
					res.status(200).send({
						executed: true,
						status: true,
						user: userObj.user,
						commentCount: commentCount.count
					})
				}
				else { res.status(200).send(userObj) }
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: 'Invalid user_id'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/pages/user/profile/lookup: Error --> ${err}`
			})
		}
	}
)


// [EXPORT] //
module.exports = router