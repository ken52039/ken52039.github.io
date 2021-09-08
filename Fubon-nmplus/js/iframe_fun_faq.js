$(function() {
    $(".accordion button").on("click", function() {
        var icon = $(this).children("i");
        $(this).parent().children("button").each(function(index) {
            if(icon.hasClass("fa-plus")) {
                $(this).next().children("button").children("i").removeClass("fa-caret-up");
                if ($(this).children("i")[0] != icon[0]) {
                    $(this).children("i").removeClass("fa-minus");
                } else {
                    icon.toggleClass("fa-minus");
                }
            } else {
                if ($(this).children("i")[0] != icon[0]) {
                    $(this).children("i").removeClass("fa-caret-up");
                } else {
                    icon.toggleClass("fa-caret-up");
                }
            }
        });

        var subItem = $(this).next();
        var depth = $(subItem).parents().length;
        var allAtDepth = $(".accordion_content").filter(function() {
            if($(this).parents().length >= depth && this !== subItem.get(0)) {
                return true;
            }
        });
        $(allAtDepth).slideUp("fast");
        subItem.slideToggle("fast");
    });
    $( ".accordion button" ).first().click();
    $("#fees").on("click", function(){
        $( ".accordion button" ).first().click();
    });
});