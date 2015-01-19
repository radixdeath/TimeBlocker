'use strict';

(function() {
	// Timeblocks Controller Spec
	describe('Timeblocks Controller Tests', function() {
		// Initialize global variables
		var TimeblocksController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Timeblocks controller.
			TimeblocksController = $controller('TimeblocksController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Timeblock object fetched from XHR', inject(function(Timeblocks) {
			// Create sample Timeblock using the Timeblocks service
			var sampleTimeblock = new Timeblocks({
				name: 'New Timeblock'
			});

			// Create a sample Timeblocks array that includes the new Timeblock
			var sampleTimeblocks = [sampleTimeblock];

			// Set GET response
			$httpBackend.expectGET('timeblocks').respond(sampleTimeblocks);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.timeblocks).toEqualData(sampleTimeblocks);
		}));

		it('$scope.findOne() should create an array with one Timeblock object fetched from XHR using a timeblockId URL parameter', inject(function(Timeblocks) {
			// Define a sample Timeblock object
			var sampleTimeblock = new Timeblocks({
				name: 'New Timeblock'
			});

			// Set the URL parameter
			$stateParams.timeblockId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/timeblocks\/([0-9a-fA-F]{24})$/).respond(sampleTimeblock);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.timeblock).toEqualData(sampleTimeblock);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Timeblocks) {
			// Create a sample Timeblock object
			var sampleTimeblockPostData = new Timeblocks({
				name: 'New Timeblock'
			});

			// Create a sample Timeblock response
			var sampleTimeblockResponse = new Timeblocks({
				_id: '525cf20451979dea2c000001',
				name: 'New Timeblock'
			});

			// Fixture mock form input values
			scope.name = 'New Timeblock';

			// Set POST response
			$httpBackend.expectPOST('timeblocks', sampleTimeblockPostData).respond(sampleTimeblockResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Timeblock was created
			expect($location.path()).toBe('/timeblocks/' + sampleTimeblockResponse._id);
		}));

		it('$scope.update() should update a valid Timeblock', inject(function(Timeblocks) {
			// Define a sample Timeblock put data
			var sampleTimeblockPutData = new Timeblocks({
				_id: '525cf20451979dea2c000001',
				name: 'New Timeblock'
			});

			// Mock Timeblock in scope
			scope.timeblock = sampleTimeblockPutData;

			// Set PUT response
			$httpBackend.expectPUT(/timeblocks\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/timeblocks/' + sampleTimeblockPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid timeblockId and remove the Timeblock from the scope', inject(function(Timeblocks) {
			// Create new Timeblock object
			var sampleTimeblock = new Timeblocks({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Timeblocks array and include the Timeblock
			scope.timeblocks = [sampleTimeblock];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/timeblocks\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTimeblock);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.timeblocks.length).toBe(0);
		}));
	});
}());