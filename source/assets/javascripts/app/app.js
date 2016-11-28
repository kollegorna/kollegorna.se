/*!
 * kollegorna.se js
 */
(function() {

    'use strict';

    var map = null;

    var Kollegorna = {

      init: function() {
        this.bindClicks();

        this.setupFeed();

        this.setupAnimations();

        setTimeout(function() {
          Kollegorna.setupMaps();
        }, 1000);
      },

      bindClicks: function() {
        $('.case__content').on('click', '.expand', function() {
          $('.case__facts').slideToggle(function() {
            $(this).toggleClass('visible');
          });
          $('.additional').slideToggle(function() {
            $(this).toggleClass('visible');
          });

          var text = $(this).text();

          if(text === "More detail") {
            $(this).text("Less detail");
            $(this).addClass('less');
          } else {
            $(this).text("More detail");
            $(this).removeClass('less');
          }
        });
      },

      setupFeed: function() {
        var $feed = $('.feed').imagesLoaded( function() {
          $('.feed').fadeIn('medium');

          $feed.packery({
            itemSelector: '.block',
            layoutMode: 'masonry',
            gutter: 20
          });
        });
      },

      setupAnimations: function() {
        $('.index__hero__background').addClass('on');
      },

      /*
      *  add_marker
      *
      *  This function will add a marker to the selected Google Map
      *
      *  @type	function
      *  @date	8/11/2013
      *  @since	4.3.0
      *
      *  @param	$marker (jQuery element)
      *  @param	map (Google Map object)
      *  @return	n/a
      */

      add_marker: function($marker, map, display) {

        // var
        var latlng = new google.maps.LatLng( $marker.attr('data-lat'), $marker.attr('data-lng') );

        var image = 'https://s11.postimg.org/zaptblr43/marker.png';

        // create marker
        var marker = new google.maps.Marker({
          position	: latlng,
          map			: map,
          icon: image
        });

        if(display === "false") {
          marker.setVisible(false);
        }

        // add to array
        map.markers.push(marker);

        // if marker contains HTML, add it to an infoWindow
        if( $marker.html() )
        {
          // create info window
          var infowindow = new google.maps.InfoWindow({
            content		: $marker.html()
          });

          // show info window when marker is clicked
          google.maps.event.addListener(marker, 'click', function() {

            infowindow.open( map, marker );

          });
        }

      },

      /*
      *  center_map
      *
      *  This function will center the map, showing all markers attached to this map
      *
      *  @type	function
      *  @date	8/11/2013
      *  @since	4.3.0
      *
      *  @param	map (Google Map object)
      *  @return	n/a
      */

      center_map: function( map ) {

        // vars
        var bounds = new google.maps.LatLngBounds();

        // loop through all markers and create bounds
        $.each( map.markers, function( i, marker ){

          var latlng = new google.maps.LatLng( marker.position.lat(), marker.position.lng() );

          bounds.extend( latlng );

        });

        // only 1 marker?
        if( map.markers.length === 1 )
        {
          // set center of map
            map.setCenter( bounds.getCenter() );
            map.setZoom(14);
        }
        else
        {
          // fit to bounds
          map.fitBounds( bounds );
        }

      },

      /*
      *  new_map
      *
      *  This function will render a Google Map onto the selected jQuery element
      *
      *  @type	function
      *  @date	8/11/2013
      *  @since	4.3.0
      *
      *  @param	$el (jQuery element)
      *  @return	n/a
      */

      new_map: function($el, show_markers) {

        // var
        var $markers = $el.find('.marker');

        // vars
        var args = {
          zoom		: 16,
          center		: new google.maps.LatLng(0, 0),
          mapTypeId	: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          scrollwheel: false,
          navigationControl: false,
          mapTypeControl: false,
          scaleControl: false,
          draggable: false,
          styles: [{"featureType":"administrative","elementType":"all","stylers":[{"hue":"#ff0000"},{"lightness":100},{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"saturation":-100},{"lightness":100},{"visibility":"on"},{"color":"#000000"}]},{"featureType":"poi","elementType":"all","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"saturation":-100},{"lightness":-100},{"visibility":"simplified"},{"color":"#e1dd8f"}]},{"featureType":"road","elementType":"labels","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"lightness":-100},{"visibility":"on"},{"color":"#201e1e"}]},{"featureType":"transit","elementType":"labels","stylers":[{"hue":"#ffffff"},{"lightness":100},{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"saturation":-100},{"lightness":100},{"visibility":"on"},{"color":"#000000"}]}]
        };

        // create map
        var map = new google.maps.Map($el[0], args);

        // add a markers reference
        map.markers = [];

        // add markers
        $markers.each(function(){
          Kollegorna.add_marker($(this), map, show_markers);
        });

        // center map
        Kollegorna.center_map(map);

        // return
        return map;

      },

      setupMaps: function() {
        $('.map').each(function(){
          var show_marker = $(this).attr('data-markers');
          map = Kollegorna.new_map($(this), show_marker);
        });
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
    };

    document.addEventListener("DOMContentLoaded", function(event) {
        Kollegorna.init();
    });

}());
