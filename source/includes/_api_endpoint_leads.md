## Leads
Use this endpoint to manipulate and obtain details on Mautic's leads.

```php
<?php
use Mautic\MauticApi;
use Mautic\Auth\ApiAuth;

// ...
$auth     = ApiAuth::initiate($settings);
$apiUrl   = "https://your-mautic.com"; 
$leadApi  = MauticApi::getContext("leads", $auth, $apiUrl);
```

### Get Lead
```php
<?php

//...
$lead = $leadApi->get($id);
```
```json
    "lead": {
        "id": 47,
        "dateAdded": "2015-07-21T12:27:12-05:00",
        "createdBy": 1,
        "createdByUser": "Joe Smith",
        "dateModified": "2015-07-21T14:12:03-05:00",
        "modifiedBy": 1,
        "modifiedByUser": "Joe Smith",
        "owner": {
            "id": 1,
            "username": "joesmith",
            "firstName": "Joe",
            "lastName": "Smith"
        },
        "points": 10,
        "lastActive": "2015-07-21T14:19:37-05:00",
        "dateIdentified": "2015-07-21T12:27:12-05:00",
        "color": "ab5959",
        "ipAddresses": {
            "111.111.111.111": {
                "ipAddress": "111.111.111.111",
                "ipDetails": {
                    "city": "",
                    "region": "",
                    "country": "",
                    "latitude": "",
                    "longitude": "",
                    "isp": "",
                    "organization": "",
                    "timezone": ""
                }
            }
        },
        "fields": {
            "core": {
                "title": {
                    "id": "1",
                    "label": "Title",
                    "alias": "title",
                    "type": "lookup",
                    "group": "core",
                    "value": "Mr"
                },
                "firstname": {
                    "id": "2",
                    "label": "First Name",
                    "alias": "firstname",
                    "type": "text",
                    "group": "core",
                    "value": "Jim"
                },
                
                "...": {
                    "..." : "..."
                }
                
            },
            "social": {
                "twitter": {
                    "id": "17",
                    "label": "Twitter",
                    "alias": "twitter",
                    "type": "text",
                    "group": "social",
                    "value": "jimlead"
                },
                
                "...": {
                    "..." : "..."
                }
                
            },
            "personal": [],
            "professional": [],
            "all": {
                "title": "Mr",
                "firstname": "Jim",
                "twitter": "jimlead",
                
                "...": "..."
            }
        }
    }
```
Get an individual lead by ID.

#### HTTP Request

`GET /leads/ID`

#### Response

`Expected Response Code: 200`

See JSON code example.

**Lead Properties**

Name|Type|Description
----|----|-----------
id|int|ID of the lead
dateAdded|datetime|Date/time lead was created
createdBy|int|ID of the user that created the lead
createdByUser|string|Name of the user that created the lead
dateModified|datetime/null|Date/time lead was last modified
modifiedBy|int|ID of the user that last modified the lead
modifiedByUser|string|Name of the user that last modified the lead
owner|object|User object that owns the lead.
points|int|Lead's current number of points
lastActive|datetime/null|Date/time for when the lead was last recorded as active
dateIdentified|datetime/null|Date/time when the lead identified themselves
color|string|Hex value given to lead from Point Trigger definitions based on the number of points the lead has been awarded
ipAddresses|array|Array of IPs currently associated with this lead
fields|array|Array of all lead fields with data grouped by field group. See JSON code example for format. This array includes an "all" key that includes an single level array of fieldAlias => leadValue pairs.

### List Leads
```php
<?php

//...
$leads = $leadApi->getList($searchFilter, $start, $limit, $orderBy, $orderByDir);
```
```json
{
    "total": "1",
    "leads": [
        {
            "id": 47,
            "isPublished": true,
            "dateAdded": "2015-07-21T12:27:12-05:00",
            "createdBy": 1,
            "createdByUser": "Joe Smith",
            "dateModified": "2015-07-21T14:12:03-05:00",
            "modifiedBy": 1,
            "modifiedByUser": "Joe Smith",
            "owner": {
                "id": 1,
                "username": "joesmith",
                "firstName": "Joe",
                "lastName": "Smith"
            },
            "points": 10,
            "lastActive": "2015-07-21T14:19:37-05:00",
            "dateIdentified": "2015-07-21T12:27:12-05:00",
            "color": "ab5959",
            "ipAddresses": {
                "111.111.111.111": {
                    "ipAddress": "111.111.111.111",
                    "ipDetails": {
                        "city": "",
                        "region": "",
                        "country": "",
                        "latitude": "",
                        "longitude": "",
                        "isp": "",
                        "organization": "",
                        "timezone": ""
                    }
                }
            },
            "fields": {
                "core": {
                    "title": {
                        "id": "1",
                        "label": "Title",
                        "alias": "title",
                        "type": "lookup",
                        "group": "core",
                        "value": "Mr"
                    },
                    "firstname": {
                        "id": "2",
                        "label": "First Name",
                        "alias": "firstname",
                        "type": "text",
                        "group": "core",
                        "value": "Jim"
                    },
                    
                    "...": {
                        "..." : "..."
                    }
                },
                "social": {
                    "twitter": {
                        "id": "17",
                        "label": "Twitter",
                        "alias": "twitter",
                        "type": "text",
                        "group": "social",
                        "value": "jimlead"
                    },
                    
                    "...": {
                        "..." : "..."
                    }
                },
                "personal": [],
                "professional": [],
                "all": {
                    "title": "Mr",
                    "firstname": "Jim",
                    "twitter": "jimlead",
                    
                    "...": "..."    
                }
            }
        }
    ]
}
```
Get a list of leads.

#### HTTP Request

`GET /leads`

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

Same as [Get Lead](#get-lead).

### Create Lead
```php
<?php 

$data = array(
    'firstname' => 'Jim',
    'lastname'  => 'Lead',
    'email'     => 'jim@his-site.com',
    'ipAddress' => $_SERVER['REMOTE_ADDR']
);

$lead = $leadApi->create($data);
```
Create a new lead.

#### HTTP Request

`POST /leads/new`

**Post Parameters**

Name|Description
----|-----------
*|Any lead field alias can be posted as a parameter.  For example, firstname, lastname, email, etc.
ipAddress|IP address to associate with the lead
lastActive|Date/time in UTC; preferablly in the format of Y-m-d H:m:i but if that format fails, the string will be sent through PHP's strtotime then formatted
owner|ID of a Mautic user to assign this lead to

#### Response

`Expected Response Code: 201`

**Properties**

Same as [Get Lead](#get-lead).

### Edit Lead
```php
<?php

$id   = 1;
$data = array(
    'email'     => 'jim-new-address@his-site.com',
    'ipAddress' => $_SERVER['REMOTE_ADDR']
);

// Create new a lead of ID 1 is not found?
$createIfNotFound = true;

$lead = $leadApi->edit($id, $data, $createIfNotFound);
```
Edit a new lead.  Note that this supports PUT or PATCH depending on the desired behavior for when a lead cannot be found based on the ID given.

#### HTTP Request

To edit a lead and return a 404 if the lead is not found:

`PATCH /leads/ID/edit`

To edit a lead and create a new one if the lead is not found:

`PUT /leads/ID/edit`

**Post Parameters**

Name|Description
----|-----------
*|Any lead field alias can be posted as a parameter.  For example, firstname, lastname, email, etc.
ipAddress|IP address to associate with the lead
lastActive|Date/time in UTC; preferablly in the format of Y-m-d H:m:i but if that format fails, the string will be sent through PHP's strtotime then formatted
owner|ID of a Mautic user to assign this lead to

#### Response

If `PUT`, the expected response code is `200` if the lead was edited or `201` if created.

If `PATCH`, the expected response code is `200`.

**Properties**

Same as [Get Lead](#get-lead).

### Delete Lead
```php
<?php

$lead = $leadApi->delete($id);
```
Delete a lead.

#### HTTP Request

`DELETE /leads/ID`

#### Response

`Expected Response Code: 200`

**Properties**

Same as [Get Lead](#get-lead).

### Get Contact Timeline (only visited url)

```php
<?php
//...
$lead = $leadApi->leadHistory($id);
```
```json
{
     "lead": {
         "0": {
               "id" : 40308,
               "page_id" : null,
               "redirect_id" : null,
               "email_id" : null,
               "lead_id" : 8,
               "ip_id" : 184,
               "date_hit" : "2016-04-27 17:39:24",
               "date_left" : "2016-04-27 17:40:21",
               "country" : "",
               "region" : "",
               "city" : "",
               "isp" : "",
               "organization" : "",
               "code" : 200,
               "referer" : "http://site.com/blog",
               "url" : "http://site.com/blog/article1",
               "url_title" : null,
               "user_agent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.86 Safari/537.36",
               "remote_host" : null,
               "page_language" : null,
               "browser_languages" : 'a:5:{i:0;s:5:"fr-FR";i:1;s:8:"fr;q=0.8";i:2;s:11:"en-US;q=0.6";i:3;s:8:"en;q=0.4";i:4;s:8:"de;q=0.2";}',
               "tracking_id" : "878b33b0f9da295eda1eb8029dedf285d08eedad",
               "source" : null,
               "source_id" : null,
               "query" : "a:0:{}"
          }
          "1": {
               "id" : 40308,
               "page_id" : null,
               "redirect_id" : null,
               "email_id" : null,
               "lead_id" : 8,
               "ip_id" : 184,
               "date_hit" : "2016-04-27 17:39:24",
               "date_left" : "2016-04-27 17:40:21",
               "country" : "",
               "region" : "",
               "city" : "",
               "isp" : "",
               "organization" : "",
               "code" : 200,
               "referer" : "http://site.com/blog/article1",
               "url" : "http://site.com/blog",
               "url_title" : null,
               "user_agent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.86 Safari/537.36",
               "remote_host" : null,
               "page_language" : null,
               "browser_languages" : 'a:5:{i:0;s:5:"fr-FR";i:1;s:8:"fr;q=0.8";i:2;s:11:"en-US;q=0.6";i:3;s:8:"en;q=0.4";i:4;s:8:"de;q=0.2";}',
               "tracking_id" : "878b33b0f9da295eda1eb8029dedf285d08eedad",
               "source" : null,
               "source_id" : null,
               "query" : "a:0:{}"
          }
     }
}
```
Get an individual contact timeline by contact ID.

#### HTTP Request

`GET leads/ID/history`

#### Response

`Expected Response Code: 200`

Return `empty` when the lead does not exist or that the lead has not visited url.

### List Available Owners
```php
<?php

$owners = $leadApi->getOwners();
```
```json
[
  {
    "id": 1,
    "firstName": "Joe",
    "lastName": "Smith"
  },
  {
    "id": 2,
    "firstName": "Jane",
    "lastName": "Smith"
  }
]
```
Get a list of owners that can be used to assign leads to when creating/editing.

#### HTTP Request

`GET /leads/list/owners`

#### Response

`Expected Response Code: 200`

**Owner Properties**

Name|Type|Description
----|----|-----------
id|int|ID of the Mautic user
firstName|string|First name of the Mautic user
lastName|string|Last name of the Mautic user

### List Available Fields
```php
<?php

$fields = $leadApi->getFieldList();
```
```json
{
    "1": {
        "id": 1,
        "label": "Title",
        "alias": "title",
        "type": "lookup",
        "group": "core",
        "order": 1
    },
    "2": {
        "id": 2,
        "label": "First Name",
        "alias": "firstname",
        "type": "text",
        "group": "core",
        "order": 2
    },
    "3": {
        "id": 3,
        "label": "Last Name",
        "alias": "lastname",
        "type": "text",
        "group": "core",
        "order": 3
    },
    
    "...": {
        "..." : "..."
    }
}
```
Get a list of available lead fields including custom ones.

#### HTTP Request

`GET /leads/list/fields`

#### Response

`Expected Response Code: 200`

**Field Properties**

Name|Type|Description
----|----|-----------
id|int|ID of the field
label|string|Field label
alias|string|Field alias used as the column name in the database
type|string|Type of field.  I.e. text, lookup, etc
group|string|Group the field belongs to
order|int|Field order

### List Lead Notes
```php
<?php

$notes = $leadApi->getLeadNotes($id, $searchFilter, $start, $limit, $orderBy, $orderByDir);
```json
{
    "total": 1,
    "notes": [
        {
              "id": 1,
              "text": "<p>Jim is super cool!</p>",
              "type": "general",
              "dateTime": "2015-07-23T13:14:00-05:00"
        }
    ]
}
```
Get a list of notes for a specific lead.

#### HTTP Request

`GET /leads/ID/notes`

**Query Parameters**

Name|Description
----|-----------
search|String or search command to filter entities by.
start|Starting row for the entities returned. Defaults to 0.
limit|Limit number of entities to return. Defaults to the system configuration for pagination (30).
orderBy|Column to sort by. Can use any column listed in the response.
orderByDir|Sort direction: asc or desc.

#### Response

`Expected response code: 200`

**Note Properties**

Name|Type|Description
----|----|-----------
id|int|ID of the note
text|string|Body of the note
type|string|Type of note. Options are "general", "email", "call", "meeting"
dateTime|datetime|Date/time string of when the note was created.

### Get List Memberships
```php
<?php

$lists = $leadApi->getLeadLists($id);
```json
{
    "total": 1,
    "lists": {
        "3": {
            "id": 3,
            "name": "New Leads",
            "alias": "newleads"
        }
    }
}
```
Get a list of lead lists the lead is a member of.

#### HTTP Request

`GET /leads/ID/lists`

#### Response

`Expected response code: 200`

**List Properties**

Name|Type|Description
----|----|-----------
id|int|ID of the list
name|string|Name of the list
alias|string|Alias of the list used with search commands.
dateAdded|datetime|Date/time string for when the lead was added to the list
manuallyAdded|bool|True if the lead was manually added to the list versus being added by a filter
manuallyRemoved|bool|True if the lead was manually removed from the list even though the list's filter is a match

### Change List Memberships

See [Lists](#lists).


### Get Campaign Memberships
```php
<?php

$lists = $leadApi->getLeadCampaigns($id);
```json
{
    "total": 1,
    "campaigns": {
        "1": {
            "id": 1,
            "name": "Welcome Campaign",
            "dateAdded": "2015-07-21T14:11:47-05:00",
            "manuallyRemoved": false,
            "manuallyAdded": false,
            "list_membership": [
                3
            ]            
        }
    }
}
```
Get a list of campaigns the lead is a member of.

#### HTTP Request

`GET /leads/ID/campaigns`

#### Response

`Expected response code: 200`

**List Properties**

Name|Type|Description
----|----|-----------
id|int|ID of the campaign
name|string|Name of the campaign
dateAdded|datetime|Date/time string for when the lead was added to the campaign
manuallyAdded|bool|True if the lead was manually added to the campaign versus being added by a lead list
manuallyRemoved|bool|True if the lead was manually removed from the campaign when the lead's list is assigned to the campaign
listMembership|array|Array of lead list IDs this lead belongs to that is also associated with this campaign

### Change Campaign Memberships

See [Campaigns](#campaigns).