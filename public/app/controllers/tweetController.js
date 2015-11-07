(function() {
	'use strict';

	angular
		.module('retractionApp')
		.controller('TweetController', function($scope, $http, Upload) {
			$scope.tweets = [];
			$scope.newtweet = '';
			$scope.user = '';

			$scope.verifyUser = function() {
				$http({
					method: 'GET',
					url: 'home'
				}).then(function successCallback(response) {
					$scope.user = response;
				}), function errorCallback(response) {
					//
				}
			}

			$scope.tweet = function() {
				var newtweet = $scope.newtweet;
				$http({
					method: 'POST',
					url: 'postTweet',
					data: {
						status: newtweet,
					}
				}).then(function successCallback(response) {
					var xxx = [];
					xxx.push(response.data);
					$scope.tweets = xxx.concat($scope.tweets);
					$scope.newtweet = '';
				}), function errorCallback(response) {
					//
				}
			}

			$scope.upload = function(file) {
				Upload.upload({
					url: 'postTweetWithMedia',
					// data: {
					// 	file: file,
					// 	'key': 'val',
					// }
					method: 'POST',
					file: file,
					sendFieldsAs: 'form',
					fields: {
						key: 'val',
					}
				})
				.then(function (resp) {
					console.log(resp.data);
				}, function (resp) {
					console.log("Error", resp.status);
				}, function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					console.log('progress: ' + progressPercentage + '%');
				});
			};

			$scope.verifyUser();
		});
})();