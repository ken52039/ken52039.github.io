$(function() {
	$('.read-more > span').click(function() {
		$(this).toggleClass('active');
		if ($(this).hasClass('active')) {
			$(this).next().slideDown(300);
		} else {
			$(this).next().slideUp(300);
		}
	});

	$('.fancybox').click(function() {
		$.fancybox.open({
			src: $(this).data('src'),
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
		return false;
	})
});