'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var calendars = require('../../app/controllers/calendars.server.controller');

    // Calendars Routes
    app.route('/calendars')
        .get(calendars.list);


};
