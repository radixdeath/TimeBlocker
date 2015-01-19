'use strict';

// Timeblocks controller
angular.module('timeblocks').controller('TimeblocksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Timeblocks',
	function($scope, $stateParams, $location, Authentication, Timeblocks) {
		$scope.authentication = Authentication;

		// Create new Timeblock
		$scope.create = function() {
			// Create new Timeblock object
			var timeblock = new Timeblocks ({
				name: this.name
			});

			// Redirect after save
			timeblock.$save(function(response) {
				$location.path('timeblocks/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Timeblock
		$scope.remove = function(timeblock) {
			if ( timeblock ) { 
				timeblock.$remove();

				for (var i in $scope.timeblocks) {
					if ($scope.timeblocks [i] === timeblock) {
						$scope.timeblocks.splice(i, 1);
					}
				}
			} else {
				$scope.timeblock.$remove(function() {
					$location.path('timeblocks');
				});
			}
		};

		// Update existing Timeblock
		$scope.update = function() {
			var timeblock = $scope.timeblock;

			timeblock.$update(function() {
				$location.path('timeblocks/' + timeblock._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Timeblocks
		$scope.find = function() {
			//$scope.timeblocks = Timeblocks.query();
			$scope.timeblocks = [
				{
					category: 'life',
					subCategory: 'sleep',
					impact: { category: 'health', effect:'8'},
					startTime: new Date(2015, 1, 1, 22, 30, 0, 0),
					endTime: new Date(2015, 1, 2, 7, 30, 0, 0),
					padding: '15',
					repeat: 'workDays',
					work: {
						chargePerHour: 0,
						costs: 0,
						discount: 0,
						discountPerHour: 0,
						balance: 0	//recalculate if any of the above change
					},
					notes: ''
				},
				{

				}
			];
		};

		// Find existing Timeblock
		$scope.findOne = function() {
			$scope.timeblock = Timeblocks.get({ 
				timeblockId: $stateParams.timeblockId
			});
		};
	}
]);
