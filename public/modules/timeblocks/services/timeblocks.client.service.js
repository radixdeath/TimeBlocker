'use strict';

//Timeblocks service used to communicate Timeblocks REST endpoints
angular.module('timeblocks').factory('Timeblocks', ['$resource',
	function($resource) {
		return $resource('timeblocks/:timeblockId', { timeblockId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);