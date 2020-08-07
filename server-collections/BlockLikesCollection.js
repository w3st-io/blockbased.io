/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCK LIKES COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const BlockLikeModel = require('../server-models/BlockLikeModel')


/******************* [CRUD] *******************/
// [CREATE] //
const s_create = async (user_id, block_id) => {
	const existance = await s_existance(user_id, block_id)

	if (existance.status && !existance.existance) {
		const formData = new BlockLikeModel(
			{
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				block: block_id,
			}
		)

		try {
			await formData.save()

			return {
				status: true,
				message: 'Created blockLike',
				block: block_id,
				user: user_id,
			}
		}
		catch(e) {
			return {
				status: false,
				message: `Caught Error --> ${e}`,
				user: user_id,
				block: block_id,
			}
		}
	}
	else { return { status: false, message: existance.message } }
}


// [DELETE] //
const s_delete = async (user_id, block_id) => {
	try {
		await BlockLikeModel.deleteMany({ user: user_id, block: block_id, })

		return {
			status: true,
			message: `Deleted blockLike`,
			user: user_id,
			block: block_id,
		}
	}
	catch(e) {
		return {
			status: false,
			message: `Caught Error --> ${e}`,
			user: user_id,
			block: block_id,
		}
	}
}


// [DELETE-ALL] //
const s_deleteAll = async (block_id) => {
	try {
		await BlockLikeModel.deleteMany({ block: block_id })

		return {
			status: true,
			message: `Deleted all blockLikes for ${block_id}`,
			block: block_id,
		}
	}
	catch(e) {
		return {
			status: false,
			message: `Caught Error --> ${e}`,
			block: block_id,
		}
	}
}


/******************* [EXISTANCE] *******************/
// [EXISTANCE] //
const s_existance = async (user_id, block_id) => {
	if (mongoose.isValidObjectId(block_id)) {
		try {
			const returnedData = await BlockLikeModel.findOne(
				{
					user: user_id,
					block: block_id,
				}
			)

			if (returnedData) {
				return {
					status: true,
					message: 'BlockLike does exists',
					existance: true,
				}
			}
			else {
				return {
					status: true,
					message: 'BlockLike does NOT exists',
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