## Plugins

Use this endpoint to manipulate and obtain details on Mautic's plugins.

### Get Plugin Settings

```json
{
    "objects": [
        "lead",
        "company"
    ],
    "update_mautic": {
        "PrimaryMailAddress": "1",
        "LastName": "1",
        "FirstName": "1"
    },
    "leadFields": {
        "PrimaryMailAddress": "email",
        "LastName": "lastname",
        "FirstName": "firstname"
    },
    "update_mautic_company": {
        "CompanyName": "1"
    },
    "companyFields": {
        "CompanyName": "companyname"
    }
}
```

Get an individual plugin's configuration

#### HTTP Request

`GET /plugins/settings/INTEGRATION_NAME`

#### Response

`Expected Response Code: 200`

See JSON code example.
