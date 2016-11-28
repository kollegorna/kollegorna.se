$('.feed').packery({
  // options
  itemSelector: '.block',
  layoutMode: 'masonry',
  gutter: 20
});

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
