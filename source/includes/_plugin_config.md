## Plugin Config File

Mautic leverages a simple array config file that will register routes, menu items, services and custom configuration parameters.

### General

```php
<?php
// plugins/HelloWorldBundle/Config/config.php

return array(
    'name'        => 'Hello World',
    'description' => 'This is an example config file for a simple Hellow World plugin.',
    'author'      => 'Marty Mautibot',
    'version'     => '1.0.0',
```

The general config options will define what should be listed in the Plugin manager.
 
The version should be "[PHP-standardized](http://php.net/manual/en/function.version-compare.php)" as the Plugin manager will use version_compare() to determine if the [onUpdate callback](#update) should be executed.  

### Routes
> If copying, do not copy `<?php //continued` as it is simply used to force sytax highlighting.

```php
<?php // continued

    'routes'   => array(
        'main' => array(
            'plugin_helloworld_world' => array(
                'path'       => '/hello/{world}',
                'controller' => 'HelloWorldBundle:Default:world',
                'defaults'    => array(
                    'world' => 'earth'
                ),
                'requirements' => array(
                    'world' => 'earth|mars'
                )
            ),
            'plugin_helloworld_list'  => array(
                'path'       => '/hello/{page}',
                'controller' => 'HelloWorldBundle:Default:index'
             ),
            'plugin_helloworld_admin' => array(
                'path'       => '/hello/admin',
                'controller' => 'HelloWorldBundle:Default:admin'
            ),
        ),
        'public' => array(
            'plugin_helloworld_goodbye' => array(
                'path'       => '/hello/goodbye',
                'controller' => 'HelloWorldBundle:Default:goodbye'
            ),
            'plugin_helloworld_contact' => array(
                'path'       => '/hello/contact',
                'controller' => 'HelloWorldBundle:Default:contact'
            )
        ),
        'api' => array(
            'plugin_helloworld_api' => array(
                'path'       => '/hello',
                'controller' => 'HelloWorldBundle:Api:howdy',
                'method'     => 'GET'
            )
        )
    ),
```

Routes define the URL paths that will be used to execute the plugin's controller actions. See [Routing](#routing) for specifics on how routes work.

#### Firewalls
There are three firewalls to define the routes behind.

Firewall|Description
--------|-----------
**main**|Secure area of Mautic (/s/ will be auto prepended to the path). The user will be required to login to access this path.
**public**|Public access without needing authentication. The URL will be appended directly to Mautic's base URL.
**api**|Secure API area of Mautic (/api/ will be auto prepended to the path). OAuth authorization will be required to access the path. 

Each firewall accepts an array of defined routes. Each key, the route's name, must be unique across all bundles and firewalls. Paths must be unique across the same firewall.  **Order does matter** as the first matching route will be used.

#### Route definitions
Array Key|Required|Type|Description
---------|--------|----|-----------
**path**|REQUIRED|string|Defines the path for the URL. Placeholders can be defined using curly brackets. Parameters are passed into the controller function as arguments.
**controller**|REQUIRED|string|Defines the controller and function to call when the path is accessed. This should be in Symfony's controller notation of BundleName:ControllerClass:controllerMethod. See [Controllers](#controllers) for more information.
**method**|OPTIONAL|string|Restricts the route to a specific method, i.e. GET, POST, etc
**defaults**|OPTIONAL|array|Defines default values for path placeholders. If a default is defined, it is not required in the URL. In the code example, /hello will be the same as /hello/earth and the controller's $world argument will default to 'earth' as well.
**requirements**|OPTIONAL|array|Defines regex matches placeholders must match in order for the route to be recognized. For example, for plugin_helloworld_world in the code example, world is restricted to earth or mars.  Anything else will not be recognized by the route.
**format**|OPTIONAL|string|Sets the request format for the Request response, i.e. Content-Type header. The api firewall will automatically set this to json.
**condition**|OPTIONAL|string|Very flexible expression to set when the route should match. Refer to [Symfony docs](http://symfony.com/doc/2.8/book/routing.html#completely-customized-route-matching-with-conditions).

Note that there are some internally used placeholders that Mautic will set defaults and requirements for (if not overridden by the route)

{page} will default to 1 with a requirement of \d+

{objectId} will default to 0 

{id} will have a requirement of \d+ if under the api firewall

<aside class="notice">
Each route's name must be unique across all bundles and firewalls and paths must be unique with the same firewall.
</aside>

<aside class="notice">
Order does matter.  The first route the path matches will be used.
</aside>

**Debugging Routes**
There are a few CLI commands that make help with debugging routes.

<pre class="inline">
php app/console router:debug
</pre>

<pre class="inline">
php app/console router:debug article_show
</pre>

<pre class="inline">
php app/console router:match /blog/my-latest-post
</pre>

### Menu

```php
<?php // continued

    'menu'     => array(
        'main' => array(
            'priority' => 4,
            'items'    => array(
                'plugin.helloworld.index' => array(
                    'id'        => 'plugin_helloworld_index',
                    'iconClass' => 'fa-globe',
                    'access'    => 'plugin:helloworld:worlds:view',
                    'parent'    => 'mautic.core.channels',
                    'children'  => array(
                        'plugin.helloworld.manage_worlds'     => array(
                            'route' => 'plugin_helloworld_list'
                        ),
                        'mautic.category.menu.index' => array(
                            'bundle' => 'plugin:helloWorld'
                        )
                    )
                )
            )
        ),
        'admin' => array(
            'plugin.helloworld.admin' => array(
                'route'     => 'plugin_helloworld_admin',
                'iconClass' => 'fa-gears',
                'access'    => 'admin',
                'checks'    => array(
                    'parameters' => array(
                        'helloworld_api_enabled' => true
                    )
                ),
                'priority'  => 60
            )
        )
    ),
```
Menu defines the menu items to display in the different menus.

#### Menu types
Mautic 2.0 has four customizable menus. 

Menu Name|Location|
---------|--------|
**main**|Main menu on the left
**admin**|Admin menu accessible through the cogwheel in upper right hand side of Mautic
**profile**|Profile menu accessible through clicking the username in upper right hand side of Mautic
**extra**|Displays to the right of the Mautic logo in the upper left hand. Only shows if there are menu items injected.

#### Priority
To control the placement of the menu item set, set an array with 'priority' and 'items' keys. Priority can be negative to position the items lower than others or positive to position them higher. If the menu items are returned without setting priority, like the admin menu in the code example, priority is treated as 9999.

To control the priority of individual menu items, set `priority` it's definition array.
  
#### Parent
To place a menu item in another bundles parent menu item, for example Channels or Components, define the `parent` key with the key of the menu item this item should display under. For example, to show an item under the Channels parent menu item, use `'parent'    => 'mautic.core.channels',`.  
  
#### Menu item definitions
The menu item's name should be the [language string key](#translations) that will be displayed as the item's link. 

Item definitions:

Array Key|Required|Type|Description
---------|--------|----|-----------
**route**|OPTIONAL|string|The route name as defined in [routes](#routes). Do not set a route to treat the item as a parent to activate a submenu.
**routeParameters**|OPTIONAL|array|Route placeholder values to use when generating the URL
**id**|OPTIONAL|string|Sets the id of the &lt;a /&gt; attribute. This will default to what is set as route. This is used in conjuction with `returnUrl` returned in a controller's response so that the correct menu item is highlighted when ajax is used to navigate the interface. 
**iconClass**|OPTIONAL|string|Font Awesome class to set the icon for the menu item.
**access**|OPTIONAL|string|Set the [permission](#security) required for this item to display to the user currently logged in. Can also set 'admin' to restrict to Administrators only.
**checks**|OPTIONAL|array|Restricts display of the link based on either configured parameters or the GET request. It will accept a 'parameters' and/or 'request' array of key => value pairs that must be true to display the menu item.
**bundle**|OPTIONAL|string|Required only for [category integration](#categories).
**parent**|OPTIONAL|string|Display this item under another parent menu item.
**priority**|OPTIONAL|int|Set the priority for ordering this menu item with it's siblings.

### Services

```php
<?php // continued 

    'services'    => array(
        'events' => array(
            'plugin.helloworld.leadbundle.subscriber' => array(
                'class' => 'MauticPlugin\HelloWorldBundle\EventListener\LeadSubscriber'
            )
        ),
        'forms'  => array(
            'plugin.helloworld.form' => array(
                'class' => 'MauticPlugin\HelloWorldBundle\Form\Type\HelloWorldType',
                'alias' => 'helloworld'
            )
        ),
        'helpers' => array(
            'mautic.helper.helloworld' => array(
                'class'     => 'MauticPlugin\HelloWorldBundle\Helper\HelloWorldHelper',
                'alias'     => 'helloworld'
            )
        ),
        'other'   => array(
            'plugin.helloworld.mars.validator' => array(
                'class'     => 'MauticPlugin\HelloWorldBundle\Form\Validator\Constraints\MarsValidator',
                'arguments' => 'mautic.factory',
                'tag'       => 'validator.constraint_validator',
                'alias'     => 'helloworld_mars'
            )
        )
    ),

```

Services are PHP objects stored in the service container and are used all throughout Mautic. They can be as simple or as complex as required. Read more about Symfony's service container [here](http://symfony.com/doc/2.8/book/service_container.html). 

The override of existing services is forbidden by default. You can allow the override by expliciting setting the parameter `plugin_allow_overrides` equal to `true` in the `app/config/local.php` file.
   
#### Service types
Mautic allows easy configuration for four types of services:

Type|Description
----|-----------
**events**|Defines event subscriber classes used to listen to events dispatched throughout Mautic and auto-tagged with 'kernel.event_subscriber.' The defined class must extend \Mautic\CoreBundle\EventListener\CommonSubscriber. Read more about subscribers [here](#subscribers).
**forms**|Defines custom [form types](#forms) and auto-tagged with 'form.type.'
**helpers**|Defines custom template helpers available through the $view variable in [views](#views). These services are auto-tagged with 'templating.helper.'
**models**|Defines [model services](#models)
**other**|All other custom services.

#### Service definitions

Each key within the service types array is the name of the service and must be unique. Use the following to define the service:

Array Key|Required|Type|Description
---------|--------|----|-----------
**class**|REQUIRED|string|Namespace to the service class (not that it does not start with a backslash)
**arguments**|OPTIONAL|string or array|String of a single argument to pass to the construct or an array of arguments to pass. Arguments enclosed with %% will be treated as a [parameter](#parameters). To pass a specific string, enclose the argument with double quotations "". Anything else that is not a boolean or a namespaced class (string with \ in it) will be treated as the name of another registered service. Often, this will simply be [mautic.factory](#factory-service).
**alias**|OPTIONAL|string|Sets the alias used by the service. For example, the key for the template helpers, $view, array or the string to retrieve a specific form type.
**tag**|OPTIONAL|string|[Tags](http://symfony.com/doc/2.8/components/dependency_injection/tags.html) the service used by bundles to get a list of specific services (for example form types and event subscribers).
**tags**|OPTIONAL|array|Array of of tags 
**tagArguments**|OPTIONAL|array|Array of attributes for the tag. See [Symfony docs](http://symfony.com/doc/2.8/components/dependency_injection/tags.html#adding-additional-attributes-on-tags) for more information.
**scope**|OPTIONAL|string|Defines the [service scope](http://symfony.com/doc/2.8/cookbook/service_container/scopes.html). Deprecated.
**factory**|OPTIONAL|string|Preferred method for using a factory class. [Factory class](http://symfony.com/doc/2.8/components/dependency_injection/factories.html) for managing creating the service.
**factoryService**|OPTIONAL|string|[Factory class](http://symfony.com/doc/2.8/components/dependency_injection/factories.html) for managing creating the service. Deprecated; use `factory` instead.
**factoryMethod**|OPTIONAL|string|Method name in the [factory service](http://symfony.com/doc/2.8/components/dependency_injection/factories.html) called to create the service. Deprecated; use `factory` instead.
**methodCalls**|OPTIONAL|array|Array of methods to be called after a service is created passing in the array of arguments provided. Should be in the format of 'methodName' => array('service_name', '%parameter%')
**decoratedService**|OPTIONAL|array|[Decorated service](http://symfony.com/doc/2.8/components/dependency_injection/advanced.html#decorating-services)
**public**|OPTIONAL|bool|[Public/private service](http://symfony.com/doc/2.8/components/dependency_injection/advanced.html#marking-services-as-public-private)
**lazy**|OPTIONAL|bool|[Lazy load service](http://symfony.com/doc/2.8/components/dependency_injection/lazy_services.html)
**synthetic**|OPTIONAL|bool|[Synthetic service](http://symfony.com/doc/2.8/components/dependency_injection/synthetic_services.html)
**synthetic**|OPTIONAL|bool|[Synthetic service](http://symfony.com/doc/2.8/components/dependency_injection/synthetic_services.html)
**file**|OPTIONAL|string|[Include file prior to loading service](http://symfony.com/doc/2.8/components/dependency_injection/definitions.html#requiring-files)
**configurator**|OPTIONAL|array|[Use a configurator to load service](http://symfony.com/doc/current/components/dependency_injection/configurators.html#configurator-service-config)


### Categories

```php
<?php // continued

    'categories' => array(
        'plugin:helloWorld' => 'mautic.helloworld.world.categories'
    ),
```
Defines category types available or the Category manager. See [Extending Categories](#extending-categories).

### Parameters

```php
<?php // continued

    'parameters' => array(
        'helloworld_api_enabled' => false
    )
);
```

The parameters array define and set default values for [custom configuration parameters](#custom-config-params) specific to the plugin. 

To obtain the values of these parameters, use the [`mautic.helper.core_parameters` service](#config-parameters).

<aside class="notice">
Any parameter to be written to the system's local config file should be defined here.
</aside>
