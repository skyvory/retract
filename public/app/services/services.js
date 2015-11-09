angular.module('retractionApp.services', [])
	.factory('twitterService', function($q) {
		var authorizationResult = false;

		return {
			initialize: function() {
				// go to oauth.io to set up oauth proxy, put https://oauth.io/auth on twitter app's Callback URL
				// initialize oauth.io with public key of the application
				OAuth.initialize('Gc1Ckf0s6GZw56KQS8NWdBglRiw', {
					cache: true
				});
				// try to create an authorization result when the page loads
				// this means a returning user won't have to click the twitter button again
				authorizationResult = OAuth.create("twitter");
			},
			isReady: function() {
				return (authorizationResult);
			},
			connectTwitter: function() {
				var deferred = $q.defer();
				OAuth.popup("twitter", {
					cache: true
				}, function(error, result) {
					//cache means to execute the callback if the tokens are already present
					if(!error) {
						authorizationResult = result;
						deferred.resolve();
					}
					else {
						//do something if there's an error
					}
				});
				return deferred.promise;
			},
			clearCache: function() {
				OAuth.clearCache('twitter');
				authorizationResult = false;
			},
			getLatestTweets: function(maxId) {
				// create a deferred object using Angular's $q service
				var deferred = $q.defer();
				var url = '/1.1/statuses/home_timeline.json';
				if(maxId) {
					url += '?max_id=' + maxId;
				}
				// console.log("XXX",  authorizationResult);
				var promise = authorizationResult.get(url).done(function(data) {
					// https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
					// when the data is retrieced resolve the deferred object
					deferred.resolve(data);
				}).fail(function(err) {
					deferred.reject(err);
				});
				// return the promise of the deferred object
				return deferred.promise;
			},

			getMentions: function() {
				var deferred = $q.defer();
				var url = '/1.1/statuses/mentions_timeline.json';
				var promise = authorizationResult.get(url).done(function(data) {
					deferred.resolve(data);
				}).fail(function(err) {
					deferred.reject(err);
				});
				return deferred.promise;
			},
			postStatus: function(status) {
				var deferred = $q.defer();
				var url = '/1.1/statuses/update.json';
				var params = {
					data: {
						status: status,
					}
				};
				var promise = authorizationResult.post(url, params).done(function(data) {
					deferred.resolve(data);
				}).fail(function(err) {
					deferred.reject(err);
				});
				return deferred.promise;
			},
			postImage: function(gazou) {
				var deferred = $q.defer(); var url = 'https://upload.twitter.com/1.1/media/upload.json';
				var params = {
					data: {
						media_data: gazou,
					}
				};
				var promise = authorizationResult.post(url, params).done(function(data) {
					deferred.resolve(data);
				}).fail(function(err) {
					deferred.reject(err);
				});
				return deferred.promise;
			},
			postStatusWithMedia: function(status, media) {
				var deferred = $q.defer();
				var url = '/1.1/statuses/update.json';
				var params = {
					data: {
						status: status,
						media_ids: [
							media
						]
					}
				};
				// console.log(params.data.media_ids);
				var promise = authorizationResult.post(url, params).done(function(data) {
					deferred.resolve(data);
				}).fail(function(err) {
					deferred.reject(err);
				});
				return deferred.promise;
			}
		}
	});