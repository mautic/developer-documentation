### OAuth 1a
```php
<?php
use Mautic\Auth\ApiAuth;

// ApiAuth::initiate will accept an array of OAuth settings
$settings = array(
    'baseUrl'      => 'https://your-mautic.com',
    'version'      => 'OAuth1a',
    'clientKey'    => '5ad6fa7asfs8fa7sdfa6sfas5fas6asdf8',
    'clientSecret' => 'adf8asf7sf54asf3as4f5sf6asfasf97dd', 
    'callback'     => 'https://your-callback.com'
);

// Initiate the auth object
$auth = ApiAuth::initiate($settings);

// Initiate process for obtaining an access token; this will redirect the user to the authorize endpoint and/or set the tokens when the user is redirected back after granting authorization

if ($auth->validateAccessToken()) {
    if ($auth->accessTokenUpdated()) {
        $accessTokenData = $auth->getAccessTokenData();
        
        //store access token data however you want
    }
}
```
The OAuth 1a method is recommended for servers that are not behind https.  Note that OAuth 1a access tokens do not expire. 

OAuth 1a can be a complicated method due to the need to generate a signature for the request. If anything is off with the signature, the request will not be validated.

#### Authorization
##### Step One - Obtain a Request Token

The first step is to obtain a request token that will be used when directing the user to the authorization page. 

Make a POST to the request token endpoint `/oauth/v1/request_token`:

<pre class="inline">
POST /oauth/v1/request_token
Authorization: 
        OAuth oauth_callback="https%3A%2F%2Fyour-callback-uri.com",
              oauth_consumer_key="CONSUMER_KEY",
              oauth_nonce="UNIQUE_STRING",
              oauth_signature="GENERATED_REQUEST_SIGNATURE",
              oauth_signature_method="HMAC-SHA1",
              oauth_timestamp="1318467427",
              oauth_version="1.0"
</pre>
(note that the header has been wrapped for legibility)

Review [Generating the Authorization Header](#generating-the-authorization-header) on the specifics of generating the OAuth header.

The response will be a query string:

<pre class="inline">
oauth_token=REQUEST_TOKEN&oauth_token_secret=REQUEST_TOKEN_SECRET&oauth_expires_in=3600
</pre>

Parse the string and use the parameters in the next step as indicated. 

<aside class="notice">
These must be preserved in some kind of persistent storage as they will be used when obtaining the access token.
</aside>

Note that the refresh token is only good for the number of seconds specified in `oauth_expires_in`. 

##### Step Two - Authorization

Now redirect the user to the authorization endpoint `oauth/v1/authorize` with the request token as part of the URL's query.

If the callback is something different than what is configured in Mautic, url encode it and include in the query as `oauth_callback`.

<pre class="inline">
/oauth/v1/authorize?oauth_token=REQUEST_TOKEN&oauth_callback=https%3A%2F%2Fyour-callback-uri.com
</pre>

The user will login and Mautic will redirect back to the either the consumer's configured callback or to the `oauth_callback` included in the query.

The callback will include `oauth_token` and `oauth_verifier` in the URL's query. 

Compare the `oauth_token` in the query with that obtained in step two to ensure they are the same and prevent cross-site request forgery.

`oauth_verifier` will need to be part of the header generated in step three.

##### Step Three - Obtain an Access Token

[Generate the Authorization header](#generating-the-authorization-header) and make a POST to the access token endpoint `/oauth/v1/access_token`.

When generating the header, the `oauth_token_secret` returned in step two should be used as the `TOKEN_SECRET` in the composite key. 

`oauth_verifier` from step two should be part of the Authorization header generated.

<pre class="inline">
POST /oauth/v1/access_token
Authorization: 
        OAuth oauth_callback="https%3A%2F%2Fyour-callback-uri.com",
              oauth_consumer_key="CONSUMER_KEY",
              oauth_nonce="UNIQUE_STRING",
              oauth_signature="GENERATED_REQUEST_SIGNATURE",
              oauth_signature_method="HMAC-SHA1",
              oauth_timestamp="1318467427",
              oauth_verifier="OAUTH_VERIFIER_FROM_STEP_TWO"
              oauth_version="1.0"
</pre>
(note that the header has been wrapped for legibility)

The response should include a query string with the access token:

<pre class="inline">
oauth_token=ACCESS_TOKEN&oauth_token_secret=ACCESS_TOKEN_SECRET
</pre>

<aside class="notice">
Mautic's OAuth 1a access tokens do not expire but the user can deauthorize them. If the access token is invalid, a `401` response will be returned.
</aside>

The `oauth_token` can be included in the authorize header and the `oauth_token_secret` should be used as the `TOKEN_SECRET` in the composite key when signing API requests.
 
#### Generating the Authorization Header

The OAuth header may include the following parameters:

Key|Description
---|-----------
oauth_callback|Optional, URL encoded callback to redirect the user to after authorization. If the callback URL is set in Mautic, this must match.
oauth_consumer_key|The consumer key obtained from Mautic's API Credentials
oauth_nonce|Uniquely generated string that should be used only once 
oauth_signature|Signature generated from all applicable data for the request
oauth_signature_method|Method for creating the signature. Currently, only `HMAC-SHA1` is supported.
oauth_timestamp|Current unix timestamp
oauth_token|The access token
oauth_verifier|Returned after authorization and used when requesting an access token
oauth_version|Should always be `1.0`

<aside class="notice">
When making a GET or POST request with parameters, all parameters should be included in the header as well.  
</aside>

##### Step One - Build the Base String

The base string is used to generate the oauth_signature. 

The structure of the base string is as follows:

<pre class="inline">
METHOD&URL_ENCODED_URI&NORMALIZED_PARAMETERS
</pre>

`METHOD` should be the request method and should always be capitalized.

`URL_ENCODED_URI` should be the base URI the request is made to. It should not include any query parameters (query parameters should be part of `NORMALIZED_PARAMETERS`).

`NORMALIZED_PARAMETERS` should be a url encoded, alphabetically sorted query string of the above oauth parameters (except `oauth_signature`) plus the parameters of the request (query/post body). 

Each key and each value of the parameters must be url encoded individually as well. 

<aside class="warning">
PHP should use <code>rawurlencode()</code> instead of <code>urlencode()</code>.
</aside>

Then each url encoded key/value pair should be concatenated into a single string with an ampersand (&) as the glue character.

For example, let's say a request includes a query of `title=Mr&firstname=Joe&lastname=Smith`. The process would look something like the following (replacing `urlencode()` with whatever function is appropriate for the language being used).  Of course realistically, natural sort and loop functions would be used.

<pre class="inline">
urlencode(
    urlencode(firstname)=urlencode(Joe)
    &urlencode(lastname)=urlencode(smith)
    &urlencode(oauth_callback)=urlencode(https%3A%2F%2Fyour-callback-uri.com)
    &urlencode(oauth_consumer_key)=urlencode(kdjafs7fsdf86ads7a98a87df6ad9fsf98ad7f)
    &urlencode(oauth_nonce)=urlencode(ak877asdf6adf68asd9fas)
    &urlencode(oauth_signature_method)=urlencode(HMAC-SHA1)
    &urlencode(oauth_timestamp)=urlencode(1437604736)
    &urlencode(oauth_version)=urlencode(1.0)
    &urlencode(title)=urlencode(Mr)
)
</pre>

<aside class="notice">
Multidimensional arrays should use <code>foo=baz&foo=bar</code> rather than <code>foo[bar]=baz&foo[baz]=bar</code> when generating the normalized parameters string.
</aside>

<aside class="notice">
Notice that <code>oauth_callback</code>, if included, is DOUBLE url encoded.
</aside>

Put all together, a base string might look like:

<pre class="inline">
GET&http%3A%2F%2Fyour-mautic.com%2Fapi&firstname%3DJoe%26lastName%3DSmith%26oauth_callback%3Dhttps%253A%252F%252Fyour-callback-uri.com%26oauth_consumer_key%3Dkdjafs7fsdf86ads7a98a87df6ad9fsf98ad7f%26oauth_nonce%3Dak877asdf6adf68asd9fas%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1437604736%26oauth_version%3D1.0%26title%3DMr
</pre>

##### Step Two - Build the Composite Key

The composite key is used to encrypt the base string. It is composed of the consumer secret and the token secret if available (post authorization) combined with an ampersand (&).  

<pre class="inline">
CLIENT_SECRET&TOKEN_SECRET
</pre>

 If the token secret is not available, i.e. during the request token process, then an ampersand (&) should still be used.
 
 <pre class="inline">
 CLIENT_SECRET&
 </pre>
 
 <aside class="notice"><code>TOKEN_SECRET</code> Sources<br />
 For <code>/oauth/v1/request_token</code>, <code>TOKEN_SECRET</code> is empty.<br /><br />
 For <code>/oauth/v1/access_token</code>, <code>TOKEN_SECRET</code> will be the <code>oauth_token_secret</code> returned by the request to <code>/oauth/v1/request_token</code><br /><br />
 For all other API endpoints, <code>TOKEN_SECRET</code> will be the <code>oauth_token_secret</code> returned by the request to <code>/oauth/v1/access_token</code>
 </aside>
 
##### Step Three - Generate the Signature
 
 Now, using the base string and the composite key, the signature can be generated using the appropriate HMAC function available to the language used. The signature generated should then be base64 encoded prior to being used in the Authorization header.
 
 <pre class="inline">
 base64_encode(
    hmac_sha1(BASE_STRING, COMPOSITE_KEY)
 )
 </pre>
 
 The resulting string should then be used included in the header as `oauth_signature`.
 
#### Signing the API Request

To sign the API request, [generate the Authorization header](#generating-the-authorization-header) using the obtained access token.

<pre class="inline">
POST /api/leads/new
Authorization: 
        OAuth oauth_callback="https%3A%2F%2Fyour-callback-uri.com",
              oauth_consumer_key="CONSUMER_KEY",
              oauth_nonce="UNIQUE_STRING",
              oauth_signature="GENERATED_REQUEST_SIGNATURE",
              oauth_signature_method="HMAC-SHA1",
              oauth_timestamp="1318467427",
              oauth_token="ACCESS_TOKEN"
              oauth_version="1.0"
              
title=Mr&firstname=Joe&lastname=Smith
</pre>
(note that the header has been wrapped for legibility)