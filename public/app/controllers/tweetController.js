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

			$scope.doUpload = function(file, sequence, callback) {
				Upload.upload({
					url: 'postMedia',
					method: 'POST',
					file: file,
					sendFieldsAs: 'form',
					fields: {},
				})
				.then(function (resp) {
					var result = {
						media: '',
						sequence: '',
					};
					result.media = resp.data.media_id_string;
					result.sequence = sequence;
					console.log(result);
					if(callback) {
						callback(result);
					}
					else {
						return result;
					}
				}, function (resp) {
					console.log("ERROR", resp.status);
					return false;
				}, function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					console.log('PORGRESS', progressPercentage);
				});
			}

			$scope.upload = function(files) {
				if(files && files.length && files.length <= 4) {
					var media = [];
					var greencount = 0;
					var allgreen = true;
					for(var i = 0; i < files.length; i++) {
						$scope.doUpload(files[i], i, function(callresponse) {
							console.log("CALLBACK", callresponse);
							// check for files length and fire tweet post if complete
							// post tweet status with media
							var newtweet = $scope.newtweet;
							$http({
								method: 'POST',
								url: 'postTweetWithMedia',
								data: {
									status: newtweet,
									media: media,
								}
							}).then(function successCallback(response) {
								var xxx = [];
								xxx.push(response.data);
								$scope.tweets = xxx.concat($scope.tweets);
								$scope.newtweet = '';
							}), function errorCallback(response) {
								//
							}
						});
					}
					
				}
			}

			$scope.verifyUser();
		});
})();