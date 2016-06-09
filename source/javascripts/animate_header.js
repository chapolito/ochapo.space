
$(function() {

  var body = $('body'),
  internal_nav = $('header a');

  internal_nav.click(function() {
    body.addClass('animate-page-out');
  });

});

