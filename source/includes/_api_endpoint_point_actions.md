## Point Actions
Use this endpoint to obtain details on Mautic's point actions.

```php
<?php
use Mautic\MauticApi;
use Mautic\Auth\ApiAuth;

// ...
$auth     = ApiAuth::initiate($settings);
$apiUrl   = "https://your-mautic.com"; 
$pointApi = MauticApi::getContext("points", $auth, $apiUrl);
```

### Get Point Action
```php
<?php

//...
$point = $pointApi->get($id);
```
```json
{
    "point": {
        "id": 1,
        "name": "Opens Email",
        "description": null,
        "type": "email.send",
        "isPublished": true,
        "publishUp": null,
        "publishDown": null,
        "dateAdded": "2015-07-19T00:34:11-05:00",
        "createdBy": 1,
        "createdByUser": "Joe Smith",
        "dateModified": "2015-07-19T00:41:44-05:00",
        "modifiedBy": 1,
        "modifiedByUser": "Joe Smith",
        "delta": 10,
        "properties": {
            "emails": [
                35
            ]
        },
        "category": null
    }
}
```
Get an individual point action by ID.

#### HTTP Request

`GET /points/ID`

#### Response

`Expected Response Code: 200`

See JSON code example.

**Point Action Properties**

Name|Type|Description
----|----|-----------
id|int|ID of the point
name|string|Name of the point
description|string/null|Description of the point
category|string|Category name
type|string|Point action type
isPublished|bool|Published state
publishUp|datetime/null|Date/time when the point should be published
publishDown|datetime/null|Date/time the point should be un published
dateAdded|datetime|Date/time point was created
createdBy|int|ID of the user that created the point
createdByUser|string|Name of the user that created the point
dateModified|datetime/null|Date/time point was last modified
modifiedBy|int|ID of the user that last modified the point
modifiedByUser|string|Name of the user that last modified the point
delta|int|The number of points to give the lead when executing this action
properties|array|Configured properties for this point action

### List Point Actions

```php
<?php
// ...

$points = $pointApi->getList($searchFilter, $start, $limit, $orderBy, $orderByDir);
```
```json
{
    "total": 1,
    "points": [
        {
            "id": 1,
            "name": "Opens Email",
            "description": null,
            "category": null
            "type": "email.send",
            "isPublished": true,
            "publishUp": null,
            "publishDown": null,
            "dateAdded": "2015-07-19T00:34:11-05:00",
            "createdBy": 1,
            "createdByUser": "Joe Smith",
            "dateModified": "2015-07-19T00:41:44-05:00",
            "modifiedBy": 1,
            "modifiedByUser": "Joe Smith",
            "delta": 10,
            "properties": {
                "emails": [
                    35
                ]
            }
        }
    ]
}
```
#### HTTP Request

`GET /points`

**Query Parameters**

Name|Description
----|-----------
search|String or search command to filter entities by.
start|Starting row for the entities returned. Defaults to 0.
limit|Limit number of entities to return. Defaults to the system configuration for pagination (30).
orderBy|Column to sort by. Can use any column listed in the response.
orderByDir|Sort direction: asc or desc.
publishedOnly|Only return currently published entities.

#### Response

`Expected Response Code: 200`

See JSON code example.

**Properties**

Same as [Get Point Action](#get-point-action).

### Apply Rule
```php
<?php
// ...
$leadId = 215;

$pointApi  = MauticApi::getContext("points", $auth, $apiUrl);
$points = $pointApi->getList();
foreach ($points['points'] as $k => $point) {
	if($point['name'] === "RuleName") {
		$idPoint = $point['id'];
		break;
	}
}

$apprule = $pointApi->apply_rule($idPoint, $leadId);
```
Application of a rule has a point's lead.

#### HTTP Reques

`PATCH /points/ID_POINT/lead/ID_LEAD`

#### Response

`Expected Response Code: 200`

See JSON code example.



