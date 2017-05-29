'use strict';

(function() {

    var Kollegorna = {

      init: function() {
        this.mobileNav();
        this.langNav();
        this.bindClicks();
        this.setupFeed();
        this.setupAnimations();
        this.initComments();
        this.fitVids();
        this.setupMaps();
      },


      mobileNav: function() {

        var $nav = $('.header__navigation'),
            $btn = $('.header__button a');

        $btn.on('click', function(e){
          e.preventDefault();
          $btn.toggleClass('is-active');
          if($btn.hasClass('is-active'))
            $nav.slideDown();
          else
            $nav.slideUp();
        });

      },

      langNav: function() {
        var $langSwitch = $('.header__lang');

        $langSwitch.superfish({
            delay: 400,
            animation: {
                height: "show"
            },
            animationOut: {
                height: "hide"
            },
            autoArrows: false
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

        $('.index__hero__background').addClass('on');

      },


      initComments: function() {

        $.disqusLoader('.disqus', { scriptUrl: '//kollegorna.disqus.com/embed.js' });

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
            callback: function(container, map)
            {
                var $container  = $(container),
                    center      = new google.maps.LatLng($container.attr('data-lat'), $container.attr('data-lng'));

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
                  styles: [{"featureType":"administrative","elementType":"all","stylers":[{"hue":"#ff0000"},{"lightness":100},{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"saturation":-100},{"lightness":100},{"visibility":"on"},{"color":"#ffffff"}]},{"featureType":"poi","elementType":"all","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"saturation":-100},{"lightness":-100},{"visibility":"simplified"},{"color":"#00C66B"}]},{"featureType":"road","elementType":"labels","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"lightness":-100},{"visibility":"on"},{"color":"#00C66B"}]},{"featureType":"transit","elementType":"labels","stylers":[{"hue":"#ffffff"},{"lightness":100},{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"saturation":-100},{"lightness":100},{"visibility":"on"},{"color":"#ffffff"}]}]
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

    };


    document.addEventListener("DOMContentLoaded", function(event) {
      Kollegorna.init();
    });

}());
