<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Abraham\TwitterOAuth\TwitterOAuth;

session_start();

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
		$connection = new TwitterOAuth('vi89NrRgmNdryV4jJtkaxgW0m', 'vLo9zzpLXSodZls3upKmxRhG6AawNRHqXe18SizCZ28nqxN2oo');
		// get temporary credentials, request twitter oauth token
		$request_token = $connection->oauth('oauth/request_token', array('oauth_callback' => ''));
		// if last connection failed don't display authorization link
		switch ($connection->getLastHttpCode()) {
			case 200:
			// omake
				// save temporary credential to session
				$_SESSION['oauth_token'] = $request_token['oauth_token'];
				$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];
				var_dump($_SESSION['oauth_token']);

				// build authorize URL and redirect use to Twitter
				$url = $connection->url('oauth/authorize', array('oauth_token' => $request_token['oauth_token']));
				break;
			default;

			// show notification if something went wrong
			echo 'Could not connect to Twitter. Refresh the page or try again later.';
		}
		echo '<a href="' . $url . '">aaa</a>';
		// $content = $connection->get("account/verify_credentials");
		// $request_token = $connection->getRequestToken('http://localhost/retract/public/');
		var_dump($request_token);
		// return view('home');
	}
	public function returning(Request $request) {
		$oauth_verifier = $request->input('oauth_verifier');
		// $_SESSION['oauth_verifier'] = $oauth_verifier;
		$request_token = [];
		$request_token['oauth_token'] = $_SESSION['oauth_token'];
		$request_token['oauth_token_secret'] = $_SESSION['oauth_token_secret'];

		// create TwitterOAuth object with app key/secret and token key/secret from default phase
		$connection = new TwitterOAuth('vi89NrRgmNdryV4jJtkaxgW0m', 'vLo9zzpLXSodZls3upKmxRhG6AawNRHqXe18SizCZ28nqxN2oo', $request_token['oauth_token'], $request_token['oauth_token_secret']);

		// request access token from twitter
		$access_token = $connection->oauth("oauth/access_token", array("oauth_verifier" => $oauth_verifier));
		$_SESSION['access_token'] = $access_token['oauth_token'];
		$_SESSION['access_token_secret'] = $access_token['oauth_token_secret'];
		var_dump($access_token);
		return redirect()->action('HomeController@home');
	}
	public function home(Request $request) {
		$access_token = $_SESSION['access_token'];
		var_dump($access_token);
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
