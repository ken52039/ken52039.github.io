$(function() {

    //event
    $('.cancel').on('click', function(event) {
        parent.jQuery.fancybox.close();
    });
    $('.confirm').on('click', function(event) {
        parent.window.location.assign("https://www.google.com.tw/chrome/");
    });
})