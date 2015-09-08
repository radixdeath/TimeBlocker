'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    google = require('googleapis'),
    _ = require('lodash');


var urlshortener = google.urlshortener('v1');

/**
 * Create a Calendar
 */
exports.create = function(req, res) {

};

/**
 * Show the current Calendar
 */
exports.read = function(req, res) {

};

/**
 * Update a Calendar
 */
exports.update = function(req, res) {

};

/**
 * Delete an Calendar
 */
exports.delete = function(req, res) {

};

/**
 * List of Calendars
 */
exports.list = function(req, res) {
    var calendar = google.calendar('v3');
    var OAuth2 = google.auth.OAuth2;
    var clientId = process.env.GOOGLE_ID;
    var secret = process.env.GOOGLE_SECRET;
    var redirecturl = '/auth/google/callback';
    var oauth2Client = new OAuth2(clientId, secret, redirecturl);
    var user = req.user;
    console.log('Get a list of users calendars '+clientId);
    //user providerData.accessToken
    //GET https://www.googleapis.com/calendar/v3/users/me/calendarList
    oauth2Client.setCredentials({
        access_token: user.providerData.accessToken,
        refresh_token: user.providerData.refresh_token
    });

    //calendar.calendarList.list(req,res);
    calendar.calendarList.list({ userId: user.providerData.id, auth: oauth2Client }, function(err, response) {
        // handle err and response
        console.log('getting plus data '+JSON.stringify(response));
    });
};
