/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% POSTS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] //
const PostModel = require('../../server-models/PostModel')


/******************* [CRUD] *******************/
// [READ-ALL-ALL] //
const c_readAllAll = async (skip, limit) => {
	const skip2 = parseInt(skip)
	const limit2 = parseInt(limit)

	try {
		const posts = await PostModel.find()
			.skip(skip2)
			.limit(limit2)
			.populate(
				{
					path: 'user',
					select: 'username email profileImg',
				}
			)
			.exec()

		return {
			executed: true,
			status: true,
			posts: posts
		}
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `postCollections: Caught Error --> ${e}`,
		}
	}
}


// [DELETE] //
const c_delete = async (post_id) => {
	if (mongoose.isValidObjectId(post_id)) {
		try {
			const deletedPost = await PostModel.findByIdAndDelete(post_id)
			
			return {
				executed: true,
				status: true,
				deleted: true,
				deletedPost: deletedPost,
			}
		}
		catch (e) {
			return {
				executed: false,
				status: false,
				message: `postCollections: Caught Error --> ${e}`,
				deleted: false,
			}
		}
	}
	else {
		return {
			executed: true,
			status: false,
			message: 'Invalid post _id',
			deleted: false,
		}
	}
}


// [EXPORT] //
module.exports = {
	c_readAllAll,
	c_delete,
}
