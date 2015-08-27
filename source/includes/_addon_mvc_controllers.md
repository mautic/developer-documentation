### Controllers

```php
<?php
// addons/HelloWorldBundle/Controller/DefaultController.php

namespace MauticAddon\HelloWorldBundle\Controller;

use Mautic\CoreBundle\Controller\FormController;

class DefaultController extends FormController
{
    /**
     * Display the world view
     *
     * @param string $world
     *
     * @return JsonResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function worldAction($world = 'earth')
    {
        /** @var \MauticAddon\HelloBundleBundle\Model\WorldModel $model */
        $model = $this->factory->getModel('addon.helloWorld.world');

        // Retrieve details about the world
        $worldDetails = $model->getWorldDetails($world);
        
        return $this->delegateView(
            array(
                'viewParameters'  => array(
                    'world'   => $world,
                    'details' => $worldDetails
                ),
                'contentTemplate' => 'HelloWorldBundle:World:details.html.php',
                'passthroughVars' => array(
                    'activeLink'    => 'addon_helloworld_world',
                    'route'         => $this->generateUrl('addon_helloworld_world', array('world' => $world)),
                    'mauticContent' => 'helloWorldDetails'
                )
            )
        );
    }

    /**
     * Contact form
     *
     * @return JsonResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function contactAction()
    {
        // Create the form object
        $form = $this->get('form.factory')->create('helloworld_contact');

        // Handle form submission if POST        
        if ($this->request->getMethod() == 'POST') {
            $flashes = array();

            // isFormCancelled() checks if the cancel button was clicked
            if ($cancelled = $this->isFormCancelled($form)) {

                // isFormValid() will bind the request to the form object and validate the data
                if ($valid = $this->isFormValid($form)) {

                    /** @var \MauticAddon\HelloBundleBundle\Model\ContactModel $model */
                    $model = $this->factory->getModel('addon.helloWorld.contact');

                    // Send the email
                    $model->sendContactEmail($form->getData());

                    // Set success flash message
                    $flashes[] = array(
                        'type'    => 'notice',
                        'msg'     => 'addon.helloworld.notice.thank_you',
                        'msgVars' => array(
                            '%name%' => $form['name']->getData()
                        )
                    );
                }
            }

            if ($cancelled || $valid) {
                // Redirect to /hello/world

                return $this->postActionRedirect(
                    array(
                        'returnUrl'       => $this->generateUrl('addon_helloworld_world'),
                        'contentTemplate' => 'HelloWorldBundle:Default:world',
                        'flashes'         => $flashes
                    )
                );
            } // Otherwise show the form again with validation error messages
        }

        // Display the form
        return $this->delegateView(
            array(
                'viewParameters'  => array(
                    'form' => $form->createView()
                ),
                'contentTemplate' => 'HelloWorldBundle:Contact:form.html.php',
                'passthroughVars' => array(
                    'activeLink' => 'addon_helloworld_contact',
                    'route'      => $this->generateUrl('addon_helloworld_contact')
                )
            )
        );
    }
}
```

#### Matching Routes to Controller Methods
The controller method called is determined by the [route defined in the config](#routes). Take this example,

<pre class="inline">
addon_helloworld_admin' => array(
    'path'       => '/hello/admin',
    'controller' => 'HelloWorldBundle:Default:admin'
 ),
</pre>

The controller is noted as `HelloWorldBundle:Default:admin`. Broken down, that will translate to:

<table>
<tr>
    <td>HelloWorldBundle</td>
    <td>\MauticAddons\HelloWorldBundle\Controller</td>
</tr>
<tr>
    <td>Default</td>
     <td>DefaultController</td>
<tr>
<tr>
    <td>admin</td>
    <td>adminAction()</td>
</tr>
</table>

<aside class="notice">
Controller notation is in the format of <code>BundleName:ControllerName:controllerMethod</code>. To use a controller within a subfolder of Controller, use <code>BundleName:Subdirectory\ControllerName:controllerMethod</code>.
</aside>

Thus when a browser calls up `/hello/admin`, `\MauticAddons\HelloWorldBundle\Controller\DefaultController\adminAction()` will be called.

What about route placeholders? Symfony is super smart and will pass those into the controller's method as arguments (the method's arguments must be the same as the route's placeholders to be matched up).

<pre class="inline">
'addon_helloworld_world' => array(
    'path'       => '/hello/{world}',
    'controller' => 'HelloWorldBundle:Default:world',
    'defaults'    => array(
        'world' => 'earth'
    ),
    'requirements' => array(
        'world' => 'earth|mars'
    )
),
</pre>

The matching method for that route will look be `public function worldAction($world = 'earth')`.

Notice that because the route defines a default for `name`, the controller method must also set the same default. If the route looked like this instead:

<pre class="inline">
'addon_helloworld_world' => array(
    'path'       => '/hello/{world}',
    'controller' => 'HelloWorldBundle:Default:world',
    'requirements' => array(
        'world' => 'earth|mars'
    )
),
</pre>

Then the method would need to be `public function worldAction($world)`.

#### Extending Mautic's Controllers

Mautic has several controllers that provide some helper functions.

#####Mautic\CoreBundle\Controller\CommonController

Controllers extending this will make [MauticFactory](#factory-service) available via `$this->factory` and [Request](#request) via `$this->request`. 

It also provides the following helper methods:

######delegateView($args)

Mautic is ajax driven and thus must support both http requests and ajax requests for content. `delegateView` is wrapper method that determines if the request is for ajax content or the full DOM then generates and returns the appropriate response. 

The $args argument is an array with the required elements for generating the view, ajax or http. It will accept the following parameters:

Key|Required|Type|Description
---|--------|----|-----------
contentTemplate|REQUIRED|string|Defines the view template to load. This should be in view notation of BundleName:ViewName:template.html.php. Refer to [views](#views) for more information.
viewParameters|OPTIONAL|array|Array of variables with values made available to the template. Each key will be a variable available to the template.
passthroughVars|OPTIONAL|array|Array of variables returned as part of the ajax response used by Mautic and/or the addon's onLoad JS callback. 

Due to the use of ajax, there are some elements of the `passthroughVars` array that Mautic will use internally to manipulate the user interface. For responses that include main content, i.e. routes a user would click to, should set at least `activeLink` and `route`.

Key|Required|Type|Description
---|--------|----|-----------
activeLink|OPTIONAL|string|The [ID of the menu item](#items) that should be activated dynamically to match the ajax response
route|OPTIONAL|string|The route that should be pushed to the browser's address bar to match the ajax response
mauticContent|OPTIONAL|string|Used to generate the Javascript method to call after the ajax content has been injected into the DOM. The same function will also be called on a page refresh/full page load if set via `$view['slots']` in the template. For example, if this is set as `helloWorldDetails`, Mautic will check for the existence of and executes `Mautic.helloWorldDetailsOnLoad()`. Refer to [Processing Ajax Content](#processing-ajax-content) for more information regarding this and [Asset Helper](#asset-helper) for injecting assets into the head for ajax generated content.
callback|OPTIONAL|string|A Mautic namespaced JS function that will be executed before the response is injected into the DOM. If set, Mautic will pass the response to the function and not process the content. It will be up to the callback function to handle the rest of the process.
redirect|OPTIONAL|string|The URL to force a page redirect rather than inject ajax content.
target|OPTIONAL|string|jQuery selector to inject the content into. By default, the app's main content selector will be used.
replaceContent|OPTIONAL|string|Determines if Mautic should replace the target selector with the ajax content or set as its inner HTML. Return 'true' as a string to replace the selector.

######delegateRedirect($url)

Delegates the appropriate response for redirects. 

If an ajax request, a json response with `{redirect: $url}` will be returned allowing the executing JS code to force the redirect.
 
If an http request, then a redirect response is returned (i.e redirect header).

######postActionRedirect($args)

Similar to delegateView(), this method will delegate the appropriate response based on the request. This method can be used after performing some action, such as saving a form. It accepts the same elements in the $args array as delegateView() but also accepts the following:
  
Key|Required|Type|Description
---|--------|----|-----------
returnUrl|OPTIONAL|string|The URL to redirect to. It will default to /s/dashboard if not set. This will also auto-populate passthroughVars[route] if not set.
flashes|OPTIONAL|array|Array of flash messages to display after redirecting. See [Flash Messages](#flash-messages) for more information.
forwardController|OPTIONAL|bool|By default, the request is forwarded to a controller method rather than directly loading a view template. This means that contentTemplate should be in controller notation (BundleName:ControllerName:controllerMethod) rather than view notation (BundleName:ViewName:template.html.php). Set this to false to directly load a view template rather than forwarding to another controller.

#####Mautic\CoreBundle\Controller\FormController

This controller extends CommonController and provides helper methods for managing forms. See [Forms](#forms) for more information.

#####Mautic\CoreBundle\Controller\AjaxController

This controller also extends CommonController and is a companion to some of the built-in Javascript helpers. See  [Javascript methods](#javascript-methods) for more information.