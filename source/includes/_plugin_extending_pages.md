### Extending Landing Pages

Make sure you reigster the event listener in your `config.php`:

```php
<?php
// plugins/HelloWorldBundle/config.php

use MauticPlugin\HelloWorldBundle\EventListener\PageSubscriber;

return [
    'services' => [
        'events' => [
            'plugin.helloworld.page.subscriber' => array(
                'class' => PageSubscriber::class,
                'arguments' => [
                    'mautic.helper.templating'
                ]
            )
        ],
    ],
];

```
```php
<?php
// plugins/HelloWorldBundle/EventListener/PageSubscriber.php

namespace MauticPlugin\HelloWorldBundle\EventListener;

use Mautic\CoreBundle\Helper\TemplatingHelper;
use Mautic\PageBundle\PageEvents;
use Mautic\PageBundle\Event\PageBuilderEvent;
use Mautic\PageBundle\Event\PageDisplayEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Class PageSubscriber
 */
class PageSubscriber implements EventSubscriberInterface
{
    /**
     * @var TemplatingHelper
     */
    private $templating;

    public function __construct(TemplatingHelper $templating)
    {
        $this->templating = $templating;
    }

    /**
     * @return array
     */
    static public function getSubscribedEvents()
    {
        return array(
            PageEvents::PAGE_ON_BUILD   => array('onPageBuild', 0),
            PageEvents::PAGE_ON_DISPLAY => array('onPageDisplay', 0)
        );
    }

    /**
     * Register the tokens and a custom A/B test winner
     *
     * @param PageBuilderEvent $event
     */
    public function onPageBuild(PageBuilderEvent $event)
    {
        // Add page tokens
        if ($event->tokensRequested('{myToken}')) {
            $event->addToken('{myToken}', 'My Token');
        }

        // Add AB Test Winner Criteria
        $event->addAbTestWinnerCriteria(
            'helloworld.planetvisits',
            array(
                // Label to group by
                'group'    => 'plugin.helloworld.header',
                
                // Label for this specific a/b test winning criteria
                'label'    => 'plugin.helloworld.pagetokens.',
                
                // Static callback function that will be used to determine the winner
                'callback' => '\MauticPlugin\HelloWorldBundle\Helper\AbTestHelper::determinePlanetVisitWinner'
            )
        );
    }

    /**
     * Search and replace tokens with content
     *
     * @param PageDisplayEvent $event
     */
    public function onPageDisplay(PageDisplayEvent $event)
    {
        // Get content
        $content = $event->getContent();

        // Search and replace tokens
        $html = $this->templating->getTemplating()->render(
            'HelloWorldBundle:SubscribedEvents\PageToken:token.html.php'
        );
        $content = str_replace('{myToken}', $html, $content);

        // Set updated content
        $event->setContent($content);
    }
}
```

There are two way to extend pages: page tokens used to insert dynamic content into a page and a/b test winning criteria . Both leverage the `\Mautic\PageBundle\PageEvents::PAGE_ON_BUILD` event. Read more about [listeners and subscribers](#events).

#### Page Tokens

Page tokens are handled exactly the same as [Email Tokens](#page-tokens).

#### Page A/B Test Winner Criteria

Custom landing page A/B test winner criteria is handled exactly the same as [page A/B test winner criteria](#page-a/b-test-winner-criteria) with the only differences being that the `callback` function is passed `Mautic\PageBundle\Entity\Page $page` and `Mautic\PageBundle\Entity\Page $parent` instead. Of course `$children` is an ArrayCollection of Page entities as well.
