### 3.0.0

Mautic 3.x being a major leap from symfony version 2.8 to 3.4 there are a lot of deprecuations. It would not be wise to list them all here. For complete list of changes and upgrades please refer to [Upgrade-3.0](https://github.com/mautic/mautic/blob/3.x/UPGRADE-3.0.md) However to immediately fix any existing or custom plugin issues you can look into following checklist:

#### Backwards Compatibility breaking changes
- Symfony deprecations were removed or refactored see [Symfony Upgrade 3.0](https://github.com/symfony/symfony/blob/3.0/UPGRADE-3.0.md)
- Migrating the database should be done by upgrading to the latest 2.x series then to M3 as all 2.x migrations have been removed from the 3.x code.
- jQuery v2.x has been replaced with jQuery v3.3.1. jQuery 2.x code is not supported anymore..
- app/version.txt has beeen removed in favor of app/release_metadata.json which includes the version
- `\AppKernel::MAJOR_VERSION`, `\AppKernel::MINOR_VERSION`, `\AppKernel::PATCH_VERSION`, and `\AppKernel::EXTRA_VERSION` are no longer defined. Use `\Mautic\CoreBundle\Release\ThisRelease::getMetadata()->getMajorVersion()`, etc instead.
#### Subscribers

- Do not extend `CommonSubscriber`. It was removed. Use direct DI instead.
- All protected properties and methods were made private. Subscribers should not be used to extend another ones. There are 2 exceptions. See bellow.
- `StatsSubscribers` extend abstract class `Mautic\CoreBundle\EventListener\CommonStatsSubscriber`. Those subscribers must have protected properties.
- `DashboardSubscribers` extend abstract class `Mautic\DashboardBundle\EventListener\DashboardSubscriber\DashboardSubscriber`. Those subscribers must have protected properties.
- Subscribers that extend abstract class `Mautic\QueueBundle\EventListener\AbstractQueueSubscriber` must keep protected properties.

Following is a Table of Content list for all the sections, which have changes, we are merely providing a title list, but for detailed information please check [Upgrade-3.0](https://github.com/mautic/mautic/blob/3.x/UPGRADE-3.0.md).
- User facing changes
- New features
- Backwards compatibility breaking changes
  - Subscribers
  - Configuration
  - PHPUNIT tests
  - CoreBundle
  - ApiBundle
  - AssetBundle
  - CampaignBundle
  - CategoryBundle
  - ChannelBundle
  - ConfigBundle
  - CrmBundle
  - DashboardBundle
  - DynamicContentBundle
  - EmailBundle
  - EmailMarketingBundle
  - HubspotApiFormBundle
  - InstallBundle
  - IntegrationsBundle
  - LeadBundle
  - NotificationsBundle
  - PageBundle
  - PluginBundle
  - SMSBundle
  - StageBundle
  - SocialBundle
  - UserBundle
  - WebhookBundle
  - MauticCloudStorageBundle
  - MauticCtrixBundle
  - MauticFullContactBundle
- Other

#### Notables from 'Other' section
  - `$view[‘router’]->generate()` in PHP templates has to be changed to `$view[‘router’]->url()`
  - Form type classes `getName()` methods should be renamed (not removed) to `getBlockPrefix()` method to save some issues with JS files which use form input ID selectors.
  - `setOptional` method in form types is deprecated. Please use `setDefined` method instead.
  - `choice_list` must be changed to `choices`, and the value of class `ChoiceType` has to be replaced with `choices` and an array with labels as keys; there’s a bug in Symfony 2.8 that you also have to set `‘choices_as_values’ => true` to ensure that labels and values are correct.
  - Some use of choices for `ChoiceType` in Mautic 2 is dependent on the Symfony 2.8 bc break and need to have the key/values flipped. See https://symfony.com/doc/2.8/reference/forms/types/choice.html#choices-as-values