$(function() {
	
	console.log('trigger draw');
    var allData={};
    var start_date;
    var standard_date;
    var data;
    var data2;
    var data3;
    var data4;
    
    var calculateData = function(data1, data2, data3, data4){
    	var textData1 = JSON.parse(data1),
    		textData2 = JSON.parse(data2),
    		textData3 = JSON.parse(data3),
    		textData4 = JSON.parse(data4);
    	var max = 0, temp1 = [], temp2 = [], temp3 = [], temp4 = [], cData = {};
    	for(i = 0 ; i < textData1.length ; i++) {
    		if(Math.abs(textData1[i]) > max) {
    			max = Math.abs(textData1[i]);
    		}
    	}
    	for(i = 0 ; i < textData2.length ; i++) {
    		if(Math.abs(textData2[i]) > max) {
    			max = Math.abs(textData2[i]);
    		}
    	}
    	for(i = 0 ; i < textData3.length ; i++) {
    		if(Math.abs(textData3[i]) > max) {
    			max = Math.abs(textData3[i]);
    		}
    	}
    	for(i = 0 ; i < textData4.length ; i++) {
    		if(Math.abs(textData4[i]) > max) {
    			max = Math.abs(textData4[i]);
    		}
    	}
    	
    	for(i = 0 ; i < textData1.length ; i++){
    		temp1.push(Math.round(textData1[i]/max * 100));
    	}
    	for(i = 0 ; i < textData2.length ; i++){
    		temp2.push(Math.round(textData2[i]/max * 100));
    	}
    	for(i = 0 ; i < textData3.length ; i++){
    		temp3.push(Math.round(textData3[i]/max * 100));
    	}
    	for(i = 0 ; i < textData4.length ; i++){
    		temp4.push(Math.round(textData4[i]/max * 100));
    	}
    	
    	cData.temp1 = temp1;
    	cData.temp2 = temp2;
    	cData.temp3 = temp3;
    	cData.temp4 = temp4;
    	return cData;
    };
    
    $.ajax({
        type: 'GET',
        url: 'fubon/track',
        contentType: "application/json",
        crossDomain: true,
        data: "",
        async: true,
        success: function(data) {
        	try {
        		var responseData = JSON.parse(data);
                allData = responseData;
                
                start_date = allData.ETFInceptionDate;
            	standard_date = allData.currentDate;
            	
            	cData = calculateData(allData.E1T.value, allData.E2T.value, allData.E3T.value, allData.E4T.value);
            	data = {
            			labels: JSON.parse(allData.E1T.labels),
            			datasets: [{
    						backgroundColor: ["rgb(47,177,83)", "rgb(247,126,188)", "rgb(250,195,67)"],
    						hoverBackgroundColor: ["rgb(47,177,83)", "rgb(247,126,188)", "rgb(250,195,67)"],
            				text_data: JSON.parse(allData.E1T.value),
            				data: cData.temp1,
            			}]
            		};
            	data2 = {
            			labels: JSON.parse(allData.E2T.labels),
            			datasets: [{
    						backgroundColor: ["rgb(47,177,83)", "rgb(247,126,188)", "rgb(250,195,67)"],
    						hoverBackgroundColor: ["rgb(47,177,83)", "rgb(247,126,188)", "rgb(250,195,67)"],
    						text_data: JSON.parse(allData.E2T.value),
            				data: cData.temp2,
            			}]
            		};
            	data3 = {
            			labels: JSON.parse(allData.E3T.labels),
            			datasets: [{
    						backgroundColor: ["rgb(47,177,83)", "rgb(247,126,188)", "rgb(250,195,67)"],
    						hoverBackgroundColor: ["rgb(47,177,83)", "rgb(247,126,188)", "rgb(250,195,67)"],
    						text_data: JSON.parse(allData.E3T.value),
            				data: cData.temp3,
            			}]
            		};
            	data4 = {
            			labels: JSON.parse(allData.E4T.labels),
            			datasets: [{
    						backgroundColor: ["rgb(47,177,83)", "rgb(247,126,188)", "rgb(250,195,67)"],
    						hoverBackgroundColor: ["rgb(47,177,83)", "rgb(247,126,188)", "rgb(250,195,67)"],
    						text_data: JSON.parse(allData.E4T.value),
            				data: cData.temp4,
            			}]
            		};

            	$('.start_date').html(start_date.replace(/\-/g,"."));
            	$('.standard_date').html(standard_date.replace(/\-/g,"."));
            	
            	Chart.Bar('chart1', {
            		options: options,
            		data: data
            	});

            	Chart.Bar('chart2', {
            		options: options,
            		data: data2
            	});

            	Chart.Bar('chart3', {
            		options: options,
            		data: data3
            	});

            	Chart.Bar('chart4', {
            		options: options,
            		data: data4
            	});
        	} catch (e) {
        		//console.error("success data error: " + e);
                hideChartElement();
        	}
        },
        error: function (err) {
            //console.error("Got a error: " + err);
            hideChartElement();
        }
    });
	Chart.plugins.register({
        afterDatasetsDraw: function(chart, easing) {
        	try {
        		chart.canvas.style.letterSpacing = "1px";
                // To only draw at the end of animation, check for easing === 1
                var ctx = chart.ctx;
                chart.data.datasets.forEach(function (dataset, i) {
                    var meta = chart.getDatasetMeta(i);
                    if (!meta.hidden) {
                        meta.data.forEach(function(element, index) {
                            // Draw the text in black, with the specified font
                            ctx.fillStyle = 'rgb(74,74,74)';
                            var fontSize = 11;
                            var fontStyle = 'normal';
                            var fontFamily = 'Noto Sans TC';
                            ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
                            // Just naively convert to string for now
                            var dataString = dataset.text_data[index].toString() + "%";
                            // Make sure alignment settings are correct
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            var padding = 5;
                            var position = element.tooltipPosition();
                            if(dataset.data[index] >= 0) ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
                            else ctx.fillText(dataString, position.x, position.y + (fontSize / 2) + padding);
                        });
                    }
                });
        	} catch (e) {
        		//console.error('afterDatasetsDraw error: ', e);
        		hideChartElement();
        	}
        }
    });
	
	var hideChartElement = function(){
		var minuss = '--';
		$('span[name="chartElement"]').html(minuss);
		$('div[name="chartElement"]').html('<span>' + minuss + '</span>');
	};

	var options = {
		maintainAspectRatio: false,
		tooltips: {
			enabled: false
		},
		legend: {
	        display: false
	    },
		scales: {
			yAxes: [{
			  	ticks: {
	                display: false,
	                beginAtZero: true,
	                //suggestedMin: 0,
                    suggestedMax: 150
	            },
			  	gridLines: {
			    	display: true,
			    	zeroLineColor: "rgb(144,164,224)",
			    	color: "rgba(145,227,225,0)"
			  	}
			}],
			xAxes: [{
				gridLines: {
			    	display: false,
			    	color: "rgba(145,227,225,0)"
			  	},
			  	ticks: {
			         padding: 20
			    }
			}]
		}
	};


	$("h4").on("click", function(e) {
		$(this).children(".tooltiptext").css('visibility', 'visible');
	});

	$(".tooltiptext .close_btn").on("click", function(e) {
		e.stopPropagation();
		$(this).parent().css('visibility', 'hidden');
	});
	
});