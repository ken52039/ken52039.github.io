$(function() {
	//[to prive FYI]
	var start_date ="2018-04-16";
	var standard_date ="2018-04-16";
	var data = {
			labels: ["推出至今"],
			datasets: [{
				backgroundColor: ["rgb(250,195,67)"],
				hoverBackgroundColor: ["rgb(250,195,67)"],
				text_data: [50],
				data: [100],
			}]
		};
	var data2 = {
			labels: ["近三個月", "推出至今"],
			datasets: [{
				backgroundColor: ["rgb(39,159,188)", "rgb(250,195,67)"],
				hoverBackgroundColor: ["rgb(39,159,188)", "rgb(250,195,67)"],
				text_data: [10, -50],
				data: [100, -100],
			}]
		};
	var data3 = {
			labels: ["近三個月", "近半年", "推出至今"],
			datasets: [{
				backgroundColor: ["rgb(39,159,188)", "rgb(247,126,188)", "rgb(250,195,67)"],
				hoverBackgroundColor: ["rgb(39,159,188)", "rgb(247,126,188)", "rgb(250,195,67)"],
				text_data: [50, -50, 10],
				data: [100, -100, 20],
			}]
		};
	var data4 = {
			labels: ["近三個月", "近半年", "推出至今"],
			datasets: [{
				backgroundColor: ["rgb(39,159,188)", "rgb(247,126,188)", "rgb(250,195,67)"],
				hoverBackgroundColor: ["rgb(39,159,188)", "rgb(247,126,188)", "rgb(250,195,67)"],
				text_data: [50, 25, 10],
				data: [10, 25, 50],
			}]
		};

	$('.start_date').html(start_date.replace(/\-/g,"."));
	$('.standard_date').html(standard_date.replace(/\-/g,"."));

	Chart.plugins.register({
        afterDatasetsDraw: function(chart, easing) {
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
        }
    });

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

	$("h4").on("click", function(e) {
		$(this).children(".tooltiptext").css('visibility', 'visible');
	});

	$(".tooltiptext .close_btn").on("click", function(e) {
		e.stopPropagation();
		$(this).parent().css('visibility', 'hidden');
	});

	$(".accordion button").on("click", function() {
        var icon = $(this).children("i");
        $(this).parent().children("button").each(function(index) {
			if ($(this).children("i")[0] != icon[0]) {
                $(this).children("i").removeClass("fa-caret-up");
            } else {
                icon.toggleClass("fa-caret-up");
            }
        });

        var subItem = $(this).next();
        subItem.slideToggle("fast");

        var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );

        if(iOS) {
        	$(document.scrollingElement).scrollTop($('.w3-center').height());
        	$(document.scrollingElement).animate({
	        	scrollTop: $('.w3-center').height() + $('.accordion button').height()
	        }, 'fast');
        } else {
        	$('html, body').animate({
	        	scrollTop: $(document).height()
	        }, 300);
        }
    });
});