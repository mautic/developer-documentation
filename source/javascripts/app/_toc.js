(function (global) {

  var closeToc = function () {
      $(".tocify-wrapper").removeClass('open');
      $("#nav-button").removeClass('open');
  };

  var makeToc = function () {
      global.toc = $("#toc").tocify({
          selectors: 'h1, h2, h3',
          extendPage: false,
          theme: 'none',
          smoothScroll: false,
          showEffectSpeed: 0,
          hideEffectSpeed: 180,
          ignoreSelector: '.toc-ignore',
          highlightOffset: 60,
          scrollTo: -1,
          scrollHistory: true,
          hashGenerator: function (text, element) {
              return element.prop('id');
          }
      }).data('toc-tocify');

      $("#nav-button").click(function () {
          $(".tocify-wrapper").toggleClass('open');
          $("#nav-button").toggleClass('open');
          return false;
      });

      $(".page-wrapper").click(closeToc);
      $(".tocify-item").click(closeToc);

      $('ul').prev('li').find('a').each(function (index) {
          var that = this;
          setTimeout(function () {
              var startingClass = ($(that).parent().hasClass('tocify-focus')) ? 'close' : 'open';
              $(that).append(
                  $("<span />").addClass(startingClass)
              );
          }, 200);

          $(this).click(function () {
              $('#toc a span').removeClass('close');
              $(this).find('span').first().addClass('close');
          });
      });
  };

  // Hack to make already open sections to start opened,
  // instead of displaying an ugly animation
  function animate() {
      setTimeout(function () {
          toc.setOption('showEffectSpeed', 180);
      }, 50);
  }

  function makeLinks() {
      // Append anchor links
      $(":header").each(function () {
          if ($(this).attr('id')) {
              var link = $('<a class="header-link"><i class="fa fa-link" style="display:none;"></i></a>').attr('href', '#' + $(this).attr('id'));
              $(this).append(link);

              $(this).on('mouseenter',function(){
                  $(this).find('i.fa-link').css('display', 'inline');
              });
              $(this).on('mouseleave',function(){
                  $(this).find('i.fa-link').css('display', 'none');
              });
          }
      });
  }

  $(makeToc);
  $(animate);

  $(makeLinks);
})(window);
