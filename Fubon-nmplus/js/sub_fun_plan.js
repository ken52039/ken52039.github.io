$(function() {
	var slicked = false;
	$('.name .edit img').click(function() {
		$(this).parent().parent().toggleClass('active');
		if ($(this).parent().parent().hasClass('active')) {
			$(this).siblings('input').show();
			$(this).siblings('span').hide();
			// $(this).siblings('input').prop('disabled', '');
		} else {
			$(this).siblings('input').hide();
			$(this).siblings('span')
				.text($(this).siblings('input').val())
				.show();
			// $(this).siblings('input').prop('disabled', 'disabled');
		}
	});
	$('.name input').keypress(function(e) {
		if (e.charCode == 13) {
			$(this).parent().parent().removeClass('active');
			// $('input').prop('disabled', 'disabled');
			$(this).hide();
			$(this).siblings('span')
				.text($(this).val())
				.show();
		}
	})

	$('.update').on({
		blur: function() {
			$(this).removeClass('active');
			$(this).find('ul').slideUp(300);
		}
	});
	$('.update > span').click(function() {
		$(this).parent().toggleClass('active');
		if ($(this).parent().hasClass('active')) {
			$(this).siblings('ul').slideDown(300);
		} else {
			$(this).siblings('ul').slideUp(300);
		}
	});
	$('.update > ul').on('click', 'li', function() {
		$(this).parent().parent().removeClass('active');
		$(this).parent().slideUp(300);
	});

	$('.info .more').click(function() {
		$(this).toggleClass('active');
		if ($(this).hasClass('active')) {
			$('.info .bottom').addClass('active').slideDown(300);
		} else {
			$('.info .bottom').slideUp(300, function() {
				$(this).removeClass('active');	
			});
		}
	});

	$('.name > .more').click(function() {
		$(this).toggleClass('active');
		if ($(this).hasClass('active')) {
			$('.info').addClass('active').slideDown(300);
		} else {
			$('.info').slideUp(300, function() {
				$(this).removeClass('active');	
			});
		}		
	});

	$('.content > .tabs .tab').click(function() {
		$(this).siblings().removeClass('active');
		$(this).addClass('active');

		if ($(this).index() == 0) {
			$('.content .invest').show();
			$('.content .record').hide();
		} else {
			$('.content .invest').hide();
			$('.content .record').show();
		}
	});

	$('.invest > .info > p').click(function() {
		$.fancybox.open({
			src: 'iframe_plan_note.html',
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
	});

	$('.invest .location .info').click(function() {
		$.fancybox.open({
			src: 'iframe_plan_location_note.html',
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
	});

	$('.record > div > nav > span').click(function(){
		$(this).siblings('span').removeClass('active');
		$(this).addClass('active');

		if ($(this).hasClass('custom')) {
			$(this).siblings('div').removeClass('readonly');
		} else {
			$(this).siblings('div').addClass('readonly');
		}
	})

	$('.record ul li .summary img').click(function() {
		$(this).parents('li').toggleClass('active');
		if ($(this).parents('li').hasClass('active')) {
			$(this).parents('.summary').next().slideDown(300);
		} else {
			$(this).parents('.summary').next().slideUp(300);
		}
	});



    var Allocation_Sample = [
        { 'code': '6314', 'name': '瑞銀中國精選股票基金', 'amount': 25000000, 'weight': 10.0, 'sector-sub': '全球債', stock: 25000000, averagePrice: 2000, price: 2000, date: '2018.07.24' },
        { 'code': '6006', 'name': '霸菱大東協基金', 'amount': 2000, 'weight': 11.0, 'sector-sub': '全球債', stock: 25000000, averagePrice: 2000, price: 2000, date: '2018.07.24' },
        { 'code': '6153', 'name': '貝萊德世界科技美元', 'amount': 2000, 'weight': 12.0, 'sector-sub': '資訊科技', stock: 25000000, averagePrice: 2000, price: 2000, date: '2018.07.24' },
        { 'code': 'B190', 'name': '摩根美國科技基金金金金金金金金金', 'amount': 2000, 'weight': 16.0, 'sector-sub': '資訊科技', stock: 25000000, averagePrice: 2000, price: 2000, date: '2018.07.24' },
        { 'code': '5101', 'name': '摩根東協基金', 'amount': 2000, 'weight': 7.0, 'sector-sub': '全球高息股', stock: 25000000, averagePrice: 2000, price: 2000, date: '2018.07.24' },
        { 'code': '5183', 'name': '摩根東協基金澳幣', 'amount': 200000, 'weight': 2.0, 'sector-sub': '全球高息股', stock: 25000000, averagePrice: 2000, price: 2000, date: '2018.07.24' },
        { 'code': '6303', 'name': '瑞銀保健股票基金', 'amount': 250000, 'weight': 12.0, 'sector-sub': '全球股', stock: 25000000, averagePrice: 2000, price: 2000, date: '2018.07.24' },
        { 'code': '5932', 'name': '聯博新市多元收益A歐', 'amount': 175000, 'weight': 20.0, 'sector-sub': '新興市場企業債', stock: 25000000, averagePrice: 2000, price: 2000, date: '2018.07.24' },
        { 'code': '1721', 'name': '安聯收益成長月收美元', 'amount': 50000, 'weight': 1.0, 'sector-sub': '小市場', stock: 25000000, averagePrice: 2000, price: 2000, date: '2018.07.24' },
        { 'code': '1722', 'name': 'VanguardETC', 'amount': 2000, 'weight': 9.0, 'sector-sub': '全球股', stock: 25000000, averagePrice: 2000, price: 2000, date: '2018.07.24' }
       ];

    var dount_chart_current_select = null,
    	location_list = Allocation_Sample,
        data_length = location_list.length,
        color_data = ['#f48fb1', '#ffcc80', '#ffe082', '#c5e1a4', '#91e3e1', '#90a4e0'],
        max_sector_sub_length = color_data.length - 1,
        others_color = color_data[color_data.length - 1],
        temp_list_data = [],
	    pie_data = [],
	    list_data = [];

	var correct_add = function(num1, num2) {
	    var num1Digits = (num1.toString().split('.')[1] || '').length;
	    var num2Digits = (num2.toString().split('.')[1] || '').length;
	    var baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
	    return (num1 * baseNum + num2 * baseNum) / baseNum;
	}

	var isFloat = function(num) {
	    return Number(num) === num && num % 1 !== 0;
	}

	var click_dount_item = function(num, go_item_center) {
	    if (dount_chart_current_select != num) {
	        dount_chart_current_select = num;
	        $('#pie_item span').removeClass('active');
	        $('#pie_item .pie-item-' + num).addClass('active');
	        $('#pie_item').slick('slickGoTo', num);

	        var select_ar = [];
	        var others_ar = [];
	        var sort_ar = [];
	        for (var listDataNum = 0; listDataNum < list_data.length; listDataNum++) {
	            if (list_data[listDataNum].typeId == num) {
	                select_ar.push(list_data[listDataNum]);
	            } else {
	                others_ar.push(list_data[listDataNum]);
	            }
	        }
	        sort_ar = select_ar.concat(others_ar);
	        refresh_list(sort_ar, num);
	    }
	}
    //chart
    for (var num = 0; num < data_length; num++) {
        temp_list_data.push({
            amount: location_list[num].amount,
            code: location_list[num].code,
            name: location_list[num].name,
            'sector-sub': location_list[num]['sector-sub'],
            typeId: '',
            weight: location_list[num].weight,
            stock: location_list[num].stock,
            averagePrice: location_list[num].averagePrice,
            date: location_list[num].date,
            price: location_list[num].price,
            color: ''
        });

        var pie_data_length = pie_data.length;
        var push = false;
        for (var pieItemNum = 0; pieItemNum < pie_data_length; pieItemNum++) {
            if (pie_data[pieItemNum].name == location_list[num]['sector-sub']) {
                pie_data[pieItemNum].y = correct_add(pie_data[pieItemNum].y, location_list[num].weight);
                push = true;
                break;
            }
        }
        if (!push) {
            pie_data.push({
                name: location_list[num]['sector-sub'],
                y: location_list[num].weight,
                z: 1,
                color: ''
            });
        }
    }

    // sort
    temp_list_data.sort(function(a, b) {
        return a.weight > b.weight ? -1 : 1;
    });
    pie_data.sort(function(a, b) {
        return a.y > b.y ? -1 : 1;
    });

    var pie_data_length = pie_data.length;
    for (var num = 0; num < pie_data_length; num++) {
        if (num < max_sector_sub_length) {
            for (var listItemNum = 0; listItemNum < data_length; listItemNum++) {
                if (temp_list_data[listItemNum]['sector-sub'] == pie_data[num].name) {
                    list_data.push(temp_list_data[listItemNum]);
                }
            }
        } else {
            for (var listItemNum = 0; listItemNum < data_length; listItemNum++) {
                if (temp_list_data[listItemNum]['sector-sub'] == pie_data[num].name) {
                    temp_list_data[listItemNum]['sector-sub'] = '其他';
                    list_data.push(temp_list_data[listItemNum]);
                }
            }
            pie_data[num].name = '其他';
        }
    }

    if (pie_data_length > max_sector_sub_length) {
        for (var num = max_sector_sub_length + 1; num < pie_data_length; num++) {
            pie_data[max_sector_sub_length].y += pie_data[num].y;
        }

        for (var num = max_sector_sub_length + 1; num < pie_data_length; num++) {
            pie_data.pop();
        }
    }

    for (var pieItemNum = 0; pieItemNum < pie_data.length; pieItemNum++) {
        pie_data[pieItemNum].color = color_data[pieItemNum];
        for (var listDataNum = 0; listDataNum < data_length; listDataNum++) {
            if (list_data[listDataNum]['sector-sub'] == pie_data[pieItemNum].name) {
                list_data[listDataNum].color = color_data[pieItemNum];
                list_data[listDataNum].typeId = pieItemNum;
            }
        }
    }

    //add float
    for (var pieItemNum = 0; pieItemNum < pie_data.length; pieItemNum++) {
        if (!isFloat(pie_data[pieItemNum].y)) {
            pie_data[pieItemNum].percent = pie_data[pieItemNum].y.toFixed(1);
        }else{
            pie_data[pieItemNum].percent = pie_data[pieItemNum].y.toString();
        }
    }
    for (var listItemNum = 0; listItemNum < list_data.length; listItemNum++) {
        if (!isFloat(list_data[listItemNum].weight)) {
            list_data[listItemNum].weight = list_data[listItemNum].weight.toFixed(1);
        }
    }

    $('#pie_item').html('');
    for (var pieItemNum = 0; pieItemNum < pie_data.length; pieItemNum++) {
        $('#pie_item').append('<span class="pie-item-' + pieItemNum + '" index="' + pieItemNum + '">' + pie_data[pieItemNum].name + '</span>');
        $('#pie_item span:nth-child(' + (pieItemNum + 1) + ')').css("border-left-color", pie_data[pieItemNum].color);
    }
    $('#pie_item span').on('click', function(event) {
        click_dount_item($(this).attr('index'), true);
    });

    function updateSlick() {
    	if ($('body').outerWidth() < 600) {
    		if (!slicked) {	
		    	$('#pie_item').slick({
		    	    arrows: false,
		    	    dots: false,
		    	    infinite: true,
		    	    speed: 300,
		    	    slidesToShow: 1,
		    	    variableWidth: true
		    	});
		    	slicked = true;
    		}
    	} else {
    		if (slicked) {
	    		$('#pie_item').slick('unslick');
	    		slicked = false;
    		}
    	}
    }

	var refresh_list = function(list_data, num) {
	    //list_item
	    var active;
	    $('.list .content').html('');
	    for (var listDataNum = 0; listDataNum < list_data.length; listDataNum++) {
	        active = (list_data[listDataNum].typeId == num) ? ' active' : '';
	        $('.list .content').append(
	        	'<div id="item-' + listDataNum + '" code="' + list_data[listDataNum].code + '" sort_name="' + list_data[listDataNum].code + '" class="item' + active + '">' +
	        	'<span>' + list_data[listDataNum].code +' ' +list_data[listDataNum].name + '</span>' +
	        	'<span><span class="small_title">佔比：</span>' + number_format(list_data[listDataNum].weight, 1, '.', ',') + '%</span>' +
	        	'<span><span class="small_title">股數：</span>' + number_format(list_data[listDataNum].stock, 2, '.', ',') + '</span>' +
	        	'<span><span class="small_title">平均買進價格：</span>' + number_format(list_data[listDataNum].averagePrice, 2, '.', ',') + '</span>' +
	        	'<span><span class="small_title">參考收盤價：</span>' + number_format(list_data[listDataNum].price, 2, '.', ',') + '</span>' +
	        	'<span><span class="small_title">參考收盤價日期：</span>' + list_data[listDataNum].date + '</span>' +
	        	'<span><span class="small_title">參考市值：</span>' + number_format(list_data[listDataNum].amount, 2, '.', ','));
	        var winW  = $(window).width();
	        var itemW = $('#item-'+listDataNum).width();
	        var textW = $('#item-'+listDataNum+' span:nth-child(1)').width();
	        if((winW<600) && ((itemW-70)<=textW)){
	        	$('#item-'+listDataNum).append('<span class="readmore">...</span>');
	        }
	        $('.list .content div:nth-child(' + (listDataNum + 1) + ')').css("border-left-color", list_data[listDataNum].color);
	        $('.list .content div:nth-child(' + (listDataNum + 1) + ') span:first-child').css("border-left-color", list_data[listDataNum].color);
	    }
	}
	$('.list .content').on('click', '> .item', function() {
		$(this).toggleClass('open');
	});
	refresh_list(list_data, 0);
	updateSlick();

	function refresh_info() {
		if (isBreakPoint(992) || isBreakPoint(600)) {
			$('.content > .info').css('display', 'none');
		} else {
			$('.content > .info').css('display', '');
		}
	}

    $(window).on("resize", function(event, is_panel_resize) {
		refresh_list(list_data, 0);

		refresh_info();
		updateSlick();
    });
    refresh_info();

    pickmeup.defaults.locales['en'] = {
    	days: ['日', '一', '二', '三', '四', '五', '六'],
    	daysShort: ['日', '一', '二', '三', '四', '五', '六'],
    	daysMin: ['日', '一', '二', '三', '四', '五', '六'],
    	months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    	monthsShort: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    };

    var date1 = document.querySelector('.record .range > span:nth-child(1)');
    var date2 = document.querySelector('.record .range > span:nth-child(2)');
    var today = new Date();
    var nextMonth = new Date().setMonth(today.getMonth() + 1);
    pickmeup(date1, {
		format: 'Y.m.d',
		title_format: 'Y.B',
    	prev: '',
    	next: '',
    	min: new Date(),
    	max: new Date(nextMonth)
    });

	date1.addEventListener('pickmeup-show', function (e) {
		if ($('.record > div nav > div').hasClass('readonly')) {
	    	e.preventDefault();
		} else {
			$(date1).addClass('active');
		}
	});
	date1.addEventListener('pickmeup-change', function (e) {
		$(date1).find('span').text(e.detail.formatted_date);
	});
	date1.addEventListener('pickmeup-hide', function (e) {
		$(date1).removeClass('active');
	})

    pickmeup(date2, {
		format: 'Y.m.d',
		title_format: 'Y.B',
    	prev: '',
    	next: '',
    	min: new Date(),
    	max: new Date(nextMonth),
    	position: function() {
			var offset = $(date2).offset(),
				top = offset.top,
				left = offset.left,
				height = $(date2).outerHeight(),
				pickerWidth = $('.pickmeup').outerWidth(),
				inputWidth = $('.range > span:nth-child(2)').outerWidth();

			return {
				top: top + height + 'px',
				left: left - pickerWidth + inputWidth + 'px'
			};

    	}
    });
	date2.addEventListener('pickmeup-show', function (e) {
		if ($('.record > div nav > div').hasClass('readonly')) {
	    	e.preventDefault();
		} else {
			$(date2).addClass('active');
		}
	});
	date2.addEventListener('pickmeup-change', function (e) {
		$(date2).find('span').text(e.detail.formatted_date);
	});
	date2.addEventListener('pickmeup-hide', function (e) {
		$(date2).removeClass('active');
	})
});
