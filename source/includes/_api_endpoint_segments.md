## Segments
Use this endpoint to obtain details on Mautic's contact segments or to manipulate contact memberships.

```php
<?php
use Mautic\MauticApi;
use Mautic\Auth\ApiAuth;

// ...
$auth     = ApiAuth::initiate($settings);
$apiUrl   = "https://your-mautic.com"; 
$segmentApi = MauticApi::getContext("segments", $auth, $apiUrl);
```

### List Contact Segments

```php
<?php

//...
$segments = $segmentApi->getSegments();
```
```json
{
  "1": {
    "id": 1,
    "name": "New Contacts",
    "alias": "new"
  },
  "2": {
    "id": 2,
    "name": "Region A Contacts",
    "alias": "region-a-laeds"
  },
  "3": {
    "id": 3,
    "name": "Region B Contacts",
    "alias": "region-b-contacts"
  }
}
```
Returns a list of contact segments available to the user. This list is not filterable.

#### HTTP Request

`GET /segments`

#### Response

`Expected Response Code: 200`

See JSON code example.

**Segment Properties**

Name|Type|Description
----|----|-----------
id|int|ID of the segment
name|string|Name of the segment
alias|string|Alias of the segment

### Add Contact to a Segment

```php
<?php

//...
$response = $segmentApi->addContact($segmentId, $contactId);
if (!isset($response['success'])) {
    // handle error
}
```
```json
{
    "success": true
}
```

Manually add a contact to a specific segment.

#### HTTP Request

`POST /segments/SEGMENT_ID/contact/add/CONTACT_ID`

#### Response

`Expected Response Code: 200`

See JSON code example.


### Remove Contact from a Segment

```php
<?php

//...
$response = $segmentApi->removeContact($segmentId, $contactId);
if (!isset($response['success'])) {
    // handle error
}
```
```json
{
    "success": true
}
```

Manually remove a contact to a specific segment.

#### HTTP Request

`POST /segments/SEGMENT_ID/contact/remove/CONTACT_ID`

#### Response

`Expected Response Code: 200`

See JSON code example.