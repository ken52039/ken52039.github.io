$(function() {
    /*data setting---------------------------------------------------------*/
    $('#num_count').attr('data-from', count_data.from);
    $('#num_count').html(count_data.to);
    for (var data in robot_dialog_data) {
        $('.' + data + ' .arrow_box').html(robot_dialog_data[data]);
    }

    //[to prive FYI] change videoID to get the thumbnail image
    var videoID = "XcklJKU94z4";
    
    if(videoID && videoID != "") {
        $("#video_thumb").attr('src','https://img.youtube.com/vi/'+videoID+'/hqdefault.jpg');
    } else {
        $(".btn_master_video").replaceWith('<div class="mask"><img src="svg/nutmeg-card.svg"></div>');
    }

    /*lightbox------------------------------------------------------------*/
    $("[data-fancybox]").fancybox({
        toolbar: false,
        smallBtn: true,
        iframe: {
            preload: false
        },
        beforeShow: function() {
            $('html').addClass('fancybox-show');
        },
        afterClose: function() {
            $('html').removeClass('fancybox-show');
        }
    });

    $('.btn_master_video').fancybox({
        toolbar: false,
        smallBtn: true,
        baseClass: 'master_video'
    });

    $('.btn_more').fancybox({
        toolbar: false,
        smallBtn: true,
        baseClass: 'intro_box'
    });

    var educations = ['[data-fancybox="education1"]', '[data-fancybox="education2"]', '[data-fancybox="education3"]', '[data-fancybox="education4"]', '[data-fancybox="education5"]'];
    educations.forEach(function(slide, index) {
        $(slide).fancybox({
            baseClass: 'education-fancybox education-container' + index,
            hash: false,
            toolbar: false,
            animationEffect: false,
            transitionEffect: 'slide',
            //margin : 0,
            loop: true,
            idleTime: false,
            smallBtn: true,
            iframe: {
                preload: true
            },
            slideShow: {
                autoStart: false,
                speed: 4000
            },
            baseTpl: '<div class="fancybox-container" role="dialog" tabindex="-1">' +
                '<div class="fancybox-bg"></div>' +
                '<div class="fancybox-inner education-content">' +
                '<div class="fancybox-navigation">' +
                '{{arrows}}' +
                '</div>' +
                '<div class="fancybox-stage"></div>' +
                '</div>' +
                '</div>',
            btnTpl: {
                arrowLeft: '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}"><span></spna></button>',
                arrowRight: '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}"><span></spna></button>'
            },
            onInit: function(instance) {
                var bullets = '<ul class="bullets">';
                for (var i = 0; i < instance.group.length; i++) {
                    bullets += '<li><a data-index="' + i + '" href="javascript:;"><span>' + (i + 1) + '</span></a></li>';
                }
                bullets += '</ul>';

                $(bullets).on('click touchstart', 'a', function() {
                        var index = $(this).data('index');
                        $.fancybox.getInstance(function() {
                            this.jumpTo(index);
                        });

                    })
                    .appendTo(instance.$refs.container.find('.fancybox-navigation'));
            },
            beforeShow: function(instance) {
                $('html').addClass('fancybox-show');

                instance.$refs.container.find('.bullets')
                    .children()
                    .removeClass('active')
                    .eq(instance.currIndex)
                    .addClass('active');
            },
            afterClose: function() {
                $('html').removeClass('fancybox-show');
            }
        });
    });

    /*menu scroll---------------------------------------------------------*/
    var lastId,
        menuItems = $('.menuItem'),
        scrollItems = menuItems.map(function() {
            var item = $($(this).attr("href").slice(10));
            if (item.length) { return item; }
        });

    menuItems.on("click", function(e) {
        closeMenu();
        var href = $(this).attr("href").slice(10),
            offsetTop = href === "#" ? 0 : $(href).offset().top - $('header').outerHeight();

        $('html, body').stop().animate({
            scrollTop: offsetTop
        }, 300);
    });

    $('.nav_container a, .footer_container a').each(function(index, element) {
        if ($(element).html() == 'Q&amp;A') {
            $(element).addClass('fancybox.iframe');
            $(element).attr('data-type', 'iframe');
            $(element).attr('data-src', 'iframe_faq.html');
            $(element).removeAttr('href');
            $(element).fancybox({
                toolbar: false,
                smallBtn: true,
                baseClass: 'faq',
                beforeShow: function() {
                    closeMenu();
                }
            });
        } else if ($(element).html() == '體驗奈米投') {
            $(element).addClass('fancybox.iframe');
            $(element).attr('data-type', 'iframe');
            $(element).attr('data-src', 'iframe_event_note.html?jump=' + $(element).attr('href'));
            $(element).removeAttr('href');
            $(element).fancybox({
                toolbar: false,
                smallBtn: false,
                baseClass: 'alert',
                beforeShow: function() {
                    closeMenu();
                }
            });
        } else if ($(element).html() == '看報告') {
            $(element).addClass('fancybox.iframe');
            $(element).attr('data-type', 'iframe');
            if(getUrlParameter('checkType')){
                $(element).attr('data-src', $(element).attr('href')+'?checkType='+getUrlParameter('checkType'));
            }else{
                $(element).attr('data-src', $(element).attr('href'));
            }
            $(element).removeAttr('href');
            $(element).fancybox({
                toolbar: false,
                smallBtn: true,
                baseClass: 'alert',
                beforeShow: function() {
                    closeMenu();
                }
            });
        }
    });

    $('.btn_scrolldown').on("click", function(e) {
        var href = $(this).attr("href"),
            offsetTop = href === "#" ? 0 : $(href).offset().top - $('header').outerHeight();

        /*$('html, body').stop().animate({
            scrollTop: offsetTop
        }, 300);

        $('.scrollContainer').stop().animate({
            scrollTop: offsetTop
        }, 300);*/
    });

    if (window.location.hash) {
        var hash = window.location.hash;
        if ($(hash).length) {
            var offsetTop = $(hash).offset().top - $('header').outerHeight();
            /*$('html, body').stop().animate({
                scrollTop: offsetTop
            }, 300);

            $('.scrollContainer').stop().animate({
                scrollTop: offsetTop
            }, 300);*/
        }
    }

    $('.scrollContainer').scroll(function() {
        $(this).scrollLeft(0);
    });

    /*animation-------------------------------------------------------------*/
    var iconObj = { curImg: 0 };
    var currIcon = 0;
    $("#why .animationA img:gt(0)").hide();
    $("#why .animationB img:gt(0)").hide();
    $("#why .animationC img:gt(0)").hide();

    var iconTween = new TimelineMax({ repeat: -1 });
    iconTween.add([TweenMax.to(iconObj, 1.2, {
        curImg: 24,
        roundProps: "curImg",
        immediateRender: true,
        ease: Linear.easeNone,
        onUpdate: function() {
            if (iconObj.curImg == currIcon) return;
            $("#why .animationA img").hide();
            $("#why .animationB img").hide();
            $("#why .animationC img").hide();
            $("#why .animationA img").eq(iconObj.curImg - 1).show();
            $("#why .animationB img").eq(iconObj.curImg - 1).show();
            $("#why .animationC img").eq(iconObj.curImg - 1).show();
            currIcon = iconObj.curImg;
        }
    })]);


    // init controller
    var controller = new ScrollMagic.Controller({ container: "#content-wrapper" });
    $('#content-wrapper').on('scroll', function() {
        controller.update();
    });

    var sections = ['.quick_section', '.professional_section', '.smart_section'];
    var scenes = [];
    sections.forEach(function(slide, index) {
        var obj = { curImg: 0 };
        var currRobot = 0;
        $(slide + " .robot:gt(0)").hide();

        var robotTween = new TimelineMax();
        /*if(index % 2 == 1)*/
        if (index == sections.length - 1) robotTween.add([TweenMax.to(slide + " .robot", 3, { right: '16%' })]);
        else robotTween.add([TweenMax.to(slide + " .robot", 3, { left: '16%' })]);

        robotTween.add([TweenMax.to(obj, 3, {
                curImg: 40,
                roundProps: "curImg",
                immediateRender: true,
                ease: Linear.easeNone,
                delay: -3,
                onUpdate: function() {
                    if (obj.curImg == currRobot) return;

                    $(slide + " .robot").hide();
                    $(slide + " .robot").eq(obj.curImg).show();
                    currRobot = obj.curImg;
                }
            }),
            TweenMax.to(slide + " .arrow_box", .5, { opacity: 1 })
        ]);
        var trigger;
        if(index == sections.length - 1) trigger = slide + ' h2';
        else trigger = slide + ' .trigger';
        var scene = new ScrollMagic.Scene({
                triggerElement: trigger,
                duration: $(slide).height() * 0.25 + "px"
            })
            .setTween(robotTween)
            //.addIndicators()
            .addTo(controller);
        scenes.push(scene);
    });

    /*top_section-------------------------------------------------------------*/
    var topTween = new TimelineMax()
        .add([
            TweenMax.to(".top_section h1", .5, { y: '-=100%' }),
            TweenMax.to(".top_section .animate_back_wave", .5, { top: '-=40%' })
        ]);

    var topScene = new new ScrollMagic.Scene({
            triggerElement: '.top_section .trigger',
            duration: "100%"
        })
        .setTween(topTween)
        .addTo(controller);

    /*quick_section-------------------------------------------------------------*/
    var quickTween = new TimelineMax()
        .add([
            TweenMax.from(".quick_section h2", .3, { y: '+=200%' }),
            TweenMax.from(".quick_section .w3-row-padding", .3, { y: '+=50%', delay: .2 })
        ]);

    var quickScene = new new ScrollMagic.Scene({
            triggerElement: '.quick_section',
            offset: -100
        })
        .setTween(quickTween)
        .addTo(controller);

    var quickElemTween = new TimelineMax()
        .add([
            TweenMax.to(".quick_section .s1", .3, { top: '+=10%' }),
            TweenMax.to(".quick_section .s2", .3, { top: '+=40%' }),
            TweenMax.to(".quick_section .s3", .3, { top: '+=30%' }),
            TweenMax.to(".quick_section .s4", .3, { top: '+=60%' }),
            TweenMax.to(".quick_section .s5", .3, { top: '+=70%' }),
            TweenMax.to(".quick_section .s6", .3, { top: '+=50%' }),
            TweenMax.to(".quick_section .s7", .3, { top: '+=40%' }),
            TweenMax.to(".quick_section .s8", .3, { top: '+=80%' }),
        ]);

    var quickElemScene = new new ScrollMagic.Scene({
            triggerElement: '.quick_section',
            duration: "100%"
        })
        .setTween(quickElemTween)
        .addTo(controller);

    /*why_section-------------------------------------------------------------*/
    var whyTween = new TimelineMax()
        .add([
            //TweenMax.from(".why_section h2", .3, { y: '+=200%' }),
            TweenMax.from(".why_section .icon", .3, { y: '+=50%', delay: .2 }),
            TweenMax.from(".why_section .txt", .3, { y: '+=200%', delay: .3 })
        ]);

    var whyScene = new new ScrollMagic.Scene({
            triggerElement: '.why_section',
            offset: -100
        })
        .setTween(whyTween)
        .addTo(controller);

    var whyElemScene = new new ScrollMagic.Scene({
            triggerElement: '.why_section',
            duration: "100%"
        })
        .addTo(controller);

    /*professional_section-------------------------------------------------------------*/
    var professionalTween = new TimelineMax()
        .add([
            TweenMax.from(".professional_section h2", .3, { y: '+=200%' }),
            TweenMax.from(".professional_section h4", .3, { y: '+=300%', delay: .2 }),
            TweenMax.from(".professional_section .w3-row-padding", .3, { y: '+=100%', delay: .3 })
        ]);

    var professionalScene = new new ScrollMagic.Scene({
            triggerElement: '.professional_section',
            offset: -100
        })
        .setTween(professionalTween)
        .addTo(controller);

    /*smart_section-------------------------------------------------------------*/
    var smartTween = new TimelineMax()
        .add([
            TweenMax.from(".smart_section h2", .3, { y: '+=200%' }),
            TweenMax.from(".smart_section .w3-row-padding", .3, { y: '+=50%', delay: .2 })
        ]);

    var smartScene = new new ScrollMagic.Scene({
            triggerElement: '.smart_section',
            offset: -100
        })
        .setTween(smartTween)
        .addTo(controller);

    /*event_section-------------------------------------------------------------*/
    var eventTween = new TimelineMax()
        .add([
            TweenMax.from(".event_section h2", .3, { y: '+=200%' }),
            TweenMax.from(".event_section h4", .3, { y: '+=300%', delay: .2 }),
            TweenMax.from(".event_section .w3-row-padding", .3, { y: '+=100%', delay: .3 })
        ]);

    var eventScene = new new ScrollMagic.Scene({
            triggerElement: '.event_section',
            offset: -100
        })
        .setTween(eventTween)
        .addTo(controller);


    $(window).resize(function() {
        scenes.forEach(function(scene, index) {
            var duration = $(sections[index]).height() * 0.25 + "px";
            scene.duration(duration);
            scene.refresh();
        });
    }).resize();


    /*count up--------------------------------------------------------------*/
    var startVal = parseInt($('#num_count').attr('data-from'), 10);
    var endVal = parseInt($('#num_count').text(), 10);
    var duration = 1.5;

    var options = {  
        useEasing: true,
          useGrouping: true,
          separator: ',',
          decimal: '.'
    };
    var numAnim = new CountUp("num_count", startVal, endVal, 0, duration, options);
    if (!numAnim.error) {
        numAnim.start();
    } else {
        console.error(numAnim.error);
    }


    /*top_section particle--------------------------------------------------*/
    Math.rand = function(max, min, _int) {
        var max = (max === 0 || max) ? max : 1,
            min = min || 0,
            gen = min + (max - min) * Math.random();
        return (_int) ? Math.round(gen) : gen;
    };
    Math.randomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    Math.randomDec = function(min, max, decimals) {
        return (Math.random() * (max - min) + min).toFixed(decimals || 2);
    };
    Math.randomList = function(list) {
        return list[Math.randomInt(0, list.length)];
    };

    var c, ctx, w, h, particles = [],
        nextframe, confettis = [PIXI.Texture.fromImage("img/group-6.png"), PIXI.Texture.fromImage("img/group.png"), PIXI.Texture.fromImage("img/oval.png"), PIXI.Texture.fromImage("img/triangle.png")];
    w = window.innerWidth;
    h = window.innerHeight;

    //PIXI setting
    var app = new PIXI.Application(w, h, { transparent: true });
    $('.top_section').prepend(app.view);

    for (var i = 0; i < 20; i++) {
        var elem = new PIXI.Sprite(confettis[Math.floor(Math.random() * confettis.length)]);
        elem.anchor.set(0.5);
        if (isBreakPoint(600) || isBreakPoint(992)) elem.scale.set(0.5);
        else elem.scale.set(1);
        elem.x = Math.rand(0, w);
        elem.y = Math.rand(0, h);
        elem.a = Math.randomDec(-2 * Math.PI, 2 * Math.PI);
        elem.s = Math.randomDec(.2, 2);
        elem.c_angle = 0;
        elem.angle_v = Math.rand(-1, 1);
        particles.push(elem);
        app.stage.addChild(elem);
    }

    app.ticker.add(function() {
        for (var i = 0; i < particles.length; i++) {
            var elem = particles[i];
            elem.x += Math.cos(elem.a) * elem.s;
            elem.y += Math.sin(elem.a) * elem.s;
            elem.c_angle += elem.angle_v;
            elem.rotation = elem.c_angle * Math.PI / 180;

            if (elem.x + elem.width / 2 < 0 || elem.x - elem.width / 2 > w || elem.y + elem.height / 2 < 0 || elem.y - elem.height / 2 > h) {
                elem.x = w / 2;
                elem.y = h / 2;
                elem.texture = confettis[Math.floor(Math.random() * confettis.length)];
                elem.a = Math.randomDec(-2 * Math.PI, 2 * Math.PI);
                elem.s = Math.randomDec(.2, 2);
                elem.c_angle = 0;
                elem.angle_v = Math.rand(-1, 1);
            }
        }
    });

    addEventListener('resize', function() {
        w = window.innerWidth;
        h = window.innerHeight;
        app.renderer.view.style.width = w + 'px';
        app.renderer.view.style.height = h + 'px';
        app.renderer.resize(w, h);

        for (var i = 0; i < particles.length; i++) {
            var elem = particles[i];
            if (isBreakPoint(600) || isBreakPoint(992)) elem.scale.set(0.5);
            else elem.scale.set(1);
        }
    });

    /*check broswer-----------------------------------------------------------*/
    var broswer = browser();
    if (broswer && !broswer.mobile && broswer.name == "ie") {
        $.fancybox.open({
            src: "iframe_broswer.html",
            type: 'iframe',
            opts: {
                toolbar: false,
                smallBtn: false,
                baseClass: 'alert',
                beforeShow: function() {
                    $('html').addClass('fancybox-show');
                },
                afterClose: function() {
                    $('html').removeClass('fancybox-show');
                }
            }
        });
    }
});