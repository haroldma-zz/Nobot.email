var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EmailSchema   = new Schema({
	_id: Number,
	name: String,
	email: String,
	views: {
		type: Number,
		default: 0
		},
	createdAt: {
            type: Date,
            default: Date.now
        }
});

module.exports = mongoose.model('Email', EmailSchema);
