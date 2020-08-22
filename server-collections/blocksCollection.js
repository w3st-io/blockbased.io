/**
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCKS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] //
const BlockModel = require('../server-models/BlockModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, cat_id, title) => {
	const formData = new BlockModel({
		_id: mongoose.Types.ObjectId(),
		user: user_id,
		cat_id: cat_id,
		title: title,
	})

	try {
		const createdBlock = await formData.save()

		return {
			status: true,
			createdBlock: createdBlock,
		}
	}
	catch (e) {
		return {
			status: false,
			message: `blocksCollection: Caught Error --> ${e}`,
		}
	}
}

// [READ-ALL] Within Cat //
const c_readAllDesending = async (cat_id, skip, amount) => {
	const skip2 = parseInt(skip)
	const amount2 = parseInt(amount)

	try {
		const blocks = await BlockModel.find(
			{ cat_id: cat_id }
		)
			.sort({ createdAt: -1 })
			.skip(skip2)
			.limit(amount2)
			.populate(
				{
					path: 'user',
					select: 'username email profileImg',
				}
			)
			.exec()

		return { status: true, blocks: blocks }
	}
	catch (e) {
		return {
			status: false,
			message: `blocksCollection: Caught Error --> ${e}`,
		}
	}
}


// [READ-ALL] Within Cat //
const c_readAllbyLikes = async (cat_id, skip, amount) => {
	const skip2 = parseInt(skip)
	const amount2 = parseInt(amount)

	try {
		const blocks = await BlockModel.find(
			{ cat_id: cat_id }
		)
			.sort({ likeCount: -1 })
			.skip(skip2)
			.limit(amount2)
			.populate(
				{
					path: 'user',
					select: 'username email profileImg',
				}
			)
			.exec()

		return { status: true, blocks: blocks }
	}
	catch (e) {
		return {
			status: false,
			message: `blocksCollection: Caught Error --> ${e}`,
		}
	}
}


// [READ-ALL] Within Cat //
const c_readAll = async (cat_id, skip, amount) => {
	const skip2 = parseInt(skip)
	const amount2 = parseInt(amount)

	try {
		const blocks = await BlockModel.find(
			{ cat_id: cat_id }
		)
			.skip(skip2)
			.limit(amount2)
			.populate(
				{
					path: 'user',
					select: 'username email profileImg',
				}
			)
			.exec()

		return { status: true, blocks: blocks }
	}
	catch (e) {
		return {
			status: false,
			message: `blocksCollection: Caught Error --> ${e}`,
		}
	}
}

// [READ] Single Block //
const c_read = async (block_id) => {
	if (mongoose.isValidObjectId(block_id)) {
		try {
			const block = await BlockModel.findById(block_id)
				.populate(
					{
						path: 'user',
						select: 'username email profileImg',
					}
				)
				.exec()
			
			return { status: true, block: block }
		}
		catch (e) {
			return {
				status: false,
				message: `blocksCollection: Caught Error --> ${e}`
			}
		}
	}
	else {
		return {
			status: false,
			message: 'blocksCollection: Invalid block_id',
		}
	}
}


/******************* [LIKE-SYSTEM] *******************/
const c_incrementLike = async (block_id) => {
	try {
		const block = await BlockModel.findOneAndUpdate(
			{ _id: block_id },
			{ $inc: { likeCount: 1 } },
		)
	
		return { status: true, block: block }
	}
	catch (e) {
		return {
			status: false,
			message: `blocksCollection: Caught Error --> ${e}`
		}
	}
}


const c_decrementLike = async (block_id) => {
	try {
		const block = await BlockModel.findOneAndUpdate(
			{ _id: block_id },
			{ $inc: { likeCount: -1 } },
		)
	
		return { status: true, block: block }
	}
	catch (e) {
		return {
			status: false,
			message: `blocksCollection: Caught Error --> ${e}`
		}
	}
}


/******************* [EXISTANCE] *******************/
const c_existance = async (block_id) => {
	if (mongoose.isValidObjectId(block_id)) {
		try {	
			const block = await BlockModel.findOne({ _id: block_id })

			if (block) {
				return {
					status: true,
					existance: true,
					block: block,
				}
			}
			else {
				return {
					status: true,
					existance: false,
					block: block,
				}
			}
		}
		catch (e) {
			return {
				status: false,
				message: `blocksCollection: Caught Error --> ${e}`
			}
		}
	}
	else {
		return {
			status: false,
			message: 'blocksCollection: Invalid block_id'
		}
	}
}


/******************* [OWNERSHIP] *******************/
const c_ownership = async (user_id, block_id) => {
	if (mongoose.isValidObjectId(block_id)) {
		try {	
			const block = await BlockModel.findOne(
				{
					user: user_id,
					_id: block_id,
				}
			)

			if (returned) {
				return {
					status: true,
					ownership: true,
					block: block,
				}
			}
			else {
				return {
					status: true,
					ownership: false,
					block: block,
				}
			}
		}
		catch (e) {
			return {
				status: false,
				message: `blocksCollection: Caught Error --> ${e}`,
			}
		}
	}
	else {
		return {
			status: false,
			message: 'blocksCollection: Invalid block_id',
		}
	}
}


/******************* [COUNT] *******************/
const c_countAll = async (cat_id) => {
	try {
		const count = await BlockModel.countDocuments({ cat_id: cat_id })

		return { status: true, count: count }
	}
	catch (e) {
		return {
			status: false,
			message: `blocksCollection: Caught Error --> ${e}`,
		}
	}
}


// [EXPORT] //
module.exports = {
	c_create,
	c_readAllDesending,
	c_readAllbyLikes,
	c_readAll,
	c_read,
	c_incrementLike,
	c_decrementLike,
	c_existance,
	c_ownership,
	c_countAll,
}
