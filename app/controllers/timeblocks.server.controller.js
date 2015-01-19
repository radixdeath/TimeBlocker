'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Timeblock = mongoose.model('Timeblock'),
	_ = require('lodash');

/**
 * Create a Timeblock
 */
exports.create = function(req, res) {
	var timeblock = new Timeblock(req.body);
	timeblock.user = req.user;

	timeblock.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(timeblock);
		}
	});
};

/**
 * Show the current Timeblock
 */
exports.read = function(req, res) {
	res.jsonp(req.timeblock);
};

/**
 * Update a Timeblock
 */
exports.update = function(req, res) {
	var timeblock = req.timeblock ;

	timeblock = _.extend(timeblock , req.body);

	timeblock.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(timeblock);
		}
	});
};

/**
 * Delete an Timeblock
 */
exports.delete = function(req, res) {
	var timeblock = req.timeblock ;

	timeblock.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(timeblock);
		}
	});
};

/**
 * List of Timeblocks
 */
exports.list = function(req, res) { 
	Timeblock.find().sort('-created').populate('user', 'displayName').exec(function(err, timeblocks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(timeblocks);
		}
	});
};

/**
 * Timeblock middleware
 */
exports.timeblockByID = function(req, res, next, id) { 
	Timeblock.findById(id).populate('user', 'displayName').exec(function(err, timeblock) {
		if (err) return next(err);
		if (! timeblock) return next(new Error('Failed to load Timeblock ' + id));
		req.timeblock = timeblock ;
		next();
	});
};

/**
 * Timeblock authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.timeblock.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
