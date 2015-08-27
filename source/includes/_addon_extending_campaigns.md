### Extending Campaigns

```php
<?php
// addons/HelloWorldBundle/EventListener/CampaignSubscriber.php

namespace MauticAddon\HelloWorldBundle\Events;

use Mautic\CoreBundle\EventListener\CommonSubscriber;
use Mautic\CampaignBundle\Event as Events;
use Mautic\CampaignBundle\CampaignEvents;

/**
* Class CampaignSubscriber
*/
class CampaignSubscriber extends CommonSubscriber
{

    /**
     * @return array
     */
    static public function getSubscribedEvents()
    {
        return array(
            CampaignEvents::CAMPAIGN_ON_BUILD => array('onCampaignBuild', 0)
        );
    }

    /**
     * Add campaign decision and actions
     *
     * @param Events\CampaignBuilderEvent $event
     */
    public function onCampaignBuild(Events\CampaignBuilderEvent $event)
    {
        // Register custom action
        $event->addAction(
            'helloworld.send_offworld',
            array(
                'label'           => 'addon.helloworld.campaign.send_offworld',
                'description'     => 'addon.helloworld.campaign.send_offworld_descr',
                // Set custom parameters to configure the decision
                'formType'        => 'helloworld_worlds',
                // Set a custom formTheme to customize the layout of elements in formType
                'formTheme'       => 'HelloWorldBundle:FormTheme\SubmitAction'
                // Set custom options to pass to the form type, if applicable 
                'formTypeOptions' => array(
                    'world' => 'mars'
                ),
                // Static callback function to execute this action
                'callback'        => '\MauticAddons\HelloWorldBundle\Helper\CampaignEventHelper::sendLeadOffworld'
            )
        );

        // Register custom decision (executes when a lead "makes a decision" i.e. executes some direct action 
        $event->addLeadDecision(
            'helloworld.visits_mars',
            array(
                'label'           => 'addon.helloworld.campaign.visits_mars',
                'description'     => 'addon.helloworld.campaign.visits_mars_descr',
                // Same as registering an action
                'formType'        => false,
                'formTypeOptions' => array(),
                // Optional static callback function to validate whether the decision should be executed or not 
                'callback'        => '\MauticAddons\HelloWorldBundle\Helper\CampaignEventHelper::validateVisitation',
            )
        );
    }
}
```

Addons can add their own campaign actions and decisions by listening to the `\Mautic\CampaignBundle\CampaignEvents::CAMPAIGN_ON_BUILD` event.  Read more about [listeners and subscribers](#events). 

#### Campaign Actions

To add an action, use the `$event->addAction($identifier, $parameters)` method. `$identifier` must be something unique. The `$parameters` array can contain the following elements:
 
Key|Required|Type|Description
---|--------|----|-----------
**label**|REQUIRED|string|The language string to use for the draggable's label
**description**|OPTIONAL|string|The language string to use for the draggable's tooltip
**callback**|REQUIRED|mixed|Static callback function that will be called for the action and should contain the logic to execute the custom action
**formType**|OPTIONAL|string|The alias of a custom form type used to set config options for the decision
**formTypeOptions**|OPTIONAL|array|Array of options to include into the formType's $options argument
**formTypeCleanMasks**|OPTIONAL|array|Array of input masks to clean a values from formType
**formTypeTheme**|OPTIONAL|string|Theme to customize elements for formType
The action's callback can accept the following variables (determined via ReflectionMethod::invokeArgs()):

Variable|Type|Description
--------|----|-----------
**config**|array|Options configured by user for the custom formType
**event**|array|Details of the current event executed
**lead**|\Mautic\LeadBundle\Entity\Lead|The lead executing the event
**factory**|\Mautic\CoreBundle\Factory\MauticFactory|[Mautic's factory service](#factory-service)
**eventDetails**|mixed|Whatever the triggering decision passes into the triggerEvent method. It could be the Email entity that was opened, an array, null, etc. 
**systemTriggered**|boolean|Notes if the action was executed directly by the lead (false) or by the system (true)

#### Campaign Decisions

 ```php
 <?php
 // Trigger configured 'helloworld.visits_mars' decisions
 
 /** @var \Mautic\CampaignBundle\Model\CampaignModel $campaignModel */
 $campaignModel = $this->factory->getModel('campaign.event');
 
 // Can be anything and passed into action callbacks as $eventDetails
 $customPassthrough = array();
 
 // Some optional unique identifier for this specific trigger that is used mainly for debug logging; for example, can be a concatenation of the decision name + lead ID
 $uniqueTriggerId   = 'something_something';
 
 $campaignModel->triggerEvent('helloworld.visits_mars', $customPassthroughToActions, $uniqueTriggerId);
 ```
 
Campaign decisions are registered exactly as a campaign action except it uses the `$event->addLeadDecision($identifier, $parameters)` method. The only difference in the `$parameters` arguments is that the function defined in the `callback` element is used to validate the decision rather than execute some action. For example, if the decision is configured to only apply to a specific ID chosen by the user (defined in the `formType`), the callback function may could compare the decision's `$eventDetails['id']` (see below) with the event's`$config['id']`. If the decision should execue the actions associated with it, return `true`.  Otherwise return `false` and nothing will be executed or logged.
  
For custom decisions to work, there must be a trigger executed when the lead makes the decision. Thus, where ever is appropriate in the addon's code logic, add something similar to what's in the example code block. 
 
 The `triggerEvent()` method will pull all the triggered decisions (`helloworld.visits_mars` in the code example) for published campaigns the lead is in, execute the decisions callback (if configured) for validation, then execute the associated actions if appropriate.
