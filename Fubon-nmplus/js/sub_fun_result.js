//[to prive FYI] get POST data from nano.html
var post_max_amount = 300,
    post_purpose = 4,
    post_amount = 20,
    post_years = 20,
    post_risk = 4,
    post_mode = 1,
    post_once = 20 || '---',
    post_perMonth = post_perMonth || '---',
    post_mix_once = post_mix_once || '---',
    post_mix_perMonth = post_mix_perMonth || '---',
    post_email = "nano@taipeifubon.com.tw",
    post_search_mode = 1,
    post_kyc = 119;

//[to prive FYI] ajax last search condition
var ajax_amount,
    ajax_years,
    ajax_risk,
    ajax_mode,
    ajax_once,
    ajax_perMonth,
    ajax_mix_once,
    ajax_mix_perMonth,
    ajax_search_mode;

//[to prive FYI] collect data for iframe_event_confirm.html
var getParentData = function(userText) {
    return {
        final_amount: ajax_amount,
        final_years: ajax_years,
        final_risk: ajax_risk,
        final_mode: ajax_mode,
        final_once: ajax_once,
        final_perMonth: ajax_perMonth,
        final_mix_once: ajax_mix_once,
        final_mix_perMonth: ajax_mix_perMonth,
        final_search_mode: ajax_search_mode,
        final_email: post_email
    };
}

var purpose = {
    1: "旅遊購物",
    2: "準備創業圓夢基金",
    3: "準備購屋頭期款",
    4: "存小孩教育費",
    5: "增加收入提早退休",
    6: "變有錢"
};

var kyc_level = {
    1: "小心謹慎",
    2: "追求穩定",
    3: "願意嘗試",
    4: "喜歡冒險"
}


$(function() {
    //method ===================================================================================
    var init = function() {
        

        $.fancybox.open({
            src  : 'iframe_application.html',
            type : 'iframe',
            opts : {
                toolbar: false,
                smallBtn: true,
                baseClass: 'small_lightbox'
            }
        });

        
        last_window_width = $(window).innerWidth();
        set_data_from_post();
        get_ajax_search_data(true);
        if(isBreakPoint(600)){
            //mobile
            trigger_slide_mennu('unactive');
        }else if(isBreakPoint(992)){
            //tablet
        }else{
            //pc
            var adjust_panel_po = $('#adjust_panel_section').offset();
            $('.event_btn').css('right', $(window).outerWidth() - (adjust_panel_po.left + $('#adjust_panel_section').outerWidth()) - 65);
        }
        $('.textinput input').trigger('blur');

    }
    var set_data_from_post = function() {
        set_select_value('#search_mode_keeper', post_search_mode);
        $('#purpose_keeper').html(purpose[post_purpose]);
        $('#amount_keeper').val(post_amount).attr('old_value', post_amount);
        $('#max_amount_keeper').html(post_max_amount);
        $('#years_keeper').val(post_years).attr('old_value', post_years);
        set_select_value('#mode_keeper', post_mode);
        $('#once_keeper').val(post_once).attr('old_value', post_once);
        $('#perMonth_keeper').val(post_perMonth).attr('old_value', post_perMonth);
        $('#mix_once_keeper').val(post_mix_once).attr('old_value', post_mix_once);
        $('#mix_perMonth_keeper').val(post_mix_perMonth).attr('old_value', post_mix_perMonth);
            if(post_kyc <= 118){
                $('#risk_keeper').parent().parent().children('ul').children('li').each(function(index) {
                    if (index == 1 || index == 2 || index == 3) {
                        $(this).hide();
                    }
                    set_select_value('#risk_keeper', 1);
                });
                //now_kyc_level = 1;
            }else if (post_kyc > 118 && post_kyc <= 254){
                $('#risk_keeper').parent().parent().children('ul').children('li').each(function(index) {
                    if (index == 2 || index == 3) {
                        $(this).hide();
                    }
                    if(post_risk > 2){
                        set_select_value('#risk_keeper', 2);
                    }else{
                        set_select_value('#risk_keeper', post_risk);
                    }
                });
                //now_kyc_level = 2;
            }else if (post_kyc > 254 && post_kyc <= 362){
                $('#risk_keeper').parent().parent().children('ul').children('li').each(function(index) {
                    if (index == 3) {
                        $(this).hide();
                    }
                    if(post_risk > 3){
                        set_select_value('#risk_keeper', 2);
                    }else{
                        set_select_value('#risk_keeper', post_risk);
                    }
                });
                //now_kyc_level = 3;
            }else if (post_kyc > 362){
                set_select_value('#risk_keeper', post_risk);
            }
    }

    var set_select_value = function(id, pure_value) {
        var get_new_data = false;
        pure_value = parseInt(pure_value, 10);
        switch (id) {
            case '#search_mode_keeper':
                    if($(id).attr('pure_value') && parseInt($(id).attr('pure_value'), 10) != pure_value){
                        $(id).removeClass('color_1 color_2');
                        get_new_data = true;
                    }
                    break;
            case '#risk_keeper':
                    if($(id).attr('pure_value') && parseInt($(id).attr('pure_value'), 10) != pure_value){
                        get_new_data = true;
                    }
                    break;
            case '#mode_keeper':
                if (!$(id).attr('pure_value') || ($(id).attr('pure_value') && parseInt($(id).attr('pure_value'), 10) != pure_value)) {
                    switch (pure_value) {
                        case 1:
                            $('#once_keeper').parent().parent().show();
                            $('#perMonth_keeper').parent().parent().hide();
                            $('#mix_once_keeper').parent().parent().hide();
                            $('#mix_perMonth_keeper').parent().parent().hide();
                            if ($('#once_keeper').val() == '---') {
                                $('#once_keeper').trigger("focus");
                            }
                            break;
                        case 2:
                            $('#once_keeper').parent().parent().hide();
                            $('#perMonth_keeper').parent().parent().show();
                            $('#mix_once_keeper').parent().parent().hide();
                            $('#mix_perMonth_keeper').parent().parent().hide();
                            if ($('#perMonth_keeper').val() == '---') {
                                $('#perMonth_keeper').trigger("focus");
                            }
                            break;
                        case 3:
                            $('#once_keeper').parent().parent().hide();
                            $('#perMonth_keeper').parent().parent().hide();
                            $('#mix_once_keeper').parent().parent().show();
                            $('#mix_perMonth_keeper').parent().parent().show();
                            if ($('#mix_once_keeper').val() == '---') {
                                $('#mix_once_keeper').trigger("focus");
                            } else if ($('#mix_perMonth_keeper').val() == '---') {
                                $('#mix_perMonth_keeper').trigger("focus");
                            }
                            break;
                    }
                }
                break;
        }
        $(id).attr('pure_value', pure_value);
        $(id).parent().parent().children('ul').children('li').each(function() {
            if ($(this).children('a').attr('value') == pure_value) {
                if ($(id).is("textarea")) {
                    if (isBreakPoint(600)) {
                        $(id).val(($(this).children('a').html()).replace(/<br[^>]*>/gi, "\n"));
                        if ($(id)[0].scrollHeight + $(id)[0].offsetHeight - $(id)[0].clientHeight) {
                            $(id).css('height', '20px').css('height', $(id)[0].scrollHeight + $(id)[0].offsetHeight - $(id)[0].clientHeight - 2);
                        }
                    } else {
                        $(id).val($(this).children('a').text());
                    }
                } else {
                    $(id).val($(this).children('a').text());
                }
            }
        });
        if(get_new_data){
            setTimeout(get_ajax_search_data, 400);
        }
    }

    var trigger_slide_mennu = function(force_action) {
        if(force_action){
            switch(force_action){
                case 'unactive':$(".sub_section").slideUp();
                                $('.sub_header').removeClass('active');
                                break;
                case 'active':$(".sub_section").slideDown();
                              $('.sub_header').addClass('active');
                              break;
            }
        }else{
            if($('.sub_header').hasClass('active')){
                $(".sub_section").slideUp();
                $('.sub_header').removeClass('active');
            }else{
                $(".sub_section").slideDown();
                $('.sub_header').addClass('active');
            }
        }
    }

    var window_resize = function(event){
        if(last_window_width == $(window).innerWidth()){
            return false;
        }else{
            last_window_width = $(window).innerWidth();
        }
        //chart
        resize_projection_chart();
        resize_historical_chart();
        resize_allocation_chart();

        //event_btn
        if(isBreakPoint(600)){
            //mobile
            $('.event_btn').css('right', 16);
        }else if(isBreakPoint(992)){
            //tablet
            $('.event_btn').css('right', 20);
        }else{
            //pc
            var adjust_panel_po = $('#adjust_panel_section').offset();
            $('.event_btn').css('right', $(window).outerWidth() - (adjust_panel_po.left + $('#adjust_panel_section').outerWidth()) - 65);
        }
        //sub_menu
        if (!isBreakPoint(600) && !isBreakPoint(992)) {
            //pc
            $('.sub_menu').css('top', $('header').outerHeight() + 24 + 'px');
        }else{
            //tablet & mobile
            $('.sub_menu').css('top', $('header').outerHeight() + 'px');
        }
        //scrollContainer
        if (!isBreakPoint(600) && !isBreakPoint(992)) {
            //pc
            $('.scrollContainer').css('margin-top', $('header').outerHeight() + 'px');
        }else{
            //tablet & mobile
            $('.scrollContainer').css('margin-top', ($('header').outerHeight() + $('.sub_menu').outerHeight()) + 'px');
        }
        //sub_section
        if(isBreakPoint(600)){
            //mobile
            trigger_slide_mennu('unactive');
        }else if(isBreakPoint(992)){
            //tablet
            trigger_slide_mennu('active');
        }else{
            //pc
            trigger_slide_mennu('active');
        }
        //mode_keeper
        if (isBreakPoint(600)) {
            if ($('#mode_keeper').val().indexOf(",") > -1) {
                $('#mode_keeper').val($('#mode_keeper').val().replace(",每", ",\n每"));
                $('#mode_keeper').css('height', '40px');
            }
        } else {
            if ($('#mode_keeper').val().indexOf("\n") > -1) {
                $('#mode_keeper').val($('#mode_keeper').val().replace("\n", ""));
                $('#mode_keeper').css('height', '20px');
            }
        }

    };

    var get_ajax_search_data = function(init) {
        var send = true;
        $('#amount_keeper, #years_keeper').parent().parent().each(function() {
            if ($(this).hasClass('error')) {
                send = false;
                return false;
            }
        });
        switch(parseInt($('#mode_keeper').attr('pure_value'), 10)){
            case 1:$('#once_keeper').parent().parent().each(function() {
                        if ($(this).hasClass('error')) {
                            send = false;
                            return false;
                        }
                    });
                   break;
            case 2:$('#perMonth_keeper').parent().parent().each(function() {
                        if ($(this).hasClass('error')) {
                            send = false;
                            return false;
                        }
                    });
                   break;
            case 3:$('#mix_once_keeper, #mix_perMonth_keeper').parent().parent().each(function() {
                        if ($(this).hasClass('error')) {
                            send = false;
                            return false;
                        }
                    });
                   break;
        }

        //[to prive FYI] get ajax result from server
        if (send) {
            $(".loading").fadeIn("slow");
            ajax_amount = $('#amount_keeper').val();
            ajax_years = $('#years_keeper').val();
            ajax_risk = $('#risk_keeper').attr('pure_value');
            ajax_mode = $('#mode_keeper').attr('pure_value');
            ajax_once = $('#once_keeper').val();
            ajax_perMonth = $('#perMonth_keeper').val();
            ajax_mix_once = $('#mix_once_keeper').val();
            ajax_mix_perMonth = $('#mix_perMonth_keeper').val();
            ajax_search_mode = $('#search_mode_keeper').attr('pure_value');

            var Projection_Sample = {
                "standard-deviation-0.0": [{ "month": "2018-03", "value": 100000.0 }, { "month": "2018-04", "value": 100608.51061587805 }, { "month": "2018-05", "value": 101220.72408345246 }, { "month": "2018-06", "value": 101836.66293496889 }, { "month": "2018-07", "value": 102456.3498397841 }, { "month": "2018-08", "value": 103079.80760520035 }, { "month": "2018-09", "value": 103707.05917730465 }, { "month": "2018-10", "value": 104338.1276418135 }, { "month": "2018-11", "value": 104973.03622492231 }, { "month": "2018-12", "value": 105611.80829416047 }, { "month": "2019-01", "value": 106254.4673592512 }, { "month": "2019-02", "value": 106901.03707297692 }, { "month": "2019-03", "value": 107551.54123204971 }, { "month": "2019-04", "value": 108206.00377798716 }, { "month": "2019-05", "value": 108864.44879799364 }, { "month": "2019-06", "value": 109526.90052584655 }, { "month": "2019-07", "value": 110193.3833427885 }, { "month": "2019-08", "value": 110863.92177842457 }, { "month": "2019-09", "value": 111538.54051162502 }, { "month": "2019-10", "value": 112217.26437143369 }, { "month": "2019-11", "value": 112900.11833798178 }, { "month": "2019-12", "value": 113587.12754340726 }, { "month": "2020-01", "value": 114278.31727277982 }, { "month": "2020-02", "value": 114973.7129650315 }, { "month": "2020-03", "value": 115673.34021389286 }, { "month": "2020-04", "value": 116377.22476883512 }, { "month": "2020-05", "value": 117085.39253601772 }, { "month": "2020-06", "value": 117797.86957924187 }, { "month": "2020-07", "value": 118514.68212090974 }, { "month": "2020-08", "value": 119235.85654298961 }, { "month": "2020-09", "value": 119961.41938798683 }, { "month": "2020-10", "value": 120691.39735992071 }, { "month": "2020-11", "value": 121425.81732530738 }, { "month": "2020-12", "value": 122164.70631414857 }, { "month": "2021-01", "value": 122908.09152092638 }, { "month": "2021-02", "value": 123656.00030560432 }, { "month": "2021-03", "value": 124408.46019463411 }, { "month": "2021-04", "value": 125165.49888196887 }, { "month": "2021-05", "value": 125927.14423008237 }, { "month": "2021-06", "value": 126693.4242709945 }, { "month": "2021-07", "value": 127464.36720730292 }, { "month": "2021-08", "value": 128240.0014132211 }, { "month": "2021-09", "value": 129020.35543562273 }, { "month": "2021-10", "value": 129805.45799509207 }, { "month": "2021-11", "value": 130595.33798698132 }, { "month": "2021-12", "value": 131390.0244824739 }, { "month": "2022-01", "value": 132189.54672965454 }, { "month": "2022-02", "value": 132993.93415458556 }, { "month": "2022-03", "value": 133803.21636239009 }, { "month": "2022-04", "value": 134617.4231383415 }, { "month": "2022-05", "value": 135436.58444895977 }, { "month": "2022-06", "value": 136260.73044311433 }, { "month": "2022-07", "value": 137089.89145313366 }, { "month": "2022-08", "value": 137924.09799592168 }, { "month": "2022-09", "value": 138763.3807740809 }, { "month": "2022-10", "value": 139607.77067704246 }, { "month": "2022-11", "value": 140457.29878220294 }, { "month": "2022-12", "value": 141311.9963560682 }, { "month": "2023-01", "value": 142171.89485540407 }, { "month": "2023-02", "value": 143037.0259283942 }, { "month": "2023-03", "value": 143907.4214158047 }, { "month": "2023-04", "value": 144783.11335215622 }, { "month": "2023-05", "value": 145664.13396690282 }, { "month": "2023-06", "value": 146550.51568561824 }, { "month": "2023-07", "value": 147442.29113118924 }, { "month": "2023-08", "value": 148339.49312501636 }, { "month": "2023-09", "value": 149242.15468822175 }, { "month": "2023-10", "value": 150150.3090428647 }, { "month": "2023-11", "value": 151063.98961316425 }, { "month": "2023-12", "value": 151983.23002672926 }, { "month": "2024-01", "value": 152908.06411579627 }, { "month": "2024-02", "value": 153838.52591847448 }, { "month": "2024-03", "value": 154774.6496799987 }, { "month": "2024-04", "value": 155716.46985398955 }, { "month": "2024-05", "value": 156664.02110372164 }, { "month": "2024-06", "value": 157617.3383033992 }, { "month": "2024-07", "value": 158576.4565394398 }, { "month": "2024-08", "value": 159541.41111176554 }, { "month": "2024-09", "value": 160512.23753510226 }, { "month": "2024-10", "value": 161488.97154028673 }, { "month": "2024-11", "value": 162471.64907558163 }, { "month": "2024-12", "value": 163460.30630799863 }, { "month": "2025-01", "value": 164454.97962462957 }, { "month": "2025-02", "value": 165455.70563398555 }, { "month": "2025-03", "value": 166462.52116734427 }, { "month": "2025-04", "value": 167475.4632801058 }, { "month": "2025-05", "value": 168494.56925315617 }, { "month": "2025-06", "value": 169519.8765942396 }, { "month": "2025-07", "value": 170551.42303933893 }, { "month": "2025-08", "value": 171589.2465540644 }, { "month": "2025-09", "value": 172633.38533505102 }, { "month": "2025-10", "value": 173683.87781136445 }, { "month": "2025-11", "value": 174740.76264591524 }, { "month": "2025-12", "value": 175804.0787368819 }, { "month": "2026-01", "value": 176873.86521914243 }, { "month": "2026-02", "value": 177950.16146571471 }, { "month": "2026-03", "value": 179033.0070892057 }, { "month": "2026-04", "value": 180122.44194326922 }, { "month": "2026-05", "value": 181218.50612407277 }, { "month": "2026-06", "value": 182321.23997177335 }, { "month": "2026-07", "value": 183430.6840720021 }, { "month": "2026-08", "value": 184546.87925735794 }, { "month": "2026-09", "value": 185669.86660891058 }, { "month": "2026-10", "value": 186799.68745771243 }, { "month": "2026-11", "value": 187936.38338631962 }, { "month": "2026-12", "value": 189079.99623032263 }, { "month": "2027-01", "value": 190230.568079886 }, { "month": "2027-02", "value": 191388.14128129717 }, { "month": "2027-03", "value": 192552.75843852555 }, { "month": "2027-04", "value": 193724.46241479 }, { "month": "2027-05", "value": 194903.29633413666 }, { "month": "2027-06", "value": 196089.3035830261 }, { "month": "2027-07", "value": 197282.52781193017 }, { "month": "2027-08", "value": 198483.0129369383 }, { "month": "2027-09", "value": 199690.80314137417 }, { "month": "2027-10", "value": 200905.9428774216 }, { "month": "2027-11", "value": 202128.47686776053 }, { "month": "2027-12", "value": 203358.4501072135 }, { "month": "2028-01", "value": 204595.90786440097 }, { "month": "2028-02", "value": 205840.8956834079 }, { "month": "2028-03", "value": 207093.45938545984 }, { "month": "2028-04", "value": 208353.64507060946 }, { "month": "2028-05", "value": 209621.49911943293 }, { "month": "2028-06", "value": 210897.06819473743 }, { "month": "2028-07", "value": 212180.399243278 }, { "month": "2028-08", "value": 213471.53949748573 }, { "month": "2028-09", "value": 214770.53647720627 }, { "month": "2028-10", "value": 216077.43799144833 }, { "month": "2028-11", "value": 217392.29214014357 }, { "month": "2028-12", "value": 218715.14731591695 }, { "month": "2029-01", "value": 220046.05220586763 }, { "month": "2029-02", "value": 221385.05579336084 }, { "month": "2029-03", "value": 222732.20735983102 }, { "month": "2029-04", "value": 224087.5564865951 }, { "month": "2029-05", "value": 225451.15305667775 }, { "month": "2029-06", "value": 226823.0472566471 }, { "month": "2029-07", "value": 228203.2895784619 }, { "month": "2029-08", "value": 229591.93082132973 }, { "month": "2029-09", "value": 230989.0220935769 }, { "month": "2029-10", "value": 232394.6148145292 }, { "month": "2029-11", "value": 233808.76071640453 }, { "month": "2029-12", "value": 235231.51184621674 }, { "month": "2030-01", "value": 236662.92056769138 }, { "month": "2030-02", "value": 238103.0395631928 }, { "month": "2030-03", "value": 239551.92183566312 }, { "month": "2030-04", "value": 241009.620710573 }, { "month": "2030-05", "value": 242476.18983788425 }, { "month": "2030-06", "value": 243951.6831940244 }, { "month": "2030-07", "value": 245436.1550838732 }, { "month": "2030-08", "value": 246929.66014276148 }, { "month": "2030-09", "value": 248432.25333848174 }, { "month": "2030-10", "value": 249943.9899733115 }, { "month": "2030-11", "value": 251464.92568604823 }, { "month": "2030-12", "value": 252995.11645405766 }, { "month": "2031-01", "value": 254534.6185953337 }, { "month": "2031-02", "value": 256083.48877057096 }, { "month": "2031-03", "value": 257641.78398525075 }, { "month": "2031-04", "value": 259209.56159173863 }, { "month": "2031-05", "value": 260786.87929139528 }, { "month": "2031-06", "value": 262373.79513670044 }, { "month": "2031-07", "value": 263970.3675333894 }, { "month": "2031-08", "value": 265576.65524260234 }, { "month": "2031-09", "value": 267192.7173830474 }, { "month": "2031-10", "value": 268818.6134331763 }, { "month": "2031-11", "value": 270454.40323337336 }, { "month": "2031-12", "value": 272100.14698815806 }, { "month": "2032-01", "value": 273755.90526840073 }, { "month": "2032-02", "value": 275421.739013552 }, { "month": "2032-03", "value": 277097.7095338854 }, { "month": "2032-04", "value": 278783.87851275405 }, { "month": "2032-05", "value": 280480.3080088607 }, { "month": "2032-06", "value": 282187.060458542 }, { "month": "2032-07", "value": 283904.19867806643 }, { "month": "2032-08", "value": 285631.785865946 }, { "month": "2032-09", "value": 287369.8856052623 }, { "month": "2032-10", "value": 289118.5618660069 }, { "month": "2032-11", "value": 290877.8790074354 }, { "month": "2032-12", "value": 292647.9017804366 }, { "month": "2033-01", "value": 294428.69532991486 }, { "month": "2033-02", "value": 296220.3251971886 }, { "month": "2033-03", "value": 298022.85732240195 }, { "month": "2033-04", "value": 299836.3580469518 }, { "month": "2033-05", "value": 301660.89411592967 }, { "month": "2033-06", "value": 303496.5326805777 }, { "month": "2033-07", "value": 305343.3413007608 }, { "month": "2033-08", "value": 307201.38794745266 }, { "month": "2033-09", "value": 309070.7410052376 }, { "month": "2033-10", "value": 310951.4692748274 }, { "month": "2033-11", "value": 312843.64197559346 }, { "month": "2033-12", "value": 314747.32874811447 }, { "month": "2034-01", "value": 316662.5996567393 }, { "month": "2034-02", "value": 318589.5251921659 }, { "month": "2034-03", "value": 320528.1762740357 }, { "month": "2034-04", "value": 322478.62425354356 }, { "month": "2034-05", "value": 324440.94091606385 }, { "month": "2034-06", "value": 326415.1984837928 }, { "month": "2034-07", "value": 328401.46961840603 }, { "month": "2034-08", "value": 330399.82742373354 }, { "month": "2034-09", "value": 332410.34544844966 }, { "month": "2034-10", "value": 334433.09768878034 }, { "month": "2034-11", "value": 336468.1585912264 }, { "month": "2034-12", "value": 338515.6030553034 }, { "month": "2035-01", "value": 340575.5064362985 }, { "month": "2035-02", "value": 342647.94454804383 }, { "month": "2035-03", "value": 344732.99366570654 }, { "month": "2035-04", "value": 346830.7305285965 }, { "month": "2035-05", "value": 348941.23234299046 }, { "month": "2035-06", "value": 351064.5767849732 }, { "month": "2035-07", "value": 353200.84200329706 }, { "month": "2035-08", "value": 355350.10662225785 }, { "month": "2035-09", "value": 357512.4497445881 }, { "month": "2035-10", "value": 359687.9509543696 }, { "month": "2035-11", "value": 361876.6903199612 }, { "month": "2035-12", "value": 364078.7483969462 }, { "month": "2036-01", "value": 366294.2062310975 }, { "month": "2036-02", "value": 368523.14536136005 }, { "month": "2036-03", "value": 370765.6478228515 }, { "month": "2036-04", "value": 373021.79614988255 }, { "month": "2036-05", "value": 375291.67337899364 }, { "month": "2036-06", "value": 377575.36305201106 }, { "month": "2036-07", "value": 379872.94921912265 }, { "month": "2036-08", "value": 382184.51644197013 }, { "month": "2036-09", "value": 384510.1497967616 }, { "month": "2036-10", "value": 386849.9348774035 }, { "month": "2036-11", "value": 389203.9577986499 }, { "month": "2036-12", "value": 391572.3051992721 }, { "month": "2037-01", "value": 393955.06424524804 }, { "month": "2037-02", "value": 396352.32263296965 }, { "month": "2037-03", "value": 398764.16859247035 }, { "month": "2037-04", "value": 401190.6908906733 }, { "month": "2037-05", "value": 403631.97883465764 }, { "month": "2037-06", "value": 406088.122274945 }, { "month": "2037-07", "value": 408559.2116088079 }, { "month": "2037-08", "value": 411045.33778359526 }, { "month": "2037-09", "value": 413546.5923000801 }, { "month": "2037-10", "value": 416063.06721582793 }, { "month": "2037-11", "value": 418594.8551485841 }, { "month": "2037-12", "value": 421142.04927968245 }, { "month": "2038-01", "value": 423704.74335747573 }, { "month": "2038-02", "value": 426283.03170078486 }, { "month": "2038-03", "value": 428877.0092023708 }, { "month": "2038-04", "value": 431486.77133242745 }, { "month": "2038-05", "value": 434112.41414209484 }, { "month": "2038-06", "value": 436754.0342669939 }, { "month": "2038-07", "value": 439411.7289307841 }, { "month": "2038-08", "value": 442085.59594874125 }, { "month": "2038-09", "value": 444775.7337313571 }, { "month": "2038-10", "value": 447482.2412879618 }, { "month": "2038-11", "value": 450205.2182303681 }, { "month": "2038-12", "value": 452944.76477653685 }, { "month": "2039-01", "value": 455700.9817542658 }, { "month": "2039-02", "value": 458473.9706049011 }, { "month": "2039-03", "value": 461263.8333870695 }, { "month": "2039-04", "value": 464070.67278043577 }, { "month": "2039-05", "value": 466894.5920894815 }, { "month": "2039-06", "value": 469735.69524730655 }, { "month": "2039-07", "value": 472594.08681945485 }, { "month": "2039-08", "value": 475469.87200776325 }, { "month": "2039-09", "value": 478363.1566542322 }, { "month": "2039-10", "value": 481274.0472449224 }, { "month": "2039-11", "value": 484202.65091387375 }, { "month": "2039-12", "value": 487149.07544704765 }, { "month": "2040-01", "value": 490113.4292862946 }, { "month": "2040-02", "value": 493095.8215333457 }, { "month": "2040-03", "value": 496096.36195382715 }, { "month": "2040-04", "value": 499115.1609813009 }, { "month": "2040-05", "value": 502152.32972132904 }, { "month": "2040-06", "value": 505207.9799555622 }, { "month": "2040-07", "value": 508282.22414585477 }, { "month": "2040-08", "value": 511375.17543840344 }, { "month": "2040-09", "value": 514486.9476679112 }, { "month": "2040-10", "value": 517617.65536177723 }, { "month": "2040-11", "value": 520767.4137443127 }, { "month": "2040-12", "value": 523936.33874098037 }, { "month": "2041-01", "value": 527124.5469826619 }, { "month": "2041-02", "value": 530332.1558099505 }, { "month": "2041-03", "value": 533559.283277469 }, { "month": "2041-04", "value": 536806.048158215 }, { "month": "2041-05", "value": 540072.5699479333 }, { "month": "2041-06", "value": 543358.9688695119 }, { "month": "2041-07", "value": 546665.3658774083 }, { "month": "2041-08", "value": 549991.8826621008 }, { "month": "2041-09", "value": 553338.6416545672 }, { "month": "2041-10", "value": 556705.7660307906 }, { "month": "2041-11", "value": 560093.3797162932 }, { "month": "2041-12", "value": 563501.607390697 }, { "month": "2042-01", "value": 566930.5744923129 }, { "month": "2042-02", "value": 570380.4072227569 }, { "month": "2042-03", "value": 573851.2325515959 }, { "month": "2042-04", "value": 577343.1782210193 }, { "month": "2042-05", "value": 580856.3727505419 }, { "month": "2042-06", "value": 584390.9454417331 }, { "month": "2042-07", "value": 587947.0263829762 }, { "month": "2042-08", "value": 591524.7464542559 }, { "month": "2042-09", "value": 595124.2373319757 }, { "month": "2042-10", "value": 598745.6314938042 }, { "month": "2042-11", "value": 602389.0622235499 }, { "month": "2042-12", "value": 606054.6636160684 }, { "month": "2043-01", "value": 609742.5705821962 }, { "month": "2043-02", "value": 613452.9188537167 }, { "month": "2043-03", "value": 617185.8449883552 }, { "month": "2043-04", "value": 620941.4863748059 }, { "month": "2043-05", "value": 624719.9812377876 }, { "month": "2043-06", "value": 628521.4686431307 }, { "month": "2043-07", "value": 632346.0885028968 }, { "month": "2043-08", "value": 636193.9815805267 }, { "month": "2043-09", "value": 640065.2894960212 }, { "month": "2043-10", "value": 643960.1547311551 }, { "month": "2043-11", "value": 647878.720634719 }, { "month": "2043-12", "value": 651821.131427796 }, { "month": "2044-01", "value": 655787.5322090705 }, { "month": "2044-02", "value": 659778.0689601675 }, { "month": "2044-03", "value": 663792.8885510251 }, { "month": "2044-04", "value": 667832.1387453016 }, { "month": "2044-05", "value": 671895.9682058123 }, { "month": "2044-06", "value": 675984.5265000011 }, { "month": "2044-07", "value": 680097.9641054466 }, { "month": "2044-08", "value": 684236.4324153989 }, { "month": "2044-09", "value": 688400.0837443516 }, { "month": "2044-10", "value": 692589.0713336493 }, { "month": "2044-11", "value": 696803.549357126 }, { "month": "2044-12", "value": 701043.6729267789 }, { "month": "2045-01", "value": 705309.5980984797 }, { "month": "2045-02", "value": 709601.4818777158 }, { "month": "2045-03", "value": 713919.4822253694 }, { "month": "2045-04", "value": 718263.7580635324 }, { "month": "2045-05", "value": 722634.4692813539 }, { "month": "2045-06", "value": 727031.7767409247 }, { "month": "2045-07", "value": 731455.8422832 }, { "month": "2045-08", "value": 735906.8287339536 }, { "month": "2045-09", "value": 740384.8999097712 }, { "month": "2045-10", "value": 744890.22062408 }, { "month": "2045-11", "value": 749422.956693215 }, { "month": "2045-12", "value": 753983.2749425202 }, { "month": "2046-01", "value": 758571.3432124906 }, { "month": "2046-02", "value": 763187.330364947 }, { "month": "2046-03", "value": 767831.4062892541 }, { "month": "2046-04", "value": 772503.7419085697 }, { "month": "2046-05", "value": 777204.5091861387 }, { "month": "2046-06", "value": 781933.8811316191 }, { "month": "2046-07", "value": 786692.0318074524 }, { "month": "2046-08", "value": 791479.1363352673 }, { "month": "2046-09", "value": 796295.3709023275 }, { "month": "2046-10", "value": 801140.9127680133 }, { "month": "2046-11", "value": 806015.9402703492 }, { "month": "2046-12", "value": 810920.6328325632 }, { "month": "2047-01", "value": 815855.170969695 }, { "month": "2047-02", "value": 820819.7362952357 }, { "month": "2047-03", "value": 825814.5115278142 }, { "month": "2047-04", "value": 830839.6804979224 }, { "month": "2047-05", "value": 835895.4281546796 }, { "month": "2047-06", "value": 840981.9405726397 }, { "month": "2047-07", "value": 846099.4049586416 }, { "month": "2047-08", "value": 851248.009658696 }, { "month": "2047-09", "value": 856427.9441649196 }, { "month": "2047-10", "value": 861639.3991225092 }, { "month": "2047-11", "value": 866882.5663367576 }, { "month": "2047-12", "value": 872157.6387801127 }, { "month": "2048-01", "value": 877464.8105992811 }, { "month": "2048-02", "value": 882804.2771223723 }, { "month": "2048-03", "value": 888176.2348660871 }, { "month": "2048-04", "value": 893580.881542953 }, { "month": "2048-05", "value": 899018.4160685986 }, { "month": "2048-06", "value": 904489.0385690746 }, { "month": "2048-07", "value": 909992.9503882208 }, { "month": "2048-08", "value": 915530.3540950753 }, { "month": "2048-09", "value": 921101.4534913294 }, { "month": "2048-10", "value": 926706.453618831 }, { "month": "2048-11", "value": 932345.5607671288 }, { "month": "2048-12", "value": 938018.9824810643 }, { "month": "2049-01", "value": 943726.927568413 }, { "month": "2049-02", "value": 949469.6061075665 }, { "month": "2049-03", "value": 955247.2294552664 }, { "month": "2049-04", "value": 961060.0102543826 }, { "month": "2049-05", "value": 966908.1624417393 }, { "month": "2049-06", "value": 972791.9012559884 }, { "month": "2049-07", "value": 978711.443245533 }, { "month": "2049-08", "value": 984667.0062764956 }, { "month": "2049-09", "value": 990658.8095407363 }, { "month": "2049-10", "value": 996687.0735639224 }, { "month": "2049-11", "value": 1002752.0202136434 }, { "month": "2049-12", "value": 1008853.8727075746 }, { "month": "2050-01", "value": 1014992.8556216973 }, { "month": "2050-02", "value": 1021169.1948985594 }, { "month": "2050-03", "value": 1027383.1178555931 }],
                "standard-deviation-positive-1.0": [{ "month": "2018-03", "value": 100000.0 }, { "month": "2018-04", "value": 104154.75987824197 }, { "month": "2018-05", "value": 106302.97950629833 }, { "month": "2018-06", "value": 108133.8904825712 }, { "month": "2018-07", "value": 109806.40766281329 }, { "month": "2018-08", "value": 111381.71616562291 }, { "month": "2018-09", "value": 112891.02803261402 }, { "month": "2018-10", "value": 114352.79544399813 }, { "month": "2018-11", "value": 115778.98928922716 }, { "month": "2018-12", "value": 117177.89316069183 }, { "month": "2019-01", "value": 118555.51882589508 }, { "month": "2019-02", "value": 119916.39267572174 }, { "month": "2019-03", "value": 121264.02412164546 }, { "month": "2019-04", "value": 122601.2001520616 }, { "month": "2019-05", "value": 123930.17885749126 }, { "month": "2019-06", "value": 125252.82124708006 }, { "month": "2019-07", "value": 126570.68379069178 }, { "month": "2019-08", "value": 127885.08508313818 }, { "month": "2019-09", "value": 129197.15494481553 }, { "month": "2019-10", "value": 130507.87129233849 }, { "month": "2019-11", "value": 131818.08830026357 }, { "month": "2019-12", "value": 133128.55823761685 }, { "month": "2020-01", "value": 134439.9486292184 }, { "month": "2020-02", "value": 135752.85590674027 }, { "month": "2020-03", "value": 137067.81638669095 }, { "month": "2020-04", "value": 138385.31518668067 }, { "month": "2020-05", "value": 139705.79353292283 }, { "month": "2020-06", "value": 141029.6547990269 }, { "month": "2020-07", "value": 142357.26953447942 }, { "month": "2020-08", "value": 143688.97968134886 }, { "month": "2020-09", "value": 145025.1021333217 }, { "month": "2020-10", "value": 146365.93175782723 }, { "month": "2020-11", "value": 147711.74397670716 }, { "month": "2020-12", "value": 149062.79698150276 }, { "month": "2021-01", "value": 150419.33364444735 }, { "month": "2021-02", "value": 151781.5831745677 }, { "month": "2021-03", "value": 153149.76255911528 }, { "month": "2021-04", "value": 154524.07782327637 }, { "month": "2021-05", "value": 155904.72513531314 }, { "month": "2021-06", "value": 157291.89177963338 }, { "month": "2021-07", "value": 158685.75701652878 }, { "month": "2021-08", "value": 160086.49284426685 }, { "month": "2021-09", "value": 161494.2646767296 }, { "month": "2021-10", "value": 162909.23194774037 }, { "month": "2021-11", "value": 164331.5486515324 }, { "month": "2021-12", "value": 165761.3638274085 }, { "month": "2022-01", "value": 167198.82199547492 }, { "month": "2022-02", "value": 168644.06354935386 }, { "month": "2022-03", "value": 170097.2251109594 }, { "month": "2022-04", "value": 171558.43985172905 }, { "month": "2022-05", "value": 173027.83778411688 }, { "month": "2022-06", "value": 174505.5460266569 }, { "month": "2022-07", "value": 175991.6890454808 }, { "month": "2022-08", "value": 177486.38887481106 }, { "month": "2022-09", "value": 178989.76531863963 }, { "month": "2022-10", "value": 180501.936135534 }, { "month": "2022-11", "value": 182023.0172082813 }, { "month": "2022-12", "value": 183553.12269988138 }, { "month": "2023-01", "value": 185092.36519722588 }, { "month": "2023-02", "value": 186640.85584364866 }, { "month": "2023-03", "value": 188198.70446140246 }, { "month": "2023-04", "value": 189766.01966500044 }, { "month": "2023-05", "value": 191342.9089662603 }, { "month": "2023-06", "value": 192929.47887180105 }, { "month": "2023-07", "value": 194525.83497366268 }, { "month": "2023-08", "value": 196132.08203365226 }, { "month": "2023-09", "value": 197748.32406195678 }, { "month": "2023-10", "value": 199374.6643905118 }, { "month": "2023-11", "value": 201011.2057415649 }, { "month": "2023-12", "value": 202658.05029183073 }, { "month": "2024-01", "value": 204315.29973259935 }, { "month": "2024-02", "value": 205983.05532612093 }, { "month": "2024-03", "value": 207661.4179585643 }, { "month": "2024-04", "value": 209350.4881898176 }, { "month": "2024-05", "value": 211050.36630037444 }, { "month": "2024-06", "value": 212761.15233552986 }, { "month": "2024-07", "value": 214482.94614708773 }, { "month": "2024-08", "value": 216215.84743276634 }, { "month": "2024-09", "value": 217959.9557734709 }, { "month": "2024-10", "value": 219715.3706685891 }, { "month": "2024-11", "value": 221482.19156945194 }, { "month": "2024-12", "value": 223260.5179110898 }, { "month": "2025-01", "value": 225050.44914240562 }, { "month": "2025-02", "value": 226852.08475487327 }, { "month": "2025-03", "value": 228665.52430986476 }, { "month": "2025-04", "value": 230490.86746469923 }, { "month": "2025-05", "value": 232328.21399749973 }, { "month": "2025-06", "value": 234177.66383093852 }, { "month": "2025-07", "value": 236039.317054944 }, { "month": "2025-08", "value": 237913.27394843774 }, { "month": "2025-09", "value": 239799.6350001648 }, { "month": "2025-10", "value": 241698.5009286759 }, { "month": "2025-11", "value": 243609.9727015159 }, { "month": "2025-12", "value": 245534.15155366887 }, { "month": "2026-01", "value": 247471.13900530647 }, { "month": "2026-02", "value": 249421.03687888396 }, { "month": "2026-03", "value": 251383.94731562305 }, { "month": "2026-04", "value": 253359.97279142114 }, { "month": "2026-05", "value": 255349.21613222058 }, { "month": "2026-06", "value": 257351.7805288717 }, { "month": "2026-07", "value": 259367.76955152015 }, { "month": "2026-08", "value": 261397.28716354654 }, { "month": "2026-09", "value": 263440.43773508666 }, { "month": "2026-10", "value": 265497.3260561555 }, { "month": "2026-11", "value": 267568.05734939984 }, { "month": "2026-12", "value": 269652.7372825012 }, { "month": "2027-01", "value": 271751.471980249 }, { "month": "2027-02", "value": 273864.36803630384 }, { "month": "2027-03", "value": 275991.5325246703 }, { "month": "2027-04", "value": 278133.0730108925 }, { "month": "2027-05", "value": 280289.09756299324 }, { "month": "2027-06", "value": 282459.7147621687 }, { "month": "2027-07", "value": 284645.0337132532 }, { "month": "2027-08", "value": 286845.16405496834 }, { "month": "2027-09", "value": 289060.21596996876 }, { "month": "2027-10", "value": 291290.30019469565 }, { "month": "2027-11", "value": 293535.52802905004 }, { "month": "2027-12", "value": 295796.0113458968 }, { "month": "2028-01", "value": 298071.8626004072 }, { "month": "2028-02", "value": 300363.19483925233 }, { "month": "2028-03", "value": 302670.12170965434 }, { "month": "2028-04", "value": 304992.7574683042 }, { "month": "2028-05", "value": 307331.216990155 }, { "month": "2028-06", "value": 309685.61577709677 }, { "month": "2028-07", "value": 312056.06996652146 }, { "month": "2028-08", "value": 314442.6963397835 }, { "month": "2028-09", "value": 316845.6123305642 }, { "month": "2028-10", "value": 319264.9360331437 }, { "month": "2028-11", "value": 321700.78621058835 }, { "month": "2028-12", "value": 324153.28230285866 }, { "month": "2029-01", "value": 326622.54443484114 }, { "month": "2029-02", "value": 329108.69342431234 }, { "month": "2029-03", "value": 331611.8507898371 }, { "month": "2029-04", "value": 334132.13875860604 }, { "month": "2029-05", "value": 336669.6802742186 }, { "month": "2029-06", "value": 339224.59900441236 }, { "month": "2029-07", "value": 341797.0193487455 }, { "month": "2029-08", "value": 344387.06644623476 }, { "month": "2029-09", "value": 346994.866182953 }, { "month": "2029-10", "value": 349620.5451995881 }, { "month": "2029-11", "value": 352264.2308989702 }, { "month": "2029-12", "value": 354926.0514535659 }, { "month": "2030-01", "value": 357606.1358129458 }, { "month": "2030-02", "value": 360304.6137112261 }, { "month": "2030-03", "value": 363021.61567448894 }, { "month": "2030-04", "value": 365757.27302818216 }, { "month": "2030-05", "value": 368511.7179045019 }, { "month": "2030-06", "value": 371285.08324976126 }, { "month": "2030-07", "value": 374077.502831745 }, { "month": "2030-08", "value": 376889.1112470558 }, { "month": "2030-09", "value": 379720.04392845073 }, { "month": "2030-10", "value": 382570.43715217296 }, { "month": "2030-11", "value": 385440.42804527824 }, { "month": "2030-12", "value": 388330.1545929605 }, { "month": "2031-01", "value": 391239.75564587594 }, { "month": "2031-02", "value": 394169.37092746864 }, { "month": "2031-03", "value": 397119.1410413008 }, { "month": "2031-04", "value": 400089.2074783852 }, { "month": "2031-05", "value": 403079.712624526 }, { "month": "2031-06", "value": 406090.7997676671 }, { "month": "2031-07", "value": 409122.613105249 }, { "month": "2031-08", "value": 412175.29775157705 }, { "month": "2031-09", "value": 415248.99974520225 }, { "month": "2031-10", "value": 418343.86605631444 }, { "month": "2031-11", "value": 421460.0445941516 }, { "month": "2031-12", "value": 424597.68421442446 }, { "month": "2032-01", "value": 427756.934726758 }, { "month": "2032-02", "value": 430937.94690215256 }, { "month": "2032-03", "value": 434140.8724804641 }, { "month": "2032-04", "value": 437365.86417790456 }, { "month": "2032-05", "value": 440613.07569456473 }, { "month": "2032-06", "value": 443882.6617219601 }, { "month": "2032-07", "value": 447174.77795060043 }, { "month": "2032-08", "value": 450489.5810775838 }, { "month": "2032-09", "value": 453827.22881421715 }, { "month": "2032-10", "value": 457187.87989366404 }, { "month": "2032-11", "value": 460571.6940786187 }, { "month": "2032-12", "value": 463978.8321690105 }, { "month": "2033-01", "value": 467409.45600973663 }, { "month": "2033-02", "value": 470863.72849842656 }, { "month": "2033-03", "value": 474341.81359323626 }, { "month": "2033-04", "value": 477843.87632067595 }, { "month": "2033-05", "value": 481370.0827834701 }, { "month": "2033-06", "value": 484920.60016845074 }, { "month": "2033-07", "value": 488495.5967544864 }, { "month": "2033-08", "value": 492095.24192044575 }, { "month": "2033-09", "value": 495719.70615319686 }, { "month": "2033-10", "value": 499369.1610556439 }, { "month": "2033-11", "value": 503043.7793548009 }, { "month": "2033-12", "value": 506743.73490990436 }, { "month": "2034-01", "value": 510469.2027205639 }, { "month": "2034-02", "value": 514220.358934953 }, { "month": "2034-03", "value": 517997.38085804065 }, { "month": "2034-04", "value": 521800.446959862 }, { "month": "2034-05", "value": 525629.7368838333 }, { "month": "2034-06", "value": 529485.431455107 }, { "month": "2034-07", "value": 533367.712688971 }, { "month": "2034-08", "value": 537276.76379929 }, { "month": "2034-09", "value": 541212.7692069936 }, { "month": "2034-10", "value": 545175.9145486066 }, { "month": "2034-11", "value": 549166.386684826 }, { "month": "2034-12", "value": 553184.3737091435 }, { "month": "2035-01", "value": 557230.064956516 }, { "month": "2035-02", "value": 561303.651012081 }, { "month": "2035-03", "value": 565405.3237199218 }, { "month": "2035-04", "value": 569535.2761918806 }, { "month": "2035-05", "value": 573693.7028164199 }, { "month": "2035-06", "value": 577880.7992675338 }, { "month": "2035-07", "value": 582096.7625137111 }, { "month": "2035-08", "value": 586341.7908269459 }, { "month": "2035-09", "value": 590616.0837918015 }, { "month": "2035-10", "value": 594919.842314527 }, { "month": "2035-11", "value": 599253.2686322243 }, { "month": "2035-12", "value": 603616.5663220679 }, { "month": "2036-01", "value": 608009.9403105811 }, { "month": "2036-02", "value": 612433.5968829639 }, { "month": "2036-03", "value": 616887.743692474 }, { "month": "2036-04", "value": 621372.5897698674 }, { "month": "2036-05", "value": 625888.345532891 }, { "month": "2036-06", "value": 630435.2227958316 }, { "month": "2036-07", "value": 635013.434779125 }, { "month": "2036-08", "value": 639623.1961190181 }, { "month": "2036-09", "value": 644264.7228772903 }, { "month": "2036-10", "value": 648938.2325510364 }, { "month": "2036-11", "value": 653643.9440825031 }, { "month": "2036-12", "value": 658382.0778689882 }, { "month": "2037-01", "value": 663152.8557728002 }, { "month": "2037-02", "value": 667956.5011312763 }, { "month": "2037-03", "value": 672793.2387668622 }, { "month": "2037-04", "value": 677663.2949972549 }, { "month": "2037-05", "value": 682566.8976456061 }, { "month": "2037-06", "value": 687504.2760507865 }, { "month": "2037-07", "value": 692475.661077719 }, { "month": "2037-08", "value": 697481.2851277692 }, { "month": "2037-09", "value": 702521.3821492029 }, { "month": "2037-10", "value": 707596.1876477089 }, { "month": "2037-11", "value": 712705.9386969873 }, { "month": "2037-12", "value": 717850.8739494005 }, { "month": "2038-01", "value": 723031.2336466947 }, { "month": "2038-02", "value": 728247.2596307859 }, { "month": "2038-03", "value": 733499.1953546121 }, { "month": "2038-04", "value": 738787.2858930582 }, { "month": "2038-05", "value": 744111.7779539439 }, { "month": "2038-06", "value": 749472.9198890828 }, { "month": "2038-07", "value": 754870.9617054131 }, { "month": "2038-08", "value": 760306.155076196 }, { "month": "2038-09", "value": 765778.7533522832 }, { "month": "2038-10", "value": 771289.0115734604 }, { "month": "2038-11", "value": 776837.1864798595 }, { "month": "2038-12", "value": 782423.5365234405 }, { "month": "2039-01", "value": 788048.321879552 }, { "month": "2039-02", "value": 793711.8044585625 }, { "month": "2039-03", "value": 799414.2479175624 }, { "month": "2039-04", "value": 805155.9176721452 }, { "month": "2039-05", "value": 810937.0809082628 }, { "month": "2039-06", "value": 816758.0065941521 }, { "month": "2039-07", "value": 822618.9654923449 }, { "month": "2039-08", "value": 828520.2301717493 }, { "month": "2039-09", "value": 834462.075019807 }, { "month": "2039-10", "value": 840444.7762547359 }, { "month": "2039-11", "value": 846468.6119378428 }, { "month": "2039-12", "value": 852533.86198592 }, { "month": "2040-01", "value": 858640.8081837198 }, { "month": "2040-02", "value": 864789.734196509 }, { "month": "2040-03", "value": 870980.9255827051 }, { "month": "2040-04", "value": 877214.6698065917 }, { "month": "2040-05", "value": 883491.2562511199 }, { "month": "2040-06", "value": 889810.9762307862 }, { "month": "2040-07", "value": 896174.1230045984 }, { "month": "2040-08", "value": 902580.9917891227 }, { "month": "2040-09", "value": 909031.8797716149 }, { "month": "2040-10", "value": 915527.0861232394 }, { "month": "2040-11", "value": 922066.9120123687 }, { "month": "2040-12", "value": 928651.6606179721 }, { "month": "2041-01", "value": 935281.6371430903 }, { "month": "2041-02", "value": 941957.1488283998 }, { "month": "2041-03", "value": 948678.5049658577 }, { "month": "2041-04", "value": 955446.0169124433 }, { "month": "2041-05", "value": 962259.9981039851 }, { "month": "2041-06", "value": 969120.7640690755 }, { "month": "2041-07", "value": 976028.63244308 }, { "month": "2041-08", "value": 982983.9229822339 }, { "month": "2041-09", "value": 989986.9575778324 }, { "month": "2041-10", "value": 997038.0602705117 }, { "month": "2041-11", "value": 1004137.557264624 }, { "month": "2041-12", "value": 1011285.7769427057 }, { "month": "2042-01", "value": 1018483.0498800391 }, { "month": "2042-02", "value": 1025729.708859309 }, { "month": "2042-03", "value": 1033026.0888853539 }, { "month": "2042-04", "value": 1040372.5272000175 }, { "month": "2042-05", "value": 1047769.3632970889 }, { "month": "2042-06", "value": 1055216.938937349 }, { "month": "2042-07", "value": 1062715.5981637095 }, { "month": "2042-08", "value": 1070265.6873164498 }, { "month": "2042-09", "value": 1077867.555048559 }, { "month": "2042-10", "value": 1085521.5523411704 }, { "month": "2042-11", "value": 1093228.0325191051 }, { "month": "2042-12", "value": 1100987.3512665078 }, { "month": "2043-01", "value": 1108799.8666425925 }, { "month": "2043-02", "value": 1116665.939097488 }, { "month": "2043-03", "value": 1124585.9314881836 }, { "month": "2043-04", "value": 1132560.2090945875 }, { "month": "2043-05", "value": 1140589.1396356805 }, { "month": "2043-06", "value": 1148673.0932857795 }, { "month": "2043-07", "value": 1156812.4426909108 }, { "month": "2043-08", "value": 1165007.5629852843 }, { "month": "2043-09", "value": 1173258.8318078779 }, { "month": "2043-10", "value": 1181566.629319134 }, { "month": "2043-11", "value": 1189931.3382177576 }, { "month": "2043-12", "value": 1198353.3437576296 }, { "month": "2044-01", "value": 1206833.0337648343 }, { "month": "2044-02", "value": 1215370.798654787 }, { "month": "2044-03", "value": 1223967.0314494842 }, { "month": "2044-04", "value": 1232622.1277948641 }, { "month": "2044-05", "value": 1241336.4859782776 }, { "month": "2044-06", "value": 1250110.506946076 }, { "month": "2044-07", "value": 1258944.5943213154 }, { "month": "2044-08", "value": 1267839.1544215747 }, { "month": "2044-09", "value": 1276794.5962768903 }, { "month": "2044-10", "value": 1285811.331647811 }, { "month": "2044-11", "value": 1294889.7750435683 }, { "month": "2044-12", "value": 1304030.3437403664 }, { "month": "2045-01", "value": 1313233.457799794 }, { "month": "2045-02", "value": 1322499.5400873541 }, { "month": "2045-03", "value": 1331829.0162911187 }, { "month": "2045-04", "value": 1341222.3149405012 }, { "month": "2045-05", "value": 1350679.8674251568 }, { "month": "2045-06", "value": 1360202.1080140015 }, { "month": "2045-07", "value": 1369789.4738743645 }, { "month": "2045-08", "value": 1379442.4050912547 }, { "month": "2045-09", "value": 1389161.3446867624 }, { "month": "2045-10", "value": 1398946.7386395854 }, { "month": "2045-11", "value": 1408799.035904685 }, { "month": "2045-12", "value": 1418718.6884330637 }, { "month": "2046-01", "value": 1428706.1511916856 }, { "month": "2046-02", "value": 1438761.8821835164 }, { "month": "2046-03", "value": 1448886.3424676987 }, { "month": "2046-04", "value": 1459079.9961798599 }, { "month": "2046-05", "value": 1469343.310552556 }, { "month": "2046-06", "value": 1479676.755935843 }, { "month": "2046-07", "value": 1490080.8058179917 }, { "month": "2046-08", "value": 1500555.9368463303 }, { "month": "2046-09", "value": 1511102.6288482312 }, { "month": "2046-10", "value": 1521721.3648522291 }, { "month": "2046-11", "value": 1532412.631109284 }, { "month": "2046-12", "value": 1543176.9171141775 }, { "month": "2047-01", "value": 1554014.7156270572 }, { "month": "2047-02", "value": 1564926.5226951144 }, { "month": "2047-03", "value": 1575912.8376744082 }, { "month": "2047-04", "value": 1586974.163251836 }, { "month": "2047-05", "value": 1598111.005467245 }, { "month": "2047-06", "value": 1609323.8737356835 }, { "month": "2047-07", "value": 1620613.280869813 }, { "month": "2047-08", "value": 1631979.7431024504 }, { "month": "2047-09", "value": 1643423.7801092688 }, { "month": "2047-10", "value": 1654945.9150316527 }, { "month": "2047-11", "value": 1666546.6744996835 }, { "month": "2047-12", "value": 1678226.5886552967 }, { "month": "2048-01", "value": 1689986.1911755826 }, { "month": "2048-02", "value": 1701826.0192962363 }, { "month": "2048-03", "value": 1713746.6138351674 }, { "month": "2048-04", "value": 1725748.5192162672 }, { "month": "2048-05", "value": 1737832.2834933263 }, { "month": "2048-06", "value": 1749998.4583741077 }, { "month": "2048-07", "value": 1762247.5992445885 }, { "month": "2048-08", "value": 1774580.2651933476 }, { "month": "2048-09", "value": 1786997.0190361254 }, { "month": "2048-10", "value": 1799498.4273405357 }, { "month": "2048-11", "value": 1812085.0604509525 }, { "month": "2048-12", "value": 1824757.49251354 }, { "month": "2049-01", "value": 1837516.3015014685 }, { "month": "2049-02", "value": 1850362.0692402835 }, { "month": "2049-03", "value": 1863295.3814334425 }, { "month": "2049-04", "value": 1876316.8276880288 }, { "month": "2049-05", "value": 1889427.0015406208 }, { "month": "2049-06", "value": 1902626.5004833406 }, { "month": "2049-07", "value": 1915915.9259900716 }, { "month": "2049-08", "value": 1929295.8835428485 }, { "month": "2049-09", "value": 1942766.9826584163 }, { "month": "2049-10", "value": 1956329.8369149745 }, { "month": "2049-11", "value": 1969985.063979088 }, { "month": "2049-12", "value": 1983733.2856327747 }, { "month": "2050-01", "value": 1997575.1278007766 }, { "month": "2050-02", "value": 2011511.2205780076 }, { "month": "2050-03", "value": 2025542.1982571788 }],
                "standard-deviation-negative-1.0": [{ "month": "2018-03", "value": 100000.0 }, { "month": "2018-04", "value": 97183.00363975739 }, { "month": "2018-05", "value": 96381.44698824149 }, { "month": "2018-06", "value": 95906.15737072732 }, { "month": "2018-07", "value": 95598.27924365488 }, { "month": "2018-08", "value": 95396.6871916863 }, { "month": "2018-09", "value": 95270.22927010484 }, { "month": "2018-10", "value": 95200.51379181868 }, { "month": "2018-11", "value": 95175.63075932086 }, { "month": "2018-12", "value": 95187.35787361077 }, { "month": "2019-01", "value": 95229.7450646574 }, { "month": "2019-02", "value": 95298.32804578404 }, { "month": "2019-03", "value": 95389.6599191329 }, { "month": "2019-04", "value": 95501.01662202114 }, { "month": "2019-05", "value": 95630.2034044437 }, { "month": "2019-06", "value": 95775.42301529867 }, { "month": "2019-07", "value": 95935.1831630361 }, { "month": "2019-08", "value": 96108.22985418806 }, { "month": "2019-09", "value": 96293.49829551061 }, { "month": "2019-10", "value": 96490.07602614617 }, { "month": "2019-11", "value": 96697.17475871486 }, { "month": "2019-12", "value": 96914.10854561988 }, { "month": "2020-01", "value": 97140.27662057478 }, { "month": "2020-02", "value": 97375.14975041583 }, { "month": "2020-03", "value": 97618.25926000683 }, { "month": "2020-04", "value": 97869.18811888162 }, { "month": "2020-05", "value": 98127.56363666999 }, { "month": "2020-06", "value": 98393.05142725084 }, { "month": "2020-07", "value": 98665.35038323679 }, { "month": "2020-08", "value": 98944.18846225424 }, { "month": "2020-09", "value": 99229.31913091186 }, { "month": "2020-10", "value": 99520.51834569973 }, { "month": "2020-11", "value": 99817.58197536385 }, { "month": "2020-12", "value": 100120.32358868272 }, { "month": "2021-01", "value": 100428.57254655888 }, { "month": "2021-02", "value": 100742.17234902139 }, { "month": "2021-03", "value": 101060.97919691924 }, { "month": "2021-04", "value": 101384.86073535583 }, { "month": "2021-05", "value": 101713.69495171346 }, { "month": "2021-06", "value": 102047.36920576968 }, { "month": "2021-07", "value": 102385.77937316611 }, { "month": "2021-08", "value": 102728.82908654412 }, { "month": "2021-09", "value": 103076.42906115572 }, { "month": "2021-10", "value": 103428.49649380674 }, { "month": "2021-11", "value": 103784.9545256802 }, { "month": "2021-12", "value": 104145.73176098964 }, { "month": "2022-01", "value": 104510.76183458063 }, { "month": "2022-02", "value": 104879.98302257467 }, { "month": "2022-03", "value": 105253.33789097215 }, { "month": "2022-04", "value": 105630.7729778217 }, { "month": "2022-05", "value": 106012.23850515003 }, { "month": "2022-06", "value": 106397.688117344 }, { "month": "2022-07", "value": 106787.07864310118 }, { "month": "2022-08", "value": 107180.36987842711 }, { "month": "2022-09", "value": 107577.52438847045 }, { "month": "2022-10", "value": 107978.50732625333 }, { "month": "2022-11", "value": 108383.28626658687 }, { "month": "2022-12", "value": 108791.8310536611 }, { "month": "2023-01", "value": 109204.11366097235 }, { "month": "2023-02", "value": 109620.10806240274 }, { "month": "2023-03", "value": 110039.79011339718 }, { "month": "2023-04", "value": 110463.13744129961 }, { "month": "2023-05", "value": 110890.12934401038 }, { "month": "2023-06", "value": 111320.74669621554 }, { "month": "2023-07", "value": 111754.97186251731 }, { "month": "2023-08", "value": 112192.78861686293 }, { "month": "2023-09", "value": 112634.18206773097 }, { "month": "2023-10", "value": 113079.13858858732 }, { "month": "2023-11", "value": 113527.6457531712 }, { "month": "2023-12", "value": 113979.6922752139 }, { "month": "2024-01", "value": 114435.26795223125 }, { "month": "2024-02", "value": 114894.36361306363 }, { "month": "2024-03", "value": 115356.97106886853 }, { "month": "2024-04", "value": 115823.08306729705 }, { "month": "2024-05", "value": 116292.69324961024 }, { "month": "2024-06", "value": 116765.79611051256 }, { "month": "2024-07", "value": 117242.38696049945 }, { "month": "2024-08", "value": 117722.46189053408 }, { "month": "2024-09", "value": 118206.0177388831 }, { "month": "2024-10", "value": 118693.0520599567 }, { "month": "2024-11", "value": 119183.56309501037 }, { "month": "2024-12", "value": 119677.54974457822 }, { "month": "2025-01", "value": 120175.01154251746 }, { "month": "2025-02", "value": 120675.94863155425 }, { "month": "2025-03", "value": 121180.361740229 }, { "month": "2025-04", "value": 121688.25216114802 }, { "month": "2025-05", "value": 122199.62173045489 }, { "month": "2025-06", "value": 122714.47280844221 }, { "month": "2025-07", "value": 123232.80826122982 }, { "month": "2025-08", "value": 123754.63144344167 }, { "month": "2025-09", "value": 124279.94618181851 }, { "month": "2025-10", "value": 124808.7567597072 }, { "month": "2025-11", "value": 125341.06790237363 }, { "month": "2025-12", "value": 125876.88476308806 }, { "month": "2026-01", "value": 126416.2129099367 }, { "month": "2026-02", "value": 126959.05831331594 }, { "month": "2026-03", "value": 127505.42733406898 }, { "month": "2026-04", "value": 128055.32671222712 }, { "month": "2026-05", "value": 128608.76355632083 }, { "month": "2026-06", "value": 129165.74533322782 }, { "month": "2026-07", "value": 129726.27985852782 }, { "month": "2026-08", "value": 130290.37528733542 }, { "month": "2026-09", "value": 130858.04010558434 }, { "month": "2026-10", "value": 131429.2831217388 }, { "month": "2026-11", "value": 132004.11345890776 }, { "month": "2026-12", "value": 132582.54054734143 }, { "month": "2027-01", "value": 133164.57411728855 }, { "month": "2027-02", "value": 133750.22419219612 }, { "month": "2027-03", "value": 134339.50108223324 }, { "month": "2027-04", "value": 134932.41537812233 }, { "month": "2027-05", "value": 135528.97794526187 }, { "month": "2027-06", "value": 136129.19991812616 }, { "month": "2027-07", "value": 136733.0926949274 }, { "month": "2027-08", "value": 137340.66793252758 }, { "month": "2027-09", "value": 137951.9375415879 }, { "month": "2027-10", "value": 138566.91368194338 }, { "month": "2027-11", "value": 139185.60875819242 }, { "month": "2027-12", "value": 139808.03541549062 }, { "month": "2028-01", "value": 140434.2065355391 }, { "month": "2028-02", "value": 141064.13523275816 }, { "month": "2028-03", "value": 141697.83485063797 }, { "month": "2028-04", "value": 142335.3189582573 }, { "month": "2028-05", "value": 142976.60134696317 }, { "month": "2028-06", "value": 143621.6960272041 }, { "month": "2028-07", "value": 144270.6172255095 }, { "month": "2028-08", "value": 144923.37938160924 }, { "month": "2028-09", "value": 145579.9971456869 }, { "month": "2028-10", "value": 146240.4853757608 }, { "month": "2028-11", "value": 146904.8591351873 }, { "month": "2028-12", "value": 147573.13369028122 }, { "month": "2029-01", "value": 148245.3245080481 }, { "month": "2029-02", "value": 148921.44725402392 }, { "month": "2029-03", "value": 149601.5177902174 }, { "month": "2029-04", "value": 150285.55217315065 }, { "month": "2029-05", "value": 150973.56665199468 }, { "month": "2029-06", "value": 151665.57766679508 }, { "month": "2029-07", "value": 152361.60184678456 }, { "month": "2029-08", "value": 153061.65600877925 }, { "month": "2029-09", "value": 153765.75715565486 }, { "month": "2029-10", "value": 154473.9224748997 }, { "month": "2029-11", "value": 155186.16933724182 }, { "month": "2029-12", "value": 155902.5152953472 }, { "month": "2030-01", "value": 156622.9780825862 }, { "month": "2030-02", "value": 157347.575611866 }, { "month": "2030-03", "value": 158076.325974526 }, { "month": "2030-04", "value": 158809.24743929462 }, { "month": "2030-05", "value": 159546.3584513044 }, { "month": "2030-06", "value": 160287.67763116394 }, { "month": "2030-07", "value": 161033.2237740842 }, { "month": "2030-08", "value": 161783.01584905756 }, { "month": "2030-09", "value": 162537.0729980874 }, { "month": "2030-10", "value": 163295.41453546673 }, { "month": "2030-11", "value": 164058.0599471041 }, { "month": "2030-12", "value": 164825.02888989515 }, { "month": "2031-01", "value": 165596.34119113802 }, { "month": "2031-02", "value": 166372.01684799165 }, { "month": "2031-03", "value": 167152.0760269751 }, { "month": "2031-04", "value": 167936.5390635067 }, { "month": "2031-05", "value": 168725.42646148184 }, { "month": "2031-06", "value": 169518.7588928879 }, { "month": "2031-07", "value": 170316.55719745555 }, { "month": "2031-08", "value": 171118.84238234442 }, { "month": "2031-09", "value": 171925.63562186362 }, { "month": "2031-10", "value": 172736.95825722424 }, { "month": "2031-11", "value": 173552.831796324 }, { "month": "2031-12", "value": 174373.27791356307 }, { "month": "2032-01", "value": 175198.31844968934 }, { "month": "2032-02", "value": 176027.97541167328 }, { "month": "2032-03", "value": 176862.27097261063 }, { "month": "2032-04", "value": 177701.22747165302 }, { "month": "2032-05", "value": 178544.86741396476 }, { "month": "2032-06", "value": 179393.21347070602 }, { "month": "2032-07", "value": 180246.2884790408 }, { "month": "2032-08", "value": 181104.11544217003 }, { "month": "2032-09", "value": 181966.7175293877 }, { "month": "2032-10", "value": 182834.11807616122 }, { "month": "2032-11", "value": 183706.34058423367 }, { "month": "2032-12", "value": 184583.40872174854 }, { "month": "2033-01", "value": 185465.34632339576 }, { "month": "2033-02", "value": 186352.17739057893 }, { "month": "2033-03", "value": 187243.9260916028 }, { "month": "2033-04", "value": 188140.6167618809 }, { "month": "2033-05", "value": 189042.27390416252 }, { "month": "2033-06", "value": 189948.92218877884 }, { "month": "2033-07", "value": 190860.58645390774 }, { "month": "2033-08", "value": 191777.29170585642 }, { "month": "2033-09", "value": 192699.0631193624 }, { "month": "2033-10", "value": 193625.92603791135 }, { "month": "2033-11", "value": 194557.90597407232 }, { "month": "2033-12", "value": 195495.02860984934 }, { "month": "2034-01", "value": 196437.31979704963 }, { "month": "2034-02", "value": 197384.80555766757 }, { "month": "2034-03", "value": 198337.51208428445 }, { "month": "2034-04", "value": 199295.46574048343 }, { "month": "2034-05", "value": 200258.69306127974 }, { "month": "2034-06", "value": 201227.22075356566 }, { "month": "2034-07", "value": 202201.07569656963 }, { "month": "2034-08", "value": 203180.28494233033 }, { "month": "2034-09", "value": 204164.87571618395 }, { "month": "2034-10", "value": 205154.87541726566 }, { "month": "2034-11", "value": 206150.3116190246 }, { "month": "2034-12", "value": 207151.21206975196 }, { "month": "2035-01", "value": 208157.604693122 }, { "month": "2035-02", "value": 209169.51758874682 }, { "month": "2035-03", "value": 210186.97903274224 }, { "month": "2035-04", "value": 211210.0174783078 }, { "month": "2035-05", "value": 212238.6615563178 }, { "month": "2035-06", "value": 213272.94007592494 }, { "month": "2035-07", "value": 214312.88202517634 }, { "month": "2035-08", "value": 215358.51657164024 }, { "month": "2035-09", "value": 216409.87306304532 }, { "month": "2035-10", "value": 217466.98102793115 }, { "month": "2035-11", "value": 218529.87017630966 }, { "month": "2035-12", "value": 219598.5704003381 }, { "month": "2036-01", "value": 220673.1117750032 }, { "month": "2036-02", "value": 221753.52455881576 }, { "month": "2036-03", "value": 222839.83919451624 }, { "month": "2036-04", "value": 223932.08630979157 }, { "month": "2036-05", "value": 225030.29671800128 }, { "month": "2036-06", "value": 226134.50141891517 }, { "month": "2036-07", "value": 227244.7315994612 }, { "month": "2036-08", "value": 228361.01863448293 }, { "month": "2036-09", "value": 229483.39408750762 }, { "month": "2036-10", "value": 230611.8897115247 }, { "month": "2036-11", "value": 231746.53744977323 }, { "month": "2036-12", "value": 232887.3694365401 }, { "month": "2037-01", "value": 234034.4179979679 }, { "month": "2037-02", "value": 235187.71565287188 }, { "month": "2037-03", "value": 236347.2951135672 }, { "month": "2037-04", "value": 237513.1892867061 }, { "month": "2037-05", "value": 238685.43127412308 }, { "month": "2037-06", "value": 239864.05437369095 }, { "month": "2037-07", "value": 241049.09208018603 }, { "month": "2037-08", "value": 242240.57808616202 }, { "month": "2037-09", "value": 243438.54628283338 }, { "month": "2037-10", "value": 244643.03076096874 }, { "month": "2037-11", "value": 245854.06581179218 }, { "month": "2037-12", "value": 247071.68592789426 }, { "month": "2038-01", "value": 248295.92580415244 }, { "month": "2038-02", "value": 249526.82033865992 }, { "month": "2038-03", "value": 250764.40463366362 }, { "month": "2038-04", "value": 252008.71399651162 }, { "month": "2038-05", "value": 253259.78394060853 }, { "month": "2038-06", "value": 254517.65018638043 }, { "month": "2038-07", "value": 255782.34866224887 }, { "month": "2038-08", "value": 257053.915505613 }, { "month": "2038-09", "value": 258332.38706384043 }, { "month": "2038-10", "value": 259617.7998952681 }, { "month": "2038-11", "value": 260910.1907702103 }, { "month": "2038-12", "value": 262209.5966719761 }, { "month": "2039-01", "value": 263516.05479789583 }, { "month": "2039-02", "value": 264829.6025603557 }, { "month": "2039-03", "value": 266150.27758784103 }, { "month": "2039-04", "value": 267478.11772598856 }, { "month": "2039-05", "value": 268813.1610386474 }, { "month": "2039-06", "value": 270155.4458089476 }, { "month": "2039-07", "value": 271505.0105403787 }, { "month": "2039-08", "value": 272861.89395787596 }, { "month": "2039-09", "value": 274226.13500891573 }, { "month": "2039-10", "value": 275597.77286461863 }, { "month": "2039-11", "value": 276976.8469208623 }, { "month": "2039-12", "value": 278363.39679940196 }, { "month": "2040-01", "value": 279757.46234899975 }, { "month": "2040-02", "value": 281159.0836465628 }, { "month": "2040-03", "value": 282568.3009982897 }, { "month": "2040-04", "value": 283985.15494082536 }, { "month": "2040-05", "value": 285409.68624242523 }, { "month": "2040-06", "value": 286841.9359041268 }, { "month": "2040-07", "value": 288281.94516093074 }, { "month": "2040-08", "value": 289729.75548299076 }, { "month": "2040-09", "value": 291185.40857681044 }, { "month": "2040-10", "value": 292648.94638645084 }, { "month": "2040-11", "value": 294120.4110947452 }, { "month": "2040-12", "value": 295599.84512452263 }, { "month": "2041-01", "value": 297087.291139841 }, { "month": "2041-02", "value": 298582.7920472276 }, { "month": "2041-03", "value": 300086.39099692885 }, { "month": "2041-04", "value": 301598.1313841687 }, { "month": "2041-05", "value": 303118.05685041624 }, { "month": "2041-06", "value": 304646.21128466027 }, { "month": "2041-07", "value": 306182.63882469496 }, { "month": "2041-08", "value": 307727.3838584124 }, { "month": "2041-09", "value": 309280.4910251047 }, { "month": "2041-10", "value": 310842.0052167748 }, { "month": "2041-11", "value": 312411.97157945565 }, { "month": "2041-12", "value": 313990.435514539 }, { "month": "2042-01", "value": 315577.442680112 }, { "month": "2042-02", "value": 317173.0389923037 }, { "month": "2042-03", "value": 318777.2706266397 }, { "month": "2042-04", "value": 320390.1840194056 }, { "month": "2042-05", "value": 322011.82586902025 }, { "month": "2042-06", "value": 323642.2431374171 }, { "month": "2042-07", "value": 325281.4830514347 }, { "month": "2042-08", "value": 326929.5931042165 }, { "month": "2042-09", "value": 328586.6210566193 }, { "month": "2042-10", "value": 330252.61493863136 }, { "month": "2042-11", "value": 331927.62305079855 }, { "month": "2042-12", "value": 333611.69396566076 }, { "month": "2043-01", "value": 335304.8765291967 }, { "month": "2043-02", "value": 337007.21986227814 }, { "month": "2043-03", "value": 338718.7733621333 }, { "month": "2043-04", "value": 340439.5867038196 }, { "month": "2043-05", "value": 342169.7098417056 }, { "month": "2043-06", "value": 343909.1930109618 }, { "month": "2043-07", "value": 345658.08672906214 }, { "month": "2043-08", "value": 347416.441797293 }, { "month": "2043-09", "value": 349184.3093022726 }, { "month": "2043-10", "value": 350961.74061748065 }, { "month": "2043-11", "value": 352748.78740479576 }, { "month": "2043-12", "value": 354545.5016160433 }, { "month": "2044-01", "value": 356351.93549455324 }, { "month": "2044-02", "value": 358168.1415767267 }, { "month": "2044-03", "value": 359994.172693612 }, { "month": "2044-04", "value": 361830.08197249216 }, { "month": "2044-05", "value": 363675.92283847963 }, { "month": "2044-06", "value": 365531.7490161222 }, { "month": "2044-07", "value": 367397.61453101906 }, { "month": "2044-08", "value": 369273.5737114455 }, { "month": "2044-09", "value": 371159.68118998775 }, { "month": "2044-10", "value": 373055.9919051891 }, { "month": "2044-11", "value": 374962.5611032039 }, { "month": "2044-12", "value": 376879.44433946285 }, { "month": "2045-01", "value": 378806.69748034846 }, { "month": "2045-02", "value": 380744.3767048798 }, { "month": "2045-03", "value": 382692.53850640706 }, { "month": "2045-04", "value": 384651.2396943191 }, { "month": "2045-05", "value": 386620.53739575663 }, { "month": "2045-06", "value": 388600.4890573395 }, { "month": "2045-07", "value": 390591.15244690306 }, { "month": "2045-08", "value": 392592.5856552437 }, { "month": "2045-09", "value": 394604.8470978771 }, { "month": "2045-10", "value": 396627.99551680457 }, { "month": "2045-11", "value": 398662.0899822922 }, { "month": "2045-12", "value": 400707.1898946578 }, { "month": "2046-01", "value": 402763.35498607194 }, { "month": "2046-02", "value": 404830.64532236557 }, { "month": "2046-03", "value": 406909.1213048526 }, { "month": "2046-04", "value": 408998.84367215954 }, { "month": "2046-05", "value": 411099.8735020685 }, { "month": "2046-06", "value": 413212.2722133691 }, { "month": "2046-07", "value": 415336.1015677238 }, { "month": "2046-08", "value": 417471.42367154063 }, { "month": "2046-09", "value": 419618.3009778614 }, { "month": "2046-10", "value": 421776.79628825566 }, { "month": "2046-11", "value": 423946.9727547318 }, { "month": "2046-12", "value": 426128.8938816534 }, { "month": "2047-01", "value": 428322.6235276716 }, { "month": "2047-02", "value": 430528.2259076656 }, { "month": "2047-03", "value": 432745.7655946963 }, { "month": "2047-04", "value": 434975.30752197036 }, { "month": "2047-05", "value": 437216.9169848168 }, { "month": "2047-06", "value": 439470.65964267286 }, { "month": "2047-07", "value": 441736.60152108525 }, { "month": "2047-08", "value": 444014.80901371816 }, { "month": "2047-09", "value": 446305.34888437774 }, { "month": "2047-10", "value": 448608.288269045 }, { "month": "2047-11", "value": 450923.6946779225 }, { "month": "2047-12", "value": 453251.63599749055 }, { "month": "2048-01", "value": 455592.18049257883 }, { "month": "2048-02", "value": 457945.3968084463 }, { "month": "2048-03", "value": 460311.35397287644 }, { "month": "2048-04", "value": 462690.1213982821 }, { "month": "2048-05", "value": 465081.76888382394 }, { "month": "2048-06", "value": 467486.3666175399 }, { "month": "2048-07", "value": 469903.9851784896 }, { "month": "2048-08", "value": 472334.6955389071 }, { "month": "2048-09", "value": 474778.5690663692 }, { "month": "2048-10", "value": 477235.67752597615 }, { "month": "2048-11", "value": 479706.0930825431 }, { "month": "2048-12", "value": 482189.8883028047 }, { "month": "2049-01", "value": 484687.13615763455 }, { "month": "2049-02", "value": 487197.9100242738 }, { "month": "2049-03", "value": 489722.2836885757 }, { "month": "2049-04", "value": 492260.331347262 }, { "month": "2049-05", "value": 494812.1276101917 }, { "month": "2049-06", "value": 497377.7475026425 }, { "month": "2049-07", "value": 499957.26646760845 }, { "month": "2049-08", "value": 502550.7603681058 }, { "month": "2049-09", "value": 505158.3054894965 }, { "month": "2049-10", "value": 507779.9785418234 }, { "month": "2049-11", "value": 510415.85666215763 }, { "month": "2049-12", "value": 513066.0174169609 }, { "month": "2050-01", "value": 515730.53880446206 }, { "month": "2050-02", "value": 518409.4992570444 }, { "month": "2050-03", "value": 521102.9776436493 }],
                "standard-deviation-positive-1.645": [{ "month": "2018-03", "value": 100000.0 }, { "month": "2018-04", "value": 106508.13042174283 }, { "month": "2018-05", "value": 109715.61850592002 }, { "month": "2018-06", "value": 112400.70233679775 }, { "month": "2018-07", "value": 114824.60564350782 }, { "month": "2018-08", "value": 117087.86916299742 }, { "month": "2018-09", "value": 119241.76426238904 }, { "month": "2018-10", "value": 121316.59219313544 }, { "month": "2018-11", "value": 123332.00472307864 }, { "month": "2018-12", "value": 125301.59618094424 }, { "month": "2019-01", "value": 127235.22950466933 }, { "month": "2019-02", "value": 129140.32842851727 }, { "month": "2019-03", "value": 131022.646982443 }, { "month": "2019-04", "value": 132886.7533321306 }, { "month": "2019-05", "value": 134736.3476208654 }, { "month": "2019-06", "value": 136574.47843275347 }, { "month": "2019-07", "value": 138403.6947407366 }, { "month": "2019-08", "value": 140226.15535023724 }, { "month": "2019-09", "value": 142043.70949773697 }, { "month": "2019-10", "value": 143857.95736592016 }, { "month": "2019-11", "value": 145670.2962990562 }, { "month": "2019-12", "value": 147481.9566337117 }, { "month": "2020-01", "value": 149294.02985455398 }, { "month": "2020-02", "value": 151107.4909882382 }, { "month": "2020-03", "value": 152923.21661004605 }, { "month": "2020-04", "value": 154741.99946703168 }, { "month": "2020-05", "value": 156564.56046129524 }, { "month": "2020-06", "value": 158391.55855160888 }, { "month": "2020-07", "value": 160223.59899753347 }, { "month": "2020-08", "value": 162061.24027187985 }, { "month": "2020-09", "value": 163904.99989442748 }, { "month": "2020-10", "value": 165755.35938506277 }, { "month": "2020-11", "value": 167612.7684929683 }, { "month": "2020-12", "value": 169477.64882667706 }, { "month": "2021-01", "value": 171350.3969852112 }, { "month": "2021-02", "value": 173231.38727134955 }, { "month": "2021-03", "value": 175120.97405299798 }, { "month": "2021-04", "value": 177019.4938267055 }, { "month": "2021-05", "value": 178927.2670278559 }, { "month": "2021-06", "value": 180844.5996244291 }, { "month": "2021-07", "value": 182771.78452506027 }, { "month": "2021-08", "value": 184709.10282711673 }, { "month": "2021-09", "value": 186656.82492641942 }, { "month": "2021-10", "value": 188615.21150687654 }, { "month": "2021-11", "value": 190584.51442552404 }, { "month": "2021-12", "value": 192564.9775061678 }, { "month": "2022-01", "value": 194556.8372529076 }, { "month": "2022-02", "value": 196560.32349322003 }, { "month": "2022-03", "value": 198575.6599589326 }, { "month": "2022-04", "value": 200603.0648122853 }, { "month": "2022-05", "value": 202642.75112331638 }, { "month": "2022-06", "value": 204694.92730399247 }, { "month": "2022-07", "value": 206759.79750380755 }, { "month": "2022-08", "value": 208837.56197098078 }, { "month": "2022-09", "value": 210928.41738287278 }, { "month": "2022-10", "value": 213032.55714880166 }, { "month": "2022-11", "value": 215150.1716880588 }, { "month": "2022-12", "value": 217281.44868559984 }, { "month": "2023-01", "value": 219426.5733275996 }, { "month": "2023-02", "value": 221585.72851881225 }, { "month": "2023-03", "value": 223759.09508346254 }, { "month": "2023-04", "value": 225946.85195120634 }, { "month": "2023-05", "value": 228149.1763295309 }, { "month": "2023-06", "value": 230366.24386382187 }, { "month": "2023-07", "value": 232598.22878619595 }, { "month": "2023-08", "value": 234845.30405408467 }, { "month": "2023-09", "value": 237107.6414794559 }, { "month": "2023-10", "value": 239385.411849471 }, { "month": "2023-11", "value": 241678.78503929757 }, { "month": "2023-12", "value": 243987.93011772717 }, { "month": "2024-01", "value": 246313.0154461875 }, { "month": "2024-02", "value": 248654.20877168074 }, { "month": "2024-03", "value": 251011.6773141327 }, { "month": "2024-04", "value": 253385.58784859136 }, { "month": "2024-05", "value": 255776.1067826746 }, { "month": "2024-06", "value": 258183.4002296322 }, { "month": "2024-07", "value": 260607.63407735334 }, { "month": "2024-08", "value": 263048.9740536234 }, { "month": "2024-09", "value": 265507.5857879081 }, { "month": "2024-10", "value": 267983.63486991846 }, { "month": "2024-11", "value": 270477.28690518904 }, { "month": "2024-12", "value": 272988.707567885 }, { "month": "2025-01", "value": 275518.06265103194 }, { "month": "2025-02", "value": 278065.5181143513 }, { "month": "2025-03", "value": 280631.2401298655 }, { "month": "2025-04", "value": 283215.39512542804 }, { "month": "2025-05", "value": 285818.14982631843 }, { "month": "2025-06", "value": 288439.67129503266 }, { "month": "2025-07", "value": 291080.1269693909 }, { "month": "2025-08", "value": 293739.684699072 }, { "month": "2025-09", "value": 296418.51278068055 }, { "month": "2025-10", "value": 299116.7799914403 }, { "month": "2025-11", "value": 301834.65562160336 }, { "month": "2025-12", "value": 304572.3095056584 }, { "month": "2026-01", "value": 307329.91205241345 }, { "month": "2026-02", "value": 310107.63427402463 }, { "month": "2026-03", "value": 312905.6478140385 }, { "month": "2026-04", "value": 315724.12497450743 }, { "month": "2026-05", "value": 318563.2387422383 }, { "month": "2026-06", "value": 321423.1628142259 }, { "month": "2026-07", "value": 324304.0716223224 }, { "month": "2026-08", "value": 327206.14035718975 }, { "month": "2026-09", "value": 330129.54499157873 }, { "month": "2026-10", "value": 333074.4623029749 }, { "month": "2026-11", "value": 336041.0698956507 }, { "month": "2026-12", "value": 339029.54622216034 }, { "month": "2027-01", "value": 342040.0706043083 }, { "month": "2027-02", "value": 345072.8232536267 }, { "month": "2027-03", "value": 348127.98529138986 }, { "month": "2027-04", "value": 351205.7387681916 }, { "month": "2027-05", "value": 354306.26668311533 }, { "month": "2027-06", "value": 357429.7530025199 }, { "month": "2027-07", "value": 360576.3826784638 }, { "month": "2027-08", "value": 363746.34166678955 }, { "month": "2027-09", "value": 366939.81694489147 }, { "month": "2027-10", "value": 370156.9965291827 }, { "month": "2027-11", "value": 373398.0694922813 }, { "month": "2027-12", "value": 376663.2259799352 }, { "month": "2028-01", "value": 379952.6572276971 }, { "month": "2028-02", "value": 383266.55557736947 }, { "month": "2028-03", "value": 386605.1144932331 }, { "month": "2028-04", "value": 389968.5285780709 }, { "month": "2028-05", "value": 393356.9935890027 }, { "month": "2028-06", "value": 396770.706453143 }, { "month": "2028-07", "value": 400209.86528309184 }, { "month": "2028-08", "value": 403674.66939227184 }, { "month": "2028-09", "value": 407165.3193101211 }, { "month": "2028-10", "value": 410682.0167971514 }, { "month": "2028-11", "value": 414224.96485988447 }, { "month": "2028-12", "value": 417794.36776567 }, { "month": "2029-01", "value": 421390.4310573991 }, { "month": "2029-02", "value": 425013.3615681188 }, { "month": "2029-03", "value": 428663.3674355571 }, { "month": "2029-04", "value": 432340.6581165626 }, { "month": "2029-05", "value": 436045.44440147164 }, { "month": "2029-06", "value": 439777.9384284038 }, { "month": "2029-07", "value": 443538.3536974964 }, { "month": "2029-08", "value": 447326.9050850818 }, { "month": "2029-09", "value": 451143.8088578157 }, { "month": "2029-10", "value": 454989.2826867588 }, { "month": "2029-11", "value": 458863.54566142114 }, { "month": "2029-12", "value": 462766.8183037716 }, { "month": "2030-01", "value": 466699.322582218 }, { "month": "2030-02", "value": 470661.28192556364 }, { "month": "2030-03", "value": 474652.9212369446 }, { "month": "2030-04", "value": 478674.46690775006 }, { "month": "2030-05", "value": 482726.1468315332 }, { "month": "2030-06", "value": 486808.19041791436 }, { "month": "2030-07", "value": 490920.8286064821 }, { "month": "2030-08", "value": 495064.29388069286 }, { "month": "2030-09", "value": 499238.8202817777 }, { "month": "2030-10", "value": 503444.6434226544 }, { "month": "2030-11", "value": 507682.00050185213 }, { "month": "2030-12", "value": 511951.13031745015 }, { "month": "2031-01", "value": 516252.27328103356 }, { "month": "2031-02", "value": 520585.67143167055 }, { "month": "2031-03", "value": 524951.5684499121 }, { "month": "2031-04", "value": 529350.2096718185 }, { "month": "2031-05", "value": 533781.8421030148 }, { "month": "2031-06", "value": 538246.7144327775 }, { "month": "2031-07", "value": 542745.0770481564 }, { "month": "2031-08", "value": 547277.182048132 }, { "month": "2031-09", "value": 551843.2832578128 }, { "month": "2031-10", "value": 556443.6362426733 }, { "month": "2031-11", "value": 561078.4983228365 }, { "month": "2031-12", "value": 565748.1285874022 }, { "month": "2032-01", "value": 570452.787908822 }, { "month": "2032-02", "value": 575192.7389573264 }, { "month": "2032-03", "value": 579968.2462154032 }, { "month": "2032-04", "value": 584779.5759923293 }, { "month": "2032-05", "value": 589626.9964387602 }, { "month": "2032-06", "value": 594510.7775613754 }, { "month": "2032-07", "value": 599431.1912375863 }, { "month": "2032-08", "value": 604388.511230303 }, { "month": "2032-09", "value": 609383.0132027658 }, { "month": "2032-10", "value": 614414.9747334424 }, { "month": "2032-11", "value": 619484.6753309906 }, { "month": "2032-12", "value": 624592.3964492895 }, { "month": "2033-01", "value": 629738.4215025428 }, { "month": "2033-02", "value": 634923.0358804499 }, { "month": "2033-03", "value": 640146.5269634548 }, { "month": "2033-04", "value": 645409.1841380652 }, { "month": "2033-05", "value": 650711.2988122521 }, { "month": "2033-06", "value": 656053.1644309232 }, { "month": "2033-07", "value": 661435.0764914788 }, { "month": "2033-08", "value": 666857.3325594455 }, { "month": "2033-09", "value": 672320.2322841933 }, { "month": "2033-10", "value": 677824.0774147378 }, { "month": "2033-11", "value": 683369.1718156221 }, { "month": "2033-12", "value": 688955.8214828911 }, { "month": "2034-01", "value": 694584.3345601484 }, { "month": "2034-02", "value": 700255.0213547047 }, { "month": "2034-03", "value": 705968.1943538144 }, { "month": "2034-04", "value": 711724.1682410048 }, { "month": "2034-05", "value": 717523.259912499 }, { "month": "2034-06", "value": 723365.7884937291 }, { "month": "2034-07", "value": 729252.0753559484 }, { "month": "2034-08", "value": 735182.4441329377 }, { "month": "2034-09", "value": 741157.22073781 }, { "month": "2034-10", "value": 747176.7333799141 }, { "month": "2034-11", "value": 753241.3125818379 }, { "month": "2034-12", "value": 759351.2911965133 }, { "month": "2035-01", "value": 765507.0044244229 }, { "month": "2035-02", "value": 771708.7898309112 }, { "month": "2035-03", "value": 777956.9873635998 }, { "month": "2035-04", "value": 784251.9393699099 }, { "month": "2035-05", "value": 790593.9906146888 }, { "month": "2035-06", "value": 796983.4882979492 }, { "month": "2035-07", "value": 803420.7820727145 }, { "month": "2035-08", "value": 809906.2240629756 }, { "month": "2035-09", "value": 816440.168881759 }, { "month": "2035-10", "value": 823022.9736493102 }, { "month": "2035-11", "value": 829654.9980113874 }, { "month": "2035-12", "value": 836336.604157673 }, { "month": "2036-01", "value": 843068.1568403002 }, { "month": "2036-02", "value": 849850.0233924979 }, { "month": "2036-03", "value": 856682.5737473516 }, { "month": "2036-04", "value": 863566.1804566896 }, { "month": "2036-05", "value": 870501.2187100828 }, { "month": "2036-06", "value": 877488.06635397 }, { "month": "2036-07", "value": 884527.1039109088 }, { "month": "2036-08", "value": 891618.7145989452 }, { "month": "2036-09", "value": 898763.2843511106 }, { "month": "2036-10", "value": 905961.2018350493 }, { "month": "2036-11", "value": 913212.8584727654 }, { "month": "2036-12", "value": 920518.6484605053 }, { "month": "2037-01", "value": 927878.9687887668 }, { "month": "2037-02", "value": 935294.2192624394 }, { "month": "2037-03", "value": 942764.8025210763 }, { "month": "2037-04", "value": 950291.1240593003 }, { "month": "2037-05", "value": 957873.5922473455 }, { "month": "2037-06", "value": 965512.6183517273 }, { "month": "2037-07", "value": 973208.6165560586 }, { "month": "2037-08", "value": 980962.0039819983 }, { "month": "2037-09", "value": 988773.2007103354 }, { "month": "2037-10", "value": 996642.6298022232 }, { "month": "2037-11", "value": 1004570.7173205416 }, { "month": "2037-12", "value": 1012557.8923514109 }, { "month": "2038-01", "value": 1020604.5870258475 }, { "month": "2038-02", "value": 1028711.2365415603 }, { "month": "2038-03", "value": 1036878.2791848945 }, { "month": "2038-04", "value": 1045106.1563529253 }, { "month": "2038-05", "value": 1053395.3125756949 }, { "month": "2038-06", "value": 1061746.1955385993 }, { "month": "2038-07", "value": 1070159.2561049303 }, { "month": "2038-08", "value": 1078634.9483385626 }, { "month": "2038-09", "value": 1087173.7295267966 }, { "month": "2038-10", "value": 1095776.0602033539 }, { "month": "2038-11", "value": 1104442.4041715297 }, { "month": "2038-12", "value": 1113173.2285274991 }, { "month": "2039-01", "value": 1121969.0036837826 }, { "month": "2039-02", "value": 1130830.2033928689 }, { "month": "2039-03", "value": 1139757.304770996 }, { "month": "2039-04", "value": 1148750.7883220997 }, { "month": "2039-05", "value": 1157811.137961914 }, { "month": "2039-06", "value": 1166938.841042246 }, { "month": "2039-07", "value": 1176134.388375406 }, { "month": "2039-08", "value": 1185398.274258811 }, { "month": "2039-09", "value": 1194730.9964997482 }, { "month": "2039-10", "value": 1204133.0564403147 }, { "month": "2039-11", "value": 1213604.958982521 }, { "month": "2039-12", "value": 1223147.2126135654 }, { "month": "2040-01", "value": 1232760.3294312842 }, { "month": "2040-02", "value": 1242444.8251697754 }, { "month": "2040-03", "value": 1252201.2192251906 }, { "month": "2040-04", "value": 1262030.0346817102 }, { "month": "2040-05", "value": 1271931.7983376943 }, { "month": "2040-06", "value": 1281907.040732008 }, { "month": "2040-07", "value": 1291956.2961705313 }, { "month": "2040-08", "value": 1302080.1027528509 }, { "month": "2040-09", "value": 1312279.0023991265 }, { "month": "2040-10", "value": 1322553.5408771518 }, { "month": "2040-11", "value": 1332904.267829593 }, { "month": "2040-12", "value": 1343331.7368014182 }, { "month": "2041-01", "value": 1353836.5052675093 }, { "month": "2041-02", "value": 1364419.134660473 }, { "month": "2041-03", "value": 1375080.1903986286 }, { "month": "2041-04", "value": 1385820.2419142013 }, { "month": "2041-05", "value": 1396639.8626817008 }, { "month": "2041-06", "value": 1407539.630246495 }, { "month": "2041-07", "value": 1418520.1262535853 }, { "month": "2041-08", "value": 1429581.9364765738 }, { "month": "2041-09", "value": 1440725.6508468299 }, { "month": "2041-10", "value": 1451951.8634828627 }, { "month": "2041-11", "value": 1463261.1727198882 }, { "month": "2041-12", "value": 1474654.1811396044 }, { "month": "2042-01", "value": 1486131.4956001714 }, { "month": "2042-02", "value": 1497693.7272663927 }, { "month": "2042-03", "value": 1509341.4916401093 }, { "month": "2042-04", "value": 1521075.408590803 }, { "month": "2042-05", "value": 1532896.1023864043 }, { "month": "2042-06", "value": 1544804.2017243218 }, { "month": "2042-07", "value": 1556800.3397626753 }, { "month": "2042-08", "value": 1568885.1541517535 }, { "month": "2042-09", "value": 1581059.2870656783 }, { "month": "2042-10", "value": 1593323.3852342977 }, { "month": "2042-11", "value": 1605678.0999752914 }, { "month": "2042-12", "value": 1618124.0872264986 }, { "month": "2043-01", "value": 1630662.0075784712 }, { "month": "2043-02", "value": 1643292.5263072513 }, { "month": "2043-03", "value": 1656016.3134073694 }, { "month": "2043-04", "value": 1668834.0436250798 }, { "month": "2043-05", "value": 1681746.3964918144 }, { "month": "2043-06", "value": 1694754.0563578752 }, { "month": "2043-07", "value": 1707857.7124263581 }, { "month": "2043-08", "value": 1721058.0587873047 }, { "month": "2043-09", "value": 1734355.7944520975 }, { "month": "2043-10", "value": 1747751.623388092 }, { "month": "2043-11", "value": 1761246.2545534803 }, { "month": "2043-12", "value": 1774840.4019324002 }, { "month": "2044-01", "value": 1788534.7845702923 }, { "month": "2044-02", "value": 1802330.1266094933 }, { "month": "2044-03", "value": 1816227.15732507 }, { "month": "2044-04", "value": 1830226.6111609223 }, { "month": "2044-05", "value": 1844329.227766112 }, { "month": "2044-06", "value": 1858535.7520314532 }, { "month": "2044-07", "value": 1872846.9341263555 }, { "month": "2044-08", "value": 1887263.5295359218 }, { "month": "2044-09", "value": 1901786.2990982991 }, { "month": "2044-10", "value": 1916416.0090422917 }, { "month": "2044-11", "value": 1931153.4310252317 }, { "month": "2044-12", "value": 1945999.3421711084 }, { "month": "2045-01", "value": 1960954.5251089674 }, { "month": "2045-02", "value": 1976019.7680115718 }, { "month": "2045-03", "value": 1991195.8646343309 }, { "month": "2045-04", "value": 2006483.6143544973 }, { "month": "2045-05", "value": 2021883.8222106362 }, { "month": "2045-06", "value": 2037397.2989423643 }, { "month": "2045-07", "value": 2053024.8610303733 }, { "month": "2045-08", "value": 2068767.3307367126 }, { "month": "2045-09", "value": 2084625.5361453698 }, { "month": "2045-10", "value": 2100600.3112031147 }, { "month": "2045-11", "value": 2116692.4957606434 }, { "month": "2045-12", "value": 2132902.9356139833 }, { "month": "2046-01", "value": 2149232.4825462173 }, { "month": "2046-02", "value": 2165681.9943694538 }, { "month": "2046-03", "value": 2182252.3349671364 }, { "month": "2046-04", "value": 2198944.374336595 }, { "month": "2046-05", "value": 2215758.988631938 }, { "month": "2046-06", "value": 2232697.060207204 }, { "month": "2046-07", "value": 2249759.4776598345 }, { "month": "2046-08", "value": 2266947.1358744423 }, { "month": "2046-09", "value": 2284260.936066873 }, { "month": "2046-10", "value": 2301701.7858285853 }, { "month": "2046-11", "value": 2319270.5991713274 }, { "month": "2046-12", "value": 2336968.2965721325 }, { "month": "2047-01", "value": 2354795.80501861 }, { "month": "2047-02", "value": 2372754.058054566 }, { "month": "2047-03", "value": 2390843.9958259324 }, { "month": "2047-04", "value": 2409066.5651270146 }, { "month": "2047-05", "value": 2427422.719447054 }, { "month": "2047-06", "value": 2445913.4190171203 }, { "month": "2047-07", "value": 2464539.630857323 }, { "month": "2047-08", "value": 2483302.328824357 }, { "month": "2047-09", "value": 2502202.4936593603 }, { "month": "2047-10", "value": 2521241.113036123 }, { "month": "2047-11", "value": 2540419.18160962 }, { "month": "2047-12", "value": 2559737.7010648674 }, { "month": "2048-01", "value": 2579197.6801661486 }, { "month": "2048-02", "value": 2598800.1348065445 }, { "month": "2048-03", "value": 2618546.088057827 }, { "month": "2048-04", "value": 2638436.5702207033 }, { "month": "2048-05", "value": 2658472.618875386 }, { "month": "2048-06", "value": 2678655.2789325253 }, { "month": "2048-07", "value": 2698985.6026845044 }, { "month": "2048-08", "value": 2719464.649857062 }, { "month": "2048-09", "value": 2740093.4876613 }, { "month": "2048-10", "value": 2760873.1908460334 }, { "month": "2048-11", "value": 2781804.841750513 }, { "month": "2048-12", "value": 2802889.5303574954 }, { "month": "2049-01", "value": 2824128.3543467056 }, { "month": "2049-02", "value": 2845522.4191486468 }, { "month": "2049-03", "value": 2867072.8379987893 }, { "month": "2049-04", "value": 2888780.731992148 }, { "month": "2049-05", "value": 2910647.2301382064 }, { "month": "2049-06", "value": 2932673.4694162547 }, { "month": "2049-07", "value": 2954860.594831089 }, { "month": "2049-08", "value": 2977209.7594690975 }, { "month": "2049-09", "value": 2999722.124554742 }, { "month": "2049-10", "value": 3022398.859507426 }, { "month": "2049-11", "value": 3045241.1419987585 }, { "month": "2049-12", "value": 3068250.1580102034 }, { "month": "2050-01", "value": 3091427.101891143 }, { "month": "2050-02", "value": 3114773.1764173307 }, { "month": "2050-03", "value": 3138289.5928497524 }],
                "standard-deviation-negative-1.645": [{ "month": "2018-03", "value": 100000.0 }, { "month": "2018-04", "value": 95035.67819906921 }, { "month": "2018-05", "value": 93383.55945580873 }, { "month": "2018-06", "value": 92265.49035837565 }, { "month": "2018-07", "value": 91420.33245977663 }, { "month": "2018-08", "value": 90747.63091924998 }, { "month": "2018-09", "value": 90196.20088426801 }, { "month": "2018-10", "value": 89735.82824077514 }, { "month": "2018-11", "value": 89346.94898555269 }, { "month": "2018-12", "value": 89016.05718617947 }, { "month": "2019-01", "value": 88733.37893719012 }, { "month": "2019-02", "value": 88491.58017747806 }, { "month": "2019-03", "value": 88284.99719547956 }, { "month": "2019-04", "value": 88109.15279371775 }, { "month": "2019-05", "value": 87960.43845154408 }, { "month": "2019-06", "value": 87835.89786656476 }, { "month": "2019-07", "value": 87733.07501130458 }, { "month": "2019-08", "value": 87649.90469427321 }, { "month": "2019-09", "value": 87584.6319661317 }, { "month": "2019-10", "value": 87535.75160932631 }, { "month": "2019-11", "value": 87501.96192751807 }, { "month": "2019-12", "value": 87482.1289197156 }, { "month": "2020-01", "value": 87475.25812935091 }, { "month": "2020-02", "value": 87480.47225530588 }, { "month": "2020-03", "value": 87496.9931502213 }, { "month": "2020-04", "value": 87524.12720233398 }, { "month": "2020-05", "value": 87561.25335722067 }, { "month": "2020-06", "value": 87607.81322122511 }, { "month": "2020-07", "value": 87663.30282242954 }, { "month": "2020-08", "value": 87727.26570331762 }, { "month": "2020-09", "value": 87799.28709221593 }, { "month": "2020-10", "value": 87878.98895535166 }, { "month": "2020-11", "value": 87966.0257728961 }, { "month": "2020-12", "value": 88060.08091418001 }, { "month": "2021-01", "value": 88160.86351186107 }, { "month": "2021-02", "value": 88268.10575400003 }, { "month": "2021-03", "value": 88381.56052807141 }, { "month": "2021-04", "value": 88500.99936286615 }, { "month": "2021-05", "value": 88626.210623757 }, { "month": "2021-06", "value": 88756.99792443216 }, { "month": "2021-07", "value": 88893.17872436965 }, { "month": "2021-08", "value": 89034.58308633305 }, { "month": "2021-09", "value": 89181.05257226153 }, { "month": "2021-10", "value": 89332.439259287 }, { "month": "2021-11", "value": 89488.60486038409 }, { "month": "2021-12", "value": 89649.41993645839 }, { "month": "2022-01", "value": 89814.763188593 }, { "month": "2022-02", "value": 89984.5208207766 }, { "month": "2022-03", "value": 90158.58596478114 }, { "month": "2022-04", "value": 90336.85815999292 }, { "month": "2022-05", "value": 90519.24288196082 }, { "month": "2022-06", "value": 90705.65111424196 }, { "month": "2022-07", "value": 90895.9989588202 }, { "month": "2022-08", "value": 91090.20728096784 }, { "month": "2022-09", "value": 91288.20138493141 }, { "month": "2022-10", "value": 91489.91071726101 }, { "month": "2022-11", "value": 91695.2685949819 }, { "month": "2022-12", "value": 91904.21195613491 }, { "month": "2023-01", "value": 92116.68113049674 }, { "month": "2023-02", "value": 92332.61962853854 }, { "month": "2023-03", "value": 92551.97394689752 }, { "month": "2023-04", "value": 92774.69338882454 }, { "month": "2023-05", "value": 93000.72989823636 }, { "month": "2023-06", "value": 93230.03790614617 }, { "month": "2023-07", "value": 93462.57418837455 }, { "month": "2023-08", "value": 93698.29773355453 }, { "month": "2023-09", "value": 93937.16962054536 }, { "month": "2023-10", "value": 94179.15290445712 }, { "month": "2023-11", "value": 94424.21251056662 }, { "month": "2023-12", "value": 94672.31513547484 }, { "month": "2024-01", "value": 94923.42915491817 }, { "month": "2024-02", "value": 95177.52453770043 }, { "month": "2024-03", "value": 95434.57276526296 }, { "month": "2024-04", "value": 95694.54675645324 }, { "month": "2024-05", "value": 95957.42079709304 }, { "month": "2024-06", "value": 96223.17047398177 }, { "month": "2024-07", "value": 96491.77261300354 }, { "month": "2024-08", "value": 96763.20522103453 }, { "month": "2024-09", "value": 97037.4474313736 }, { "month": "2024-10", "value": 97314.47945244236 }, { "month": "2024-11", "value": 97594.2825195223 }, { "month": "2024-12", "value": 97876.83884931519 }, { "month": "2025-01", "value": 98162.13159713143 }, { "month": "2025-02", "value": 98450.14481652537 }, { "month": "2025-03", "value": 98740.8634212124 }, { "month": "2025-04", "value": 99034.2731491145 }, { "month": "2025-05", "value": 99330.36052839355 }, { "month": "2025-06", "value": 99629.1128453421 }, { "month": "2025-07", "value": 99930.51811401162 }, { "month": "2025-08", "value": 100234.56504746659 }, { "month": "2025-09", "value": 100541.24303056207 }, { "month": "2025-10", "value": 100850.54209414864 }, { "month": "2025-11", "value": 101162.452890617 }, { "month": "2025-12", "value": 101476.96667069971 }, { "month": "2026-01", "value": 101794.07526145373 }, { "month": "2026-02", "value": 102113.77104535329 }, { "month": "2026-03", "value": 102436.04694042697 }, { "month": "2026-04", "value": 102760.89638137726 }, { "month": "2026-05", "value": 103088.31330162608 }, { "month": "2026-06", "value": 103418.2921162324 }, { "month": "2026-07", "value": 103750.82770563233 }, { "month": "2026-08", "value": 104085.9154001554 }, { "month": "2026-09", "value": 104423.55096527339 }, { "month": "2026-10", "value": 104763.73058754127 }, { "month": "2026-11", "value": 105106.45086119226 }, { "month": "2026-12", "value": 105451.70877535145 }, { "month": "2027-01", "value": 105799.50170183451 }, { "month": "2027-02", "value": 106149.82738350076 }, { "month": "2027-03", "value": 106502.68392313056 }, { "month": "2027-04", "value": 106858.06977280049 }, { "month": "2027-05", "value": 107215.98372372951 }, { "month": "2027-06", "value": 107576.4248965728 }, { "month": "2027-07", "value": 107939.39273213965 }, { "month": "2027-08", "value": 108304.88698251462 }, { "month": "2027-09", "value": 108672.90770256153 }, { "month": "2027-10", "value": 109043.45524179109 }, { "month": "2027-11", "value": 109416.53023657459 }, { "month": "2027-12", "value": 109792.13360268663 }, { "month": "2028-01", "value": 110170.26652816105 }, { "month": "2028-02", "value": 110550.93046644478 }, { "month": "2028-03", "value": 110934.12712983586 }, { "month": "2028-04", "value": 111319.85848319202 }, { "month": "2028-05", "value": 111708.12673789689 }, { "month": "2028-06", "value": 112098.93434607254 }, { "month": "2028-07", "value": 112492.28399502633 }, { "month": "2028-08", "value": 112888.17860192193 }, { "month": "2028-09", "value": 113286.621308664 }, { "month": "2028-10", "value": 113687.61547698715 }, { "month": "2028-11", "value": 114091.16468373993 }, { "month": "2028-12", "value": 114497.27271635541 }, { "month": "2029-01", "value": 114905.94356849993 }, { "month": "2029-02", "value": 115317.18143589274 }, { "month": "2029-03", "value": 115730.99071228835 }, { "month": "2029-04", "value": 116147.3759856156 }, { "month": "2029-05", "value": 116566.34203426601 }, { "month": "2029-06", "value": 116987.89382352564 }, { "month": "2029-07", "value": 117412.0365021439 }, { "month": "2029-08", "value": 117838.7753990345 }, { "month": "2029-09", "value": 118268.11602010204 }, { "month": "2029-10", "value": 118700.06404519 }, { "month": "2029-11", "value": 119134.62532514468 }, { "month": "2029-12", "value": 119571.80587899071 }, { "month": "2030-01", "value": 120011.61189121337 }, { "month": "2030-02", "value": 120454.04970914399 }, { "month": "2030-03", "value": 120899.12584044371 }, { "month": "2030-04", "value": 121346.8469506823 }, { "month": "2030-05", "value": 121797.21986100826 }, { "month": "2030-06", "value": 122250.25154590643 }, { "month": "2030-07", "value": 122705.94913103995 }, { "month": "2030-08", "value": 123164.31989117352 }, { "month": "2030-09", "value": 123625.37124817459 }, { "month": "2030-10", "value": 124089.11076908992 }, { "month": "2030-11", "value": 124555.54616429415 }, { "month": "2030-12", "value": 125024.68528570877 }, { "month": "2031-01", "value": 125496.53612508764 }, { "month": "2031-02", "value": 125971.10681236745 }, { "month": "2031-03", "value": 126448.40561408091 }, { "month": "2031-04", "value": 126928.44093182984 }, { "month": "2031-05", "value": 127411.2213008163 }, { "month": "2031-06", "value": 127896.75538843003 }, { "month": "2031-07", "value": 128385.05199288976 }, { "month": "2031-08", "value": 128876.12004193668 }, { "month": "2031-09", "value": 129369.96859157864 }, { "month": "2031-10", "value": 129866.6068248827 }, { "month": "2031-11", "value": 130366.04405081477 }, { "month": "2031-12", "value": 130868.28970312512 }, { "month": "2032-01", "value": 131373.3533392772 }, { "month": "2032-02", "value": 131881.2446394196 }, { "month": "2032-03", "value": 132391.97340539863 }, { "month": "2032-04", "value": 132905.54955981104 }, { "month": "2032-05", "value": 133421.98314509485 }, { "month": "2032-06", "value": 133941.28432265797 }, { "month": "2032-07", "value": 134463.46337204223 }, { "month": "2032-08", "value": 134988.5306901229 }, { "month": "2032-09", "value": 135516.49679034165 }, { "month": "2032-10", "value": 136047.3723019728 }, { "month": "2032-11", "value": 136581.1679694207 }, { "month": "2032-12", "value": 137117.89465154844 }, { "month": "2033-01", "value": 137657.56332103617 }, { "month": "2033-02", "value": 138200.18506376864 }, { "month": "2033-03", "value": 138745.7710782505 }, { "month": "2033-04", "value": 139294.3326750492 }, { "month": "2033-05", "value": 139845.8812762643 }, { "month": "2033-06", "value": 140400.4284150224 }, { "month": "2033-07", "value": 140957.98573499726 }, { "month": "2033-08", "value": 141518.5649899538 }, { "month": "2033-09", "value": 142082.17804331615 }, { "month": "2033-10", "value": 142648.83686775833 }, { "month": "2033-11", "value": 143218.55354481726 }, { "month": "2033-12", "value": 143791.34026452745 }, { "month": "2034-01", "value": 144367.2093250768 }, { "month": "2034-02", "value": 144946.1731324829 }, { "month": "2034-03", "value": 145528.24420028925 }, { "month": "2034-04", "value": 146113.43514928085 }, { "month": "2034-05", "value": 146701.758707219 }, { "month": "2034-06", "value": 147293.22770859415 }, { "month": "2034-07", "value": 147887.8550943968 }, { "month": "2034-08", "value": 148485.65391190618 }, { "month": "2034-09", "value": 149086.6373144956 }, { "month": "2034-10", "value": 149690.81856145465 }, { "month": "2034-11", "value": 150298.2110178275 }, { "month": "2034-12", "value": 150908.82815426716 }, { "month": "2035-01", "value": 151522.68354690494 }, { "month": "2035-02", "value": 152139.7908772353 }, { "month": "2035-03", "value": 152760.16393201484 }, { "month": "2035-04", "value": 153383.81660317662 }, { "month": "2035-05", "value": 154010.76288775742 }, { "month": "2035-06", "value": 154641.01688783924 }, { "month": "2035-07", "value": 155274.5928105046 }, { "month": "2035-08", "value": 155911.5049678039 }, { "month": "2035-09", "value": 156551.76777673638 }, { "month": "2035-10", "value": 157195.39575924366 }, { "month": "2035-11", "value": 157842.403542215 }, { "month": "2035-12", "value": 158492.80585750463 }, { "month": "2036-01", "value": 159146.61754196158 }, { "month": "2036-02", "value": 159803.85353746987 }, { "month": "2036-03", "value": 160464.52889100066 }, { "month": "2036-04", "value": 161128.65875467553 }, { "month": "2036-05", "value": 161796.25838584005 }, { "month": "2036-06", "value": 162467.34314714815 }, { "month": "2036-07", "value": 163141.92850665728 }, { "month": "2036-08", "value": 163820.0300379331 }, { "month": "2036-09", "value": 164501.66342016446 }, { "month": "2036-10", "value": 165186.8444382886 }, { "month": "2036-11", "value": 165875.58898312502 }, { "month": "2036-12", "value": 166567.9130515197 }, { "month": "2037-01", "value": 167263.83274649817 }, { "month": "2037-02", "value": 167963.36427742787 }, { "month": "2037-03", "value": 168666.52396018914 }, { "month": "2037-04", "value": 169373.32821735568 }, { "month": "2037-05", "value": 170083.79357838279 }, { "month": "2037-06", "value": 170797.9366798047 }, { "month": "2037-07", "value": 171515.7742654406 }, { "month": "2037-08", "value": 172237.32318660786 }, { "month": "2037-09", "value": 172962.60040234422 }, { "month": "2037-10", "value": 173691.6229796379 }, { "month": "2037-11", "value": 174424.4080936653 }, { "month": "2037-12", "value": 175160.97302803613 }, { "month": "2038-01", "value": 175901.33517504737 }, { "month": "2038-02", "value": 176645.5120359434 }, { "month": "2038-03", "value": 177393.52122118414 }, { "month": "2038-04", "value": 178145.380450721 }, { "month": "2038-05", "value": 178901.10755427898 }, { "month": "2038-06", "value": 179660.72047164664 }, { "month": "2038-07", "value": 180424.2372529729 }, { "month": "2038-08", "value": 181191.6760590711 }, { "month": "2038-09", "value": 181963.055161729 }, { "month": "2038-10", "value": 182738.39294402656 }, { "month": "2038-11", "value": 183517.70790066005 }, { "month": "2038-12", "value": 184301.01863827227 }, { "month": "2039-01", "value": 185088.34387579028 }, { "month": "2039-02", "value": 185879.70244476877 }, { "month": "2039-03", "value": 186675.11328973985 }, { "month": "2039-04", "value": 187474.59546856987 }, { "month": "2039-05", "value": 188278.16815282186 }, { "month": "2039-06", "value": 189085.8506281241 }, { "month": "2039-07", "value": 189897.66229454527 }, { "month": "2039-08", "value": 190713.62266697543 }, { "month": "2039-09", "value": 191533.7513755128 }, { "month": "2039-10", "value": 192358.068165857 }, { "month": "2039-11", "value": 193186.59289970764 }, { "month": "2039-12", "value": 194019.34555516916 }, { "month": "2040-01", "value": 194856.3462271612 }, { "month": "2040-02", "value": 195697.6151278351 }, { "month": "2040-03", "value": 196543.1725869954 }, { "month": "2040-04", "value": 197393.03905252786 }, { "month": "2040-05", "value": 198247.23509083255 }, { "month": "2040-06", "value": 199105.7813872625 }, { "month": "2040-07", "value": 199968.6987465681 }, { "month": "2040-08", "value": 200836.00809334713 }, { "month": "2040-09", "value": 201707.73047249974 }, { "month": "2040-10", "value": 202583.88704968928 }, { "month": "2040-11", "value": 203464.4991118086 }, { "month": "2040-12", "value": 204349.58806745103 }, { "month": "2041-01", "value": 205239.17544738768 }, { "month": "2041-02", "value": 206133.28290504921 }, { "month": "2041-03", "value": 207031.93221701315 }, { "month": "2041-04", "value": 207935.14528349665 }, { "month": "2041-05", "value": 208842.9441288544 }, { "month": "2041-06", "value": 209755.35090208118 }, { "month": "2041-07", "value": 210672.3878773203 }, { "month": "2041-08", "value": 211594.07745437685 }, { "month": "2041-09", "value": 212520.4421592362 }, { "month": "2041-10", "value": 213451.50464458737 }, { "month": "2041-11", "value": 214387.2876903516 }, { "month": "2041-12", "value": 215327.8142042162 }, { "month": "2042-01", "value": 216273.10722217287 }, { "month": "2042-02", "value": 217223.1899090617 }, { "month": "2042-03", "value": 218178.08555912017 }, { "month": "2042-04", "value": 219137.81759653598 }, { "month": "2042-05", "value": 220102.40957600664 }, { "month": "2042-06", "value": 221071.88518330263 }, { "month": "2042-07", "value": 222046.26823583627 }, { "month": "2042-08", "value": 223025.58268323488 }, { "month": "2042-09", "value": 224009.85260791998 }, { "month": "2042-10", "value": 224999.1022256899 }, { "month": "2042-11", "value": 225993.35588630856 }, { "month": "2042-12", "value": 226992.6380740986 }, { "month": "2043-01", "value": 227996.97340853943 }, { "month": "2043-02", "value": 229006.38664487048 }, { "month": "2043-03", "value": 230020.90267469853 }, { "month": "2043-04", "value": 231040.54652661123 }, { "month": "2043-05", "value": 232065.34336679397 }, { "month": "2043-06", "value": 233095.3184996529 }, { "month": "2043-07", "value": 234130.4973684422 }, { "month": "2043-08", "value": 235170.90555589617 }, { "month": "2043-09", "value": 236216.5687848662 }, { "month": "2043-10", "value": 237267.51291896307 }, { "month": "2043-11", "value": 238323.7639632035 }, { "month": "2043-12", "value": 239385.34806466172 }, { "month": "2044-01", "value": 240452.29151312617 }, { "month": "2044-02", "value": 241524.62074176062 }, { "month": "2044-03", "value": 242602.36232777056 }, { "month": "2044-04", "value": 243685.54299307422 }, { "month": "2044-05", "value": 244774.18960497837 }, { "month": "2044-06", "value": 245868.3291768591 }, { "month": "2044-07", "value": 246967.98886884763 }, { "month": "2044-08", "value": 248073.19598852092 }, { "month": "2044-09", "value": 249183.97799159636 }, { "month": "2044-10", "value": 250300.362482633 }, { "month": "2044-11", "value": 251422.37721573576 }, { "month": "2044-12", "value": 252550.05009526608 }, { "month": "2045-01", "value": 253683.40917655677 }, { "month": "2045-02", "value": 254822.48266663152 }, { "month": "2045-03", "value": 255967.29892492955 }, { "month": "2045-04", "value": 257117.88646403613 }, { "month": "2045-05", "value": 258274.27395041575 }, { "month": "2045-06", "value": 259436.49020515275 }, { "month": "2045-07", "value": 260604.56420469505 }, { "month": "2045-08", "value": 261778.5250816042 }, { "month": "2045-09", "value": 262958.40212530864 }, { "month": "2045-10", "value": 264144.2247828642 }, { "month": "2045-11", "value": 265336.02265971754 }, { "month": "2045-12", "value": 266533.8255204755 }, { "month": "2046-01", "value": 267737.66328967985 }, { "month": "2046-02", "value": 268947.56605258567 }, { "month": "2046-03", "value": 270163.5640559467 }, { "month": "2046-04", "value": 271385.6877088035 }, { "month": "2046-05", "value": 272613.96758327895 }, { "month": "2046-06", "value": 273848.43441537657 }, { "month": "2046-07", "value": 275089.1191057859 }, { "month": "2046-08", "value": 276336.0527206913 }, { "month": "2046-09", "value": 277589.26649258746 }, { "month": "2046-10", "value": 278848.79182109813 }, { "month": "2046-11", "value": 280114.6602738022 }, { "month": "2046-12", "value": 281386.90358706244 }, { "month": "2047-01", "value": 282665.55366686214 }, { "month": "2047-02", "value": 283950.64258964406 }, { "month": "2047-03", "value": 285242.2026031568 }, { "month": "2047-04", "value": 286540.2661273056 }, { "month": "2047-05", "value": 287844.86575500824 }, { "month": "2047-06", "value": 289156.03425305546 }, { "month": "2047-07", "value": 290473.8045629791 }, { "month": "2047-08", "value": 291798.20980192185 }, { "month": "2047-09", "value": 293129.28326351574 }, { "month": "2047-10", "value": 294467.05841876403 }, { "month": "2047-11", "value": 295811.5689169289 }, { "month": "2047-12", "value": 297162.8485864241 }, { "month": "2048-01", "value": 298520.9314357139 }, { "month": "2048-02", "value": 299885.85165421636 }, { "month": "2048-03", "value": 301257.6436132127 }, { "month": "2048-04", "value": 302636.34186676185 }, { "month": "2048-05", "value": 304021.9811526206 }, { "month": "2048-06", "value": 305414.5963931684 }, { "month": "2048-07", "value": 306814.2226963394 }, { "month": "2048-08", "value": 308220.89535655803 }, { "month": "2048-09", "value": 309634.64985568094 }, { "month": "2048-10", "value": 311055.5218639453 }, { "month": "2048-11", "value": 312483.5472409213 }, { "month": "2048-12", "value": 313918.76203647046 }, { "month": "2049-01", "value": 315361.2024917112 }, { "month": "2049-02", "value": 316810.9050399869 }, { "month": "2049-03", "value": 318267.906307843 }, { "month": "2049-04", "value": 319732.24311600754 }, { "month": "2049-05", "value": 321203.9524803788 }, { "month": "2049-06", "value": 322683.07161301625 }, { "month": "2049-07", "value": 324169.6379231413 }, { "month": "2049-08", "value": 325663.68901813944 }, { "month": "2049-09", "value": 327165.2627045713 }, { "month": "2049-10", "value": 328674.39698918833 }, { "month": "2049-11", "value": 330191.1300799544 }, { "month": "2049-12", "value": 331715.50038707274 }, { "month": "2050-01", "value": 333247.54652402026 }, { "month": "2050-02", "value": 334787.3073085861 }, { "month": "2050-03", "value": 336334.82176391716 }]
            };

            var Allocation_Sample = {
                'allocation': [
                    { 'code': '6314', 'name': '瑞銀中國精選股票基金', 'amount': 2000, 'weight': 10.0, 'sector-sub': '全球債' },
                    { 'code': '6006', 'name': '霸菱大東協基金', 'amount': 2000, 'weight': 11.0, 'sector-sub': '全球債' },
                    { 'code': '6153', 'name': '貝萊德世界科技美元', 'amount': 2000, 'weight': 12.0, 'sector-sub': '資訊科技' },
                    { 'code': 'B190', 'name': '摩根美國科技基金', 'amount': 2000, 'weight': 16.0, 'sector-sub': '資訊科技' },
                    { 'code': '5101', 'name': '摩根東協基金', 'amount': 2000, 'weight': 7.0, 'sector-sub': '全球高息股' },
                    { 'code': '5183', 'name': '摩根東協基金澳幣', 'amount': 200000, 'weight': 2.0, 'sector-sub': '全球高息股' },
                    { 'code': '6303', 'name': '瑞銀保健股票基金', 'amount': 250000, 'weight': 12.0, 'sector-sub': '全球股' },
                    { 'code': '5932', 'name': '聯博新市多元收益A歐', 'amount': 175000, 'weight': 20.0, 'sector-sub': '新興市場企業債' },
                    { 'code': '1721', 'name': '安聯收益成長月收美元', 'amount': 50000, 'weight': 1.0, 'sector-sub': '小市場' },
                    { 'code': '1722', 'name': 'VanguardETC', 'amount': 2000, 'weight': 9.0, 'sector-sub': '全球股' }
                ]
            };

            var Historical_Sample = {
                "return-rate": [
                    { 'year': 2003, 'rate': 26.65 },
                    { 'year': 2004, 'rate': 3.81 },
                    { 'year': 2005, 'rate': 6.06 },
                    { 'year': 2006, 'rate': 13.51 },
                    { 'year': 2007, 'rate': 3.88 },
                    { 'year': 2008, 'rate': -35.33 },
                    { 'year': 2009, 'rate': 26.98 },
                    { 'year': 2010, 'rate': 3.84 },
                    { 'year': 2011, 'rate': 5.48 },
                    { 'year': 2012, 'rate': 10.79 },
                    { 'year': 2013, 'rate': 30.05 },
                    { 'year': 2014, 'rate': 17.61 },
                    { 'year': 2015, 'rate': 2.36 },
                    { 'year': 2016, 'rate': 4.31 },
                    { 'year': 2017, 'rate': 7.03 }
                ],
                "averages-rate": 0.08468640379
            };

            //display data
            var message_str, year_dollar, month_dollar, amount_dollar, total_amount, now_kyc_level;

            //search_mode (1:Kyper, 2:Nutmeg)
            $('.good').removeClass('color_1 color_2');
            $('.averages').removeClass('color_1 color_2');
            $('#startYear').removeClass('color_1 color_2');
            $('#endYear').removeClass('color_1 color_2');
            $('#search_mode_keeper').removeClass('color_1 color_2');
            $('.btn_container button').removeClass("color_1 color_2");
            $('.panel .content').removeClass("color_1 color_2");
            if (parseInt(ajax_search_mode, 10) == 1) {
                $('.event_btn span').text('即將開賣');
                $('#talk_icon').attr('src','svg/role_cube/robot_kyper.svg');
                $('.good').addClass('color_1');
                $('.averages').addClass('color_1');
                $('#startYear').addClass('color_1');
                $('#endYear').addClass('color_1');
                $('#search_mode_keeper').addClass('color_1');
                $('.btn_container button').addClass("color_1");
                $('.panel .content').addClass("color_1");
                $('#search_mode_1').show();
                $('#search_mode_2').hide();
            } else {
                $('.event_btn span').text('我要申購');
                $('#talk_icon').attr('src','svg/role_cube/robot_nutmeg.svg');
                $('.good').addClass('color_2');
                $('.averages').addClass('color_2');
                $('#startYear').addClass('color_2');
                $('#endYear').addClass('color_2');
                $('#search_mode_keeper').addClass('color_2');
                $('.btn_container button').addClass("color_2");
                $('.panel .content').addClass("color_2");
                $('#search_mode_1').hide();
                $('#search_mode_2').show();
            }

            //kyc_level
            if(post_kyc <= 118){
                now_kyc_level = 1;
            }else if (post_kyc > 118 && post_kyc <= 254){
                now_kyc_level = 2;
            }else if (post_kyc > 254 && post_kyc <= 362){
                now_kyc_level = 3;
            }else if (post_kyc > 362){
                now_kyc_level = 4;
            }

            //mode (1:一筆錢一次投入, 2:每個月定期投資, 3:先一筆錢一次投入，之後每個月定期投資)
            switch (parseInt(ajax_mode, 10)) {
                case 2:
                    month_dollar = parseInt(ajax_perMonth, 10);
                    amount_dollar = parseInt(ajax_amount, 10) * 10000;
                    message_str ='你是屬於<span class="color_'+ajax_search_mode+'" id="message_mode">'+kyc_level[now_kyc_level]+'</span>的投資人<br/>你希望：<br/>每月投入USD' + number_format(month_dollar, 0, ".", ",") + '，用<span class="color_'+ajax_search_mode+'" id="message_years">'+ajax_years+'</span>年的時間，能夠累積到<span class="color_'+ajax_search_mode+'" id="message_target">USD' + number_format(amount_dollar, 0, ".", ",") + '</span>，<br/>來完成<span class="color_'+ajax_search_mode+'" id="message_purpose">'+purpose[post_purpose]+'</span>的目標。';
                    break;
                case 1:
                    year_dollar = parseInt(ajax_once, 10) * 10000;
                    amount_dollar = parseInt(ajax_amount, 10) * 10000;
                    message_str ='你是屬於<span class="color_'+ajax_search_mode+'" id="message_mode">'+kyc_level[now_kyc_level]+'</span>的投資人<br/>你希望：<br/>一筆錢一次投入USD' + number_format(year_dollar, 0, ".", ",") + '，用<span class="color_'+ajax_search_mode+'" id="message_years">'+ajax_years+'</span>年的時間，能夠累積到<span class="color_'+ajax_search_mode+'" id="message_target">USD' + number_format(amount_dollar, 0, ".", ",") + '</span>，<br/>來完成<span class="color_'+ajax_search_mode+'" id="message_purpose">'+purpose[post_purpose]+'</span>的目標。';
                    break;
                case 3:
                    year_dollar = parseInt(ajax_mix_once, 10) * 10000;
                    month_dollar = parseInt(ajax_mix_perMonth, 10);
                    amount_dollar = parseInt(ajax_amount, 10) * 10000;
                    message_str ='你是屬於<span class="color_'+ajax_search_mode+'" id="message_mode">'+kyc_level[now_kyc_level]+'</span>的投資人<br/>你希望：<br/>先一筆錢一次投入USD' + number_format(year_dollar, 0, ".", ",") + '，之後每個月定期投資USD' + number_format(month_dollar, 0, ".", ",") + '</span>，用<span class="color_'+ajax_search_mode+'" id="message_years">'+ajax_years+'</span>年的時間，能夠累積到<span class="color_'+ajax_search_mode+'" id="message_target">USD' + number_format(amount_dollar, 0, ".", ",") + '</span>，<br/>來完成<span class="color_'+ajax_search_mode+'" id="message_purpose">'+purpose[post_purpose]+'</span>的目標。';
                    break;
            }

            $('#message_str').html(message_str);
            draw_projection_chart(Projection_Sample, parseInt(ajax_search_mode, 10), parseInt(ajax_mode, 10), parseInt(ajax_years, 10), year_dollar, month_dollar);
            draw_historical_chart(Historical_Sample, parseInt(ajax_search_mode, 10));
            draw_allocation_chart(Allocation_Sample, parseInt(ajax_search_mode, 10));
            $(".loading").fadeOut("slow");
        }
    }

    //listen ===================================================================================
    //////////
    //window//
    //////////
    var auto_scroll = false;
    $(window).on("scroll", function() {
        if (!auto_scroll) {
            var section_ar = [0, $("#allocation_chart_section").offset().top - $('#adjust_panel_section').offset().top, $("#projection_chart_section").offset().top - $('#adjust_panel_section').offset().top, $("#historical_chart_section").offset().top - $('#adjust_panel_section').offset().top];
            var now_section;
            var scroll_total = $(document).innerHeight();
            if (scroll_total - ($(window).height() + $(document).scrollTop()) === 0) {
                now_section = section_ar.length - 1;
            }else{
                for (var num = 0; num < section_ar.length; num++) {
                    if (num == 0) {
                        if ($(document).scrollTop() < section_ar[num + 1]) {
                            now_section = num;
                            break;
                        }
                    } else if (num == section_ar.length - 1) {
                        if ($(document).scrollTop() >= section_ar[num]) {
                            now_section = num;
                            break;
                        }
                    } else {
                        if ($(document).scrollTop() >= section_ar[num] && $(document).scrollTop() < section_ar[num + 1]) {
                            now_section = num;
                            break;
                        }
                    }
                }
            }
            $('.sub_menu li').each(function(index) {
                if (index == now_section) {
                    if(!$(this).hasClass("active")){
                        $(this).addClass("active");
                        if(isBreakPoint(600)){
                            var li_po = $(this).position();
                            $('.sub_menu').animate({
                                scrollLeft: li_po.left
                            }, 400, function() {
                                auto_scroll = false;
                            });
                        }
                    }
                } else {
                    if($(this).hasClass("active")){
                        $(this).removeClass("active");
                    }
                }
            });
        }
    }).scroll();
    $(window).on("resize", window_resize);
    ////////////////
    //adjust_panel//
    ////////////////
    $('.sub_header').on('click', function(event){
        trigger_slide_mennu();
    });
    $('.btn_container button').on('click', function(event) {
        get_ajax_search_data();
    });
    ////////////
    //sub_menu//
    ////////////
    $('.sub_menu li').on("click", function(event) {
        var target_index = $(this).index();
        $(this).parent().children("li").each(function(index) {
            if (index == target_index) {
                $(this).addClass("active");
            } else {
                $(this).removeClass("active");
            }
        });
        auto_scroll = true;
        $('html, body').animate({
            scrollTop: $("#" + $(this).attr('scrollto')).offset().top - $('#adjust_panel_section').offset().top
        }, 1000, function() {
            auto_scroll = false;
        });
    });
    ////////////
    //dropdown//
    ////////////
    $('.dropdown.info label').on('click', function(event) {
        switch($(this).text()){
            case '投資術':window.open('index.html#professional');
                          break;
            case '投組風險偏好': $.fancybox.open({
                                    src  : 'iframe_risk_attributes.html?level='+$("#risk_keeper").attr('pure_value'),
                                    type : 'iframe',
                                    opts : {
                                        toolbar: false,
                                        smallBtn: true,
                                        baseClass: 'alert'
                                    }
                                });
                               break;
        }
    });
    $('.dropdown button').on('click', function(event) {
        if ($(this).parent().hasClass('active')) {
            $(this).siblings('ul').slideUp();
            $(this).parent().removeClass('active');
        } else {
            $(this).parent().not('.disable').children('ul').slideDown();
            $(this).parent().addClass('active');
        }
    });

    $('.dropdown').on('mouseleave', function(event) {
        $(this).children('ul').slideUp();
        $(this).removeClass('active');
    });

    $('.dropdown ul li').on('click', function(event) {
        if ($(this).parent().parent().children('button').children('input').length) {
            set_select_value('#' + $(this).parent().parent().children('button').children('input').attr('id'), $(this).children('a').attr('value'));
        } else {
            set_select_value('#' + $(this).parent().parent().children('button').children('textarea').attr('id'), $(this).children('a').attr('value'));
        }
        $(this).parent().slideUp();
        $(this).parent().parent().removeClass('active');
    });
    /////////////
    //textinput//
    /////////////
    var recover_timeout;
    $('.textinput input').on('focus', function(event) {
        $(this).removeClass('placeholder');
        $(this).parent().parent().addClass("focus");
        if ($(this).parent().parent().not('.disable').length) {
            $(this).val('');
            $(this).parent().parent().removeClass('error');
        }
    });
    $('.textinput input').on('blur', function(event) {
        $(this).parent().parent().removeClass("focus");
        if ($(this).parent().parent().not('.disable').length) {
            var patt = /^\d+$/,
                show_error = true,
                show_new_value = true;
            switch ($(this).attr('id')) {
                case 'amount_keeper':
                    if ($(this).val() == '') {
                        if ($(this).attr('old_value') == "---" || (patt.test($(this).attr('old_value')) && (parseInt($(this).attr('old_value'), 10) > 4 && parseInt($(this).attr('old_value'), 10) <= post_max_amount))) {
                            show_error = false;
                        } else {
                            $(this).attr('old_value', '---');
                        }
                        show_new_value = false;
                    }else {
                        if (patt.test($(this).val()) && (parseInt($(this).val(), 10) > 4 && parseInt($(this).val(), 10) <= post_max_amount)) {
                            show_error = false;
                        }
                        if ($(this).attr('old_value') == $(this).val()) {
                            show_new_value = false;
                        }
                    }
                    break;
                case 'years_keeper':
                    if ($(this).val() == '') {
                        if (patt.test($(this).attr('old_value')) && (parseInt($(this).attr('old_value'), 10) > 2 && parseInt($(this).attr('old_value'), 10) < 31)) {
                            show_error = false;
                        } else {
                            $(this).attr('old_value', '---');
                        }
                        show_new_value = false;
                    } else {
                        if (patt.test($(this).val()) && (parseInt($(this).val(), 10) > 2 && parseInt($(this).val(), 10) < 31)) {
                            $(this).attr('old_value', $(this).val());
                            show_error = false;
                        }
                        if ($(this).attr('old_value') == $(this).val()) {
                            show_new_value = false;
                        }
                    }
                    break;
                case 'once_keeper':
                    if ($(this).val() == '') {
                        if (patt.test($(this).attr('old_value')) && (parseInt($(this).attr('old_value'), 10) > 1 && parseInt($(this).attr('old_value'), 10) <= 1000)) {
                            show_error = false;
                        } else {
                            $(this).attr('old_value', '---');
                        }
                        show_new_value = false;
                    } else {
                        if (patt.test($(this).val()) && (parseInt($(this).val(), 10) > 1 && parseInt($(this).val(), 10) <= 1000)) {
                            $(this).attr('old_value', $(this).val());
                            show_error = false;
                        }
                        if ($(this).attr('old_value') == $(this).val()) {
                            show_new_value = false;
                        }
                    }
                    break;
                case 'perMonth_keeper':
                    if ($(this).val() == '') {
                        if (patt.test($(this).attr('old_value')) && (parseInt($(this).attr('old_value'), 10) > 2999 && parseInt($(this).attr('old_value'), 10) <= 1000000) && parseInt($(this).attr('old_value'), 10) % 1000 == 0) {
                            show_error = false;
                        } else {
                            $(this).attr('old_value', '---');
                        }
                        show_new_value = false;
                    } else {
                        if (patt.test($(this).val()) && (parseInt($(this).val(), 10) > 2999 && parseInt($(this).val(), 10) <= 1000000) && parseInt($(this).val(), 10) % 1000 == 0) {
                            $(this).attr('old_value', $(this).val());
                            show_error = false;
                        }
                        if ($(this).attr('old_value') == $(this).val()) {
                            show_new_value = false;
                        }
                    }
                    break;
                case 'mix_once_keeper':
                    if ($(this).val() == '') {
                        if (patt.test($(this).attr('old_value')) && (parseInt($(this).attr('old_value'), 10) > 1 && parseInt($(this).attr('old_value'), 10) <= 1000)) {
                            show_error = false;
                        } else {
                            $(this).attr('old_value', '---');
                        }
                        show_new_value = false;
                    } else {
                        if (patt.test($(this).val()) && (parseInt($(this).val(), 10) > 1 && parseInt($(this).val(), 10) <= 1000)) {
                            $(this).attr('old_value', $(this).val());
                            show_error = false;
                        }
                        if ($(this).attr('old_value') == $(this).val()) {
                            show_new_value = false;
                        }
                    }
                    break;
                case 'mix_perMonth_keeper':
                    if ($(this).val() == '') {
                        if (patt.test($(this).attr('old_value')) && (parseInt($(this).attr('old_value'), 10) > 2999 && parseInt($(this).attr('old_value'), 10) <= 1000000) && parseInt($(this).attr('old_value'), 10) % 1000 == 0) {
                            show_error = false;
                        } else {
                            $(this).attr('old_value', '---');
                        }
                        show_new_value = false;
                    } else {
                        if (patt.test($(this).val()) && (parseInt($(this).val(), 10) > 2999 && parseInt($(this).val(), 10) <= 1000000) && parseInt($(this).val(), 10) % 1000 == 0) {
                            $(this).attr('old_value', $(this).val());
                            show_error = false;
                        }
                        if ($(this).attr('old_value') == $(this).val()) {
                            show_new_value = false;
                        }
                    }
                    break;
            }

            if (show_error) {
                $(this).parent().parent().addClass('error');
            } else {
                $(this).parent().parent().removeClass('error');
            }
            if (show_new_value) {
                $(this).attr('old_value', $(this).val());
            } else {
                $(this).val($(this).attr('old_value'));
            }
            if( $(this).val() == "---"){
                $(this).addClass('placeholder');
            }
        }
    });
    /////////////
    //event_btn//
    /////////////
    $('.event_btn').on('click', function(event) {
        switch($(this).children('span').text()){
            case '我要申購':window.location.href = 'purchase_step1.html';
                           break;
            case '即將開賣':$.fancybox.open({
                                src  : 'iframe_result_message.html',
                                type : 'iframe',
                                opts : {
                                    toolbar: false,
                                    smallBtn: true,
                                    baseClass: 'alert'
                                }
                            });
                            break;
        }
    });
    ////////////
    //lightbox//
    ////////////
    $('.scrollContainer .footer a').each(function(index, element) {
        $(element).addClass('fancybox.iframe');
        $(element).attr('data-type', 'iframe');
        $(element).attr('data-src', $(element).attr('href'));
        $(element).removeAttr('href');
        $(element).fancybox({
            toolbar: false,
            smallBtn: true,
            baseClass: 'investment'
        });
    });
    $('.nav_container a, .footer_container a').each(function(index, element) {
        if ($(element).html() != '模擬投資拿豪禮') {
            if ($(element).html() == '看報告') {
                $(element).addClass('fancybox.iframe');
                $(element).attr('data-type', 'iframe');
                if (getUrlParameter('checkType')) {
                    $(element).attr('data-src', $(element).attr('href') + '?checkType=' + getUrlParameter('checkType'));
                } else {
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
            } else if ($(element).html() != 'Q&amp;A') {
                if($(element).html() == '登入'){
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
                }else if($(element).html() == '登出'){
                    $(element).addClass('fancybox.iframe');
                    $(element).attr('data-type', 'iframe');
                    $(element).attr('data-src', $(element).attr('href'));
                    $(element).removeAttr('href');
                    $(element).fancybox({
                        toolbar: false,
                        smallBtn: true,
                        baseClass: 'alert',
                        beforeShow: function() {
                            closeMenu();
                        }
                    });
                }else{
                    $(element).addClass('fancybox.iframe');
                    $(element).attr('data-type', 'iframe');
                    $(element).attr('data-src', 'iframe_result_quit.html?jump=' + $(element).attr('href'));
                    $(element).removeAttr('href');
                    if (index != 0 && index != 1) {
                        $(element).fancybox({
                            toolbar: false,
                            smallBtn: false,
                            baseClass: 'alert',
                            beforeShow: function() {
                                closeMenu();
                            }
                        });
                    } else {
                        $(element).fancybox({
                            toolbar: false,
                            smallBtn: false,
                            baseClass: 'alert'
                        });
                    }
                }
            } else {
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
            }
        }
    });

    //init =================================================================================================
    init();
});