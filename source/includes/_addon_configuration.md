## Custom Config Params

Mautic's configuration is stored in app/config/local.php. Addon's can leverage custom config parameters to use within it's code.

Each configuration option desired should be defined and have a default set in the [addon's config file](#parameters). This prevents Symfony from throwing errors if the parameter is used during cache compilation or if accessed directly from the container without checking if it exists first. Defining the parameters in the addon's config file will ensure that it always exists.

To add config options to the Configuration page, an [event subscriber](#subscribers), a config [form type](#forms), and a [specific view](#views) are required.

<aside class="notice">
To translate the addon's tab in the configuration form, be sure to include <code>mautic.config.tab.helloworld_config</code> in the addon's messages.ini file. Of course replace helloworld_config with whatever is used as the formAlias when registering the form in the event subscriber (explained below).
</aside>

### Config Event Subscriber
```php
<?php
// addons/HelloWorldBundle/EventListener/ConfigSubscriber.php

namespace MauticAddon\HelloWorldBundle\EventListener;

use Mautic\ConfigBundle\Event\ConfigEvent;
use Mautic\CoreBundle\EventListener\CommonSubscriber;
use Mautic\ConfigBundle\ConfigEvents;
use Mautic\ConfigBundle\Event\ConfigBuilderEvent;

/**
 * Class ConfigSubscriber
 */
class ConfigSubscriber extends CommonSubscriber
{

    /**
     * @return array
     */
    static public function getSubscribedEvents()
    {
        return array(
            ConfigEvents::CONFIG_ON_GENERATE => array('onConfigGenerate', 0),
            ConfigEvents::CONFIG_PRE_SAVE    => array('onConfigSave', 0)
        );
    }

    /**
     * @param ConfigBuilderEvent $event
     */
    public function onConfigGenerate(ConfigBuilderEvent $event)
    {
        $event->addForm(
            array(
                'formAlias'  => 'helloworld_config',
                'formTheme'  => 'HelloWorldBundle:FormTheme\Config',
                'parameters' => $event->getParametersFromConfig('HelloWorldBundle')
            )
        );
    }

    /**
     * @param ConfigEvent $event
     */
    public function onConfigSave(ConfigEvent $event)
    {
        /** @var array $values */
        $values = $event->getConfig();

        // Manipulate the values
        if (!empty($values['helloworld_config']['custom_config_option'])) {
            $values['helloworld_config']['custom_config_option'] = htmlspecialchars($values['helloworld_config']['custom_config_option']);
        }

        // Set updated values 
        $event->setConfig($values);
    }
}
```

The event subscriber will listen to the `ConfigEvents::CONFIG_ON_GENERATE` and `ConfigEvents::CONFIG_PRE_SAVE` events.  

The `ConfigEvents::CONFIG_ON_GENERATE` is dispatched when the configuration form is built giving the addon an opportunity to inject it's own tab and config options.

To do this, the addon must register it's configuration details through the method assigned to the `ConfigEvents::CONFIG_ON_GENERATE` event. The \Mautic\ConfigBundle\Event\ConfigBuilderEvent object is passed into the method and expects the method to call `addForm()`. `addForm()` expects an array with the following elements:
 
Key|Description
---|-----------
**formAlias**|Alias of the form type class that sets the expected form elements
**formTheme**|View to format the configuration form elements, i.e, `HelloWorldBundle:FormTheme\Config`
**parameters**|Array of custom config elements. `$event->getParametersFromConfig('HelloWorldBundle')))` can be used to glean them from the addon's config file.

The `ConfigEvents::CONFIG_PRE_SAVE` is called before the values from the form are rendered and saved to the local.php file. This gives the addon an opportunity to clean up or manipulate the data before it is written.

Remember that the subscriber must be registered through the addon's config in the `services[events]` [section](#services).

###Config Form

```php
<?php
// addons/HelloWorldBundle/Form/Type/ConfigType.php

namespace MauticAddon\HelloWorldBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;

/**
 * Class ConfigType
 */
class ConfigType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array                $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add(
            'custom_config_option',
            'text',
            array(
                'label' => 'addon.helloworld.config.custom_config_option',
                'data'  => $options['data']['custom_config_option'],
                'attr'  => array(
                    'tooltip' => 'addon.helloworld.config.custom_config_option_tooltip'
                )
            )
        );
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'helloworld_config';
    }
}
```

The form type is used to generate the form fields in the main configuration form. Refer to [Forms](#forms) for more information on using form types.

Remember that the form type must be registered through the addon's config in the `services[forms]` [section](#services).

###Config Template

```php
<?php
// addons/HelloWorldBundle/Views/FormTheme/Config/_config_helloworld_config_widget.html.php

?>

<div class="panel panel-primary">
    <div class="panel-heading">
        <h3 class="panel-title"><?php echo $view['translator']->trans('mautic.config.tab.helloworld_config'); ?></h3>
    </div>
    <div class="panel-body">
        <?php foreach ($form->children as $f): ?>
            <div class="row">
                <div class="col-md-6">
                    <?php echo $view['form']->row($f); ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>
```

Registering a formTheme as `HelloWorldBundle:FormTheme\Config` in the event listener told the ConfigBundle to look in the HelloWorldBundle's Views/FormTheme/Config folder for templates. Specifically, it will look for a template named `_config_{formAlias}_widget.html.php` where `{formAlias}` is the same as `formAlias` set in the addon's `ConfigEvents::CONFIG_ON_GENERATE` event listener.

The template should be in a panel format to match the rest of the config UI.