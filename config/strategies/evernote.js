/**
 * Created by Stewart on 04/09/2015.
 */
'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    url = require('url'),
    EvernoteStrategy = require('passport-evernote').Strategy,
    config = require('../config'),
    users = require('../../app/controllers/users.server.controller');

module.exports = function() {
    // Use evernote strategy
    passport.use(new EvernoteStrategy({
            consumerKey: config.evernote.consumerKey,
            consumerSecret: config.evernote.consumerSecret,
            callbackURL: config.evernote.callbackURL,
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            // Set the provider data and include tokens
            var providerData = profile._json;
            providerData.accessToken = accessToken;
            providerData.refreshToken = refreshToken;

            // Create the user OAuth profile
            var providerUserProfile = {
                displayName: profile.displayName,
                email: profile.emails[0].value,
                username: profile.username,
                provider: 'evernote',
                providerIdentifierField: 'id',
                providerData: providerData
            };

            // Save the user OAuth profile
            users.saveOAuthUserProfile(req, providerUserProfile, done);
        }
    ));
};
