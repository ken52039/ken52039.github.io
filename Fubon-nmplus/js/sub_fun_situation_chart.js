var situation_chart;
var go_hide_plotLines = true;
var PlotLines = [];
var set_default_timer;

var resize_situation_chart = function() {
    var situation_tg_width = $('#lineChart').innerWidth();
    var situation_tg_height = $('#lineChart').innerHeight();
    hidePlotLines();
    situation_chart.setSize(situation_tg_width, situation_tg_height, false);
    showPlotLines();
}
var show_situation_default_data = function(chart) {
    var index = chart.options.chart.defaultSelectIndex;
    $('#targetPrice').html(number_format(chart.options.series[1].data[0].y, 2, ".", ","));
}
var show_situation_current_data = function(chart, index) {
    $('#nowValue').html(chart.options.series[0].data[index].show_price);
    $('#nowRate').html(chart.options.series[0].data[index].rate + "%");
}

var showPlotLines = function(chart) {
    chart = chart || situation_chart;
    var defaultSelectIndex = chart.options.chart.defaultSelectIndex,
        price_point = chart.series[0].data[defaultSelectIndex],
        hoverPoints = chart.hoverPoints = [price_point];

    var i = chart.xAxis[0].plotLinesAndBands.length;
    if (i > 0) {
        while (i--) {
            chart.xAxis[0].plotLinesAndBands[i].destroy();
        }
        PlotLines[0].color = "#b9b9b9";
    }
    chart.xAxis[0].update({
        plotLines: PlotLines
    });

    Highcharts.each(hoverPoints, function(point) {
        point.series.point = point;
        point.setState('hover');
    });

    show_situation_current_data(chart, defaultSelectIndex);
    go_hide_plotLines = true;
}
var hidePlotLines = function(chart) {
    if (go_hide_plotLines) {
        chart = chart || situation_chart;
        var defaultSelectIndex = chart.options.chart.defaultSelectIndex,
            price_point = chart.series[0].data[defaultSelectIndex],
            hoverPoints = chart.hoverPoints = [price_point];

        var i = chart.xAxis[0].plotLinesAndBands.length;

        chart.xAxis[0].options.plotLines[0].color = "#ffffff";
        chart.xAxis[0].update();

        Highcharts.each(hoverPoints, function(point) {
            point.series.point = point;
            point.setState('');
        });
        go_hide_plotLines = false;
    }
}
var convent_to_date_num = function(now_date_string, start_date_string) {
    var now_date_ar = now_date_string.split("-"),
        start_date_ar = start_date_string.split("-");
    return (new Date(now_date_ar[0], now_date_ar[1] - 1, now_date_ar[2]) - new Date(start_date_ar[0], start_date_ar[1] - 1, start_date_ar[2])) / 86400000;
}
var get_range_object = function(json_data, mode, key_obj) {
    var date, start_date_ar, start_date_str, end_date_ar, end_date_str;
    switch (mode) {
        case 'three_months':
            end_date_str = json_data[key_obj.price][json_data[key_obj.price].length - 1][key_obj.date];
            start_date_ar = end_date_str.split("-");
            date = new Date(start_date_ar[0], start_date_ar[1] - 1, start_date_ar[2]);
            date.setMonth(date.getMonth() - 3);
            start_date_str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            break;
        case 'one_year':
            end_date_str = json_data[key_obj.price][json_data[key_obj.price].length - 1][key_obj.date];
            start_date_ar = end_date_str.split("-");
            date = new Date(start_date_ar[0], start_date_ar[1] - 1, start_date_ar[2]);
            date.setFullYear(date.getFullYear() - 1);
            start_date_str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            break;
        case 'three_years':
            end_date_str = json_data[key_obj.price][json_data[key_obj.price].length - 1][key_obj.date];
            start_date_ar = end_date_str.split("-");
            date = new Date(start_date_ar[0], start_date_ar[1] - 1, start_date_ar[2]);
            date.setFullYear(date.getFullYear() - 3);
            start_date_str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            break;
        case 'all':
        default:
            start_date_str = json_data[key_obj.price][0][key_obj.date];
            end_date_ar = start_date_str.split("-");
            date = new Date(end_date_ar[0], end_date_ar[1] - 1, end_date_ar[2]);
            date.setFullYear(date.getFullYear() + 3);
            end_date_str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }
    return { 'start_date_str': start_date_str, 'end_date_str': end_date_str };
}
var draw_situation_chart = function(json_data, mode) {
    var price_num, x_category_num,
        key_obj = {
            price: 'prices',
            date: 'date',
            value: 'value',
            rate: 'rate',
            target: 'targetPrice'
        },
        price_length = json_data[key_obj.price].length,
        default_index = price_length - 1,
        date = [],
        price = [],
        rate = [],
        target = [],
        y_interval = ((json_data[key_obj.target] * 1.1) / 3).toFixed(0),
        y_max = y_interval * 3,
        date_obj = get_range_object(json_data, mode, key_obj),
        x_category = [];
        x_max = convent_to_date_num(date_obj.end_date_str, date_obj.start_date_str),
        x_interval = x_max;

    //set target
    target.push({ x: -1, y: json_data[key_obj.target], marker: { enabled: false } });
    target.push({ x: x_max, y: json_data[key_obj.target] });

    //set x_category
    for (x_category_num = 0; x_category_num <= x_max; x_category_num++) {
        if (x_category_num == 0) {
            x_category.push(date_obj.start_date_str.replace(/-/g, "."));
        } else if (x_category_num == x_max) {
            x_category.push(date_obj.end_date_str.replace(/-/g, "."));
        } else {
            x_category.push('');
        }
    }

    //set price
    for (price_num = 0; price_num < price_length; price_num++) {
        price.push({ x: convent_to_date_num(json_data[key_obj.price][price_num][key_obj.date], date_obj.start_date_str), y: json_data[key_obj.price][price_num][key_obj.value], date: json_data[key_obj.price][price_num][key_obj.date].replace(/-/g, "."), rate: json_data[key_obj.price][price_num][key_obj.rate].toFixed(1), show_price:json_data[key_obj.price][price_num][key_obj.value].toFixed(2) });
    }

    //set PlotLines
    PlotLines = [];
    PlotLines.push({
        "value": price[default_index].x,
        "width": 2,
        "color": "#b9b9b9",
        "zIndex": -1,
        "dashStyle": "ShortDot",
        "label": {
            "text": ""
        }
    });

    situation_chart = Highcharts.chart('lineChart', {
        chart: {
            defaultSelectIndex: default_index,
            type: 'spline',
            animation:false,
            events: {
                load: function(e) {
                    show_situation_default_data(this);
                    showPlotLines(this);
                }
            }
        },
        xAxis: {
            categories: x_category,
            allowDecimals: false,
            lineColor: '#f0f0f0',
            lineWidth: 1,
            tickLength: 0,
            minPadding: 0,
            maxPadding: 0,
            min: 0,
            max: x_max-0.5,
            tickInterval: x_interval,
            labels: {
                step: 1,
                style: {
                    'font-family': "Noto Sans TC",
                    'font-size': '10px',
                    'font-weight': '300',
                    'line-height': '1.4',
                    'color': '#4a4a4a',
                }
            }
        },
        yAxis: [{
                title: {
                    text: null
                },
                labels: {
                    style: {
                        'font-family': "Noto Sans TC",
                        'font-size': '10px',
                        'font-weight': '300',
                        'line-height': '1.4',
                        'color': '#4a4a4a'
                    },
                    formatter: function() {
                        if (this.value === 0) {
                            return '';
                        } else {
                            return (this.value / 1000).toFixed(1) + "K";
                        }
                    }
                },
                min: 0,
                max: y_max,
                lineColor: '#f0f0f0',
                lineWidth: 1,
                gridLineWidth: 1,
                tickInterval: y_interval
            },
            {
                title: {
                    text: null
                },
                lineColor: '#f0f0f0',
                lineWidth: 1,
                opposite: true
            }
        ],
        title: {
            text: '',
            style: { display: 'none' }
        },
        subtitle: {
            text: '',
            style: { display: 'none' }
        },
        credits: {
            enabled: false
        },
        annotations: [{
            labels: [{
                className: "situation_chart_target_label",
                backgroundColor: "rgba(70, 104, 203, 1)",
                borderRadius: 8,
                borderWidth: 0,
                verticalAlign: 'bottom',
                distance: 15,
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: target[1].x,
                    y: target[1].y
                },
                text: '終點'
            }]
        }],
        plotOptions: {
            series: {
                shadow: true,
                point: {
                    events: {
                        mouseOver: function() {
                            if (set_default_timer) {
                                clearTimeout(set_default_timer);
                            }
                            var chart = this.series.chart;
                            show_situation_current_data(chart, this.index);
                            hidePlotLines(chart);
                        },
                        mouseOut: function() {
                            set_default_timer = setTimeout(function() { showPlotLines(); }, 200);
                        }
                    }
                },
                states: {
                    hover: {
                        enabled: true,
                        lineWidth: 0,
                        lineWidthPlus: 0,
                        halo: {
                            size: 0
                        }
                    }
                }
            }
        },
        tooltip: {
            animation: false,
            crosshairs: [{
                width: 2,
                dashStyle: 'ShortDot',
                color: '#b9b9b9'
            }, false],
            shared: true,
            shadow: false,
            borderWidth: 0,
            borderRadius: 8,
            backgroundColor: "rgba(74,74,74,0.8)",
            padding: 3,
            style: {
                color: "#ffffff",
                fontSize: "10px"
            },
            formatter: function() {
                return this.points[0].point.date;
            }/*,
            positioner: function(boxWidth, boxHeight, point){
                return { x: point.plotX, y: point.plotY+30 };
            }*/
        },
        series: [{
            showInLegend: false,
            name: 'price',
            data: price,
            zIndex: 2,
            lineWidth: 3,
            color: '#f5ac00',
            marker: {
                symbol: 'circle',
                radius: 2,
                enabled: false,
                states: {
                    hover: {
                        enabled: true,
                        fillColor: '#f5ac00',
                        lineWidth: 0
                    }
                }
            }
        }, {
            showInLegend: false,
            name: 'target',
            data: target,
            zIndex: 1,
            lineWidth: 3,
            color: '#4668cb',
            enableMouseTracking: false,
            marker: {
                symbol: 'circle',
                radius: 4
            }
        }],

        responsive: {
            rules: [{
                condition: {
                    minWidth: 583
                },
                chartOptions: {
                    chart: {
                        margin: [15, 40, 25, 40],
                        height: 220
                    }
                }
            }, {
                condition: {
                    maxWidth: 584
                },
                chartOptions: {
                    chart: {
                        margin: [15, 40, 25, 40],
                        height: 160
                    }
                }
            }]
        }
    });
}