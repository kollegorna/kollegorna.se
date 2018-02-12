'use strict';

(function() {

  var Kollegorna = {

    init: function() {
      this.miscInits();
      this.mobileNav();
      this.bindClicks();
      this.initComments();
      this.fitVids();
      this.setupMaps();
      this.setupFeed();
      // this.injectSVGs();
      this.fetchLabsPosts();
      this.echo1();
    },


    miscInits: function() {

      if(typeof svg4everybody === 'function')
        svg4everybody();

    },


    // injectSVGs: function() {
    //   // Elements to inject
    //   var mySVGsToInject = document.querySelectorAll('img.inject-svg');
    //
    //   // Do the injection
    //   SVGInjector(mySVGsToInject, '', function() {
    //     Kollegorna.setupAnimations();
    //   });
    //
    //   Kollegorna.setupAnimations();
    // },


    mobileNav: function() {

      var $doc  = $(document),
          $body = $('body'),
          $tglNav = $('.header__nav__tgl'),
          $tglLang = $('.header__lang__tgl'),
          $langAnchors = $('.header__lang__list a'),

          // excludes lang nav anchors from tab order when the nav is visually hidden
          toggleLangAnchorsTabIndex = function() {
            if($body.hasClass('open-lang'))
              $langAnchors.removeAttr('tabindex');
            else
              $langAnchors.attr('tabindex', '-1');
          };

      toggleLangAnchorsTabIndex();

      // toggle nav
      $tglNav.on('click', function(e){
        e.preventDefault();
        $body.removeClass('open-lang').toggleClass('open-nav');
        toggleLangAnchorsTabIndex();
      });

      // toggle lang nav
      $tglLang.on('click', function(e){
        e.preventDefault();
        $body.removeClass('open-nav').toggleClass('open-lang');
        toggleLangAnchorsTabIndex();
      });

      // hide navs on outside click
      $doc.on('ontouchstart' in window ? 'touchend' : 'click', function(e) {
        if($body.hasClass('open-nav')) {
          var $target = $(e.target);
          if(!$target.closest('.header__nav').length && !$target.closest($tglLang).length) {
            e.preventDefault();
            $body.removeClass('open-nav');
          }
        }
        if($body.hasClass('open-lang')) {
          var $target = $(e.target);
          if(!$target.closest('.header__lang').length && !$target.closest($tglNav).length) {
            e.preventDefault();
            $body.removeClass('open-lang');
          }
        }
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

      // $('.index__feed').on('click', '.expand', function(e) {
      //   e.preventDefault();
      //
      //   var height = $('.index__feed__blocks').height();
      //
      //   $('.index__feed').animate({
      //     'height': height + 113
      //   }, 1000, function() {
      //     $(this).find('.expand').fadeOut(function() {
      //       $('.index__feed').css('height', 'auto').addClass('expanded');
      //     });
      //   });
      // });

    },


    setupFeed: function() {

      var $feed = $('.feed');
      if(!$feed.length) return;

      $feed.find("a[href^='http']").attr({target: "_blank", rel: "noopener"});

      $feed.packery({
        itemSelector: '.block',
        layoutMode: 'masonry',
        gutter: 0
      });

      $feed.imagesLoaded(function() {
        $feed.packery();
      });


      // ehance tweets
      var isLocalStorage = 'localStorage' in window,

          tweetDataToHtml = function(data) {
            var $html    = $(data.html),
                username = data.author_url.match(/https?:\/\/(www\.)?twitter\.com\/(#!\/)?@?([^\/]*)/)[3],
                avatar   = '<img src="https://avatars.io/twitter/'+username+'?size=large" alt="'+username+'">';

            $html.find('> a:last-of-type').before(avatar).find('script').remove();
            return $html.prop('outerHTML');
          },
          insertHtml = function($tweet, html) {
            $tweet.find('.block__text').append(html);
            $feed.packery();
          },
          discardTweet = function($tweet) {
            $tweet.remove();
            $feed.packery();
          },
          doAjaxCall = function(tweetLink, success, error) {
            error = error || function(){};
            $.ajax({
              url:      'https://api.twitter.com/1/statuses/oembed.json?url='+tweetLink,
              dataType: 'jsonp',
              success:  success,
              error:    error
            });
          };

      $feed.find('.block--tweet').each(function() {
        var $tweet    = $(this),
            tweetLink = $tweet.attr('data-tweet');

        if(isLocalStorage) {
          var tweetId   = tweetLink.hashCode();
              cacheData = localStorage.getItem('tweet-'+tweetId) || false;

          if(!cacheData) { // not cached, do fetch and insert
            doAjaxCall(tweetLink, function(data) {
              var html = tweetDataToHtml(data);
              localStorage.setItem('tweet-'+tweetId, html);
              insertHtml($tweet, html);
            },
            function() { // couldn't fetch, remove tweet
              discardTweet($tweet);
            });
          }
          else { // already cached, do insert
            insertHtml($tweet, cacheData);
          }
        }
        else { // localStorage is not supported, fallback on Ajax
          doAjaxCall(tweetLink, function(data) {
            insertHtml($tweet, tweetDataToHtml(data));
          },
          function() {
            discardTweet($tweet);
          });
        }
      });

    },


    // setupAnimations: function() {
    //
    //   setTimeout(function() {
    //     $('.index__hero').addClass('loaded');
    //   }, 500);
    //
    // },


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
    // parseTweets: function(data) {
    //
    //   var html = $(data.html.bold());
    //   html.find('script').remove();
    //   var twitter_handle = (data.author_url.match(/https?:\/\/(www\.)?twitter\.com\/(#!\/)?@?([^\/]*)/)[3]);
    //   var twitter_profile_image = '<figure class="case__media__tweet__image polaroid polaroid--circle"><img src="//avatars.io/twitter/' + twitter_handle + '?size=large"></figure>';
    //   html = '<div class="case__media__tweet__content">' + html.html() + '</div>';
    //   html = twitter_profile_image + html;
    //   return html;
    //
    // },


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

      $('.person__card__location').mouseenter(function() {
        $(this).closest('.person__card').addClass('hover');
      })
      .mouseleave(function() {
        $(this).closest('.person__card').removeClass('hover');
      });

    },


    fetchLabsPosts: function() {

      var $list = $('.js--labs-posts-fetch');
      if(!$list.length) return;

      var isLocalStorage    = 'localStorage' in window,
          endpoint          = 'https://labs.kollegorna.se/feed.json',
          $displayOnSuccess = $('.js--labs-posts-fetch-display'),

          insertHtml = function(data) {
            $.each(data.slice(0, 3), function(i, item) {
              $list.append('<li><a href="'+item.url+'" target="_blank" rel="noopener">'+item.title+'</a></li>');
            });
            $list.add($displayOnSuccess).removeClass('is-hidden');
          },

          fetchJson = function(success, error) {
            error = error || function(){};
            $.getJSON(endpoint, function(data) {
              data.length ? success(data) : error();
            })
            .fail(error);
          };

      if(isLocalStorage) {
        var cacheData = JSON.parse(localStorage.getItem('labsPostsData') || '[]'),
            cacheTime = localStorage.getItem('labsPostsTime') || 0,
            curTime   = Date.now()/1000;

        if(curTime-3600*24 > cacheTime) { // re-cache every 24 hours
          fetchJson(function(data) {
            localStorage.setItem('labsPostsData', JSON.stringify(data));
            localStorage.setItem('labsPostsTime', curTime);
            insertHtml(data);
          },
          function() { // try to fallback on localStorage if no data fetched
            insertHtml(cacheData);
          });
        }
        else {
          insertHtml(cacheData);
        }
      }
      else { // localStorage is not supported, fallback on Ajax
        fetchJson(insertHtml);
      }
    },


    echo1: function() {
      $('body').imagesLoaded(function() {
        if ($('.laptop__site').length) {
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
        }
      });
    }

  };

  Number.prototype.map = function(in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  };

  String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  document.addEventListener("DOMContentLoaded", function(event) {
    Kollegorna.init();
  });

}());
