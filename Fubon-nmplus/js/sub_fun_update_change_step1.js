$(function() {
	$('.read-more > span').click(function() {
		$(this).toggleClass('active');
		if ($(this).hasClass('active')) {
			$(this).next().slideDown(300);
		} else {
			$(this).next().slideUp(300);
		}
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

	$('.select.field> div > ul').on('click', 'li', function() {
		$(this).parent().prev()
			.html($(this).text() + '<img src="svg/black.svg" alt="">')
			.removeClass('placeholder');
	});
	$('.select.field.date > div > ul').on('click', 'li', function() {
		$(this).parent().prev()
			.html($(this).text() + '<img src="svg/black.svg" alt="">');
	});
	$('.select.field.account > div > ul').on('click', 'li', function() {
		$(this).parent().prev()
			.html($(this).find('span:first-child').text() + '<img src="svg/black.svg" alt="">');
		$(this).parent().parent().next().text($(this).find('span:last-child').text());
	});


	// radio.field select

	$('.radio.field .block >div >div >p').click(function() {
		$(this).parent().toggleClass('active');
		if ($(this).parent().hasClass('active')) {
			$(this).next().slideDown(300);
		} else {
			$(this).next().slideUp(300);
		}
	});

	$('.radio.field div ').blur(function() {
		$(this).removeClass('active');
		$(this).find('> ul').slideUp(300);
	});

	$('.radio.field ul').on('click', 'li', function() {
		$(this).parent().parent().removeClass('active');
		$(this).parent().slideUp(300);
	});

	$('.radio.field  ul').on('click', 'li', function() {
		$(this).parent().prev().removeClass('placeholder')
			.html($(this).text() + '<img src="svg/black.svg" alt="">');
	});

});