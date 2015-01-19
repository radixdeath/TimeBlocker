'use strict';

// Configuring the Articles module
angular.module('timeblocks').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Timeblocks', 'timeblocks', 'dropdown', '/timeblocks(/create)?');
		Menus.addSubMenuItem('topbar', 'timeblocks', 'List Timeblocks', 'timeblocks');
		Menus.addSubMenuItem('topbar', 'timeblocks', 'New Timeblock', 'timeblocks/create');
	}
]);