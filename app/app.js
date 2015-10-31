'use strict';

var app = angular.module('retractionApp', [
	'ui.router',
	// 'ngTwitter',
	'retractionApp.services',
	'ngSanitize',
]);

// $twitterApi.configure(clientId, )

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	// redirect to the auth state if any other states are requested other than users
	$urlRouterProvider.otherwise('/home');

	$stateProvider
		// .state('auth', {
		// 	url: '/auth',
		// 	templateUrl: 'views/authView.html',
		// 	controller: 'AuthController as auth',
		// })
		.state('common', {
			templateUrl: 'views/common.html',
			abstract: true,
		})
		.state('home', {
			url: '/home',
			templateUrl: 'views/homeView.html',
			controller: 'HomeController as home',
			parent: 'common',
		})
		// .state('logout', {
		// 	url: '/logout',
		// 	// templateUrl: 'views/logoutView',
		// 	controller: 'LogoutController',
		// });
}]);