// [REQUIRE] //
const mongoose = require('mongoose')

// [INIT] //
const defaultImage = 'https://icon-library.com/images/placeholder-icon/placeholder-icon-17.jpg'

// [EXPORT] //
module.exports = mongoose.model(
	'User',
	mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,

		email: {
			type: String,
			required: [true, 'This is required'],
			maxlength: 50,
		},

		username: {
			type: String,
			required: [true, 'This is required'],
			maxlength: 24,
		},
		
		first_name: {
			type: String,
			required: false,
			default: '',
			maxlength: 24,
		},
		
		last_name: {
			type: String,
			required: false,
			default: '',
			maxlength: 24,
		},
		
		profile_img: {
			type: String,
			default: defaultImage,
			maxlength: 600,
		},
		
		password: {
			type: String,
			required: [true, 'This is required'],
		},

		bio: {
			type: String,
			default: '',
			maxlength: 600,
		},

		verified: {
			type: Boolean,
			default: false,
		},

		created_at: {
			type: Date,
			default: Date.now,
			maxlength: 50
		},
	})
)