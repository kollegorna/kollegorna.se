'use strict';

(function() {

    var Kollegorna = {

      init: function() {
        this.mobileNav();
        this.bindClicks();
        this.initComments();
        this.fitVids();
        this.setupMaps();
        this.setupFeed();
        this.injectSVGs();
        this.echo1();
      },


      injectSVGs: function() {
        // Elements to inject
        var mySVGsToInject = document.querySelectorAll('img.inject-svg');

        // Do the injection
        SVGInjector(mySVGsToInject, '', function() {
          Kollegorna.setupAnimations();
        });

        Kollegorna.setupAnimations();
      },


      mobileNav: function() {

        var $langBtn = $('#header-lang-tgl'),
            $btn = $('.header__button a');

        $btn.on('click', function(e){
          e.preventDefault();
          $('body').removeClass('open-lang');
          $('body').toggleClass('open-nav');
          $btn.toggleClass('is-active');
        });

        $langBtn.on('click', function(e){
          e.preventDefault();
          $('body').removeClass('open-nav');
          $btn.removeClass('is-active');
          $('body').toggleClass('open-lang');
        });

      },


      bindClicks: function() {

        $('.case__content').on('click', '.expand', function(e) {
          e.preventDefault();

          $('.case__facts').slideDown(function() {
            $(this).addClass('visible');
          });
          $('.additional').slideDown(function() {
            $(this).addClass('visible');

            // Reset positions on Echo1 case study
            Kollegorna.echo1();

            $('.expand').animate({
              'opacity': 0
            }, function() {
              $(this).animate({
                'width': 0,
                'margin': 0
              });
            });
          });
        });

        $('.index__feed').on('click', '.expand', function(e) {
          e.preventDefault();

          var height = $('.index__feed__blocks').height();

          $('.index__feed').animate({
            'height': height + 113
          }, 1000, function() {
            $(this).find('.expand').fadeOut(function() {
              $('.index__feed').css('height', 'auto').addClass('expanded');
            });
          });
        });

      },


      caseMediaTweet: function(data) {

        var html = $(data.html.bold());
        html.find('script').remove();
        var twitter_handle = (data.author_url.match(/https?:\/\/(www\.)?twitter\.com\/(#!\/)?@?([^\/]*)/)[3]);
        var twitter_profile_image = '<figure class="case__media__tweet__image polaroid polaroid--circle"><img src="//avatars.io/twitter/' + twitter_handle + '?size=large"></figure>';
        return html.html();

      },


      setupFeed: function() {

        $(".index__feed a[href^='http']").attr("target","_blank");

        var $feed = $('.grid').imagesLoaded(function() {
          $('.grid').fadeIn('medium');
          $('#gridloader').fadeOut('fast');

          $feed.packery({
            itemSelector: '.block',
            layoutMode: 'masonry',
            gutter: 20
          });
        });

        $('.block--tweet').each(function(i) {
          var tweet = $(this);
          $.ajax({
            url: "https://api.twitter.com/1/statuses/oembed.json?url="+tweet.attr('data-tweet'),
            dataType: "jsonp",
            success: function(data){
              tweet.find('.block__text').append(Kollegorna.caseMediaTweet(data));
              $feed.packery();
            },
            error: function(){
              tweet.remove();
              $feed.packery();
            }
          });
        });

      },


      setupAnimations: function() {

        setTimeout(function() {
          $('.index__hero').addClass('loaded');
        }, 500);

      },


      initComments: function() {

        var url = window.location.origin + window.location.pathname;

        $.disqusLoader( '.disqus', {
          scriptUrl: '//kollegorna.disqus.com/embed.js',
          disqusConfig: function() {
            this.page.url         = url;
            this.page.identifier  = url;
          }
        });

      },


      fitVids: function() {

        $('.blog__content, .case__study').fitVids();

      },


      // Make tweets look nice. Remove Twitter widget script and add profile
      // image from avatars.io.
      parseTweets: function(data) {

        var html = $(data.html.bold());
        html.find('script').remove();
        var twitter_handle = (data.author_url.match(/https?:\/\/(www\.)?twitter\.com\/(#!\/)?@?([^\/]*)/)[3]);
        var twitter_profile_image = '<figure class="case__media__tweet__image polaroid polaroid--circle"><img src="//avatars.io/twitter/' + twitter_handle + '?size=large"></figure>';
        html = '<div class="case__media__tweet__content">' + html.html() + '</div>';
        html = twitter_profile_image + html;
        return html;

      },


      setupMaps: function() {

        var $maps = $('.colleague-map');
        if(!$maps.length)
            return true;

        $maps.lazyLoadGoogleMaps({
          key: 'AIzaSyD8Z3idP4mO8UBkWokGNLtf47NT522C6YQ',
          callback: function(container, map) {
            var $container = $(container),
                center     = new google.maps.LatLng($container.attr('data-lat'), $container.attr('data-lng'));

            map.setOptions({
              center: center,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              zoom: 14,
              scrollwheel: false,
              disableDefaultUI: true,
              navigationControl: false,
              mapTypeControl: false,
              scaleControl: false,
              draggable: false,
              styles:[{"featureType":"administrative","elementType":"all","stylers":[{"hue":"#ff0000"},{"lightness":100},{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"saturation":-100},{"lightness":100},{"visibility":"on"},{"color":"#ffffff"}]},{"featureType":"poi","elementType":"all","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"saturation":-100},{"lightness":-100},{"visibility":"simplified"},{"color":"#00C66B"}]},{"featureType":"road","elementType":"labels","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"lightness":-100},{"visibility":"on"},{"color":"#00C66B"}]},{"featureType":"transit","elementType":"labels","stylers":[{"hue":"#ffffff"},{"lightness":100},{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"saturation":-100},{"lightness":100},{"visibility":"on"},{"color":"#ffffff"}]}]
            });
          }
        });

        $('.profile__location').mouseenter(function() {
          $(this).closest('.profile').addClass('hover');
        })
        .mouseleave(function() {
          $(this).closest('.profile').removeClass('hover');
        });

      },

      echo1: function() {
        $('body').imagesLoaded(function() {
          var windowHeight = $(window).height();
          var laptopPos = $('.laptop__site').offset().top;
          var difference = laptopPos - windowHeight;

          var rtime;
          var timeout = false;
          var delta = 200;

          $(window).resize(function() {
            var scrollTop = $(window).scrollTop();
            var translateX = scrollTop.map(difference, windowHeight + laptopPos, 0, 100)
            $('.laptop__site').css('transform', 'translateY(-' + translateX  + '%)');
          });

          $(window).scroll(function() {
            var scrollTop = $(window).scrollTop();
            var translateX = scrollTop.map(difference, windowHeight + laptopPos, 0, 100)
            $('.laptop__site').css('transform', 'translateY(-' + translateX  + '%)');
          });
        });
      }

    };

    Number.prototype.map = function (in_min, in_max, out_min, out_max) {
      return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    document.addEventListener("DOMContentLoaded", function(event) {
      Kollegorna.init();
    });

}());
