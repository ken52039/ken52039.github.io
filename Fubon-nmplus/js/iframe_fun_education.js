$(function() {
	$(".w3-center > div:gt(0)").hide();

	setInterval(function() {
		$('.w3-center > div:first')
	    	.fadeOut(1000)
	    	.next()
	    	.fadeIn(1000)
		    .end()
		    .appendTo('.w3-center');
		
	}, 3000);
});