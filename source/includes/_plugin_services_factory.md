### Factory Service

`\Mautic\Factory\MauticFactory` is deprecated as of 2.0 and will be phased out through 2.x release cycles and completely removed in 3.0. Direct dependency injection into the services should be used instead where possible. 

For [controllers](#controllers), extend either `\Mautic\CoreBundle\Controller\CommonController` or `\Mautic\CoreBundle\Controller\FormController` and it will be available via `$this->factory` by default. Otherwise, obtain the factory from the service container via `$factory = $this->container->get('mautic.factory');`
  
For [models](#models), it will be available via `$this->factory` by default.
  
For custom [services](#services), pass 'mautic.factory' as an argument and MauticFactory will be passed into the __construct of the service.

#### Mautic 3.x
- `MauticFactory` no longer injected into `CommonRepository` classes thus `CommonRepository::setFactory()` and `$this->factory` removed
- `MauticFactory` no longer made available to `AbstractMauticMigration;` use `$this->container` instead
<aside class="warning">
Mautic 3.x removed MauticFactory, should use the service container and proper DI instead.
</aside>