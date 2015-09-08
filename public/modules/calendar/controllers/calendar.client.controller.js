'use strict';

angular.module('calendar').controller('CalendarController', ['$scope', 'Calendars',
	function($scope, Calendars) {


		$scope.findAllCalendars = function() {
			$scope.calendars = Calendars.get({});
		};
	}
]);
