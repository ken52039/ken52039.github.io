$(function() {
	function resetNewPlanPosition() {
		var scrollContainerWidth = $('.scrollContainer').outerWidth() - 25;
		var contentWidth = $('.content').outerWidth();
		var width = (scrollContainerWidth - contentWidth) / 2;
		var right = (width - 50);
		right = right < 16 ? 16 : right;
		if (isBreakPoint(600)) {
			right = 8;
		}
		$('.new-plan').css('right', right + 'px');
	}

	$('.new-plan').click(function() {
		$.fancybox.open({
			src: 'iframe_new_plan.html',
			type: 'iframe',
			opts: {
				toolbar: false,
				smallBtn: true,
				baseClass: 'alert',
				iframe: {
					preload: true
				}
			}
		});
	});

	$(window).resize(resetNewPlanPosition);

	$('.sort img').click(function() {
		$(this).toggleClass('active');
		if ($(this).hasClass('active')) {
			$(this).siblings('ul').slideDown(300);
		} else {
			$(this).siblings('ul').slideUp(300);
		}
	});

	$('.sort ul').on('click', 'li', function() {
		$(this).parent().siblings().removeClass('active');
		$(this).parent().slideUp(300);
	});

    $('.card a').click(function(){
        $('body').append('<div class="loading" style="z-index:100;"><div class="fancybox-loading"></div></div>');
    });


	resetNewPlanPosition();
});