/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% POST LIKES COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const PostLikeModel = require('../server-models/PostLikeModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, post_id) => {
	// [VALIDATE] //
	if (!mongoose.isValidObjectId(user_id) || !mongoose.isValidObjectId(post_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid id(s)',
		}
	}
	
	// [EXISTANCE] //
	const existance = await c_existance(user_id, post_id)

	if (!existance.status || existance.existance) {
		return {
			executed: true,
			status: false,
			message: existance.message,
		}
	}

	try {
		// [SAVE] //
		const createdPostLike = await new PostLikeModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			post: post_id,
		}).save()

		return {
			executed: true,
			status: true,
			createdPostLike: createdPostLike,
			existance: existance,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postLikesCollection: Error --> ${err}`,
		}
	}
	
}

// [DELETE] //
const c_delete = async (user_id, post_id) => {
	// [VALIDATE] //
	if (!mongoose.isValidObjectId(user_id) || !mongoose.isValidObjectId(post_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid id(s)',
		}
	}

	try {
		const deletedPostLike = await PostLikeModel.deleteMany({
			user: user_id,
			post: post_id,
		})

		return {
			executed: true,
			status: true,
			deletedPostLike: deletedPostLike,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postLikesCollection: Error --> ${err}`,
		}
	}
}


// [DELETE-ALL] //
const c_deleteAll = async (post_id) => {
	// [VALIDATE] //
	if (!mongoose.isValidObjectId(post_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid post_id',
		}
	}

	try {
		const deletedPostLike = await PostLikeModel.deleteMany({ post: post_id })

		return {
			executed: true,
			status: true,
			deletedPostLike: deletedPostLike,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `deletedPostLike: Error --> ${err}`,
		}
	}
}


/******************* [EXISTANCE] *******************/
// [EXISTANCE] //
const c_existance = async (user_id, post_id) => {
	// [VALIDATE] //
	if (!mongoose.isValidObjectId(post_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid post_id',
		}
	}

	try {
		const returned = await PostLikeModel.findOne({
			user: user_id,
			post: post_id,
		})

		if (returned) {
			return {
				executed: true,
				status: true,
				existance: true,
			}
		}
		else {
			return {
				executed: true,
				status: true,
				existance: false,
			}
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postLikesCollection: Error --> ${err}`,
		}
	}
}


/******************* [COUNT] *******************/
const c_countAll = async (post_id) => {
	// [VALIDATE] //
	if (!mongoose.isValidObjectId(post_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid post_id',
		}
	}
	
	try {
		const count = await PostLikeModel.countDocuments({ post: post_id })

		return {
			executed: true,
			status: true,
			count: count
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postLikesCollection: Error --> ${err}`
		}
	}
	
}


// [EXPORT] //
module.exports = {
	c_create,
	c_delete,
	c_deleteAll,
	c_existance,
	c_countAll,
}