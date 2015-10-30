(function() {
	'use strict';

	angular
		.module('retractionApp')
		.controller('HomeController', function($scope, $q, twitterService) {

			$scope.tweets = [];
			$scope.newtweet = '';
			twitterService.initialize();

			//using the OAuth authorization result get the latest 20 tweets from twitter for the user
			$scope.refreshTimeline = function(maxId) {
				twitterService.getLatestTweets(maxId).then(function(data) {
					// console.log('data', data);
					$scope.tweets = $scope.tweets.concat(data);
				},function() {
					$scope.rateLimitError = true;
				});
			}

			$scope.getMentions = function() {
				twitterService.getMentions().then(function(data) {
					$scope.tweets = $scope.tweets.concat(data);
				}, function() {
					$scope.rateLimitError = true;
				});
			}

			function addslashes(str) {
				str = str.replace(/\\/g, '\\\\');
				str = str.replace(/\'/g, '\\\'');
				str = str.replace(/\"/g, '\\"');
				str = str.replace(/\0/g, '\\0');
				return str;
			}

			function stripslashes(str) {
				str = str.replace(/\\'/g, '\'');
				str = str.replace(/\\"/g, '"');
				str = str.replace(/\\0/g, '\0');
				str = str.replace(/\\\\/g, '\\');
				return str;
			}

			$scope.tweet = function() {
				var newtweet = $scope.newtweet;
				twitterService.postStatus(newtweet).then(function(data) {
					// prepare empty array
					var xxx = [];
					// push new tweet object to empty array
					xxx.push(data);
					// merge (append) existing tweet cluster to new tweet array
					$scope.tweets = xxx.concat($scope.tweets);
					// clear input
					$scope.newtweet = '';
				}, function() {
					$scope.rateLimitError = true;
				});
			}

			$scope.stepsModel = [];
			$scope.upload = function(event) {
				var files = event.target.files;
				// console.log(files);
				for (var i = 0; i < files.length; i++) {
					var file = files[i];
					var reader = new FileReader();
					reader.onload = $scope.imageIsLoaded;
					reader.readAsDataURL(file);
				}
			}

			$scope.imageIsLoaded = function(e) {
				$scope.$apply(function() {
					$scope.stepsModel.push(e.target.result);
					// do send to twitter after process
					var gazou = e.target.result;
					// console.log(gazou);
					twitterService.postImage(gazou).then(function(data) {
						console.log(data);
					}, function() {
						$scope.rateLimitError = true;
					});
				});
			}

			// when the user clicks the connect twitter button, the popup authorization window open
			$scope.connectButton = function() {
				twitterService.connectTwitter().then(function() {
					if(twitterService.isReady()) {
						// if authorization is successful, hide the connect button and display the tweet
						$('#connectButton').fadeOut(function() {
							$('#container').fadeIn();
							$scope.refreshTimeline();
							$scope.connectedTwitter = true;
						});
					}
					else {
						//
					}
				});
			}

			// sign out clears the OAuth cache, the user will have to reauthenticate when returning
			$scope.signOut = function() {
				twitterService.clearCache();
				$scope.tweets.length = 0;
				$('#getTimelineButton, #signOut').fadeOut(function() {
					$('#connectButton').fadeIn();
					$scope.$apply(function() {
						$scope.connectedTwitter = false
					});
				});
			}

			// if the user is a returning user, hide the sign in button and display the tweets
			if(twitterService.isReady()) {
				$('#connectButton').hide();
				$('#container').show();
				$scope.connectedTwitter = true;
				$scope.refreshTimeline();
				// $scope.getMentions();
			}
		});
})();