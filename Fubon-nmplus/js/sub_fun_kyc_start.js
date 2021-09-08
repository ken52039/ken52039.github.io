$(function() {

	function noticeDisplay(){
		var $notice = $('.notice');
		if($notice.hasClass('open')){
			$notice.css('height',$notice.children('ol').height() + 9 + 16 + 32+'px');
		}else{
			$notice.css('height','32px');
		}
	}

	$(window).resize(noticeDisplay);
	$('.notice').click(function(){
		$(this).toggleClass('open');
		noticeDisplay();
	});

});