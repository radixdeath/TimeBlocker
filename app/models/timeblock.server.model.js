'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Timeblock Schema
 */
var TimeblockSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Timeblock name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Timeblock', TimeblockSchema);