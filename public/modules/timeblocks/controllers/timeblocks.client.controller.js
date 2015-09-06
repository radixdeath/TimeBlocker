'use strict';

// Timeblocks controller
angular.module('timeblocks').controller('TimeblocksController', ['$scope', '$stateParams', '$location', '$timeout', 'VisDataSet', 'Authentication', 'Timeblocks',
	function($scope, $stateParams, $location, $timeout, VisDataSet, Authentication, Timeblocks) {

		var graph2d;


		// ------------------------------------------------
		// Event Handlers

		$scope.onDoubleClick = function() {
			console.log('double click');
		};

		$scope.onLoaded = function (graphRef) {
			console.log("timeline loaded callback", graphRef);
			graph2d = graphRef;
			graph2d.setWindow($scope.startTime, $scope.stopTime);
		};

		$scope.setWindow = function (window) {
			var periodStart = moment().subtract(1, window);
			$scope.timeNow = moment().valueOf();

			if (graph2d === undefined) {
				return;
			}

			graph2d.setOptions({max: $scope.timeNow});
			graph2d.setWindow(periodStart, $scope.timeNow);
		};

		$scope.setNow = function (direction) {
			var range = graph2d.getWindow();
			var interval = range.end - range.start;
			$scope.timeNow = moment().valueOf();

			if (graph2d === undefined) {
				return;
			}

			graph2d.setOptions({max: $scope.timeNow});
			graph2d.setWindow($scope.timeNow - interval, $scope.timeNow);
		};

		$scope.stepWindow = function (direction) {
			var percentage = (direction > 0) ? 0.2 : -0.2;
			var range = graph2d.getWindow();
			var interval = range.end - range.start;

			if (graph2d === undefined) {
				return;
			}

			graph2d.setWindow({
				start: range.start.valueOf() - interval * percentage,
				end: range.end.valueOf() - interval * percentage
			});
		};

		$scope.zoomWindow = function (percentage) {
			var range = graph2d.getWindow();
			var interval = range.end - range.start;

			if (graph2d === undefined) {
				return;
			}

			graph2d.setWindow({
				start: range.start.valueOf() - interval * percentage,
				end: range.end.valueOf() + interval * percentage
			});
		};

		$scope.setDateRange = function () {
			$scope.timeNow = moment().valueOf();

			if (graph2d === undefined) {
				return;
			}

			graph2d.setOptions({max: $scope.timeNow});
			graph2d.setWindow($scope.startTime, $scope.stopTime);
		};

		/**
		 * Callback from the chart whenever the range is updated
		 * This is called repeatedly during zooming and scrolling
		 * @param period
		 */
		$scope.onRangeChange = function (period) {
			console.log("Range changing", period);
			function splitDate(date) {
				var m = moment(date);
				return {
					year: m.get('year'),
					month: {
						number: m.get('month'),
						name: m.format('MMM')
					},
					week: m.format('w'),
					day: {
						number: m.get('date'),
						name: m.format('ddd')
					},
					hour: m.format('HH'),
					minute: m.format('mm'),
					second: m.format('ss')
				};
			}

			var p = {
				s: splitDate(period.start),
				e: splitDate(period.end)
			};

			// Set the window for so the appropriate buttons are highlighted
			// We give some leeway to the interval -:
			// A day, +/- 1 minutes
			// A week, +/- 1 hour
			// A month is between 28 and 32 days
			var interval = period.end - period.start;
			if (interval > 86340000 && interval < 86460000) {
				$scope.graphWindow = 'day';
			}
			else if (interval > 601200000 && interval < 608400000) {
				$scope.graphWindow = 'week';
			}
			else if (interval > 2419200000 && interval < 2764800000) {
				$scope.graphWindow = 'month';
			}
			else {
				$scope.graphWindow = 'custom';
			}

			if (p.s.year == p.e.year) {
				$scope.timelineTimeline =
					p.s.day.name + ' ' + p.s.day.number + '-' + p.s.month.name + '  -  ' +
					p.e.day.name + ' ' + p.e.day.number + '-' + p.e.month.name + ' ' + p.s.year;

				if (p.s.month.number == p.e.month.number) {
					$scope.timelineTimeline =
						p.s.day.name + ' ' + p.s.day.number + '  -  ' +
						p.e.day.name + ' ' + p.e.day.number + ' ' +
						p.s.month.name + ' ' + p.s.year;

					if (p.s.day.number == p.e.day.number) {
						if (p.e.hour == 23 && p.e.minute == 59 && p.e.second == 59) {
							p.e.hour = 24;
							p.e.minute = '00';
							p.e.second = '00';
						}

						$scope.timelineTimeline =
							p.s.hour + ':' + p.s.minute + '  -  ' +
							p.e.hour + ':' + p.e.minute + ' ' +
							p.s.day.name + ' ' + p.s.day.number + ' ' + p.s.month.name + ' ' + p.s.year;
					}
				}
			}
			else {
				$scope.timelineTimeline =
					p.s.day.name + ' ' + p.s.day.number + '-' + p.s.month.name + ', ' + p.s.year + '  -  ' +
					p.e.day.name + ' ' + p.e.day.number + '-' + p.e.month.name + ', ' + p.e.year;
			}

			// Call apply since this is updated in an event and angular may not know about the change!
			if (!$scope.$$phase) {
				$timeout(function () {
					$scope.$apply();
				}, 0);
			}
		};

		/**
		 * Callback from the chart whenever the range is updated
		 * This is called once at the end of zooming and scrolling
		 * @param period
		 */
		$scope.onRangeChanged = function (period) {
			//console.log("Range changed", period);
		};

		var now = moment().minutes(0).seconds(0).milliseconds(0);
		var groupCount = 3;
		var itemCount = 20;

		// create a data set with groups
		var names = ['John', 'Alston', 'Lee', 'Grant'];
		var groups = new VisDataSet();
		for (var g = 0; g < groupCount; g++) {
			groups.add({id: g, content: names[g]});
		}

		// create a dataset with items
		var items = new VisDataSet();
		for (var i = 0; i < itemCount; i++) {
			var start = now.clone().add(Math.random() * 200, 'hours');
			var group = Math.floor(Math.random() * groupCount);
			items.add({
				id: i,
				group: group,
				content: 'item ' + i +
				' <span style="color:#97B0F8;">(' + names[group] + ')</span>',
				start: start,
				type: 'box'
			});
		}

		// create visualization
		$scope.timelineOptions = {
			height:"100%",
			groupOrder: 'content'  // groupOrder can be a property name or a sorting function
		};

		$scope.graphEvents = {
			rangechange: $scope.onRangeChange,
			rangechanged: $scope.onRangeChanged,
			onload: $scope.onLoaded,
			doubleClick: $scope.onDoubleClick
		};

		$scope.timelineData = {
			items: items,
			groups: groups
		};


		$scope.timelineLoaded = true;


        var minBlockTimeMins = 15;
        var scalingFactor = 10;
//prototyping data
        $scope.categories = [{name:'Life'}, {name:'Work'}];
        $scope.subCategories = [{name:'Sleep'}, {name:'CreativeReader'}];

        $scope.authentication = Authentication;

        $scope.getLifeStyle = function(timeblock) {
            var lifeStyleWidth = this.calcBlockTime(timeblock);
            var lifeStyleColour = 'grey';
            return {'background-color': lifeStyleColour, 'width':lifeStyleWidth+'px'};
        };

        $scope.calcBlockTime = function(timeblock){
            var blockTimeLength = timeblock.endTime - timeblock.startTime;
            var scaledBlockTime = blockTimeLength / (1000 * 60 * minBlockTimeMins);
            console.log('raw time' + blockTimeLength+' calc time '+scaledBlockTime);
            return scaledBlockTime*scalingFactor;
        };

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
                    category: 'work',
                    subCategory: 'cycle commute',
                    impact: { category: 'health', effect:'8'},
                    startTime: new Date(2015, 1, 1, 8, 30, 0, 0),
                    endTime: new Date(2015, 1, 1, 9, 0, 0, 0),
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
