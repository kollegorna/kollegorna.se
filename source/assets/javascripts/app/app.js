(function() {

    'use strict';

    var Kollegorna = {

      init: function()
      {
        this.labsRssFeed();
        this.mobileNav();
        this.bindClicks();
        this.setupFeed();
        this.setupAnimations();
        this.initComments();
        this.fitVids();
        this.setupMaps();
      },
      
      xmlToJson: function(xml) {
	
          // Create the return object
          var obj = {};

          if (xml.nodeType == 1) { // element
              // do attributes
              if (xml.attributes.length > 0) {
              obj["@attributes"] = {};
                  for (var j = 0; j < xml.attributes.length; j++) {
                      var attribute = xml.attributes.item(j);
                      obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                  }
              }
          } else if (xml.nodeType == 3) { // text
              obj = xml.nodeValue;
          }

          // do children
          if (xml.hasChildNodes()) {
              for(var i = 0; i < xml.childNodes.length; i++) {
                  var item = xml.childNodes.item(i);
                  var nodeName = item.nodeName;
                  if (typeof(obj[nodeName]) == "undefined") {
                      obj[nodeName] = xmlToJson(item);
                  } else {
                      if (typeof(obj[nodeName].push) == "undefined") {
                          var old = obj[nodeName];
                          obj[nodeName] = [];
                          obj[nodeName].push(old);
                      }
                      obj[nodeName].push(xmlToJson(item));
                  }
              }
          }
          return obj;
      },

      labsRssFeed: function () {
        if ($('.about__labs').length) {
          $.ajax({
            url      : 'https://labs.kollegorna.se/feed.xml',
            dataType : 'xml',
            success  : function (data) {
              console.log(data);
              console.log(this.xmlToJson(data));
//              if (data.responseData.feed && data.responseData.feed.entries) {
//                $('.about__labs p').after('<ul></ul>');
//
//                $.each(data.responseData.feed.entries, function (i, e) {
//                  if (i < 5) {
//                    var press_date = new Date(e.publishedDate);
//                    $('.about__labs ul').append('<li><a href="' + e.link + '">' + e.title + '</a><time class="t-meta t-meta--small">' + Kollegorna.formatRssDate(press_date) + '</time></li>');
//                  }
//                });
//              }
            }
          });
        }
      },

      formatRssDate: function (d) {
        var curr_date = d.getDate();
        var curr_month = d.getMonth();
        var curr_year = d.getFullYear();

        if ($('html').attr('lang') == 'sv') {
          var month_names = new Array("januari", "februari", "mars",
          "april", "maj", "juni", "juli", "augusti", "september",
          "oktober", "november", "december");

          return curr_date + ' ' + month_names[curr_month] + ' ' + curr_year;
        } else {
          return d.toISOString().substring(0, 10);
        }
      },


      mobileNav: function()
      {
        var $nav = $( '.header__navigation' ),
            $btn = $( '.header__button a' );

        $btn.on( 'click', function( e ){
          e.preventDefault();
          $btn.toggleClass( 'is-active' );
          if( $btn.hasClass( 'is-active' ))
            $nav.slideDown();
          else
            $nav.slideUp();
        });
      },


      bindClicks: function()
      {
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
      },


      caseMediaTweet: function(data)
      {
        var html = $(data.html.bold());
        html.find('script').remove();

        var twitter_handle = (data.author_url.match(/https?:\/\/(www\.)?twitter\.com\/(#!\/)?@?([^\/]*)/)[3]);

        var twitter_profile_image = '<figure class="case__media__tweet__image polaroid polaroid--circle"><img src="//avatars.io/twitter/' + twitter_handle + '?size=large"></figure>';

        return html.html();
      },


      setupFeed: function()
      {
        $(".index__feed a[href^='http']").attr("target","_blank");

        var $feed = $('.grid').imagesLoaded( function() {
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


      setupAnimations: function()
      {
        $('.index__hero__background').addClass('on');
      },


      initComments: function()
      {
        $.disqusLoader( '.disqus', { scriptUrl: '//kollegorna.disqus.com/embed.js' });
      },


      fitVids: function()
      {
        $('.blog__content').fitVids();
      },


      // Make tweets look nice. Remove Twitter widget script and add profile
      // image from avatars.io.
      parseTweets: function(data)
      {
        var html = $(data.html.bold());
        html.find('script').remove();

        var twitter_handle = (data.author_url.match(/https?:\/\/(www\.)?twitter\.com\/(#!\/)?@?([^\/]*)/)[3]);

        var twitter_profile_image = '<figure class="case__media__tweet__image polaroid polaroid--circle"><img src="//avatars.io/twitter/' + twitter_handle + '?size=large"></figure>';

        html = '<div class="case__media__tweet__content">' + html.html() + '</div>';
        html = twitter_profile_image + html;

        return html;
      },


      setupMaps: function()
      {
        var $maps = $( '.colleague-map' );
        if( !$maps.length )
            return true;

        $maps.lazyLoadGoogleMaps(
        {
            key: 'AIzaSyD8Z3idP4mO8UBkWokGNLtf47NT522C6YQ',
            callback: function( container, map )
            {
                var $container  = $( container ),
                    center      = new google.maps.LatLng( $container.attr( 'data-lat' ), $container.attr( 'data-lng' ) );

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
