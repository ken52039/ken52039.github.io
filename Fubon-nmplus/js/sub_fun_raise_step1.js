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
	
	//raise
	$('[name="group1"]').on('change', function() {
		var cur_value = $(this).prop('id');
		$(this).parent().parent().find('.block').each(function(){
			if($(this).find('input[type=radio]').attr('id') == cur_value){
				$(this).find('div').find('input').focus();
			}else{
				$(this).find('div').find('input').val('');
			}
		})
	});
	$('.radio.field input[type=radio]').siblings('div').find('input').focus(function() {
		$(this).parent().parent().siblings('label').trigger('click');
	});
});