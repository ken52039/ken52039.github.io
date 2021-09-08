//[to prive FYI] get ajax result from server
var logout = function(){
    window.location.href = 'index.html';
}

var isBreakPoint = function(bp) {
    var bps = [600, 992],
        w = $(window).outerWidth(),
        min, max
    for (var i = 0, l = bps.length; i < l; i++) {
        if (bps[i] === bp) {
            min = bps[i - 1] || 0
            max = bps[i]
            break
        }
    }
    return w > min && w <= max
}

var menu_opened = false;
var page_reload = false;

var closeMenu = function() {
    menu_opened = false;
    $('.nav-hamburger').removeClass('hamburger-open');
    $('nav').removeClass('open');
    $('nav').removeClass('close');
    $('header').removeClass('open');

    var nano = $('header nav a:contains("打造投資計畫")');
    var login = $('header nav a:contains("登入")');
    var dashboard = $('header nav a:contains("我的奈米投")');
    var logout = $('header nav a:contains("登出")');
    $('header nav').append(nano).append(dashboard).append(login).append(logout);
}

var quite_cancel = function() {
    $.fancybox.close();
}

var quite_confirm = function(jump_url) {
    switch (jump_url) {
        case 'restart':
            $.fancybox.close(true);
            $.fn.nanoReset();
            break;
        case 'nano.html':
            if (window.location.pathname == "/" + jump_url) {
                window.location.reload();
            } else {
                window.location.href = jump_url;
            }
            break;
        default:
            window.location.href = jump_url;
    }
}

var number_format = function(number, decimals, dec_point, thousands_sep, roundtag) {
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    roundtag = roundtag || "ceil"; //"ceil","floor","round"
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function(n, prec) {
            var k = Math.pow(10, prec);
            return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k;
        };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    var re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
    }

    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

var getUrlParameter = function(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

$(function() {
    /*nav--------------------------------------------------*/
    //hamurger menu icon click
    $('.nav-hamburger').on('click', function() {

        var nano = $('header nav a:contains("打造投資計畫")');
        var login = $('header nav a:contains("登入")');
        var logout = $('header nav a:contains("登出")');
        var dashboard = $('header nav a:contains("我的奈米投")');
        $('header nav a:contains("台北富邦銀行")').after(nano).after(dashboard).after(logout).after(login);

        menu_opened = !menu_opened;
        $(this).toggleClass('hamburger-open');
        $('header').toggleClass('open');

        if (menu_opened) {
            $('nav').removeClass('close');
            $('nav').addClass('open');
        } else {
            $('nav').removeClass('open');
            $('nav').addClass('close');
        }
    });

    $('.nav-logout').on('click', function() {
        $.fancybox.open({
            src  : 'iframe_logout.html',
            type : 'iframe',
            opts : {
                toolbar: false,
                smallBtn: false,
                baseClass: 'alert'
            }
        });
    });

    $('.nav-login').on('click', function() {
        $.fancybox.open({
            src  : 'iframe_login.html',
            type : 'iframe',
            opts : {
                toolbar: false,
                smallBtn: true,
                baseClass: 'alert_full'
            }
        });
        var browser = window.navigator.appVersion.toLowerCase();
        var winH = $(window).height();
        if( 
            ($(window).width() <= 600)          && 
            (browser.indexOf('safari') != -1)   && 
            (browser.indexOf('crios') == -1)    && 
            (browser.indexOf('chrome') == -1)
        ){
            $('.fancybox-slide').css({
                'min-height': winH,
                'height'    : winH
            });
            $('.alert_full .fancybox-slide--iframe .fancybox-content').css({
                'overflow'  : 'auto',
                'min-height': winH,
                'height'    : winH
            });
            $('.fancybox-iframe').css({
                'overflow'  : 'auto',
                'min-height': winH,
                'height'    : winH
            });
        } else if($(window).width() <= 600) {
            $('.alert_full .fancybox-slide--iframe .fancybox-content').css({
                'min-height' : '100vh',
                'height'     : '100%'
            });
        }

    });

    $('.nav_container a').each(function(index, element) {
        switch ($(element).html()) {
            case '登入':
                $(element).addClass('fancybox.iframe');
                $(element).attr('data-type', 'iframe');
                $(element).attr('data-src', $(element).attr('href'));
                $(element).removeAttr('href');
                $(element).fancybox({
                    toolbar: false,
                    smallBtn: true,
                    baseClass: 'alert_full',
                    beforeShow: function() {
                        closeMenu();
                    },
                    afterClose: function (instance) {
                        if(page_reload){
                            page_reload = false;
                            location.reload();
                        }
                    }
                });
                $('.nav_container nav .w3-bar-item.login').click(function(){
                    var browser = window.navigator.appVersion.toLowerCase();
                    var winH = $(window).height();
                    if( 
                        ($(window).width() <= 600)          && 
                        (browser.indexOf('safari') != -1)   && 
                        (browser.indexOf('crios') == -1)    && 
                        (browser.indexOf('chrome') == -1)
                    ){
                        $('.fancybox-slide').css({
                            'min-height': winH,
                            'height'    : winH
                        });
                        $('.alert_full .fancybox-slide--iframe .fancybox-content').css({
                            'overflow'  : 'auto',
                            'min-height': winH,
                            'height'    : winH
                        });
                        $('.fancybox-iframe').css({
                            'overflow'  : 'auto',
                            'min-height': winH,
                            'height'    : winH
                        });
                    } else if($(window).width() <= 600) {
                        $('.alert_full .fancybox-slide--iframe .fancybox-content').css({
                            'min-height' : '100vh',
                            'height'     : '100%'
                        });
                    }
                });
                break;
            case '登出':
                $(element).addClass('fancybox.iframe');
                $(element).attr('data-type', 'iframe');
                $(element).attr('data-src', $(element).attr('href'));
                $(element).removeAttr('href');
                $(element).fancybox({
                    toolbar: false,
                    smallBtn: false,
                    baseClass: 'alert',
                    beforeShow: function() {
                        closeMenu();
                    }
                });
                break;
            case 'Q&amp;A':
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
                break;
        }
    });

    $('.overlay').on('click', function() {
        $('.nav-hamburger').click();
    });

    $('nav a').click(function(){
        if( $(this).text() == '我的奈米投' ){
            $('header,nav').removeClass('open');
            $('header .hamburger-open').removeClass('hamburger-open');
            $('body').append('<div class="loading" style="z-index:100;"><div class="fancybox-loading"></div></div>');
        }
    });

    $(window).resize(function() {
        closeMenu();
    });

});