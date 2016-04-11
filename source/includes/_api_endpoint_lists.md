## Lists
Use this endpoint to obtain details on Mautic's lead lists or to manipulate lead memberships.

```php
<?php
use Mautic\MauticApi;
use Mautic\Auth\ApiAuth;

// ...
$auth     = ApiAuth::initiate($settings);
$apiUrl   = "https://your-mautic.com"; 
$listApi = MauticApi::getContext("lists", $auth, $apiUrl);
```

### List Lead Lists

```php
<?php

//...
$lists = $listApi->getList();
```
```json
{
  "1": {
    "id": 1,
    "name": "New Leads",
    "alias": "new"
  },
  "2": {
    "id": 2,
    "name": "Region A Leads",
    "alias": "region-a-laeds"
  },
  "3": {
    "id": 3,
    "name": "Region B Leads",
    "alias": "region-b-leads"
  }
}
```
Returns a list of lead lists available to the user. This list is not filterable.

#### HTTP Request

`GET /lists`

#### Response

`Expected Response Code: 200`

See JSON code example.

**List Properties**

Name|Type|Description
----|----|-----------
id|int|ID of the list
name|string|Name of the list
alias|string|Alias of the list

### Add Lead to a List

```php
<?php

//...
$response = $listApi->addLead($listId, $leadId);
if (!isset($response['success'])) {
    // handle error
}
```
```json
{
    "success": true
}
```

Manually add a lead to a specific list.

#### HTTP Request

`POST /lists/LIST_ID/lead/add/LEAD_ID`

#### Response

`Expected Response Code: 200`

See JSON code example.


### Remove Lead from a List

```php
<?php

//...
$response = $listApi->removeLead($llistId, $leadId);
if (!isset($response['success'])) {
    // handle error
}
```
```json
{
    "success": true
}
```

Manually remove a lead to a specific list.

#### HTTP Request

`POST /lists/LIST_ID/lead/remove/LEAD_ID`

#### Response

`Expected Response Code: 200`

See JSON code example.