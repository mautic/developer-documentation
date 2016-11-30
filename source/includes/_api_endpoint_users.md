## Users
Use this endpoint to manipulate and obtain details on Mautic's users.

```php
<?php
use Mautic\MauticApi;
use Mautic\Auth\ApiAuth;

// ...
$auth       = ApiAuth::initiate($settings);
$apiUrl     = "https://your-mautic.com"; 
$userApi = MauticApi::getContext("users", $auth, $apiUrl);
```

### Get user
```php
<?php

//...
$user = $userApi->get($id);
```
```json
    "user": {
        "id": 1,
        "dateAdded": "2015-07-21T12:27:12-05:00",
        "createdBy": 1,
        "createdByUser": "Joe Smith",
        "dateModified": "2015-07-21T14:12:03-05:00",
        "modifiedBy": 1,
        "modifiedByUser": "Joe Smith",
        "username": "test user",
        "firstName": "test",
        "lastName": "USER",
        "email": "test.user@test.com",
        "position": "Market Lead",
        "timezone": "",
        "locale": "",
        "lastLogin": "2016-09-27T09:34:36+00:00",
        "lastActive": "2015-07-21T14:19:37-05:00",
        "onlineStatus": "online",
        "signature": NULL,
        "role":{
        	 "createdByUser": NULL,
        	 "modifiedByUser": NULL,
        	 "id": 1,
        	 "name": "Administrator",
        	 "description": "Full system access",
        	 "isAdmin": TRUE,
        }
    }
```
Get an individual user by ID.

#### HTTP Request

`GET /users/ID`

#### Response

`Expected Response Code: 200`

See JSON code example.

**User Properties**

Name|Type|Description
----|----|-----------
id|int|ID of the user
dateAdded|datetime|Date/time user was created
createdBy|int|ID of the user that created the user
createdByUser|string|Name of the user that created the user
dateModified|datetime/null|Date/time user was last modified
modifiedBy|int|ID of the user that last modified the user
modifiedByUser|string|Name of the user that last modified the user
username|srting|User login
firstName|string|User first name
lastName|string|User last name
email|String|User email
position|String|User position
timezone|datetime/null|User timezone
locale|datetime/null|User locale
lastLogin|datetime/null|User last login
lastActive|datetime/null|User last active
onlineStatus|datetime/null|user online status
signature|datetime/null|User signature
role|datetime/null|User active role

### List user
```php
<?php

//...
$users = $userApi->getUser();
```
```json
{
    "total": "1",
    "users": [
    	{
	        "id": 1,
	        "dateAdded": "2015-07-21T12:27:12-05:00",
	        "createdBy": 1,
	        "createdByUser": "Joe Smith",
	        "dateModified": "2015-07-21T14:12:03-05:00",
	        "modifiedBy": 1,
	        "modifiedByUser": "Joe Smith",
	        "username": "test user",
	        "firstName": "test",
	        "lastName": "USER",
	        "email": "test.user@test.com",
	        "position": "Market Lead",
	        "timezone": "",
	        "locale": "",
	        "lastLogin": "2016-09-27T09:34:36+00:00",
	        "lastActive": "2015-07-21T14:19:37-05:00",
	        "onlineStatus": "online",
	        "signature": NULL,
	        "role":{
	        	 "createdByUser": NULL,
	        	 "modifiedByUser": NULL,
	        	 "id": 1,
	        	 "name": "Administrator",
	        	 "description": "Full system access",
	        	 "isAdmin": TRUE,
	        }
	    }
    ]
}
```
Get a list of users.

#### HTTP Request

`GET /users`

**Query Parameters**

Name|Description
----|-----------


#### Response

`Expected Response Code: 200`

See JSON code example.

**Properties**

Same as [Get User](#get-user).

### Create User
```php
<?php 

$data = array(
    'username' => 'Jim.login',
    'firstName' => 'Jim',
    'lastName'  => 'USER',
    'email'     => 'jim@his-site.com',
    'plainPassword' => 'the_passWord',
    'position' => 'CMO',
    'role' => '2'
);

$user = $userApi->addUser($data);
```
Create a new user.

#### HTTP Request

`POST /users/add`

**Post Parameters**

Name|Type|Description
----|----|-----------
id|int|ID of the user
dateAdded|datetime|Date/time user was created
createdBy|int|ID of the user that created the user
createdByUser|string|Name of the user that created the user
dateModified|datetime/null|Date/time user was last modified
modifiedBy|int|ID of the user that last modified the user
modifiedByUser|string|Name of the user that last modified the user
username|srting|User login
firstName|string|User first name
lastName|string|User last name
email|String|User email
position|String|User position
timezone|datetime/null|User timezone
locale|datetime/null|User locale
lastLogin|datetime/null|User last login
lastActive|datetime/null|User last active
onlineStatus|datetime/null|user online status
signature|datetime/null|User signature
role|datetime/null|User active role

#### Response

`Expected Response Code: 201`

**Properties**

Same as [Get User](#get-user).
