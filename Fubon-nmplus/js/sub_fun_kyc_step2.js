$(function() {

	//網頁載入時
	function init(){
		$('.notice').attr('height',$('.notice').height())	
					.removeClass('open')
					.css('height','32px');
		$('.finish-topic').attr('topic_length', $('.topic').length);
	}


	//開啟注意事項
	function noticeDisplay(){
		var $notice = $('.notice');
		if($notice.hasClass('open')){
			$notice.css('height',$notice.children('ol').height() + 9 + 16 + 32+'px');
		}else{
			$notice.css('height','32px');
		}
	}


	init();
	$(window).resize(noticeDisplay);
	$('.notice').click(function(){
		$(this).toggleClass('open');
		noticeDisplay();
	});

});