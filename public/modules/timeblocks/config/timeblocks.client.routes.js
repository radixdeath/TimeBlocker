'use strict';

//Setting up route
angular.module('timeblocks').config(['$stateProvider',
	function($stateProvider) {
		// Timeblocks state routing
		$stateProvider.
		state('listTimeblocks', {
			url: '/timeblocks',
			templateUrl: 'modules/timeblocks/views/list-timeblocks.client.view.html'
		}).
		state('createTimeblock', {
			url: '/timeblocks/create',
			css: '/timeblocks/timeblocs.css',
			templateUrl: 'modules/timeblocks/views/create-timeblock.client.view.html'
		}).
		state('day', {
			url: '/day',
			css: '/timeblocks/timeblocs.css',
			templateUrl: 'modules/timeblocks/views/day.client.view.html'
		}).
		state('viewTimeblock', {
			url: '/timeblocks/:timeblockId',
			templateUrl: 'modules/timeblocks/views/view-timeblock.client.view.html'
		}).
		state('editTimeblock', {
			url: '/timeblocks/:timeblockId/edit',
			templateUrl: 'modules/timeblocks/views/edit-timeblock.client.view.html'
		});
	}
]);
