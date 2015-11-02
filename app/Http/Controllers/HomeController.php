<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Abraham\TwitterOAuth\TwitterOAuth;

class HomeController extends Controller
{
	/**
	 * Display a listing of the resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		// build TwitterOAuth object with client credentials
		$connection = new TwitterOAuth('F4wpBL8XAbvnWVZduPDCRAC2L', 'jkY2GogbNBftilsBMc4sjej2xjI0w4xHcKTpXUMqKLdwm3Rjwj');
		// get temporary credentials, request twitter oauth token
		$request_token = $connection->oauth('oauth/request_token', array('oauth_callback' => ''));
		// if last connection failed don't display authorization link
		switch ($connection->getLastHttpCode()) {
			case 200:
				// save temporary credential to session
				$_SESSION['oauth_token'] = $request_token['oauth_token'];
				$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];

				// build authorize URL and redirect use to Twitter
				$url = $connection->url('oauth/authorize', array('oauth_token' => $request_token['oauth_token']));
				break;
			default;

			// show notification if something went wrong
			echo 'Could not connect to Twitter. Refresh the page or try again later.';
		}
		echo $url;
		// $content = $connection->get("account/verify_credentials");
		// $request_token = $connection->getRequestToken('http://localhost/retract/public/');
		var_dump($request_token);
		// return view('home');
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request)
	{
		//
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function edit($id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, $id)
	{
		//
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		//
	}
}
