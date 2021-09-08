$(document).ready(function(){
	function init(){
		var level = parseInt(getUrlParameter('level')) - 1 || 0;
		$('.btn-group span').eq(level).addClass('open');
		$('.info_block ul').eq(level).show();
	}
	function switch_page(){
		$(this).addClass('open').siblings().removeClass('open');
		var btn_index = $(this).index();
		$('.info_block ul').eq(btn_index).show().siblings().hide();
	}

	init();
	$('.btn-group span').click(switch_page);
});
 
$(document).ready(function(){
	function init(){
		var level = parseInt(getUrlParameter('level')) - 1 || 0;
		$('.btn-group2 span').eq(level).addClass('open');
		$('.info_block2 ul').eq(level).show();
	}
	function switch_page(){
		$(this).addClass('open').siblings().removeClass('open');
		var btn_index = $(this).index();
		$('.info_block2 ul').eq(btn_index).show().siblings().hide();
	}

	init();
	$('.btn-group2 span').click(switch_page);
});
 