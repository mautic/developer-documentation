### Extending Integrations

```php
<?php
<?php
// plugins\HelloWorldBundle\Integration\MarsIntegration

namespace MauticPlugin\HelloWorldBundle\Integration;

use Mautic\PluginBundle\Entity\Integration;
use Mautic\PluginBundle\Integration\AbstractIntegration;
use Mautic\PluginBundle\Helper\oAuthHelper;

/**
 * Class MarsIntegration
 */
class MarsIntegration extends AbstractIntegration
{
    /**
     * Returns the name of the social integration that must match the name of the file
     * For example, IcontactIntegration would need Icontact here
     *
     * @return string
     */
    public function getName()
    {
        return 'Mars';
    }

    /**
     * Display name for the integration which defaults to getName() unless defined here
     */
    public function getDisplayName()
    {
        return 'Red Mars'
    }
    
    /**
     * Get the type of authentication required for this API.  Values can be none, key, oauth2 or callback
     * (will call $this->authenticationTypeCallback)
     *
     * @return string
     */
    public function getAuthenticationType()
    {
        return 'oauth2';
    }

    /**
     * OAuth2 authentication URL
     */
    public function getAuthenticationUrl()
    {
        return 'https://somesite.com/oauth/authorize';
    }

    /**
     * OAuth2 access token URL
     */
    public function getAccessTokenUrl()
    {
        return 'https://somesite.com/oauth/access_token';
    }

    /**
     * Get a list of supported features for this integration
     *
     * @return array
     */
    public function getSupportedFeatures()
    {
        return array(
            'public_profile',
            'public_activity'
        );
    }
}
```

Integrating 3rd party services in Mautic can be done by defining an Integration class for the service. For example, the MauticSocialBundle has several social media service classes defined in \Plugins\MauticSocialBundle\Integration.  Each integration class handles the authorization process, integration configuration, etc.
 
#### Integration Class
 
 Each plugin can have multiple integrations by defining each as it's own Integration class in the bundle's Integration folder. The class should extend `\Mautic\PluginBundle\Integration\AbstractIntegration`. It defines the integration and provides a number of helper functions including OAuth authorization/request signing functions.
 
#### Integration Image
 
 Each integration is displayed on a "card" in the Manage Plugins area. To set an image for the integration, include an image in the bundle's Assets\img.  It should be 128x128px, be in a png, and have the same name as returned by `getName()` as lower case. For example, `\MauticPlugin\HelloWorldBundle\Integration\MarsIntegration` should have an image `plugins\HelloWorldBundle\Assets\img\mars.png`.  
  
#### Authorization

Out of the box, the AbstractIntegration class can handle standard key, OAuth1a, and OAuth2 specifications. The authorization type is defined by the `getAuthenticationType()` function. Each input required by the user (i.e username, password, etc) are defined by an array of keyName => label elements returned by `getRequiredKeyFields()`. This function is not required if using standard specs of key, OAuth1a, or OAuth2.
  
#### Functions

Some of the main functions used are described below. Review the AbstractIntegration class and the functions docblocks for more details.

Keys saved by the integration are encrypted. To access the unencrypted versions in the Integration class, use the array `$this->keys`. 

Any of the functions defined in AbstractIntegration can be overridden per special needs of the specific Integration being implemented.

Area|Function|Description
----|--------|-----------
Auth|getRequiredKeyFields|Returns an array of keyName => label elements for settings required from the user, i.e. username, password, client id, client secret, key, etc. Each element will be displayed as an input in the integration's settings.
Auth|getSecretKeys|Any keyName returned by getRequiredKeyFields that is considered secret or a password should be returned in an array by this function so that it's properly masked in the form.
Auth & Request|getClientIdKey|Used to define the "username" for the integration. It defaults to 'client_id' for authentication type oauth2 and 'keyName' for the keyName authentication type. 
Auth & Request|getClientSecretKey|Used to define the "password" for the integration. By default, only oauth2 uses this and returns 'client_secret'.  
Auth|getAuthLoginUrl|Defines the login URL for the oauth1a spec
Auth|getRequestToken|Used by the oauth1a spec to retrieve a request token during authorization
Auth|getRequestTokenUrl|Used by the oauth1a spec to define the request token URL
Auth|getAuthenticationUrl|Defines the login URL for the oauth2 spec
Auth|getAccessTokenUrl|Defines the access token URL for the oauth2 spec
Auth|getAuthScope|Defines the scope for the oauth2 spec
Auth|getAuthCallbackUrl|Used to define the callback URL for oauth1a or oauth2 specs. This defaults to the mautic_integration_auth_callback route.
Auth|prepareResponseForExtraction|Called by extractAuthKeys() to manipulate the data prior to checking validating the response by checking that the keyName returned by getAuthTokenKey() is part of the response. If not, it calls getErrorsFromResponse().
Auth|getErrorsFromResponse|Called by extractAuthKeys() to extract errors from the response into a string.
Auth & Request|prepareRequest|Called by makeRequest() to manipulate or prepare parameters, settings, headers, etc before sending to the URL
Auth & Request|parseCallbackResponse|Called by makeRequest() to parse the response for the request into an array.
Auth & Request|getAuthTokenKey|Returns the keyName that's used to sign a request. Used by oauth1a (oauth_token) and oauth2 (access_token) specs.
Request|getBearerToken|Generate a bearer token if required by the oauth2 spec
General|isConfigured|Called to determine if the integration has been correctly configured.
General|isAuthorized|Called to determine if the integration is authorized (or peforms a reauth if an oauth2 spec has refresh tokens stored)
Request|makeRequest|Can be used to make API requests. It automatically handles standard key, oauth1a and oauth2 specs.
Form|getFormSettings|Returns an array of options of what to display in integration's configuration form. The two options used at this time is `requires_callback` (true to show a readonly input with the callback returned by getAuthCallbackUrl()) and `requires_authorization` (true to display the authorization button).
Form|getFormNotes|Returns an array of "helper notes" to display in the various areas of the form. 

```php

class XyzController extends CommonController
{
    public function someAction()
    {
        $token = 'abc';
        $idtoken = 'xyz';
        
        /*as defined in config file*/    
        $service = $this->get('mautic.integration.servicename');      
        $serviceIntegrationObject = $this->getLineIntegrationObject($service);

        /*
        get request example
        */
        $response = $serviceIntegrationObject->makeRequest(
            'https://example.com/api/product',
            [
                /*parameters, can be passed in url as well in case of get request*/
                'fields' => '[\'name\',\'price\']',
                'limit' => 10
            ],
            'GET',
            [
                'headers' => [
                    'Content-Type' => 'application/x-www-form-urlencoded',
                    'charset' => 'utf-8',
                    'access_token' => $token
                ]
            ]
        );

        /*
        post request example
        */
        $response = $serviceIntegrationObject->makeRequest(
            'https://example.com/oauth2/v2.1/verify',
            [
                'id_token' => $idtoken,
                'client_id' => $serviceIntegrationObject->getKeys()['client_id']
            ],
            'POST',
            [
                /*headers, if any*/
            ]
        );

    }

    private function getIntegrationObject($service)
    {
        /** @var \Mautic\PluginBundle\Helper\IntegrationHelper $integrationHelper */
        $integrationHelper = $this->get('mautic.helper.integration');
        /** @var AbstractIntegration $integrationObject */
        return $integrationHelper->getIntegrationObject($service->getName());
    }
}

```

#### makeRequest()

makeRequest() can be used to automatically sign outgoing requests and/or authentication processes. Of course, any integration can inherit and override this class to suit the integrations needs. It accepts the following parameters:

Name|Type|Description
----|----|-----------
$url|string|The url to make the request to
$parameters|array|An array of parameters to submit with the request.  If $method is GET, these will be appended to the query string. Otherwise, they will be part of the POST body.
$method|string|The request method i.e. get, post, put, patch, delete
$settings|array|Configures the behavior of the makeRequest function. Built in optional settings are below.

##### Settings
Key|Type|Description
----|----|-----------
auth_type|string|Overrides the authentication type for the request. If not set, getAuthenticationType() is used.
query|array|Append parameters to the query of the request URL.
content_type|string|Sets the content type header for the request.
encode_parameters|string|If set to json, parameters in the POST will be json encoded prior to making the request.
headers|array|Array of custom headers to append to the request.
ssl_verifypeer|bool|Set the CURLOPT_SSL_VERIFYPEER to true.
curl_options|array|Custom set of curl options to apply to the request.
return_raw|bool|If true, return the response rather than running it through parseCallbackResponse first.
authorize_session|bool|Used by prepareRequest() and parseCallbackResponse() to change the behavior based on whether the if the request is obtaining authorization or just making an API call.

#### Mautic 3.x
- Removed deprecated method `Mautic\PluginBundle\Integration\AbstractIntegration::init()`
- Removed deprecated method `Mautic\PluginBundle\Integration\AbstractIntegration::getUserId()`
- Changed constructor args in `\Mautic\PluginBundle\Integration\AbstractIntegration` and removed setter methods used by IntegrationPass