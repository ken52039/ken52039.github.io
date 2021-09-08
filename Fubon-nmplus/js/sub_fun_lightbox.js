$(function() {
	$('.button').click(function() {
		var src = $(this).data('src'),
			boxClass = $(this).attr('boxClass');

		$.fancybox.open({
			src: src,
			type: 'iframe',
			opts: {
				toolbar: false,
				smallBtn: true,
				baseClass: boxClass,
				iframe: {
					preload: true
				}
			}
		});
	});
});