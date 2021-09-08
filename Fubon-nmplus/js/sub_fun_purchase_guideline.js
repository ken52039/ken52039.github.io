$(function() {
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
		$(this).parent().prev().html($(this).find('span:first-child').text() + '<img src="svg/black.svg" alt="">');
	});


	// <p>文字文字文字文字 <img src="svg/black.svg" alt=""></p>
	// <ul>
	// 	<li class="active">
	// 		<span>123456789123(美金)</span>
	// 		<span>餘額 100,000,000,000.00 元</span>
	// 	</li>
	// 	<li>
	// 		<span>123456789456(美金)</span>
	// 		<span>餘額 1,000.00 元</span>
	// 	</li>
	// </ul>

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
		$(this).parent().prev().html($(this).text() + '<img src="svg/black.svg" alt="">');
	});
});