$(function() {

	//網頁載入時
	function init(){
		$('.notice').attr('height',$('.notice').height())	
					.removeClass('open')
					.css('height','32px');
		$('.finish-topic').attr('topic_length', $('.topic').length);
	}

	//答題
	function select_answer(){
		$(this).addClass('select').siblings().removeClass('select');
		var finish_percent = $('.option .select').length*100 / $('.topic').length;
		$('.finish-topic div:nth-child(2)').css('transform','translateX('+ finish_percent * ($('.finish-topic').width() - 40) / 100+ 'px)');
		$('.finish-topic div:nth-child(1) span').css('transform','translateX('+finish_percent+'%)');
		$('.finish-topic div:nth-child(2) span').text($('.topic .select').length);
		$(this).parents('.topic').next().fadeIn(1000);
		var topicH = $('.topic').height();
		$('.topics-box').animate({
			scrollTop: ($(this).parents('.topic').index() + 1) * topicH
		},500);
		$('.notice').removeClass('open').css('height','32px');
		$('html,body').animate({scrollTop:0},500);
	}

	//檢查是否已全數作答完畢
	function check_finish_topic_length(){
		if ($('.select').length != $('.topic').length) {
			$('.error_info').css('opacity','1');
			return false;
		}		
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
	$('.option div').click(select_answer);
	$('#continue').click(check_finish_topic_length);
	$(window).resize(noticeDisplay);
	$('.notice').click(function(){
		$(this).toggleClass('open');
		noticeDisplay();
	});

});