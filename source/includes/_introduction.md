# Introduction

Welcome to the Mautic Developer Documentation. This documentation will go over how to build a Mautic Plugin that extends the features of Mautic, how to build custom themes, and how to integrate applications outside of Mautic using its REST API. 

## Submitting Code to Mautic

Development is open and available to any member of the Mautic community. All fixes and improvements are done through pull requests to the code on [GitHub](https://github.com/mautic/mautic). This code is open source and publicly available. 

Read all about [contributing to Mautic](https://contribute.mautic.org/contributing-to-mautic/developer) as a Developer.

Read more about the PR process on the Mautic [Governance](https://www.mautic.org/about/governance) page.

The code should try to follow [Symfony's Coding Standards](http://symfony.com/doc/current/contributing/code/standards.html)

## Symfony

Mautic is built on [Symfony](http://symfony.com), the popular PHP framework (Mautic 1.0.x uses Symfony 2.5; Mautic 2.0.x uses Symfony 2.8). This document will go over the basics but most of [their documentation](http://symfony.com/doc/2.8/book/index.html) applies to Mautic as well which can be used to obtain more advanced Symfony functionality.
  
There are some structural differences between Mautic and standard Symfony. Below is a list of where you will find some of standard Symfony locations in Mautic:
 
 Symfony | Mautic
 ------- | -------
 src/ | app/bundles (Mautic core) or plugins/ (Mautic plugins)
 web/ | /
 AcmeBundle/Resources/config | AcmeBundle/Config
 AcmeBundle/Resources/views | AcmeBundle/Views
 AcmeBundle/Resources/public | AcmeBundle/Assets
 AcmeBundle/Resources/translations/domain.en_US.ini | AcmeBundle/Translations/en_US/domain.ini
 
 Most of Symfony's standard locations, such as the Resources/views and Resources/translations directories, should still function with Mautic. However, it may be required to handle service registration, etc with native Symfony processes if not using the Mautic methods defined in this document. 
 
 ### Mautic 3.x and Symfony 3.4
 With release of Mautic 3.x Symfony version has also been updated. Mautic 3.x uses [Symfony 3.4](https://symfony.com/doc/3.4/index.html). For detailed information of what changed with symfony 3 please read [UPGRADE-3.0](https://github.com/mautic/mautic/blob/3.x/UPGRADE-3.0.md). Major notable change in the filesystem is `app/log` and `app/cache` is not part of `var/logs` and `var/cache`. Also `app/console` is now `bin/console`. 

 
## Development Environment

### Setup
It is assumed that the system already has [composer](https://getcomposer.org) and [git](http://git-scm.com) installed and configured.

To setup the developer environment, simply fork and clone the source from [GitHub](https://github.com/mautic/mautic). Then Run `composer install` on the source. 

Open your browser and complete the installation through the Mautic installer.
You can also execute the install process from command line:
* Add a `local.php` file in app/config
* Edit the `local.php` file using the following template (adapt to your own settings):
```php
<?php
$parameters = array(
	'db_driver' => 'pdo_mysql',
	'db_host' => 'localhost',
	'db_table_prefix' => null,
	'db_port' => '3306',
	'db_name' => 'mautic',
	'db_user' => 'root',
	'db_password' => 'root_password',
	'db_backup_tables' => true,
	'db_backup_prefix' => 'bak_',
);
```
* Execute the following command and add your own options: `php bin/console mautic:install http://your.mautic.instance`

### Environments

There are three environments in Mautic: prod, dev, and test.

**prod** is used when accessing the site through index.php.

**dev** is used when accessing the site through index_dev.php. Using Mautic in the dev environment will activate Symfony's profiler toolbar, has more strict error handling, will display information about exceptions, and will not cache as much (see below). Note that steps should be taken to ensure index_dev.php is not accessible to the public as it could potentially reveal sensitive information. It is restricted to localhost by default. However, there are two ways to allow access to index_dev.php from a non-localhost. The first option is to set a header from the web-server with the IP addresses assigned to `MAUTIC_DEV_HOSTS`. The second and easier option is to add an array to your installation's `app/config/local.php` file as `'dev_hosts' = ['123.123.123.123', '124.124.124.124'],` then clear the [cache](#cache).

**test** is used mainly for PHP Unit Tests.

### Cache

Symfony makes heavy use of a filesystem cache. Frequently clearing this cache will be required when developing for Mautic. By default, the cache is located in app/cache/ENV where ENV is the environment currently accessed (i.e. dev or prod). To rebuild the cache, the ENV can just be deleted or run the Symfony command `php app/console cache:clear --env=ENV` If a specific environment is not passed to the command via `--env=ENV`, the dev environment will be used by default.
 
 > `php bin/console` shall be used for Mautic 3.x
 
 In the dev environment, translations, views, and assets are not cached. However, changes to these files will require the cache to be cleared for them to take effect in the prod environment. Changes to Mautic config files, Symfony config files, etc will require the cache to be cleared regardless of environment.
 
 <aside class="notice">
 The typical rule of thumb is, if Mautic is not acting as you expect after making changes, try clearing your cache.
 </aside>
 
 <aside class="warning">
 If you get class could not be found or cannot redeclare class errors when using the cache:clear command, manually delete the app/cache/ENV folder then run the command and/or browse to the site to rebuild.
 </aside>
 
