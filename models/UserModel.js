const mongoose = require("mongoose")
require('mongoose-type-email')
const Schema = mongoose.Schema

const UserSchema = new Schema({
	first_name: {
		type: String
	},
	last_name: {
		type: String
	},
	username: {
		type: String
	},
	email: {
		type: String
	},
	password: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	}
})

module.exports = User = mongoose.model('users', UserSchema)