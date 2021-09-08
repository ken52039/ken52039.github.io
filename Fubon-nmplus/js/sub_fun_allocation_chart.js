var allocation_chart;
var dount_chart_degree = [];
var dount_chart_default_data = [];
var list_data = [];
var dount_chart_degree_counter = {};
var dount_chart_current_select;
var allocation_currentAngle = 0;
var move_snapshot;
var allocation_touchTarget;
var allocation_zingTouch;
var is_set_slick = false;

var resize_allocation_chart = function() {
    if (isBreakPoint(600)) {
        $('.list .content').height($('.list .content div').length * 78);
        $('.list .content div').each(function(index) {
            $(this).css('top', index * 78 + "px");
        });
        if(!is_set_slick){
            $('#pie_item').slick({
                 arrows: false,
                 dots: false,
                 infinite: true,
                 speed: 300,
                 slidesToShow: 1,
                 variableWidth: true,
                 mobileFirst: true
             });
            is_set_slick = true;
        }
    } else {
        $('.list .content').height($('.list .content div').length * 34);
        $('.list .content div').each(function(index) {
            $(this).css('top', index * 34 + "px");
        });
        if(is_set_slick){
            $('#pie_item').slick('unslick');
            is_set_slick = false;
        }
    }
}
var set_dount_degree_data = function(chart) {
    var nowDegree = 0,
        currentValue;
    dount_chart_degree = [];
    for (var dataNum in chart.series[0].data) {
        currentValue = (chart.series[0].data[dataNum].shapeArgs.end - chart.series[0].data[dataNum].shapeArgs.start) * 180 / Math.PI;
        if (chart.series[0].data.length - 1 != dataNum) {
            dount_chart_degree.push({ center: nowDegree + currentValue / 2, range: [nowDegree, nowDegree + currentValue] });
            nowDegree += currentValue;
        } else {
            dount_chart_degree.push({ center: nowDegree + currentValue / 2, range: [nowDegree, 360] });
        }
    }
}
var on_dount_rotate = function(event) {
    var rotatable = document.getElementById('dountChart');
    allocation_currentAngle += event.detail.distanceFromLast;
    rotatable.style.transform = 'rotate(' + allocation_currentAngle + 'deg)';
    var now_point_degree = (allocation_currentAngle % 360 < 0) ? Math.abs(allocation_currentAngle % 360) : 360 - allocation_currentAngle % 360;
    for (var num = 0; num < dount_chart_degree.length; num++) {
        if (now_point_degree > dount_chart_degree[num].range[0] && now_point_degree <= dount_chart_degree[num].range[1]) {
            click_dount_item(num);
            break;
        }
    }
}
var refresh_list = function(list_data, num) {
    //list_item
    var active;
    $('.list .content').html('');
    for (var listDataNum = 0; listDataNum < list_data.length; listDataNum++) {
        active = (list_data[listDataNum].typeId == num) ? ' active' : '';
        $('.list .content').append('<div id="item-' + listDataNum + '" code="' + list_data[listDataNum].code + '" sort_name="' + list_data[listDataNum].code + '" class="item' + active + '"><span>' + list_data[listDataNum].code + ' ' + list_data[listDataNum].name + '</span><span><span class="small_title w3-hide-medium w3-hide-large">配置金額(美金)：</span>' + number_format(list_data[listDataNum].amount) + '</span><span><span class="small_title w3-hide-medium w3-hide-large">佔比：</span>' + list_data[listDataNum].weight + '%</span></div>');
        $('.list .content div:nth-child(' + (listDataNum + 1) + ')').css("border-left-color", list_data[listDataNum].color);
        $('.list .content div:nth-child(' + (listDataNum + 1) + ') span:first-child').css("border-left-color", list_data[listDataNum].color);
        resize_allocation_chart();
    }
    $('.list .content .item span:first-child').on('click', function(event) {
        window.open("https://www.fubon.com/banking/personal/fund_trust/fund_focus/fund_detail.htm?A=" + $(this).parent().attr('code') + "&B=01&t=0&page=1&title=" + $(this).parent().attr('sort_name'));
    });
}

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
        var current_data = JSON.parse(JSON.stringify(dount_chart_default_data));
        for (var itemNum in current_data) {
            if (itemNum == num) {
                current_data[itemNum]['z'] = 1.2;
            } else {
                current_data[itemNum]['z'] = 1;
            }
        }
        allocation_chart.series[0].setData(JSON.parse(JSON.stringify(current_data)), true);
        $('.pie #weight').html(dount_chart_default_data[num].percent + "%");
        $('.pie #name').html(dount_chart_default_data[num].name);
        if (go_item_center) {
            var now_point_degree = (allocation_currentAngle % 360 < 0) ? Math.abs(allocation_currentAngle % 360) : 360 - allocation_currentAngle % 360;
            var point_center = dount_chart_degree[num].center;
            var clockwise_dist, counterclockwise_dist;
            if (point_center > now_point_degree) {
                counterclockwise_dist = point_center - now_point_degree;
                clockwise_dist = 360 - counterclockwise_dist;
            } else {
                clockwise_dist = now_point_degree - point_center;
                counterclockwise_dist = 360 - clockwise_dist;
            }
            dount_chart_degree_counter.degree = allocation_currentAngle;
            TweenMax.to(dount_chart_degree_counter, 1, {
                degree: (clockwise_dist < counterclockwise_dist) ? allocation_currentAngle + clockwise_dist : allocation_currentAngle - counterclockwise_dist,
                onUpdate: function() {
                    var rotatable = document.getElementById('dountChart');
                    allocation_currentAngle = dount_chart_degree_counter.degree;
                    rotatable.style.transform = 'rotate(' + dount_chart_degree_counter.degree + 'deg)';
                }
            });
        }
        $('#pie_item span').removeClass('active');
        $('#pie_item .pie-item-' + num).addClass('active');
        if(is_set_slick){
            $('#pie_item').slick('slickGoTo', num);
        }

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
var draw_allocation_chart = function(json_data, search_mode) {
    dount_chart_current_select = null;
    allocation_currentAngle = 0;
    //touch
    if (!allocation_zingTouch) {
        var broswer = browser();
        if (broswer && broswer.name != "ie") {
            allocation_touchTarget = document.getElementById('touch_area');
            allocation_zingTouch = new ZingTouch.Region(allocation_touchTarget);
            allocation_zingTouch.bind(allocation_touchTarget, 'rotate', on_dount_rotate);
        }
    }

    var location_list_key = 'allocation',
        location_list = json_data[location_list_key],
        date_length = location_list.length,
        color_data = ['#f48fb1', '#ffcc80', '#ffe082', '#c5e1a4', '#91e3e1', '#90a4e0'],
        max_sector_sub_length = color_data.length - 1,
        others_color = color_data[color_data.length - 1],
        temp_list_data = [];
    pie_data = [];
    list_data = [];

    //chart
    for (var num = 0; num < date_length; num++) {
        temp_list_data.push({
            amount: location_list[num].amount,
            code: location_list[num].code,
            name: location_list[num].name,
            'sector-sub': location_list[num]['sector-sub'],
            typeId: '',
            weight: location_list[num].weight,
            color: ''
        });

        var pie_date_length = pie_data.length;
        var push = false;
        for (var pieItemNum = 0; pieItemNum < pie_date_length; pieItemNum++) {
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
            for (var listItemNum = 0; listItemNum < date_length; listItemNum++) {
                if (temp_list_data[listItemNum]['sector-sub'] == pie_data[num].name) {
                    list_data.push(temp_list_data[listItemNum]);
                }
            }
        } else {
            for (var listItemNum = 0; listItemNum < date_length; listItemNum++) {
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
        for (var listDataNum = 0; listDataNum < date_length; listDataNum++) {
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
    
    dount_chart_default_data = JSON.parse(JSON.stringify(pie_data));

    allocation_chart = Highcharts.chart('dountChart', {
        chart: {
            margin: [0, 0, 0, 0],
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'variablepie',
            height: 264,
            width: 264,
            animation: {
                duration: 500
            },
            events: {
                load: function(e) {
                    set_dount_degree_data(this);
                }
            },
            backgroundColor: 'rgba(255, 255, 255, 0.0)'
        },
        exporting: { enabled: false },
        title: {
            text: ''
        },
        tooltip: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            variablepie: {
                startAngle: 180,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                states: {
                    hover: {
                        enabled: false
                    }
                }
            },
            series: {
                allowPointSelect: true,
                slicedOffset: 0,
                point: {
                    events: {
                        click: function(e) {
                            click_dount_item(this.index, true);
                        }
                    }
                }
            }
        },
        series: [{
            minPointSize: 50,
            innerSize: '50%',
            data: pie_data,
            zMax: 2
        }],
        credits: {
            enabled: false
        }
    });

    //pie_item
    $('#pie_item').html('');
    for (var pieItemNum = 0; pieItemNum < pie_data.length; pieItemNum++) {
        $('#pie_item').append('<span class="pie-item-' + pieItemNum + '" index="' + pieItemNum + '">' + pie_data[pieItemNum].name + '</span>');
        $('#pie_item span:nth-child(' + (pieItemNum + 1) + ')').css("border-left-color", pie_data[pieItemNum].color);
    }
    $('#pie_item span').on('click', function(event) {
        click_dount_item($(this).attr('index'), true);
    });

    if (isBreakPoint(600)) {
        if(!is_set_slick){
            $('#pie_item').slick({
                 arrows: false,
                 dots: false,
                 infinite: true,
                 speed: 300,
                 slidesToShow: 1,
                 variableWidth: true,
                 mobileFirst: true
             });
            is_set_slick = true;
        }else{
            $('#pie_item').slick('unslick');
            is_set_slick = false;
        }
    }

    //extra touch
    $(allocation_chart.container).on("touchstart", function(event) {
        move_snapshot = allocation_currentAngle;
    });
    $(allocation_chart.container).on("touchend", function(event) {
        if (Math.abs(move_snapshot - allocation_currentAngle) < 3) {
            var f = allocation_chart.pointer.normalize(event);
            if (f.target.point) {
                click_dount_item(f.target.point.index, true);
            }
        }
    });

    //init
    click_dount_item(0, true);
    refresh_list(list_data, 0);
};