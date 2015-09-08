'use strict';

//Setting up route
angular.module('calendar').config(['$stateProvider',
	function($stateProvider) {
		// Calendar state routing
		$stateProvider.
		state('calendars', {
			url: '/calendars',
			templateUrl: 'modules/calendar/views/list-calendars.client.view.html'
		});
	}
]);
