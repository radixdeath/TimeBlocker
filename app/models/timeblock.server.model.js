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
	// You can create TimeBlocks and start and end them at any time
	creationDateTime: {
		type: Date
	},
	startDateTime: {
		type: Date
	},
	endDateTime: {
		type: Date
	},
    invoiceId: {
        type: String
    },
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Timeblock', TimeblockSchema);
