var go_hide_plotLines = true;
var projection_chart;
var PlotLines = [];
var set_default_timer;
var resize_projection_chart = function() {
    var projection_tg_width = (isBreakPoint(600)) ? $('.projection').innerWidth() - 18 : $('.projection').innerWidth() - $('.summary').outerWidth() - 96;
    var projection_tg_height = $('#areaChart').innerHeight();
    hidePlotLines();
    projection_chart.setSize(projection_tg_width, projection_tg_height, false);
    showPlotLines();
}
var show_projection_default_data = function(chart) {
    var index = chart.options.chart.defaultSelectIndex;
    $('#good_amount').html('<span>NTD</span>' + number_format(chart.options.series[1].data[index].toFixed(0), 0, ".", ","));
    $('#bad_amount').html('<span>NTD</span>' + number_format(chart.options.series[2].data[index].toFixed(0), 0, ".", ",") + '<span>或較少</span>');
}
var show_projection_current_data = function(chart, index) {
    var time_ar = chart.options.series[0].data[index].split("-");
    $('#projection_month').html(time_ar[0] + "年" + time_ar[1].replace(/\b(0+)/gi, "") + "月");
    $('#projection_good').html('NTD' + number_format(chart.options.series[1].data[index].toFixed(0), 0, ".", ","));
    $('#projection_bad').html('NTD' + number_format(chart.options.series[2].data[index].toFixed(0), 0, ".", ",") + ' 或較少');
    $('#projection_principal').html('NTD' + number_format(chart.options.series[3].data[index].toFixed(0), 0, ".", ","));
}
var hidePlotLines = function(chart) {
    if (go_hide_plotLines) {
        chart = chart || projection_chart;
        var defaultSelectIndex = chart.options.chart.defaultSelectIndex,
            averages_point = chart.series[1].data[defaultSelectIndex],
            bad_point = chart.series[2].data[defaultSelectIndex],
            investment_point = chart.series[3].data[defaultSelectIndex],
            hoverPoints = chart.hoverPoints = [averages_point, bad_point, investment_point];
        var i = chart.xAxis[0].plotLinesAndBands.length;

        chart.xAxis[0].options.plotLines[1].color = "#ffffff";
        chart.xAxis[0].update();

        Highcharts.each(hoverPoints, function(point) {
            point.series.point = point;
            point.setState('');
        });
        go_hide_plotLines = false;
    }
}
var showPlotLines = function(chart) {
    chart = chart || projection_chart;
    var defaultSelectIndex = chart.options.chart.defaultSelectIndex,
        averages_point = chart.series[1].data[defaultSelectIndex],
        bad_point = chart.series[2].data[defaultSelectIndex],
        investment_point = chart.series[3].data[defaultSelectIndex],
        hoverPoints = chart.hoverPoints = [averages_point, bad_point, investment_point];
    var i = chart.xAxis[0].plotLinesAndBands.length;
    if (i > 0) {
        while (i--) {
            chart.xAxis[0].plotLinesAndBands[i].destroy();
        }
        PlotLines[1].color = "#dcdcdc";
    }
    chart.xAxis[0].update({
        plotLines: PlotLines
    });

    Highcharts.each(hoverPoints, function(point) {
        point.series.point = point;
        point.setState('hover');
    });

    show_projection_current_data(chart, defaultSelectIndex);
    go_hide_plotLines = true;
}
var draw_projection_chart = function(json_data, search_mode, mode, investment_year, year_amount, month_amount) {
    PlotLines = [];
    var averages_kay = 'standard-deviation-0.0',
        good_key = 'standard-deviation-positive-1.645',
        bad_key = 'standard-deviation-negative-1.645',
        date_length = json_data[averages_kay].length,
        default_index = investment_year * 12,
        default_index_str = (isBreakPoint(600)) || (isBreakPoint(992)) ? '目<br/>標<br/>' : '目標<br/>',
        search_mode_color = (search_mode == 1)?'#279fbc':'#2fb153',
        ranges = [],
        averages = [],
        bad = [],
        investment = [],
        month = [],
        year = [],
        y_max = json_data[good_key][date_length - 1].value,
        y_interval;

    for (var num = 0; num < date_length; num++) {
        if (y_max < json_data[bad_key][num].value) {
            y_max = json_data[bad_key][num].value;
        }
        if (y_max < json_data[good_key][num].value) {
            y_max = json_data[good_key][num].value;
        }
        if (y_max < json_data[averages_kay][num].value) {
            y_max = json_data[averages_kay][num].value;
        }
    }
    y_max *= 1.1;
    y_interval = y_max / 3;

    PlotLines.push({
        "value": default_index,
        "width": 2,
        "color": "#121212",
        "zIndex": -2,
        "dashStyle": "Dash",
        "label": {
            "text": default_index_str,
            "verticalAlign": "bottom",
            "textAlign": "center",
            "rotation": 0,
            "y": 19,
            "x": -1,
            style: {
                'font-family': "Noto Sans TC",
                'font-size': '14px',
                'font-weight': '300',
                'line-height': '1.43',
                'color': '#4a4a4a'
            }
        }
    }, {
        "value": default_index,
        "width": 2,
        "color": "#dcdcdc",
        "zIndex": -1,
        "dashStyle": "Dash",
        "label": {
            "text": ""
        }
    });
    for (var num = 0; num < date_length; num++) {
        ranges.push([json_data[bad_key][num].value, json_data[good_key][num].value]);
        averages.push(json_data[averages_kay][num].value);
        bad.push(json_data[bad_key][num].value);
        month.push(json_data[averages_kay][num].month);
        switch(mode){
            case 1:investment.push(year_amount);
                   break;
            case 2:investment.push(month_amount * (num + 1));
                   break;
            case 3:investment.push(year_amount + (month_amount * num));
                   break;
        }
        if (num == default_index) {
            PlotLines[0].label.text = (isBreakPoint(600)) || (isBreakPoint(992))? default_index_str : default_index_str+ json_data[averages_kay][num].month.replace("-", "/");
        }
        switch (num) {
            case 0:
            case date_length - 1:
                year.push((json_data[averages_kay][num].month.split('-'))[0]);
                break;
            default:
                year.push('');
        }
    }
    var marginRight = 5 + ((parseInt(y_max) + '').length - 2) * 11;
    projection_chart = Highcharts.chart('areaChart', {
        chart: {
            defaultSelectIndex: default_index,
            margin: [15, marginRight, 40, 20],
            events: {
                load: function(e) {
                    show_projection_default_data(this);
                    showPlotLines(this);
                }
            },
            height: 312
        },
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
        plotOptions: {
            series: {
                point: {
                    events: {
                        mouseOver: function() {
                            if (set_default_timer) {
                                clearTimeout(set_default_timer);
                            }
                            var chart = this.series.chart;
                            show_projection_current_data(chart, this.index);
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
        xAxis: {
            categories: year,
            allowDecimals: false,
            lineColor: '#f7f7f7',
            lineWidth: 2,
            tickLength: 0,
            labels: {
                step: 1,
                style: {
                    'font-family': "Noto Sans TC",
                    'font-size': '14px',
                    'font-weight': '300',
                    'line-height': '1.43',
                    'color': '#4a4a4a',
                }
            }
        },
        yAxis: {
            title: {
                text: null
            },
            labels: {
                style: {
                    'font-family': "Noto Sans TC",
                    'font-size': '14px',
                    'font-weight': '300',
                    'line-height': '1.43',
                    'color': '#4a4a4a'
                },
                formatter: function() {
                    if (this.value === 0) {
                        return '';
                    } else {
                        return (this.value / 1000).toFixed(0) + "K";
                    }
                }
            },
            min: 0,
            max: y_max,
            lineColor: '#f7f7f7',
            lineWidth: 2,
            gridLineWidth: 0,
            tickInterval: y_interval,
            opposite: true
        },
        tooltip: {
            animation: false,
            crosshairs: [{
                width: 2,
                dashStyle: 'dash',
                color: '#dcdcdc'
            }, false],
            shared: true,
            shadow: false,
            borderWidth: 0,
            backgroundColor: null,
            useHTML: true,
            formatter: function() {
                return '';
            }
        },
        series: [{
            showInLegend: false,
            name: 'month',
            data: month,
            visible: false
        }, {
            showInLegend: false,
            name: 'averages',
            data: averages,
            zIndex: 1,
            lineWidth: 1,
            color: search_mode_color,
            marker: {
                symbol: 'circle',
                radius: 2,
                enabled: false,
                states: {
                    hover: {
                        enabled: true,
                        fillColor: search_mode_color,
                        lineWidth: 0
                    }
                }
            }
        }, {
            showInLegend: false,
            name: 'bad',
            data: bad,
            zIndex: 1,
            lineWidth: 0,
            color: '#f97ebc',
            marker: {
                symbol: 'circle',
                radius: 2,
                enabled: false,
                states: {
                    hover: {
                        enabled: true,
                        fillColor: '#f97ebc',
                        lineWidth: 0
                    }
                }
            }
        }, {
            showInLegend: false,
            name: 'investment',
            data: investment,
            zIndex: 1,
            lineWidth: 1,
            color: '#b9b9b9',
            marker: {
                symbol: 'circle',
                radius: 2,
                enabled: false,
                states: {
                    hover: {
                        enabled: true,
                        fillColor: '#b9b9b9',
                        lineWidth: 0
                    }
                }
            }
        }, {
            name: 'range',
            data: ranges,
            type: 'arearange',
            lineWidth: 0,
            linkedTo: ':previous',
            color: search_mode_color,
            fillOpacity: .1,
            zIndex: 0,
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: false
                    }
                }
            }
        }]
    });

    /*$(projection_chart.container).on("touchend", function(event) {
        showPlotLines();
    });*/
}