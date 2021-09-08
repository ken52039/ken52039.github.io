(function(factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory;
    } else {
        factory(Highcharts);
    }
}(function(Highcharts) {
    (function(H) {

        // add additional event for hide of tooltip
        H.wrap(H.Tooltip.prototype, 'hide', function(proceed) {
            var tooltip = this.chart.options.tooltip;

            // original proceed method
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));
            if (!this.isHidden && tooltip.events && tooltip.events.hide) {
                tooltip.events.hide(this.chart);
            }
        });

        // add additional event for refresh(show) of tooltip
        H.wrap(H.Tooltip.prototype, 'refresh', function(proceed) {
            var tooltip = this.chart.options.tooltip;

            // original proceed method
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));
            if (tooltip.events && tooltip.events.show) {
                tooltip.events.show(this.chart);
            }
        });

        // add plotOptions.column.borderRadiusTopLeft & borderRadiusTopRight & borderRadiusBottomRight & borderRadiusBottomLeft
        H.wrap(H.seriesTypes.column.prototype, 'translate', function(proceed) {
            var options = this.options;
            var topMargin = options.topMargin || 0;
            var bottomMargin = options.bottomMargin || 0;

            proceed.call(this);

            H.each(this.points, function(point) {
                if (options.borderRadiusTopLeft || options.borderRadiusTopRight || options.borderRadiusBottomRight || options.borderRadiusBottomLeft) {
                    var w = point.shapeArgs.width;
                    var h = point.shapeArgs.height;
                    var x = point.shapeArgs.x;
                    var y = point.shapeArgs.y;


                    var radiusTopLeft = H.relativeLength(options.borderRadiusTopLeft || 0, w);
                    var radiusTopRight = H.relativeLength(options.borderRadiusTopRight || 0, w);
                    var radiusBottomLeft = H.relativeLength(options.borderRadiusBottomLeft || 0, w);
                    var radiusBottomRight = H.relativeLength(options.borderRadiusBottomRight || 0, w);

                    // check if the value is negative, exchange top and bottom 
                    if (point.y < 0) {
                        var tempLeft = radiusTopLeft;
                        var tempRight = radiusTopRight;
                        radiusTopLeft = radiusBottomLeft;
                        radiusTopRight = radiusBottomRight;
                        radiusBottomLeft = tempLeft;
                        radiusBottomRight = tempRight;
                    }

                    var maxR = Math.min(w, h) / 2

                    radiusTopLeft = radiusTopLeft > maxR ? maxR : radiusTopLeft;
                    radiusTopRight = radiusTopRight > maxR ? maxR : radiusTopRight;
                    radiusBottomRight = radiusBottomRight > maxR ? maxR : radiusBottomRight;
                    radiusBottomLeft = radiusBottomLeft > maxR ? maxR : radiusBottomLeft;

                    point.dlBox = point.shapeArgs;

                    point.shapeType = 'path';
                    point.shapeArgs = {
                        d: [
                            'M', x + radiusTopLeft, y + topMargin,
                            'L', x + w - radiusTopRight, y + topMargin,
                            'C', x + w - radiusTopRight / 2, y, x + w, y + radiusTopRight / 2, x + w, y + radiusTopRight,
                            'L', x + w, y + h - radiusBottomRight,
                            'C', x + w, y + h - radiusBottomRight / 2, x + w - radiusBottomRight / 2, y + h, x + w - radiusBottomRight, y + h + bottomMargin,
                            'L', x + radiusBottomLeft, y + h + bottomMargin,
                            'C', x + radiusBottomLeft / 2, y + h, x, y + h - radiusBottomLeft / 2, x, y + h - radiusBottomLeft,
                            'L', x, y + radiusTopLeft,
                            'C', x, y + radiusTopLeft / 2, x + radiusTopLeft / 2, y, x + radiusTopLeft, y,
                            'Z'
                        ]
                    };
                }

            });
        });
    }(Highcharts));
}));

var historical_chart;
var resize_historical_chart = function() {
    var historical_tg_width = (isBreakPoint(992)||isBreakPoint(600))?$('.section4 .chart_body').innerWidth():$('.section4 .chart_body').innerWidth()-86;
    var historical_tg_height = historical_tg_width * 253 / 984;
    historical_chart.setSize(historical_tg_width, historical_tg_height, false);
}
var show_historical_default_data = function(chart) {
    var bestRate = chart.options.chart.bestRate,
        bestYear = chart.options.chart.bestYear,
        worstRate = chart.options.chart.worstRate,
        worstYear = chart.options.chart.worstYear,
        startYear = chart.options.chart.startYear,
        endYear = chart.options.chart.endYear,
        averagesRate = chart.options.chart.averagesRate;
    $('#bestRate').html(number_format(bestRate, 1, ".", "", "round")+'%');
    $('#worstRate').html(number_format(worstRate, 1, ".", "", "round")+'%');
    $('#averagesRate').html(number_format(averagesRate, 1, ".", "", "round")+'%');
    $('#bestYear').html(bestYear);
    $('#worstYear').html(worstYear);
    $('#startYear').html(startYear);
    $('#endYear').html(endYear);
}
var draw_historical_chart = function(json_data, search_mode) {
    var averages_kay = 'averages-rate',
        rate_list_key = 'return-rate',
        rate_list = json_data[rate_list_key],
        date_length = rate_list.length,
        startYear = rate_list[0].year,
        endYear = rate_list[date_length - 1].year,
        averagesRate = json_data[averages_kay],
        search_mode_class = (search_mode == 1)?'color_1':'color_2',
        search_mode_color = (search_mode == 1)?'#279fbc':'#2fb153',
        bestIndex,
        bestRate,
        bestYear,
        worstIndex,
        worstRate,
        worstYear,
        startYear,
        endYear,
        bar_data = [],
        with_year_data = [];
    for (var num = 0; num < date_length; num++) {
        bar_data.push({ y: rate_list[num].rate, color: search_mode_color });
        switch(num){
            case 0:startYear=rate_list[num].year;break;
            case date_length-1:endYear=rate_list[num].year;break;
        }
        if (!bestRate) {
            bestRate = rate_list[num].rate;
            bestYear = rate_list[num].year;
            bestIndex = num;
        } else {
            if (bestRate < rate_list[num].rate) {
                bestRate = rate_list[num].rate;
                bestYear = rate_list[num].year;
                bestIndex = num;
            }
        }
        if (!worstRate) {
            worstRate = rate_list[num].rate;
            worstYear = rate_list[num].year;
            worstIndex = num;
        } else {
            if (worstRate > rate_list[num].rate) {
                worstRate = rate_list[num].rate;
                worstYear = rate_list[num].year;
                worstIndex = num;
            }
        }
        with_year_data = bar_data.slice();
        with_year_data.unshift({ y: 0, color: '#ffffff' });
        with_year_data.push({ y: 0, color: '#ffffff' });
    }
    bar_data[bestIndex].color = '#fac343';
    bar_data[worstIndex].color = '#f77ebc';
    historical_chart = Highcharts.chart('barChart', {
        chart: {
            type: 'column',
            margin: [0, 0, 0, 0],
            height: (253 / 984 * 100) + '%',
            bestRate:bestRate,
            bestYear:bestYear,
            worstRate:worstRate,
            worstYear:worstYear,
            startYear:startYear,
            endYear:endYear,
            averagesRate:averagesRate,
            events: {
                load: function(e) {
                    show_historical_default_data(this);
                }
            }
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
        tooltip: {
            style: {
                display: "none",
            }
        },
        xAxis: {
            visible: false
        },
        yAxis: {
            title: {
                text: '',
                style: { display: 'none' }
            },
            labels: {
                enabled: false
            },
            plotLines: [{ // middle line
                color: '#ffffff',
                width: 3,
                value: 0,
                zIndex: 1
            }, { // middle line
                color: '#b9b9b9',
                width: 1,
                value: 0,
                zIndex: 5
            }],
            tickAmount: 7,
            gridLineWidth: 2,
            min: -((Math.abs(worstRate)/2*3 > Math.abs(bestRate)/2*3)?Math.abs(worstRate)/2*3:Math.abs(bestRate)/2*3),
            max: (Math.abs(worstRate)/2*3 > Math.abs(bestRate)/2*3)?Math.abs(worstRate)/2*3:Math.abs(bestRate)/2*3,
            gridLineDashStyle: 'ShortDot'
        },
        series: [{
            showInLegend: false,
            name: 'rate',
            data: bar_data
        }],
        plotOptions: {
            series: {
                pointPadding: 0,
                groupPadding: 0.15,
                states: {
                    hover: {
                        enabled: false
                    }
                }
            },
            column: {
                borderRadiusTopLeft: 6,
                borderRadiusTopRight: 6,
                dataLabels: {
                    enabled: true,
                    allowOverlap: true,
                    align: 'center',
                    crop: false,
                    padding: 0,
                    useHTML:true,
                    formatter: function() {
                        /*if (this.point.index == 0) {
                          return "<span class=\"colum_label\">" + "2003" + "</span>";
                        }else*/ if(this.point.index == bestIndex) {
                            return "<span class=\"colum_label best\">" + number_format(this.y, 1, ".", "", "round") + "%" + "</span>";
                        } else if (this.point.index == worstIndex) {
                            return "<span class=\"colum_label worst\">" + number_format(this.y, 1, ".", "", "round") + "%" + "</span>";
                        } else {
                            return '';
                        }
                    }
                }
            }
        },
        responsive: {
            rules: [{
                condition: {
                    minWidth: 848
                },
                chartOptions: {
                    series: [{
                      name: 'rate',
                      data: bar_data
                    }],
                    plotOptions: {
                        series: {
                            pointPadding: 0,
                            groupPadding: 0.15
                        },
                        column: {
                            borderRadiusTopLeft: 6,
                            borderRadiusTopRight: 6,
                            dataLabels: {
                                formatter: function() {
                                    if(this.point.index == bestIndex) {
                                        return "<span class=\"colum_label best\">" + number_format(this.y, 1, ".", "", "round") + "%" + "</span>";
                                    } else if (this.point.index == worstIndex) {
                                        return "<span class=\"colum_label worst\">" + number_format(this.y, 1, ".", "", "round") + "%" + "</span>";
                                    } else {
                                        return '';
                                    }
                                }
                            }
                        }
                    }
                }
            },{
                condition: {
                    maxWidth: 849
                },
                chartOptions: {
                    series: [{
                      name: 'rate',
                      data: with_year_data
                    }],
                    plotOptions: {
                        series: {
                            pointPadding: 0,
                            groupPadding: 0.09
                        },
                        column: {
                            borderRadiusTopLeft: 3,
                            borderRadiusTopRight: 3,
                            dataLabels: {
                                formatter: function() {
                                    if (this.point.index == 0) {
                                      return "<span class=\"colum_label startYear "+search_mode_class+"\">" + startYear + "</span>";
                                    }else if (this.point.index == date_length+1) {
                                      return "<span class=\"colum_label endYear "+search_mode_class+"\">" + endYear + "</span>";
                                    }else if(this.point.index == bestIndex+1) {
                                        return "<span class=\"colum_label best\">" + number_format(this.y, 1, ".", "", "round") + "%" + "</span>";
                                    } else if (this.point.index == worstIndex+1) {
                                        return "<span class=\"colum_label worst\">" + number_format(this.y, 1, ".", "", "round") + "%" + "</span>";
                                    } else {
                                        return '';
                                    }
                                }
                            }
                        }
                    }
                }
            }]
        }
    });
}