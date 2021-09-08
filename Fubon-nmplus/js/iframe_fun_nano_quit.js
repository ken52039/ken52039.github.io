$(function() {
	//
    var getParameterByName = function (name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&]*)|&|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    //event
    $('.cancel').on('click', function(event) {
        parent.quite_cancel();
    });
    $('.confirm').on('click', function(event) {
        //console.log(getParameterByName('jump'));
    	parent.quite_confirm(getParameterByName('jump'));
    });
})