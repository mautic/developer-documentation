## Roles and Permissions

Mautic provides a means of defining custom permissions for roles through Permission objects.

### How Permissions Work
Permissions are calculated based on bits assigned to an addon's level and permission. Bits are integers that increase by doubling the value. 1, 2, 4, 8, 16, 32, 64, 128, 512, 1024, and so forth. The bits should never be assigned numbers in between such as 3 or 5 as the permission will not be correctly calculated in such cases.
 
For example, let's say HelloWorldBundle needs to manage access to user's Worlds entity. A permission set for `addon:helloWorld:worlds` might look like

Permission|Bit
----------|---
view|1
edit|2
create|4
delete|8
full|16

<aside class="notice">
<code>addon:helloWorld:worlds:view</code> is a typically notation for requesting permission in Mautic. The notation tells Mautic to check for the `view` permission for the addon, HelloWorldBundle, within the `worlds` level. Levels allow addon's to set permissions for multiple areas.
</aside>

Mautic will take the summation of the bits for the permissions given to a role and store it in the database. For example, if a role is given view and edit access, the stored bit is 3. If given view and create access, the stored bit is 5.

When a permission check is required, e.g. `addon:helloWorld:worlds:create`, Mautic will check if bit of 4 is set in the role's generated bit for `addon:helloWorld:worlds`. If so, permission is granted.

<aside class="notice">
The permission <code>full</code> is reserved to grant access to all previous permissions within the level and thus should always be the highest bit.
</aside>

###Using Permissions

```php
<?php

$security = $this->factory->getSecurity();

// Check if user is granted a single permission
if ($security->isGranted('addon:helloWorld:worlds:view')) {
    // do something
}

// Check if user is granted multiple permissions (must be granted to all to be true)
if ($security->isGranted(
    array(
        'addon:helloWorld:worlds:view',
        'addon:helloWorld:worlds:create',
    )
)
) {
    //do something
}

// Check if user is granted to at least one permission
if ($security->isGranted(
    array(
        'addon:helloWorld:worlds:view',
        'addon:helloWorld:worlds:edit',
    ),
    'MATCH_ONE'
)
) {
    //do something
}

// Get an array of user permissions
$permissions = $security->isGranted(
    array(
        'addon:helloWorld:worlds:view',
        'addon:helloWorld:worlds:edit',
    ),
    'RETURN_ARRAY'
);

if ($permissions['addon:helloWorld:worlds:view']) {
    // do something
}

// Check if user has access to view leads
if ($security->isGranted('lead:leads:viewother')) {
    // do something
}
```

To determine if a user has a specific permission, use Mautic's security service which can be obtained from the [factory service](#factory-service) via `$this->factory->getSecurity()`.

As suggested above, Mautic uses a special permission notation to refer to a specific permission. For core bundles, `bundleName:permissionLevel:permission` is used.  For addons, append `addon:`, i.e. `addon:bundleName:permissionLevel:permission`. `addon:` tells Mautic to look for the permission class in the addons/ directory and `MauticAddons` namespace. 

The permission level and permissions are set by the core bundle or addon. For example, Mautic's core UserBundle has `users` and `roles` levels with `view`, `edit`, `create`, `delete` and `full` permissions for each. 
 
 To check if a user has permission to edit roles, use `$this->factory->getSecurity()->isGranted('user:roles:edit');`
 
###Creating Custom Permissions

```php
<?php
// addons/HelloWorldBundle/Security/Permissions/HelloWorldPermissions.php

namespace MauticAddon\HelloWorldBundle\Security\Permissions;

use Symfony\Component\Form\FormBuilderInterface;
use Mautic\CoreBundle\Security\Permissions\AbstractPermissions;

/**
 * Class HelloWorldPermissions
 */
class HelloWorldPermissions extends AbstractPermissions
{

    /**
     * Define available permissions
     *
     * @param $params
     */
    public function __construct($params)
    {
        parent::__construct($params);

        $this->permissions = array(

            // Custom level
            'worlds' => array(

                // Custom permissions
                'use_telescope' => 1,
                'send_probe'    => 2,
                'visit'         => 4,
                // Full will almost always be included and should be significantly higher than the
                // others in case new permissions need to be added later 
                'full'          => 1024
            )
        );

        // Add standard category permissions
        $this->addStandardPermissions('categories');
    }

    /**
     * Append the permission form fields to the Role form
     *
     * @param FormBuilderInterface $builder
     * @param array                $options
     * @param array                $data
     */
    public function buildForm(FormBuilderInterface &$builder, array $options, array $data)
    {
        // Add standard category form fields
        $this->addStandardFormFields('helloWorld', 'categories', $builder, $data);

        // Add custom 'worlds' level form fields
        $builder->add(
        
            // Form element name should be bundleName:permissionLevel
            'helloWorld:worlds',
            
            // Should always be permissionlist type
            'permissionlist',
            array(
                'choices' => array(
                    'use_telescope' => 'addon.helloworld.permissions.use_telescope',
                    'send_probe'    => 'addon.helloworld.permissions.send_probe',
                    'visit'         => 'addon.helloworld.permissions.visit',
                    'full'          => 'mautic.core.permissions.full',
                ),
                'label'   => 'addon.helloworld.permissions',
            
                // Set existing data
                'data'    => (!empty($data['worlds']) ? $data['worlds'] : array()),
            
                // Bundle name (used to build frontend form)
                'bundle'  => 'helloWorld',
            
                // Permission level (used to build frontend form)
                'level'   => 'worlds'
            )
        );
    }

    /**
     * Permission set identifier; should be bundleName
     * 
     * @return string
     */
    public function getName()
    {
        return 'helloWorld';
    }
}
```

An addon can create it's own set of permissions by creating a Permission class. See the code example for a skeleton outline of what the class will look like.

Each permission class should extend `Mautic\CoreBundle\Security\Permissions\AbstractPermissions`.

Then, for most permission classes, three methods are needed: `__construct()`, `buildForm()` and `getName()`.

**__construct()**

The construct method should do two things. It should call `parent::__construct($params)` or it should set `$this->params = $params;`. 

Then it should define `$this->permissions`. `$this->permissions` is an array of permission levels that are each arrays with permissions assigned to bits.  For example, in the code block, a custom permission level of `worlds` is defined with the permissions of `use_telescope`, `send_probe`, `visit` and `full`. To check to see if a user has permission to the level `worlds` and permission `send_probe`, `$this->factory->getSecurity()->isGranted('addon:helloWorld:worlds:send_probe')` would be used.

Mautic provides a few helper methods for common permission sets:

Method|Description
------|-----------
addStandardPermissions()|Set view, edit, create, delete, publish (with option to exclude), and full permissions.
addExtendedPermissions()|Set creator level restrictions: viewown, viewother, editown, editother, create, deleteown, deleteother, publishown (with option to exclude), publishother (with option to exclude), and full
addManagePermission|Set single manage permission

**buildForm()**

The buildForm method will append the permission toggles to the Role's form (see [Forms](#forms) for details on form builders). Review the comments in the code sample.

There are complimentary helper methods for the common permission sets:

Method|Description
------|-----------
addStandardFormFields()|Appends the standard permission sets to the form
addExtendedFormFields()|Appends the extended, aka creator restricted, permissions to the form 
addManageFormFields()|Appends the single manager element to the form

**getName()**
This method is absolutely required and should match both the bundleName and the name of the file. For example, if `HelloWorldBundle` is the bundle's name, then this would be `helloWorld` with a filename of `HelloWorldPermissions.php`.

<div class="clear-right"></div> 
#### Permission Aliases

```php
<?php

    protected function getSynonym($name, $level)
    {
        if ($name == 'send_satellite') {
            // Set real permission name
            $name = 'send_probe';
        }

        return array($name, $level);
    }
```

To add a permission alias, use the `getSynonym()` method. Basically this method is called before each requested permission is determined giving opportunity to change the permission level or name as needed.

For example, `parent::getSynonym()` will recognize `editown` as `edit` if `editown` isn't defined in the permission class' `$this->permissions` property for the requested level.
 
<div class="clear-right"></div>
#### Manipulating Permissions before Saving
 
 ```php
 <?php
 
     /**
      * @param array $permissions     Addon specific permissions
      * @param       $allPermissions  All role permissions
      * @param bool  $isSecondRound   Is round two after permissions have been updated by all permission classes 
      *
      * @return bool Return true if a second round is required; default false
      */
     public function analyzePermissions(array &$permissions, $allPermissions, $isSecondRound = false)
     {
         foreach ($permissions as $level => &$perms) {
             foreach ($perms as $perm) {
                 $include = array();
                 switch ($perm) {
                     case 'send_probe':
                         $include = array('use_telescope');
                         break;
                     case 'visit':
                         $include = array('use_telescope', 'send_probe');
                         break;
                 }
                 if (!empty($include)) {
                     foreach ($include as $r) {
                         list($ignore, $r) = $this->getSynonym($level, $r);
                         if ($this->isSupported($level, $r) && !in_array($r, $perms)) {
                             $perms[] = $r;
                         }
                     }
                 }
             }
         }
         
         // Return true if this method needs a second round after all the other bundles have adjusted permissions
         return false;
     }
```

Addon's can adjust permissions based on other selected permissions in order to prevent 'user error.' For example, if a user has permission to `edit`, then the user also needs permission to `view` whether that was selected in the Role form or not. The method `analyzePermissions()`  can be be used for this which gives opportunity to the addon to modify permissions based on other selections before persisting to the database. 

Sometimes, it may be necessary to re-adjust based on a permission that is outside the addon's control. In this case, `analyzePermissions()` can return true and it will be called again after all the permissions have been analyzed by the other bundles and addons. In this case, the argument `$isSecondRound` will be true.

#### Advanced isGranted Logic
If it is necessary to perform some logic other than simply comparing bits, the permission class can override the parent's `public function isGranted($userPermissions, $name, $level)` and do whatever is necessary for it's own permission levels and individual permissions.

#### Advanced isSupported Logic
The same can be applied for the method `isSupported()` which is used to determine if a bundle or addon includes the requested permission and permission level. This can also be used to provide BC support.