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

	$('.select.field.offer > div > ul').on('click', 'li', function() {
		var select_text = $(this).text();
		if($(this).find('span>span').text()){
			select_text = select_text.slice(0,select_text.indexOf($(this).find('.li-notice').text()));
			select_text = select_text.slice(0,select_text.indexOf($(this).find('.description').text())) + 
							'<br>' +
							select_text.slice(select_text.indexOf($(this).find('.description').text()));

		}
		$(this).parent().prev()
			.html(select_text + '<img src="svg/black.svg" alt="">')
			.removeClass('placeholder');
		$(this).parents('.offer').children('p').text($(this).find('.li-notice').text());
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

	$('.radio.field .select > div > p').click(function() {
		$(this).parent().toggleClass('active');
		if ($(this).parent().hasClass('active')) {
			$(this).next().slideDown(300);
		} else {
			$(this).next().slideUp(300);
		}
	});

	$('.radio.field .select > div').blur(function() {
		$(this).removeClass('active');
		$(this).find('> ul').slideUp(300);
	});

	$('.radio.field .select > div > ul').on('click', 'li', function() {
		$(this).parent().parent().removeClass('active');
		$(this).parent().slideUp(300);
	});
});