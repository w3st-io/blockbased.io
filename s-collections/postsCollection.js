 /**
 * %%%%%%%%%%%%%%%%%%%%%%%%
 * %%% POSTS COLLECTION %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] //
const PostModel = require('../s-models/PostModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, cat_id, title) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid user_id',
			}
		}

		// [VALIDATE] cat_id //
		if (!validator.isAscii(cat_id)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid cat_id',
			}
		}

		// [VALIDATE] title //
		if (!validator.isAscii(title)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid title',
			}
		}

		// [VALIDATE] title //
		if (!title) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: No title passed',
			}
		}

		// [SAVE] //
		const createdPost = await new PostModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			cat_id: cat_id,
			title: title,
		}).save()

		return {
			executed: true,
			status: true,
			createdPost: createdPost,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postsCollection: Error --> ${err}`,
		}
	}
}


// [READ] //
const c_read = async (post_id) => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid post_id',
			}
		}

		// [EXISTANCE] //
		const existance = await c_existance(post_id)
		
		if (!existance.existance) { return existance }

		const post = await PostModel.findById(post_id)
			.populate({ path: 'user', select: 'username email bio profile_img', })
			.exec()
		
		return {
			executed: true,
			status: true,
			post: post
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postsCollection: Error --> ${err}`
		}
	}
}


// [DELETE] //
const c_delete = async (post_id) => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid post_id',
				deleted: false,
			}
		}

		const deletedPost = await PostModel.findByIdAndDelete(post_id)
		
		return {
			executed: true,
			status: true,
			deleted: true,
			deletedPost: deletedPost,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postCollections: Error --> ${err}`,
			deleted: false,
		}
	}
}


/******************* [OTHER-CRUD] *******************/
// [READ-ALL-SORT] Within Cat //
const c_readSorted = async (sort = 0, limit, skip) => {
	try {
		// [SANITIZE] //
		sort = parseInt(sort)
		limit = parseInt(limit)
		skip = parseInt(skip)

		// [VALIDATE] sort //
		if (!Number.isInteger(sort)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid sort',
			}
		}

		// [VALIDATE] limit //
		if (!Number.isInteger(limit)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid limit',
			}
		}

		// [VALIDATE] skip //
		if (!Number.isInteger(skip)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid skip',
			}
		}

		// Set Sort //
		if (sort == 0) { sort = { created_at: -1 } }
		else if (sort == 1) { sort = { likeCount: -1 } }
		else {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Unknown filter'
			}
		}

		const posts = await PostModel.find()
			.sort(sort)
			.limit(limit)
			.skip(skip)
			.populate({ path: 'user', select: 'username bio profile_img', })
			.exec()

		return {
			executed: true,
			status: true,
			posts: posts,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postsCollection: Error --> ${err}`,
		}
	}
}


// [READ-ALL] Within Cat Sorted //
const c_readByCatSorted = async (cat_id, sort = 0, limit, skip) => {
	try {
		// [SANITIZE] //
		sort = parseInt(sort)
		limit = parseInt(limit)
		skip = parseInt(skip)

		// [VALIDATE] cat_id //
		if (!validator.isAscii(cat_id)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid cat_id',
			}
		}

		// [VALIDATE] sort //
		if (!Number.isInteger(sort)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid sort',
			}
		}

		// [VALIDATE] limit //
		if (!Number.isInteger(limit)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid limit',
			}
		}

		// [VALIDATE] skip //
		if (!Number.isInteger(skip)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid skip',
			}
		}

		// Set Sort //
		if (sort == 0) { sort = { created_at: -1 } }
		else if (sort == 1) { sort = { likeCount: -1 } }
		else {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Unknown filter'
			}
		}

		const posts = await PostModel.find({ cat_id })
			.sort(sort)
			.limit(limit)
			.skip(skip)
			.populate({ path: 'user', select: 'username bio profile_img', })
			.exec()

		return {
			executed: true,
			status: true,
			posts: posts,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postsCollection: Error --> ${err}`,
		}
	}
}


// [READ-ALL] Pinned Posts //
const c_readPinned = async (cat_id, sort = 0) => {
	try { 
		// [VALIDATE] cat_id //
		if (!validator.isAscii(cat_id)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid cat_id',
			}
		}

		// [VALIDATE] sort //
		if (!Number.isInteger(sort)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid sort',
			}
		}

		// Set Sort //
		if (sort == 0) { sort = { created_at: -1 } }
		else if (sort == 0) { sort = { likeCount: -1 } }

		const posts = await PostModel.find({
			cat_id,
			pinned: true,
		})
			.populate({
				path: 'user',
				select: 'username email bio profile_img'
			})
			.sort(sort)
			.exec()

		return {
			executed: true,
			status: true,
			posts: posts,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postsCollection: Error --> ${err}`,
		}
	}
}


// [DELETE] _id & user //
const c_deleteByIdAndUser = async (post_id, user_id) => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid post_id',
				deleted: false,
			}
		}

		const deletedPost = await PostModel.deleteOne({
			_id: post_id,
			user: user_id
		})
		
		return {
			executed: true,
			status: true,
			deleted: true,
			deletedPost: deletedPost,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postCollections: Error --> ${err}`,
			deleted: false,
		}
	}
}


/******************* [LIKE-SYSTEM] *******************/
const c_incrementLike = async (post_id) => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid post_id',
			}
		}

		const post = await PostModel.findOneAndUpdate(
			{ _id: post_id },
			{ $inc: { likeCount: 1 } },
		)

		return {
			executed: true,
			status: true,
			post: post
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postsCollection: Error --> ${err}`
		}
	}
}


const c_decrementLike = async (post_id) => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid post_id',
			}
		}

		const post = await PostModel.findOneAndUpdate(
			{ _id: post_id },
			{ $inc: { likeCount: -1 } },
		)

		return {
			executed: true,
			status: true,
			post: post
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postsCollection: Error --> ${err}`
		}
	}
}


/******************* [EXISTANCE] *******************/
const c_existance = async (post_id) => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid post_id',
				existance: false,
			}
		}

		const post = await PostModel.findOne({ _id: post_id })

		if (!post) {
			return {
				executed: true,
				status: false,
				message: `Post does NOT exist`,
				existance: false,
				post: post,
			}
		}

		return {
			executed: true,
			status: true,
			message: `Post does exist`,
			existance: true,
			post: post,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postsCollection: Error --> ${err}`,
			existance: false,
		}
	}
}


/******************* [OWNERSHIP] *******************/
const c_ownership = async (post_id, user_id) => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid post_id',
				updated: false,
			}
		}

		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid user_id',
				updated: false,
			}
		}

		const post = await PostModel.findOne({ _id: post_id, user: user_id })

		if (!post) {
			return {
				executed: true,
				status: true,
				ownership: false,
				post: post,
			}
		}

		return {
			executed: true,
			status: true,
			ownership: true,
			post: post,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postsCollection: Error --> ${err}`,
		}
	}
}


/******************* [COUNT] *******************/
const c_count = async () => {
	try {
		const count = await PostModel.countDocuments()

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
			message: `postsCollection: Error --> ${err}`,
		}
	}
}


const c_countByCat = async (cat_id) => {
	try {
		// [VALIDATE] cat_id //
		if (!validator.isAscii(cat_id)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid cat_id',
				updated: false,
			}
		}

		const count = await PostModel.countDocuments({ cat_id })

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
			message: `postsCollection: Error --> ${err}`,
		}
	}
}


const c_countByUser = async (user_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid user_id',
				updated: false,
			}
		}

		const count = await PostModel.countDocuments({ user: user_id })

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
			message: `postsCollection: Error --> ${err}`,
		}
	}
}


// [EXPORT] //
module.exports = {
	c_create,
	c_read,
	c_delete,
	c_readSorted,
	c_readByCatSorted,
	c_readPinned,
	c_deleteByIdAndUser,
	c_incrementLike,
	c_decrementLike,
	c_existance,
	c_ownership,
	c_count,
	c_countByCat,
	c_countByUser,
}