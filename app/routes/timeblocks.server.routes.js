'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var timeblocks = require('../../app/controllers/timeblocks.server.controller');

	// Timeblocks Routes
	app.route('/timeblocks')
		.get(timeblocks.list)
		.post(users.requiresLogin, timeblocks.create);

	app.route('/timeblocks/:timeblockId')
		.get(timeblocks.read)
		.put(users.requiresLogin, timeblocks.hasAuthorization, timeblocks.update)
		.delete(users.requiresLogin, timeblocks.hasAuthorization, timeblocks.delete);

	// Finish by binding the Timeblock middleware
	app.param('timeblockId', timeblocks.timeblockByID);
};
