/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% POST PAGE ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const postsCollection = require('../../../s-collections/postsCollection')
const postLikesCollection = require('../../../s-collections/postLikesCollection')
const postFollowersCollection = require('../../../s-collections/postFollowersCollection')
const commentsCollection = require('../../../s-collections/commentsCollection')
const commentLikesCollection = require('../../../s-collections/commentLikesCollection')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [READ-ALL] //
router.get(
	'/:post_id/:limit/:page',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				mongoose.isValidObjectId(req.params.post_id) &&
				Number.isInteger(parseInt(req.params.limit)) &&
				Number.isInteger(parseInt(req.params.page))
			) {
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit

				///// [POSTS] /////
				let postObj = await postsCollection.c_read(req.params.post_id)

				if (postObj.status) {
					// [COUNT] Likes //
					postObj.post.likeCount = (
						await postLikesCollection.c_countAll(postObj.post._id)
					).count
		
					// [COUNT] Follows //
					postObj.post.followersCount = (
						await postFollowersCollection.c_countAll(postObj.post._id)
					).count
	
					// [USER-LOGGED] //
					if (req.decoded) {
						// [LIKED-STATUS] //
						postObj.post.liked = (
							await postLikesCollection.c_existance(
								req.decoded.user_id,
								postObj.post._id
							)
						).existance
		
						// [FOLLOWED-STATUS] //
						postObj.post.followed = (
							await postFollowersCollection.c_existance(
								req.decoded.user_id,
								postObj.post._id
							)
						).existance
					}
				}

				//// [COMMENTS] ////
				let commentsObj = await commentsCollection.c_readAll(
					req.params.post_id,
					skip,
					limit
				)

				if (commentsObj.status) {
					for (let i = 0; i < commentsObj.comments.length; i++) {
						// [COUNT] Likes //
						commentsObj.comments[i].likeCount = (
							await commentLikesCollection.c_countAll(
								commentsObj.comments[i]._id
							)
						).count
	
					
						// [USER-LOGGED] //
						if (req.decoded) {
							// [LIKED-STATUS] //
							commentsObj.comments[i].liked = (
								await commentLikesCollection.c_existance(
									req.decoded.user_id,
									commentsObj.comments[i]._id
								)
							).existance
						}
					}

					// [COUNT] Comments //
					commentsObj.commentsCount = (
						await commentsCollection.c_countAll(req.params.post_id)
					).count

					// [COUNT] Calculate Total Pages //
					commentsObj.pageCount = Math.ceil(
						commentsObj.commentsCount / req.params.limit
					)
				}
				
				res.status(200).send({
					executed: true,
					status: true,
					postObj: postObj,
					commentsObj: commentsObj,
				})
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/pages/post: Invalid params',
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/pages/post: Error --> ${err}`
			})
		}
	},
)


// [EXPORT] //
module.exports = router