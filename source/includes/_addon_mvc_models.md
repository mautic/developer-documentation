### Models

```php
<?php
// addons/HelloWorldBundle/Model/ContactModel.php

namespace MauticAddon\HelloWorldBundle\Model;

use Mautic\CoreBundle\Model\CommonModel;

class ContactModel extends CommonModel
{

    /**
     * Send contact email
     * 
     * @param array $data
     */
    public function sendContactEmail($data)
    {
        // Get mailer helper
        $mailer = $this->factory->getMailer();

        $mailer->message->addTo(
            $this->factory->getParameter('mailer_from_email')
        );

        $this->message->setFrom(
            array($data['email'] => $data['name'])
        );
        
        $mailer->message->setSubject($data['subject']);

        $mailer->message->setBody($data['message']);

        $mailer->send();
    }
}
```
Models are used to retrieve and process data between controllers and views. Models aren't required for addons but, if used, Mautic provides means to easily obtain the model objects and some commonly used methods.

#### Model Classes

Custom models should extend one of two Mautic base models.

##### \Mautic\CoreBundle\Model\CommonModel

This is the basic model that mainly provides access to services frequently used with models.

Property|Service
--------|-------
$this->factory | [Mautic's factory service](#factory-service)
$this->em | [Entity manager service](#database)
$this->security | [Mautic's security service](#security)
$this->dispatcher | [Event dispatcher service](#events)
$this->translator | [Translator service](#translator)

##### \Mautic\CoreBundle\Model\FormModel

The FormModel extends CommonModel and provides a set of helper methods for interacting with entities and repositories. To read more about these methods, refer to the [Database](#database) section. 

#### Getting Model Objects

```php
<?php

/** @var \Mautic\LeadBundle\Model\LeadModel $leadModel */
$leadModel = $this->factory->getModel('lead');

/** @var \Mautic\LeadBundle\Model\ListModel $leadListModel */
$leadListModel = $this->factory->getModel('lead.list');

/** @var \MauticAddons\HelloWorldBundle\Model\ContactModel $contactModel */
$contactModel = $this->factory->getModel('addon.helloWorld.contact');
```
To get a model object, use the MauticFactory's `getModel()` method. 

The `getModel()` method accepts the name of the model in a special notation of `bundleName.modelName` for Mautic core bundles or `addon.bundleName.modelName` for addons. If the `bundleName` and `modelName` happens to be the same, then `bundleName` (core bundles) or `addon.bundleName` (addons) are also accepted.