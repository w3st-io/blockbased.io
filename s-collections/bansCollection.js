/**
 * %%%%%%%%%%%%%%%%%%%%%%
 * %%% BAN COLLECTION %%%
 * %%%%%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const BanModel = require('../s-models/BanModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, hours) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'bansCollection: Invalid user_id'
			}
		}

		// [VALIDATE] hours //
		if (!Number.isInteger(hours)) {
			return {
				executed: true,
				status: false,
				message: 'bansCollection: Invalid hours (must be numeric)'
			}
		}
	
		// [EXISTANCE] //
		const existance = await c_existance(user_id)

		if (!existance.status || existance.existance) {
			return {
				executed: true,
				status: false,
				message: existance.message
			}
		}

		let banTime = new Date()
		banTime.setHours(banTime.getHours() + hours)

		const createdBan = await new BanModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			bannedTill: banTime,
		}).save()

		return {
			executed: true,
			status: true,
			createdBan: createdBan,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `bansCollection: Error --> ${err}`,
		}
	}
}


// [DELETE] //
const c_delete = async (user_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'bansCollection: Invalid user_id'
			}
		}

		const ban = await BanModel.deleteMany({ user: user_id })

		return {
			executed: true,
			status: true,
			ban: ban,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `bansCollection: Error --> ${err}`,
		}
	}
}


/******************* [EXISTANCE] *******************/
// [EXISTANCE] //
const c_existance = async (user_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'bansCollection: Invalid user_id',
			}
		}

		const foundBan = await BanModel.findOne({ user: user_id })

		if (!foundBan) {
			return {
				executed: true,
				status: true,
				message: 'Ban does NOT exists',
				existance: false,
			}
		}

		return {
			executed: true,
			status: true,
			message: 'Ban does exists',
			existance: true,
			foundBan: foundBan,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `banCollection: Error --> ${err}`,
		}
	}
}


// [EXPORT] //
module.exports = {
	c_create,
	c_delete,
	c_existance
}
