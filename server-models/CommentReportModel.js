// [REQUIRE] //
const mongoose = require("mongoose")


// [SCHEMA MODEL] //
const CommentReportSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	block: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Block',
		required: true,
	},

	reportType: {
		type: String,
		required: true,
	},
	
	comment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment',
		required: true,
	},

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	createdAt: {
		type: Date,
		default: Date.now
	},
})


// [EXPORTS] //
module.exports = mongoose.model('CommentReport', CommentReportSchema)