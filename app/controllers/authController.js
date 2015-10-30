(function() {
	'use strict';

	angular
		.module('retractionApp')
		.controller('AuthController', AuthController);

	function AuthController($auth, $state, $scope) {

		$scope.authenticate = function(provider) {
			$auth.authenticate(provider);
		}
		
	}
})();