<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Abraham\TwitterOAuth\TwitterOAuth;

use Illuminate\Http\Response;

session_start();

// define('CONSUMER_KEY', 'vi89NrRgmNdryV4jJtkaxgW0m');
// define('CONSUMER_SECRET', 'vLo9zzpLXSodZls3upKmxRhG6AawNRHqXe18SizCZ28nqxN2oo');

define('CONSUMER_KEY', 'F4wpBL8XAbvnWVZduPDCRAC2L');
define('CONSUMER_SECRET', 'jkY2GogbNBftilsBMc4sjej2xjI0w4xHcKTpXUMqKLdwm3Rjwj');

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
		$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);
		// get temporary credentials, request twitter oauth token
		$request_token = $connection->oauth('oauth/request_token', array('oauth_callback' => ''));
		// if last connection failed don't display authorization link
		switch ($connection->getLastHttpCode()) {
			case 200:
			// omake
				// save temporary credential to session
				$_SESSION['oauth_token'] = $request_token['oauth_token'];
				$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];
				// var_dump($_SESSION['oauth_token']);

				// build authorize URL and redirect use to Twitter
				$url = $connection->url('oauth/authorize', array('oauth_token' => $request_token['oauth_token']));
				break;
			default;

			// show notification if something went wrong
			echo 'Could not connect to Twitter. Refresh the page or try again later.';
		}
		echo '<a href="' . $url . '">Authenticate</a>';
		// $content = $connection->get("account/verify_credentials");
		// $request_token = $connection->getRequestToken('http://localhost/retract/public/');
		// var_dump($request_token);
		// return view('home');

		// redirect automatically to twitter's authentication page
		return redirect($url);
	}
	public function returning(Request $request) {
		$oauth_verifier = $request->input('oauth_verifier');
		// $_SESSION['oauth_verifier'] = $oauth_verifier;
		$request_token = [];
		$request_token['oauth_token'] = $_SESSION['oauth_token'];
		$request_token['oauth_token_secret'] = $_SESSION['oauth_token_secret'];

		// create TwitterOAuth object with app key/secret and token key/secret from default phase
		$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $request_token['oauth_token'], $request_token['oauth_token_secret']);

		// request access token from twitter
		$access_token = $connection->oauth("oauth/access_token", array("oauth_verifier" => $oauth_verifier));
		$_SESSION['access_token'] = $access_token['oauth_token'];
		$_SESSION['access_token_secret'] = $access_token['oauth_token_secret'];
		var_dump($access_token);
		// return redirect()->action('HomeController@home');

		// set url directing to public directory
		$path = url('/');
		// redirect to front-end
		return redirect($path . '/front.html');
	}
	public function home() {
		$access_token = $_SESSION['access_token'];
		$access_token_secret = $_SESSION['access_token_secret'];
		// create twitteroauth object with access token
		$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token, $access_token_secret);
		$content = $connection->get('account/verify_credentials');
		// return view('home', ['user' => $content]);
		return response()->json(['content' => $content]);
	}
	public function postTweet(Request $request) {
		$access_token = $_SESSION['access_token'];
		$access_token_secret = $_SESSION['access_token_secret'];
		$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token, $access_token_secret);
		$exec = $connection->post('statuses/update', array('status' => $request->input('status')));
		return response()->json($exec);
	}
	public function postMedia(Request $request) {
		// $file = \Input::file('file');
		// return $file;
		$filename = $_FILES['file']['name'];
		$tmp = $_FILES['file']['tmp_name'];
		// return $tmp;
		$access_token = $_SESSION['access_token'];
		$access_token_secret = $_SESSION['access_token_secret'];
		$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token, $access_token_secret);
		$connection->setTimeouts(10, 15);
		$media = $connection->upload('media/upload', array('media' => $tmp));

		// $dest = '../resources/assets/' . $filename;
		// move_uploaded_file($tmp, $dest);

		return response()->json($media);
	}
	public function postTweetWithMedia(Request $request) {
		$access_token = $_SESSION['access_token'];
		$access_token_secret = $_SESSION['access_token_secret'];
		$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token, $access_token_secret);
		$connection->setTimeouts(10, 15);
		$parameters = array(
			'status' => $request->input('status'),
			'media_ids' => implode(',', $request->input('media')),
		);
		// return var_dump($parameters);
		$exec = $connection->post('statuses/update', $parameters);
		return response()->json($exec);
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
