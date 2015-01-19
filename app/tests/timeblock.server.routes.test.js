'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Timeblock = mongoose.model('Timeblock'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, timeblock;

/**
 * Timeblock routes tests
 */
describe('Timeblock CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Timeblock
		user.save(function() {
			timeblock = {
				name: 'Timeblock Name'
			};

			done();
		});
	});

	it('should be able to save Timeblock instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Timeblock
				agent.post('/timeblocks')
					.send(timeblock)
					.expect(200)
					.end(function(timeblockSaveErr, timeblockSaveRes) {
						// Handle Timeblock save error
						if (timeblockSaveErr) done(timeblockSaveErr);

						// Get a list of Timeblocks
						agent.get('/timeblocks')
							.end(function(timeblocksGetErr, timeblocksGetRes) {
								// Handle Timeblock save error
								if (timeblocksGetErr) done(timeblocksGetErr);

								// Get Timeblocks list
								var timeblocks = timeblocksGetRes.body;

								// Set assertions
								(timeblocks[0].user._id).should.equal(userId);
								(timeblocks[0].name).should.match('Timeblock Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Timeblock instance if not logged in', function(done) {
		agent.post('/timeblocks')
			.send(timeblock)
			.expect(401)
			.end(function(timeblockSaveErr, timeblockSaveRes) {
				// Call the assertion callback
				done(timeblockSaveErr);
			});
	});

	it('should not be able to save Timeblock instance if no name is provided', function(done) {
		// Invalidate name field
		timeblock.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Timeblock
				agent.post('/timeblocks')
					.send(timeblock)
					.expect(400)
					.end(function(timeblockSaveErr, timeblockSaveRes) {
						// Set message assertion
						(timeblockSaveRes.body.message).should.match('Please fill Timeblock name');
						
						// Handle Timeblock save error
						done(timeblockSaveErr);
					});
			});
	});

	it('should be able to update Timeblock instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Timeblock
				agent.post('/timeblocks')
					.send(timeblock)
					.expect(200)
					.end(function(timeblockSaveErr, timeblockSaveRes) {
						// Handle Timeblock save error
						if (timeblockSaveErr) done(timeblockSaveErr);

						// Update Timeblock name
						timeblock.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Timeblock
						agent.put('/timeblocks/' + timeblockSaveRes.body._id)
							.send(timeblock)
							.expect(200)
							.end(function(timeblockUpdateErr, timeblockUpdateRes) {
								// Handle Timeblock update error
								if (timeblockUpdateErr) done(timeblockUpdateErr);

								// Set assertions
								(timeblockUpdateRes.body._id).should.equal(timeblockSaveRes.body._id);
								(timeblockUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Timeblocks if not signed in', function(done) {
		// Create new Timeblock model instance
		var timeblockObj = new Timeblock(timeblock);

		// Save the Timeblock
		timeblockObj.save(function() {
			// Request Timeblocks
			request(app).get('/timeblocks')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Timeblock if not signed in', function(done) {
		// Create new Timeblock model instance
		var timeblockObj = new Timeblock(timeblock);

		// Save the Timeblock
		timeblockObj.save(function() {
			request(app).get('/timeblocks/' + timeblockObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', timeblock.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Timeblock instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Timeblock
				agent.post('/timeblocks')
					.send(timeblock)
					.expect(200)
					.end(function(timeblockSaveErr, timeblockSaveRes) {
						// Handle Timeblock save error
						if (timeblockSaveErr) done(timeblockSaveErr);

						// Delete existing Timeblock
						agent.delete('/timeblocks/' + timeblockSaveRes.body._id)
							.send(timeblock)
							.expect(200)
							.end(function(timeblockDeleteErr, timeblockDeleteRes) {
								// Handle Timeblock error error
								if (timeblockDeleteErr) done(timeblockDeleteErr);

								// Set assertions
								(timeblockDeleteRes.body._id).should.equal(timeblockSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Timeblock instance if not signed in', function(done) {
		// Set Timeblock user 
		timeblock.user = user;

		// Create new Timeblock model instance
		var timeblockObj = new Timeblock(timeblock);

		// Save the Timeblock
		timeblockObj.save(function() {
			// Try deleting Timeblock
			request(app).delete('/timeblocks/' + timeblockObj._id)
			.expect(401)
			.end(function(timeblockDeleteErr, timeblockDeleteRes) {
				// Set message assertion
				(timeblockDeleteRes.body.message).should.match('User is not logged in');

				// Handle Timeblock error error
				done(timeblockDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Timeblock.remove().exec();
		done();
	});
});