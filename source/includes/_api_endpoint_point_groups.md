## Point Groups
Use this endpoint to manage contact point groups in Mautic.

```php
<?php
use Mautic\MauticApi;
use Mautic\Auth\ApiAuth;

// ...
$initAuth = new ApiAuth();
$auth     = $initAuth->newAuth($settings);
$apiUrl   = "https://your-mautic.com";
$api      = new MauticApi();
$pointGroupApi = $api->newApi("pointGroups", $auth, $apiUrl);
```

### Get Point Group
```php
<?php

//...
$pointGroup = $pointGroupApi->get($id);
```
```json
    "pointGroup": {
        "id": 47,
        "name": "Group A",
        "description": "This is my first point group created via API.",
        "isPublished": true,
        "dateAdded": "2024-02-29T12:17:52+00:00",
        "dateModified": null,
        "createdBy": 2,
        "createdByUser": "Admin User",
        "modifiedBy": null,
        "modifiedByUser": null,
    }
```
Get an individual point group by ID.

#### HTTP Request

`GET /points/groups/ID`

#### Response

`Expected Response Code: 200`

See JSON code example.

**Point Group Properties**

Name|Type|Description
----|----|-----------
id|int|ID of the point group
name|string|Point group name
description|string|Point group description
isPublished|boolean|Whether the Point group is published
dateAdded|datetime|Date/time Point group was created
createdBy|int|ID of the user that created the Point group
createdByUser|string|Name of the user that created the Point group
dateModified|datetime/null|Date/time Point group was last modified
modifiedBy|int|ID of the user that last modified the Point group
modifiedByUser|string|Name of the user that last modified the Point group


### List Contact Point Groups

```php
<?php

//...
$pointGroups = $pointGroupApi->getList($searchFilter, $start, $limit, $orderBy, $orderByDir, $publishedOnly, $minimal);
```
```json
{
  "total": 4,
  "pointGroups": [
    {
        "id": 47,
        "name": "Group A",
        "description": "This is my first point group created via API.",
        "isPublished": true,
        "dateAdded": "2024-02-29T12:17:52+00:00",
        "dateModified": null,
        "createdBy": 2,
        "createdByUser": "Admin User",
        "modifiedBy": null,
        "modifiedByUser": null
    },
    ...
  ]
}
```

#### HTTP Request

`GET /points/groups`

#### Response

`Expected Response Code: 200`

See JSON code example.

**Point Group Properties**

Name|Type|Description
----|----|-----------
total|int|Count of all point groups
id|int|ID of the point group
name|string|Point group name
description|string|Point group description
isPublished|boolean|Whether the Point group is published
dateAdded|datetime|Date/time Point group was created
createdBy|int|ID of the user that created the Point group
createdByUser|string|Name of the user that created the Point group
dateModified|datetime/null|Date/time Point group was last modified
modifiedBy|int|ID of the user that last modified the Point group
modifiedByUser|string|Name of the user that last modified the Point group

### Create Point Group
```php
<?php 

$data = [
    'name'        => 'Group A',
    'description' => 'This is my first point group created via API.'
];

$pointGroup = $pointGroupApi->create($data);
```
Create a new point group.

#### HTTP Request

`POST /points/groups/new`

**Post Parameters**

Name|Description
----|-----------
name|Point group name is the only required field
description|A description of the point group.

#### Response

`Expected Response Code: 201`

**Properties**

Same as [Get Point Group](#get-point-group).

### Edit Point Group
```php
<?php

$id   = 1;
$data = [
    'name'        => 'New point group name',
    'description' => 'Updated description of the point group.'
];

$pointGroup = $pointGroupApi->edit($id, $data);
```
Edit a point group.

#### HTTP Request

`PATCH /points/groups/ID/edit`

**Post Parameters**

Name|Description
----|-----------
name|Point group name is the only required field
description|A description of the point group.

#### Response

`Expected Response Code: 200`

**Properties**

Same as [Get Point Group](#get-point-group).

### Delete Point Group
```php
<?php

$pointGroup = $pointGroupApi->delete($id);
```
Delete a point group.

#### HTTP Request

`DELETE /points/groups/ID/delete`

#### Response

`Expected Response Code: 200`

**Properties**

Same as [Get Point Group](#get-point-group).