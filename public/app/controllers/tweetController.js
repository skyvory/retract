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
					$scope.getUserTimeline();
				}), function errorCallback(response) {
					//
				}
			}

			$scope.getMentions = function() {
				$http({
					method: 'GET',
					url: 'mentions'
				}).then(function successCallback(response) {
					$scope.mentions = response;
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
						in_reply_to_status_id: $scope.mention_target_id,
					}
				}).then(function successCallback(response) {
					var xxx = [];
					xxx.push(response.data);
					$scope.tweets = xxx.concat($scope.tweets);
					$scope.newtweet = '';
					$scope.mention_target_id = '';
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
					var greencount = files.length;
					var green = 0;
					for(var i = 0; i < files.length; i++) {
						$scope.doUpload(files[i], i, function(callresponse) {
							if(callresponse.media) {
								media[callresponse.sequence] = callresponse.media;
								green++;
							}
							// post tweet status with media if number of successful upload equal total files
							if(green == files.length) {
								var newtweet = $scope.newtweet;
								var mention_target_id = $scope.mention_target_id;
								$http({
									method: 'POST',
									url: 'postTweetWithMedia',
									data: {
										status: newtweet,
										media: media,
										in_reply_to_status_id: mention_target_id
									},
								}).then(function successCallback(response) {
									var xxx = [];
									xxx.push(response.data);
									$scope.tweets = xxx.concat($scope.tweets);
									$scope.newtweet = '';
									$scope.mention_target_id = '';
								}), function errorCallback(response) {
									//
								}
							}
						});
					}
					
				}
			}

			$scope.mention_target_id = '';
			$scope.toMention = function(mention_target_id, screen_name) {
				$scope.mention_target_id = mention_target_id;
				$scope.newtweet = '@' + screen_name + ' ';
			}
			$scope.clearTweet = function() {
				$scope.newtweet = '';
				$scope.mention_target_id = '';
			}

			$scope.usertimeline = '';
			$scope.getUserTimeline = function() {
				$http({
					method: 'GET',
					url: 'getUserTimeline'
				}).then(function successCallback(response) {
					$scope.usertimeline = response;
				}), function errorCallback(response) {
					//
				}
			}

			$scope.verifyUser();
			$scope.getMentions();
		});
})();