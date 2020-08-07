/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT LIKES COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const CommentLikeModel = require('../server-models/CommetLikeModel')


/******************* [CRUD] *******************/
// [CREATE] //
const s_create = async (user_id, block_id, comment_id) => {
	const existance = await s_existance(user_id, comment_id)

	if (existance.status && !existance.existance) {
		const formData = new CommentLikeModel(
			{
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				block: block_id,
				comment: comment_id,
			}
		)
		
		try {
			await formData.save()

			return {
				status: true,
				message: 'Created commentLike',
				user: user_id,
				comment: comment_id,
				block: block_id,
			}
		}
		catch(e) {
			return {
				status: false,
				message: `Caught Error --> ${e}`,
				user: user_id,
				comment: comment_id,
				block: block_id,
			}
		}
	}
	else { return { status: false, message: existance.message } }
}


// [DELETE] //
const s_delete = async (user_id, comment_id) => {
	try {
		await CommentLikeModel.deleteMany(
			{
				user: user_id,
				comment: comment_id,
			}
		)

		return {
			status: true,
			message: 'Deleted CommentLike',
			user: user_id,
			comment: comment_id,
		}
	}
	catch(e) {
		return {
			status: false,
			message: `Caught Error --> ${e}`,
			user: user_id,
			comment: comment_id,
		}
	}
}


// [DELETE-ALL] //
const s_deleteAll = async (comment_id) => {
	try {
		await CommentLikeModel.deleteMany({ comment: comment_id })

		return {
			status: true,
			message: 'Deleted All CommentLike for this comment',
			comment: comment_id,
		}
	}
	catch(e) {
		return {
			status: false,
			message: `Caught Error --> ${e}`,
			comment: comment_id,
		}
	}
}


/******************* [EXISTANCE] *******************/
// [EXISTANCE] //
const s_existance = async (user_id, comment_id) => {
	if (mongoose.isValidObjectId(comment_id)) {
		try {
			const returnedData = await CommentLikeModel.findOne(
				{
					user: user_id,
					comment: comment_id,
				}
			)

			if (returnedData) {
				return {
					status: true,
					message: 'CommentLike does exists',
					existance: true,
				}
			}
			else {
				return {
					status: true,
					message: 'CommentLike does NOT exists',
					existance: false,
				}
			}
		}
		catch(e) { return { status: false, message: `Caught Error --> ${e}`, } }
	}
	else { return { status: false, message: 'Invalid Block ID', } }
}


// [EXPORT] //
module.exports = {
	s_create,
	s_delete,
	s_deleteAll,
	s_existance,
}