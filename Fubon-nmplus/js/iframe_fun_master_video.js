$(function() {
	//[to prive FYI] change video array
	var video_arr = [{
						id: 'XcklJKU94z4',
						name: '奈米投_Nutmeg 大師來敲門',
						date: '2018 May'
					},{
						id: 'R6yjn5lEEvk',
						name: '奈米投_Nutmeg 2018.05市場觀點',
						date: '2018 May'
					}];

	var str = '';
	for(var i = 0; i < video_arr.length; i++) {
		if(i == 0) str += '<li class="w3-bar active">';
		else str += '<li class="w3-bar">';

		str += '<a href="https://www.youtube.com/embed/'+video_arr[i].id+'?rel=0&amp;autoplay=1&amp;color=white&amp;showinfo=0">';
		str += '<img class="w3-bar-item w3-hide-small" src="https://img.youtube.com/vi/'+video_arr[i].id+'/default.jpg">';
		str += '<h3 class="w3-bar-item">'+video_arr[i].name+'</h3>';
		str += '<span class="w3-bar-item w3-right">'+video_arr[i].date+'</span></a></li>';
	}

	$('#video_list').html(str);
	$('#youtube-iframe').attr('src','https://www.youtube.com/embed/'+video_arr[0].id+'?rel=0&amp;autoplay=1&amp;color=white&amp;showinfo=0');

	$('.w3-bar a').on('click', function(e) {
		e.preventDefault();

		var url = $(this).attr('href');
		$('#youtube-iframe').attr('src',url);

		$('.w3-bar').removeClass('active');
		$(this).parent().addClass('active');
	});
});