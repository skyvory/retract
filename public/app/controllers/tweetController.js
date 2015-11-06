(function() {
	'use strict';

	angular
		.module('retractionApp')
		.controller('TweetController', function($scope, $http, $upload) {
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

			$scope.upload = function(files) {
				if(files && file.length) {
					for(var i = files.length-1; i>=0; i++) {
						var file = files[i];
						$upload.upload({
							url: 'postTweetWithMedia',
							fields: {
								key: 'value'
							},
							file: file
						})
						.progress(function (evt) {
							var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
							console.log('File upload ' + progressPercentage + '%');
						})
						.success(function(data, status, headers, config) {
							console.log(data);
						})
						.error(function(data, status, headers, config) {
							console.log(data);
						});
					}
				}
			};

			$scope.verifyUser();
		});
})();