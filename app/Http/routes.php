<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

// Route::get('/', function () {
//     return view('home');
// });

Route::get('/', 'HomeController@index');
Route::get('/returning', 'HomeController@returning');
Route::get('/home', 'HomeController@home');
Route::post('/postTweet', 'HomeController@postTweet');
Route::post('/postTweetWithMedia', [
	'uses' => 'HomeController@postTweetWithMedia'
]);