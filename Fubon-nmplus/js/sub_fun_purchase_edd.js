$(function() {
	$('.read-more > span').click(function() {
		$(this).toggleClass('active');
		if ($(this).hasClass('active')) {
			$(this).next().slideDown(300);
		} else {
			$(this).next().slideUp(300);
		}
	});

	// industry
	$('[name="industry"]').on('change', function() {
		console.log('change', $(this), $('#industry-other').siblings('div').find('input'));
		if ($(this).prop('id') == 'industry-other') {
			$('#industry-other').siblings('div').find('input').focus();
		} else {
			$('#industry-other').siblings('div').find('input').val('');
		}
	});
	$('#industry-other').siblings('div').find('input').focus(function() {
		$('#industry-other').prop('checked', 'checked');
		console.log('other focus', $(this));
	});

	// income-source
	$('#income-source-other').on('change', function() {
		if ($(this).prop('checked')) {
			$(this).siblings('div').find('input').focus();
		} else {
			$(this).siblings('div').find('input').val('');
		}
	});
	$('#income-source-other').siblings('div').find('input').focus(function() {
		$('#income-source-other').prop('checked', 'checked');
	});
});