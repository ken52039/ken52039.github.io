$(function() {
	$('section > span').click(function() {
		$(this).parent().toggleClass('active');
	});

	// select.field
	$('.select.field > div > p').click(function() {
		$(this).parent().toggleClass('active');
		if ($(this).parent().hasClass('active')) {
			$(this).next().slideDown(300);
		} else {
			$(this).next().slideUp(300);
		}
	});

	$('.select.field > div').blur(function() {
		$(this).removeClass('active');
		$(this).find('> ul').slideUp(300);
	});

	$('.select.field > div > ul').on('click', 'li', function() {
		$(this).parent().parent().removeClass('active');
		$(this).parent().slideUp(300);
	});
	$('.select.field > div > ul').on('click', 'li', function() {
		$(this).parent().prev()
			.html($(this).text() + '<img src="svg/black.svg" alt="">')
			.removeClass('placeholder');
	});
}); 