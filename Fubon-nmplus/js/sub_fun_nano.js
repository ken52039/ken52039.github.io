$(function() {

    var now_robot,
        frame1_timeLine,
        frame2_timeLine,
        now_id,
        last_scroll = 0,
        off_scroll_detact = true,
        auto_hide_timer,
        talk_log = [],
        summary_log = [],
        iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    var random_robot = function() {
        var items = [];
        for (var roleName in robot_role_data) { items.push(roleName); }
        now_robot = items[Math.floor(Math.random() * items.length)];
    }
    var random_sticker = function() {
        var items = robot_role_data[now_robot].sticker;
        return items[Math.floor(Math.random() * items.length)];
    }
    var init = function() {
        $(window).scrollTop(0);
        $(".robotHead").attr("src", robot_role_data[now_robot].avatar);
        $(".welcomeMessage").html(dialog_data.welcome.massage);
        $(".startBtn").html(dialog_data.welcome.start);
        $("#robot_name").html(robot_role_data[now_robot].name);
        frame1_timeLine = new TimelineMax()
            .add(TweenMax.fromTo(".robotHeadContainer", .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
            .add(TweenMax.to(".robotHead", .3, { autoAlpha: 1 }))
            .add([TweenMax.to(".welcomeMessage", .3, { autoAlpha: 1 }),
                TweenMax.from(".startBtn", .3, {
                    autoAlpha: 0,
                    scale: 0,
                    onComplete: function() {
                        talk('system', 'welcome', 'defalut');
                        $(".startBtn").focus();
                    }
                })
            ]);
    }
    var goTo_dialog = function(event) {
        frame2_timeLine = new TimelineMax()
            .add(TweenMax.to(".frame1", .3, {
                autoAlpha: 0,
                onComplete: function() {
                    $(".frame1").hide();
                    $(".frame2").show()
                }
            }))
            .add(TweenMax.from(".summary", .3, { right: -334, onComplete: function() { talk('robot', 'purpose', 'ask') } }));
        var browser = navigator.appVersion.toLowerCase();
        var winW = $(window).width();
        var winH = $(window).height();
        if(
            (winW > winH)                           &&
            (browser.indexOf('ipad') != -1)         && 
            (browser.indexOf('safari') != -1)       && 
            (browser.indexOf('crios') == -1)        && 
            (browser.indexOf('chrome') == -1)
        ){
            setTimeout(function(){
                $('.summary > input').css({
                    'position':'fixed',
                    'top':'100px',
                    'transition':'.5s'
                });
                $('.summary > ul').css({
                    'position':'fixed',
                    'top':'202px',
                    'width':'300px'
                });
            },300);
        }            
    }
    var setSize = function(){
        var new_li = $('.dialog>ul>li:nth-last-child(1)');
        var option_length = new_li.find('.iconItem').length;
        if(option_length>1){
            var option_h = [];
            var option_w = [];
            for(var i=0;i<option_length;i++){
                option_w.push( new_li.children('.option').eq(i).find('.height-center').width() );
            }
            var max_w = Math.max.apply(null, option_w) + 64;
            new_li.find('.iconItem').css('width',max_w);
            
            for(var i=0;i<option_length;i++){
                option_h.push( new_li.children().eq(i).find('.height-center').height() );
            }
            var option_padding;
            $(window).width() < 600 ? option_padding = 12 : option_padding = 24;
            var max_h = Math.max.apply(null, option_h) + option_padding;
            new_li.find('.iconItem').css('height',max_h);
        }
    }
    var talk = function(role, section, action) {
        var id = get_newId();
        var log = {
            id: id,
            talk_id: 'talk_' + id,
            role: role,
            section: section,
            action: action
        };
        var html_str = "";
        if (role == "robot") {
            switch (section) {
                case 'purpose':
                    switch (action) {
                        case 'ask':
                            html_str = replace_avatar(replace_talkId(html_data.robot_talk, log.talk_id), role);
                            html_str = replace_message(html_str, dialog_data.purpose.question.heading);
                            append_talk_html(html_str, log);
                            break;
                        case 'ask_option':
                            html_str = replace_talkId(html_data.option_list_normal, log.talk_id);
                            html_str = replace_option_list(html_str, html_data.option_icon_normal, dialog_data.purpose.question.option);
                            append_talk_html(html_str, log);
                            break;
                        case 'feedback':
                            html_str = replace_avatar(replace_talkId(html_data.robot_talk, log.talk_id), role);
                            html_str = replace_message(html_str, dialog_data.purpose.feedback.option[$('input:hidden[name=purpose]').val()]);
                            append_talk_html(html_str, log);
                            break;
                    }
                    break;
                case 'amount':
                    switch (action) {
                        case 'ask':
                            html_str = replace_avatar(replace_talkId(html_data.robot_talk, log.talk_id), role);
                            html_str = replace_message(html_str, dialog_data.amount.question.heading);
                            html_str = replace_ask_option(html_str, dialog_data.amount.question.ask_option[$('input:hidden[name=purpose]').val()]);
                            append_talk_html(html_str, log);
                            break;
                        case 'tips':
                            html_str = replace_avatar(replace_talkId(html_data.robot_talk, log.talk_id), role);
                            html_str = replace_message(html_str, dialog_data.amount.tips[$('input:hidden[name=purpose]').val()]);
                            append_talk_html(html_str, log);
                            break;
                        case 'error':
                            html_str = replace_avatar(replace_talkId(html_data.robot_error, log.talk_id), role);
                            html_str = replace_message(html_str, dialog_data.amount.answer.error);
                            append_talk_html(html_str, log);
                            break;
                        case 'feedback':
                            html_str = replace_avatar(replace_talkId(html_data.robot_sticker, log.talk_id), role);
                            html_str = replace_sticker(html_str, random_sticker());
                            append_talk_html(html_str, log);
                            break;
                    }
                    break;
                case 'years':
                    switch (action) {
                        case 'ask':
                            html_str = replace_avatar(replace_talkId(html_data.robot_talk, log.talk_id), role);
                            html_str = replace_message(html_str, dialog_data.years.question.heading);
                            html_str = replace_ask_option(html_str, dialog_data.years.question.ask_option[$('input:hidden[name=purpose]').val()]);
                            append_talk_html(html_str, log);
                            break;
                        case 'tips':
                            html_str = replace_avatar(replace_talkId(html_data.robot_talk, log.talk_id), role);
                            html_str = replace_message(html_str, dialog_data.years.tips);
                            append_talk_html(html_str, log);
                            break;
                        case 'error':
                            html_str = replace_avatar(replace_talkId(html_data.robot_error, log.talk_id), role);
                            html_str = replace_message(html_str, dialog_data.years.answer.error);
                            append_talk_html(html_str, log);
                            break;
                    }
                    break;
                case 'income':
                    switch (action) {
                        case 'ask':
                            html_str = replace_avatar(replace_talkId(html_data.robot_talk, log.talk_id), role);
                            html_str = replace_message(html_str, dialog_data.income.question.heading);
                            append_talk_html(html_str, log);
                            break;
                        case 'ask_option':
                            html_str = replace_talkId(html_data.option_list_nowarp, log.talk_id);
                            html_str = replace_option_list(html_str, html_data.option_tiny, dialog_data.income.question.option);
                            append_talk_html(html_str, log);
                            setSize();
                            break;
                    }
                    break;
                case 'percentage':
                    switch (action) {
                        case 'ask':
                            html_str = replace_avatar(replace_talkId(html_data.robot_talk, log.talk_id), role);
                            html_str = replace_message(html_str, dialog_data.percentage.question.heading);
                            append_talk_html(html_str, log);
                            break;
                        case 'ask_option':
                            html_str = replace_talkId(html_data.option_list_nowarp, log.talk_id);
                            html_str = replace_option_list(html_str, html_data.option_tiny, dialog_data.percentage.question.option);
                            append_talk_html(html_str, log);
                            setSize();
                            break;
                    }
                    break;
                case 'experience':
                    switch (action) {
                        case 'ask':
                            html_str = replace_avatar(replace_talkId(html_data.robot_talk, log.talk_id), role);
                            html_str = replace_message(html_str, dialog_data.experience.question.heading);
                            append_talk_html(html_str, log);
                            break;
                        case 'ask_option':
                            html_str = replace_talkId(html_data.option_list_nowarp, log.talk_id);
                            html_str = replace_option_list(html_str, html_data.option_tiny, dialog_data.experience.question.option);
                            append_talk_html(html_str, log);
                            setSize();
                            break;
                    }
                    break;
                case 'flux':
                    switch (action) {
                        case 'ask':
                            html_str = replace_avatar(replace_talkId(html_data.robot_talk, log.talk_id), role);
                            html_str = replace_message(html_str, dialog_data.flux.question.heading);
                            append_talk_html(html_str, log);
                            break;
                        case 'ask_option':
                            html_str = replace_talkId(html_data.option_list_nowarp, log.talk_id);
                            html_str = replace_option_list(html_str, html_data.option_tiny, dialog_data.flux.question.option);
                            append_talk_html(html_str, log);
                            setSize();
                            break;
                    }
                    break;
                case 'risk':
                    switch (action) {
                        case 'ask':
                            html_str = replace_avatar(replace_talkId(html_data.robot_talk, log.talk_id), role);
                            html_str = replace_message(html_str, dialog_data.risk.question.heading);
                            html_str = replace_ask_option(html_str, dialog_data.risk.question.ask_option[$('input:hidden[name=purpose]').val()]);
                            append_talk_html(html_str, log);
                            break;
                        case 'ask_option':
                            html_str = replace_talkId(html_data.option_list_nowarp, log.talk_id);
                            html_str = replace_option_list(html_str, html_data.option_icon_text, dialog_data.risk.question.option);
                            append_talk_html(html_str, log);
                            break;
                        case 'feedback':
                            html_str = replace_avatar(replace_talkId(html_data.robot_sticker, log.talk_id), role);
                            html_str = replace_sticker(html_str, random_sticker());
                            append_talk_html(html_str, log);
                            break;
                    }
                    break;
                case 'mode':
                    switch (action) {
                        case 'ask':
                            html_str = replace_avatar(replace_talkId(html_data.robot_talk, log.talk_id), role);
                            html_str = replace_message(html_str, dialog_data.mode.question.heading);
                            append_talk_html(html_str, log);
                            break;
                        case 'ask_option':
                            html_str = replace_talkId(html_data.option_list_nowarp, log.talk_id);
                            html_str = replace_option_list(html_str, html_data.option_tiny, dialog_data.mode.question.option);
                            append_talk_html(html_str, log);
                            setSize();
                            break;
                    }
                    break;
                case 'once':
                    switch (action) {
                        case 'ask':
                            html_str = replace_avatar(replace_talkId(html_data.robot_talk, log.talk_id), role);
                            html_str = replace_message(html_str, dialog_data.once.question.heading);
                            append_talk_html(html_str, log);
                            break;
                        case 'error':
                            html_str = replace_avatar(replace_talkId(html_data.robot_error, log.talk_id), role);
                            html_str = replace_message(html_str, dialog_data.once.answer.error);
                            append_talk_html(html_str, log);
                            break;
                    }
                    break;
                case 'perMonth':
                    switch (action) {
                        case 'ask':
                            html_str = replace_avatar(replace_talkId(html_data.robot_talk, log.talk_id), role);
                            html_str = replace_message(html_str, dialog_data.perMonth.question.heading);
                            append_talk_html(html_str, log);
                            break;
                        case 'error':
                            html_str = replace_avatar(replace_talkId(html_data.robot_error, log.talk_id), role);
                            html_str = replace_message(html_str, dialog_data.perMonth.answer.error);
                            append_talk_html(html_str, log);
                            break;
                    }
                    break;
                case 'email':
                    switch (action) {
                        case 'ask':
                            html_str = replace_avatar(replace_talkId(html_data.robot_talk, log.talk_id), role);
                            html_str = replace_message(html_str, dialog_data.email.question.heading);
                            append_talk_html(html_str, log);
                            break;
                        case 'error':
                            html_str = replace_avatar(replace_talkId(html_data.robot_error, log.talk_id), role);
                            html_str = replace_message(html_str, dialog_data.email.answer.error);
                            append_talk_html(html_str, log);
                            break;
                        case 'encourage':
                            html_str = replace_avatar(replace_talkId(html_data.robot_sticker, log.talk_id), role);
                            html_str = replace_sticker(html_str, random_sticker());
                            append_talk_html(html_str, log);
                             break;
                        case 'feedback':
                            html_str = replace_avatar(replace_talkId(html_data.robot_talk, log.talk_id), role);
                            html_str = replace_message(html_str, dialog_data.email.feedback.heading);
                            html_str = replace_search_mode(html_str, search_data.search_mode[$('input:hidden[name=search_mode]').val()]);
                            html_str = replace_search_target(html_str, search_data.search_target[$('input:hidden[name=search_target]').val()]);
                            append_talk_html(html_str, log);
                            break;
                    }
                    break;
            }
        } else if (role == "user") {
            switch (section) {
                case 'purpose':
                    html_str = replace_avatar(replace_talkId(html_data.user_talk, log.talk_id), role);
                    html_str = replace_message(html_str, dialog_data.purpose.answer.heading);
                    html_str = replace_option(html_str, dialog_data.purpose.answer.option[$('input:hidden[name=purpose]').val()]);
                    append_talk_html(html_str, log);
                    break;
                case 'amount':
                    log.input_id = 'input_' + id;
                    html_str = replace_avatar(replace_talkId(html_data.user_talk, log.talk_id), role);
                    html_str = replace_inputId(replace_message(html_str, dialog_data.amount.answer.heading), log.input_id);
                    html_str = replace_maxLength(html_str, dialog_data.amount.answer.max_length);
                    append_talk_html(html_str, log);
                    break;
                case 'years':
                    log.input_id = 'input_' + id;
                    html_str = replace_avatar(replace_talkId(html_data.user_talk, log.talk_id), role);
                    html_str = replace_inputId(replace_message(html_str, dialog_data.years.answer.heading), log.input_id);
                    html_str = replace_maxLength(html_str, dialog_data.years.answer.max_length);
                    append_talk_html(html_str, log);
                    break;
                case 'income':
                    html_str = replace_avatar(replace_talkId(html_data.user_talk, log.talk_id), role);
                    html_str = replace_message(html_str, dialog_data.income.answer.heading);
                    html_str = replace_option(html_str, dialog_data.income.answer.option[$('input:hidden[name=income]').val()]);
                    append_talk_html(html_str, log);
                    break;
                case 'percentage':
                    html_str = replace_avatar(replace_talkId(html_data.user_talk, log.talk_id), role);
                    html_str = replace_message(html_str, dialog_data.percentage.answer.heading);
                    html_str = replace_option(html_str, dialog_data.percentage.answer.option[$('input:hidden[name=percentage]').val()]);
                    append_talk_html(html_str, log);
                    break;
                case 'experience':
                    html_str = replace_avatar(replace_talkId(html_data.user_talk, log.talk_id), role);
                    html_str = replace_message(html_str, dialog_data.experience.answer.heading);
                    html_str = replace_option(html_str, dialog_data.experience.answer.option[$('input:hidden[name=experience]').val()]);
                    append_talk_html(html_str, log);
                    break;
               case 'flux':
                    html_str = replace_avatar(replace_talkId(html_data.user_talk, log.talk_id), role);
                    html_str = replace_message(html_str, dialog_data.flux.answer.heading);
                    html_str = replace_option(html_str, dialog_data.flux.answer.option[$('input:hidden[name=flux]').val()]);
                    append_talk_html(html_str, log);
                    break;
                case 'risk':
                    html_str = replace_avatar(replace_talkId(html_data.user_talk, log.talk_id), role);
                    html_str = replace_message(html_str, dialog_data.risk.answer.heading);
                    html_str = replace_option(html_str, dialog_data.risk.answer.option[$('input:hidden[name=risk]').val()]);
                    append_talk_html(html_str, log);
                    break;
                case 'mode':
                    html_str = replace_avatar(replace_talkId(html_data.user_talk, log.talk_id), role);
                    html_str = replace_message(html_str, dialog_data.mode.answer.heading);
                    html_str = replace_option(html_str, dialog_data.mode.answer.option[$('input:hidden[name=mode]').val()]);
                    append_talk_html(html_str, log);
                    break;
                case 'once':
                    log.input_id = 'input_' + id;
                    html_str = replace_avatar(replace_talkId(html_data.user_talk, log.talk_id), role);
                    html_str = replace_inputId(replace_message(html_str, dialog_data.once.answer.heading), log.input_id);
                    html_str = replace_maxLength(html_str, dialog_data.once.answer.max_length);
                    append_talk_html(html_str, log);
                    break;
                case 'perMonth':
                    log.input_id = 'input_' + id;
                    html_str = replace_avatar(replace_talkId(html_data.user_talk, log.talk_id), role);
                    html_str = replace_inputId(replace_message(html_str, dialog_data.perMonth.answer.heading), log.input_id);
                    html_str = replace_maxLength(html_str, dialog_data.perMonth.answer.max_length);
                    append_talk_html(html_str, log);
                    break;
                case 'email':
                    log.input_id = 'input_' + id;
                    html_str = replace_avatar(replace_talkId(html_data.user_talk, log.talk_id), role);
                    html_str = replace_inputId(replace_message(html_str, dialog_data.email.answer.heading), log.input_id);
                    append_talk_html(html_str, log);
                    break;
            }
        } else if (role == "system") {
            switch (section) {
                case 'go':
                    html_str = replace_talkId(html_data.go_result, log.talk_id);
                    html_str = replace_value(html_str, dialog_data.go);
                    append_talk_html(html_str, log);
                    break;
            }
        }
        set_talkLog(log);
    }
    $.fn.talk = talk;
    var get_newId = function() {
        now_id = (now_id) ? now_id += 1 : 1;
        return now_id;
    }
    var set_talkLog = function(log) {
        talk_log.push(log);
    }
    var set_summaryLog = function(log) {
        summary_log.push(log);
    }

    //replace ==========================================================================================================
    var replace_talkId = function(html, talk_id) {
        return html.replace(/\$id/i, 'id="' + talk_id + '"');
    }
    var replace_inputId = function(html, talk_id) {
        return html.replace(/\$id/i, 'id="' + talk_id + '"');
    }
    var replace_summaryId = function(html, summary_id) {
        return html.replace(/\$id/i, 'id="' + summary_id + '"');
    }
    var replace_maxLength = function(html, max_length) {
        return html.replace(/\$maxlength/i, 'maxlength="' + max_length + '"');
    }
    var replace_avatar = function(html, role) {
        if (role == "robot") {
            html = html.replace(/\$avatar_src/i, 'src="' + robot_role_data[now_robot].avatar + '"');
        } else {
            html = html.replace(/\$avatar_src/i, 'src="' + user_role_data.avatar + '"');
        }
        return html;
    }
    var replace_message = function(html, message) {
        return html.replace(/\$message/i, message);
    }
    var replace_option_list = function(html, option_html, option_data) {
        var option_list_html = "";
        for (var option in option_data) {
            var option_temp_html = option_html;
            for (var optionAttr in option_data[option]) {
                switch (optionAttr) {
                    case 'icon':
                        option_temp_html = option_temp_html.replace(/\$icon_src/i, 'src="' + option_data[option][optionAttr] + '"');
                        break;
                    case 'text':
                        option_temp_html = option_temp_html.replace(/\$text/i, option_data[option][optionAttr]);
                        break;
                    case 'title':
                        option_temp_html = option_temp_html.replace(/\$title/i, option_data[option][optionAttr]);
                        break;
                }
            }
            option_list_html += option_temp_html;
        }
        return html.replace(/\$option_list/i, option_list_html);
    }
    var replace_option = function(html, option) {
        return html.replace(/\$option/i, option);
    }
    var replace_ask_option = function(html, ask_option) {
        return html.replace(/\$ask_option/i, ask_option);
    }
    var replace_answer = function(html, answer) {
        return html.replace(/\$answer/i, answer);
    }
    var replace_sticker = function(html, sticker) {
        return html.replace(/\$sticker_src/i, 'src="' + sticker + '"');
    }
    var replace_search_mode = function(html, search_mode) {
        return html.replace(/\$search_mode/i, search_mode);
    }
    var replace_search_target = function(html, search_target) {
        return html.replace(/\$search_target/i, search_target);
    }
    var replace_value = function(html, value) {
        return html.replace(/\$value/i, 'value="' + value + '"');
    }

    //  append ==========================================================================================================
    var append_summary_html = function(section, answer_str) {
        var summary_html = "<li $id>$answer</li>";
        var log = {
            id: now_id,
            summary_id: 'summary' + now_id,
            section: section,
            summary_timeLine: new TimelineMax()
        };
        switch (section) {
            case 'purpose':
                summary_html = replace_answer(replace_summaryId(summary_html, log.summary_id), answer_str);
                break;
            case 'amount':
                summary_html = replace_answer(replace_summaryId(summary_html, log.summary_id), "新台幣" + answer_str + "萬元");
                break;
            case 'years':
                summary_html = replace_answer(replace_summaryId(summary_html, log.summary_id), "總共" + answer_str + "年");
                break;
            case 'income':
                summary_html = replace_answer(replace_summaryId(summary_html, log.summary_id), "我的收入來自" + answer_str);
                break;
            case 'percentage':
                summary_html = replace_answer(replace_summaryId(summary_html, log.summary_id), "我想拿" + answer_str);
                break;
            case 'experience':
                summary_html = replace_answer(replace_summaryId(summary_html, log.summary_id), answer_str);
                break;
            case 'flux':
                summary_html = replace_answer(replace_summaryId(summary_html, log.summary_id), answer_str);
                break;
            case 'risk':
                summary_html = replace_answer(replace_summaryId(summary_html, log.summary_id), answer_str);
                break;
            case 'mode':
                summary_html = replace_answer(replace_summaryId(summary_html, log.summary_id), answer_str);
                break;
            case 'once':
                summary_html = replace_answer(replace_summaryId(summary_html, log.summary_id), "新台幣" + answer_str + "萬元");
                break;
            case 'perMonth':
                summary_html = replace_answer(replace_summaryId(summary_html, log.summary_id), "新台幣" + answer_str + "元");
                break;
        }
        $(".frame2 .summary ul").append(summary_html);
        log.summary_timeLine.add(TweenMax.fromTo('#' + log.summary_id, 1, { autoAlpha: 0 }, { autoAlpha: 1 }, Back.easeOut.config(1.4)), "+=.5");
        set_summaryLog(log);
    }
    var append_talk_html = function(html_str, log) {
        log.talk_timeLine = new TimelineMax();
        $(".frame2 form ul").append(html_str);
        scrollTo_talk(log.talk_id);
        if (log.role == "robot") {
            var typeing_time = 0.6 + Math.random() * 0.6;
            switch (log.section) {
                case 'purpose':
                    switch (log.action) {
                        case 'ask':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .text').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { talk('robot', 'purpose', 'ask_option') }), '+=' + typeing_time);
                            break;
                        case 'ask_option':
                            log.talk_timeLine.add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(1) .icon', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4)), TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(1) .text', .5, { autoAlpha: 0 }, { autoAlpha: 1 }, Back.easeOut.config(1.4))])
                                .add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(2) .icon', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4)), TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(2) .text', .5, { autoAlpha: 0 }, { autoAlpha: 1 }, Back.easeOut.config(1.4))], '-=.45')
                                .add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(3) .icon', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4)), TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(3) .text', .5, { autoAlpha: 0 }, { autoAlpha: 1 }, Back.easeOut.config(1.4))], '-=.45')
                                .add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(4) .icon', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4)), TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(4) .text', .5, { autoAlpha: 0 }, { autoAlpha: 1 }, Back.easeOut.config(1.4))], '-=.45')
                                .add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(5) .icon', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4)), TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(5) .text', .5, { autoAlpha: 0 }, { autoAlpha: 1 }, Back.easeOut.config(1.4))], '-=.45')
                                .add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(6) .icon', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4)), TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(6) .text', .5, { autoAlpha: 0 }, { autoAlpha: 1 }, Back.easeOut.config(1.4))], '-=.45')
                                .add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(7) .icon', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4)), TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(7) .text', .5, { autoAlpha: 0 }, { autoAlpha: 1 }, Back.easeOut.config(1.4))], '-=.45').eventCallback("onComplete", function() { $('#' + log.talk_id).focus(); });
                            $('#' + log.talk_id).children('.option').on('click', itemSelect);
                            $('#' + log.talk_id).children('.option').on('mouseenter', itemHover);
                            $('#' + log.talk_id).on('keydown', function(event) {
                                event.preventDefault();
                                var key = event.which;
                                var now_active_index = ($(this).children('.active').index() != -1) ? $(this).children('.active').index() + 1 : $(this).children('.active').index();
                                var tg_active_index;
                                switch (key) {
                                    case 13:
                                        if (now_active_index != -1) {
                                            $('#' + log.talk_id + ' .option:nth-child(' + now_active_index + ')').click();
                                        }
                                        break;
                                    case 37:
                                    case 38:
                                        if (now_active_index == -1) {
                                            $(this).children('.option').last().addClass('active');
                                        } else {
                                            tg_active_index = now_active_index - 1;
                                            $('#' + log.talk_id + ' .option:nth-child(' + now_active_index + ')').removeClass('active');
                                            if (tg_active_index < 1) {
                                                $(this).children('.option').last().addClass('active');
                                            } else {
                                                $('#' + log.talk_id + ' .option:nth-child(' + tg_active_index + ')').addClass('active');
                                            }
                                        }
                                        break;

                                    case 39:
                                    case 40:
                                        if (now_active_index == -1) {
                                            $(this).children('.option').first().addClass('active');
                                        } else {
                                            tg_active_index = now_active_index + 1;
                                            $('#' + log.talk_id + ' .option:nth-child(' + now_active_index + ')').removeClass('active');
                                            if (tg_active_index > 7) {
                                                $(this).children('.option').first().addClass('active');
                                            } else {
                                                $('#' + log.talk_id + ' .option:nth-child(' + tg_active_index + ')').addClass('active');
                                            }
                                        }
                                        break;

                                    default:
                                        return false;
                                }
                            });
                            break;
                        case 'feedback':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .text').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { if ($('input:hidden[name=purpose]').val() == 7) { talk('robot', 'years', 'ask') } else { talk('robot', 'amount', 'ask') } }), '+=' + typeing_time);
                            break;
                    }
                    break;
                case 'amount':
                    switch (log.action) {
                        case 'ask':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .text').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { if ($('input:hidden[name=purpose]').val() > 1 && $('input:hidden[name=purpose]').val() < 6) { talk('robot', 'amount', 'tips') } else { talk('user', 'amount', 'answer') } }), '+=' + typeing_time);
                            break;
                        case 'tips':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .text').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { talk('user', 'amount', 'answer') }), '+=' + typeing_time);
                            break;
                        case 'error':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .error', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .error').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { talk('user', 'amount', 'answer') }), '+=' + typeing_time);
                            break;
                        case 'feedback':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .sticker', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .sticker').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { talk('robot', 'years', 'ask') }), '+=' + typeing_time);
                            break;
                    }
                    break;
                case 'years':
                    switch (log.action) {
                        case 'ask':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .text').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { talk('robot', 'years', 'tips') }), '+=' + typeing_time);
                            break;
                        case 'tips':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .text').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { talk('user', 'years', 'answer') }), '+=' + typeing_time);
                            break;
                        case 'error':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .error', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .error').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { talk('user', 'years', 'answer') }), '+=' + typeing_time);
                            break;
                    }
                    break;
                case 'income':
                    switch (log.action) {
                        case 'ask':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .text').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { talk('robot', 'income', 'ask_option') }), '+=' + typeing_time);
                            break;
                        case 'ask_option':
                            log.talk_timeLine.add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(1) .iconItem', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4))])
                                .add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(2) .iconItem', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4))], '-=.25')
                                .add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(3) .iconItem', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4))], '-=.25')
                                .add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(4) .iconItem', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4))], '-=.25').eventCallback("onComplete", function() { $('#' + log.talk_id).focus(); });
                            $('#' + log.talk_id).children('.option').on('click', itemSelect);
                            $('#' + log.talk_id).children('.option').on('mouseenter', itemHover);
                            $('#' + log.talk_id).on('keydown', function(event) {
                                event.preventDefault();
                                var key = event.which;
                                var now_active_index = ($(this).children('.active').index() != -1) ? $(this).children('.active').index() + 1 : $(this).children('.active').index();
                                var tg_active_index;
                                switch (key) {
                                    case 13:
                                        if (now_active_index != -1) {
                                            $('#' + log.talk_id + ' .option:nth-child(' + now_active_index + ')').click();
                                        }
                                        break;
                                    case 37:
                                    case 38:
                                        if (now_active_index == -1) {
                                            $(this).children('.option').last().addClass('active');
                                        } else {
                                            tg_active_index = now_active_index - 1;
                                            $('#' + log.talk_id + ' .option:nth-child(' + now_active_index + ')').removeClass('active');
                                            if (tg_active_index < 1) {
                                                $(this).children('.option').last().addClass('active');
                                            } else {
                                                $('#' + log.talk_id + ' .option:nth-child(' + tg_active_index + ')').addClass('active');
                                            }
                                        }
                                        break;

                                    case 39:
                                    case 40:
                                        if (now_active_index == -1) {
                                            $(this).children('.option').first().addClass('active');
                                        } else {
                                            tg_active_index = now_active_index + 1;
                                            $('#' + log.talk_id + ' .option:nth-child(' + now_active_index + ')').removeClass('active');
                                            if (tg_active_index > 4) {
                                                $(this).children('.option').first().addClass('active');
                                            } else {
                                                $('#' + log.talk_id + ' .option:nth-child(' + tg_active_index + ')').addClass('active');
                                            }
                                        }
                                        break;

                                    default:
                                        return false;
                                }
                            });
                            break;
                    }
                    break;
                case 'percentage':
                    switch (log.action) {
                        case 'ask':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .text').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { talk('robot', 'percentage', 'ask_option') }), '+=' + typeing_time);
                            break;
                        case 'ask_option':
                            log.talk_timeLine.add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(1) .iconItem', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4))])
                                .add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(2) .iconItem', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4))], '-=.25')
                                .add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(3) .iconItem', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4))], '-=.25').eventCallback("onComplete", function() { $('#' + log.talk_id).focus(); });
                            $('#' + log.talk_id).children('.option').on('click', itemSelect);
                            $('#' + log.talk_id).children('.option').on('mouseenter', itemHover);
                            $('#' + log.talk_id).on('keydown', function(event) {
                                event.preventDefault();
                                var key = event.which;
                                var now_active_index = ($(this).children('.active').index() != -1) ? $(this).children('.active').index() + 1 : $(this).children('.active').index();
                                var tg_active_index;
                                switch (key) {
                                    case 13:
                                        if (now_active_index != -1) {
                                            $('#' + log.talk_id + ' .option:nth-child(' + now_active_index + ')').click();
                                        }
                                        break;
                                    case 37:
                                    case 38:
                                        if (now_active_index == -1) {
                                            $(this).children('.option').last().addClass('active');
                                        } else {
                                            tg_active_index = now_active_index - 1;
                                            $('#' + log.talk_id + ' .option:nth-child(' + now_active_index + ')').removeClass('active');
                                            if (tg_active_index < 1) {
                                                $(this).children('.option').last().addClass('active');
                                            } else {
                                                $('#' + log.talk_id + ' .option:nth-child(' + tg_active_index + ')').addClass('active');
                                            }
                                        }
                                        break;

                                    case 39:
                                    case 40:
                                        if (now_active_index == -1) {
                                            $(this).children('.option').first().addClass('active');
                                        } else {
                                            tg_active_index = now_active_index + 1;
                                            $('#' + log.talk_id + ' .option:nth-child(' + now_active_index + ')').removeClass('active');
                                            if (tg_active_index > 3) {
                                                $(this).children('.option').first().addClass('active');
                                            } else {
                                                $('#' + log.talk_id + ' .option:nth-child(' + tg_active_index + ')').addClass('active');
                                            }
                                        }
                                        break;

                                    default:
                                        return false;
                                }
                            });
                            break;
                    }
                    break;
                case 'experience':
                    switch (log.action) {
                        case 'ask':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .text').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { talk('robot', 'experience', 'ask_option') }), '+=' + typeing_time);
                            break;
                        case 'ask_option':
                            log.talk_timeLine.add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(1) .iconItem', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4))])
                                .add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(2) .iconItem', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4))], '-=.25')
                                .add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(3) .iconItem', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4))], '-=.25')
                                .add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(4) .iconItem', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4))], '-=.25').eventCallback("onComplete", function() { $('#' + log.talk_id).focus(); });
                            $('#' + log.talk_id).children('.option').on('click', itemSelect);
                            $('#' + log.talk_id).children('.option').on('mouseenter', itemHover);
                            $('#' + log.talk_id).on('keydown', function(event) {
                                event.preventDefault();
                                var key = event.which;
                                var now_active_index = ($(this).children('.active').index() != -1) ? $(this).children('.active').index() + 1 : $(this).children('.active').index();
                                var tg_active_index;
                                switch (key) {
                                    case 13:
                                        if (now_active_index != -1) {
                                            $('#' + log.talk_id + ' .option:nth-child(' + now_active_index + ')').click();
                                        }
                                        break;
                                    case 37:
                                    case 38:
                                        if (now_active_index == -1) {
                                            $(this).children('.option').last().addClass('active');
                                        } else {
                                            tg_active_index = now_active_index - 1;
                                            $('#' + log.talk_id + ' .option:nth-child(' + now_active_index + ')').removeClass('active');
                                            if (tg_active_index < 1) {
                                                $(this).children('.option').last().addClass('active');
                                            } else {
                                                $('#' + log.talk_id + ' .option:nth-child(' + tg_active_index + ')').addClass('active');
                                            }
                                        }
                                        break;

                                    case 39:
                                    case 40:
                                        if (now_active_index == -1) {
                                            $(this).children('.option').first().addClass('active');
                                        } else {
                                            tg_active_index = now_active_index + 1;
                                            $('#' + log.talk_id + ' .option:nth-child(' + now_active_index + ')').removeClass('active');
                                            if (tg_active_index > 4) {
                                                $(this).children('.option').first().addClass('active');
                                            } else {
                                                $('#' + log.talk_id + ' .option:nth-child(' + tg_active_index + ')').addClass('active');
                                            }
                                        }
                                        break;

                                    default:
                                        return false;
                                }
                            });
                            break;
                    }
                    break;
                case 'flux':
                    switch (log.action) {
                        case 'ask':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .text').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { talk('robot', 'flux', 'ask_option') }), '+=' + typeing_time);
                            break;
                        case 'ask_option':
                            log.talk_timeLine.add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(1) .iconItem', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4))])
                                .add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(2) .iconItem', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4))], '-=.25')
                                .add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(3) .iconItem', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4))], '-=.25')
                                .add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(4) .iconItem', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4))], '-=.25').eventCallback("onComplete", function() { $('#' + log.talk_id).focus(); });
                            $('#' + log.talk_id).children('.option').on('click', itemSelect);
                            $('#' + log.talk_id).children('.option').on('mouseenter', itemHover);
                            $('#' + log.talk_id).on('keydown', function(event) {
                                event.preventDefault();
                                var key = event.which;
                                var now_active_index = ($(this).children('.active').index() != -1) ? $(this).children('.active').index() + 1 : $(this).children('.active').index();
                                var tg_active_index;
                                switch (key) {
                                    case 13:
                                        if (now_active_index != -1) {
                                            $('#' + log.talk_id + ' .option:nth-child(' + now_active_index + ')').click();
                                        }
                                        break;
                                    case 37:
                                    case 38:
                                        if (now_active_index == -1) {
                                            $(this).children('.option').last().addClass('active');
                                        } else {
                                            tg_active_index = now_active_index - 1;
                                            $('#' + log.talk_id + ' .option:nth-child(' + now_active_index + ')').removeClass('active');
                                            if (tg_active_index < 1) {
                                                $(this).children('.option').last().addClass('active');
                                            } else {
                                                $('#' + log.talk_id + ' .option:nth-child(' + tg_active_index + ')').addClass('active');
                                            }
                                        }
                                        break;

                                    case 39:
                                    case 40:
                                        if (now_active_index == -1) {
                                            $(this).children('.option').first().addClass('active');
                                        } else {
                                            tg_active_index = now_active_index + 1;
                                            $('#' + log.talk_id + ' .option:nth-child(' + now_active_index + ')').removeClass('active');
                                            if (tg_active_index > 4) {
                                                $(this).children('.option').first().addClass('active');
                                            } else {
                                                $('#' + log.talk_id + ' .option:nth-child(' + tg_active_index + ')').addClass('active');
                                            }
                                        }
                                        break;

                                    default:
                                        return false;
                                }
                            });
                            break;
                    }
                    break;
                case 'risk':
                    switch (log.action) {
                        case 'ask':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .text').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { talk('robot', 'risk', 'ask_option') }), '+=' + typeing_time);
                            break;
                        case 'ask_option':
                            log.talk_timeLine.add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(1) .iconText', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4)), TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(1) .text', .5, { autoAlpha: 0 }, { autoAlpha: 1 }, Back.easeOut.config(1.4))])
                                .add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(2) .iconText', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4)), TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(2) .text', .5, { autoAlpha: 0 }, { autoAlpha: 1 }, Back.easeOut.config(1.4))], '-=.45')
                                .add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(3) .iconText', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4)), TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(3) .text', .5, { autoAlpha: 0 }, { autoAlpha: 1 }, Back.easeOut.config(1.4))], '-=.45')
                                .add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(4) .iconText', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4)), TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(4) .text', .5, { autoAlpha: 0 }, { autoAlpha: 1 }, Back.easeOut.config(1.4))], '-=.45').eventCallback("onComplete", function() { $('#' + log.talk_id).focus(); });
                            $('#' + log.talk_id).children('.option').on('click', itemSelect);
                            $('#' + log.talk_id).children('.option').on('mouseenter', itemHover);
                            $('#' + log.talk_id).on('keydown', function(event) {
                                event.preventDefault();
                                var key = event.which;
                                var now_active_index = ($(this).children('.active').index() != -1) ? $(this).children('.active').index() + 1 : $(this).children('.active').index();
                                var tg_active_index;
                                switch (key) {
                                    case 13:
                                        if (now_active_index != -1) {
                                            $('#' + log.talk_id + ' .option:nth-child(' + now_active_index + ')').click();
                                        }
                                        break;
                                    case 37:
                                    case 38:
                                        if (now_active_index == -1) {
                                            $(this).children('.option').last().addClass('active');
                                        } else {
                                            tg_active_index = now_active_index - 1;
                                            $('#' + log.talk_id + ' .option:nth-child(' + now_active_index + ')').removeClass('active');
                                            if (tg_active_index < 1) {
                                                $(this).children('.option').last().addClass('active');
                                            } else {
                                                $('#' + log.talk_id + ' .option:nth-child(' + tg_active_index + ')').addClass('active');
                                            }
                                        }
                                        break;

                                    case 39:
                                    case 40:
                                        if (now_active_index == -1) {
                                            $(this).children('.option').first().addClass('active');
                                        } else {
                                            tg_active_index = now_active_index + 1;
                                            $('#' + log.talk_id + ' .option:nth-child(' + now_active_index + ')').removeClass('active');
                                            if (tg_active_index > 4) {
                                                $(this).children('.option').first().addClass('active');
                                            } else {
                                                $('#' + log.talk_id + ' .option:nth-child(' + tg_active_index + ')').addClass('active');
                                            }
                                        }
                                        break;

                                    default:
                                        return false;
                                }
                            });
                            break;
                        case 'feedback':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .sticker', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .sticker').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { talk('robot', 'mode', 'ask') }), '+=' + typeing_time);
                            break;
                    }
                    break;
                case 'mode':
                    switch (log.action) {
                        case 'ask':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .text').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { talk('robot', 'mode', 'ask_option') }), '+=' + typeing_time);
                            break;
                        case 'ask_option':
                            log.talk_timeLine.add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(1) .iconItem', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4))])
                                .add([TweenMax.fromTo('#' + log.talk_id + ' .option:nth-child(2) .iconItem', .3, { scale: 0 }, { scale: 1 }, Back.easeOut.config(1.4))], '-=.25').eventCallback("onComplete", function() { $('#' + log.talk_id).focus(); });
                            $('#' + log.talk_id).children('.option').on('click', itemSelect);
                            $('#' + log.talk_id).children('.option').on('mouseenter', itemHover);
                            $('#' + log.talk_id).on('keydown', function(event) {
                                event.preventDefault();
                                var key = event.which;
                                var now_active_index = ($(this).children('.active').index() != -1) ? $(this).children('.active').index() + 1 : $(this).children('.active').index();
                                var tg_active_index;
                                switch (key) {
                                    case 13:
                                        if (now_active_index != -1) {
                                            $('#' + log.talk_id + ' .option:nth-child(' + now_active_index + ')').click();
                                        }
                                        break;
                                    case 37:
                                    case 38:
                                        if (now_active_index == -1) {
                                            $(this).children('.option').last().addClass('active');
                                        } else {
                                            tg_active_index = now_active_index - 1;
                                            $('#' + log.talk_id + ' .option:nth-child(' + now_active_index + ')').removeClass('active');
                                            if (tg_active_index < 1) {
                                                $(this).children('.option').last().addClass('active');
                                            } else {
                                                $('#' + log.talk_id + ' .option:nth-child(' + tg_active_index + ')').addClass('active');
                                            }
                                        }
                                        break;

                                    case 39:
                                    case 40:
                                        if (now_active_index == -1) {
                                            $(this).children('.option').first().addClass('active');
                                        } else {
                                            tg_active_index = now_active_index + 1;
                                            $('#' + log.talk_id + ' .option:nth-child(' + now_active_index + ')').removeClass('active');
                                            if (tg_active_index > 2) {
                                                $(this).children('.option').first().addClass('active');
                                            } else {
                                                $('#' + log.talk_id + ' .option:nth-child(' + tg_active_index + ')').addClass('active');
                                            }
                                        }
                                        break;

                                    default:
                                        return false;
                                }
                            });
                            break;
                    }
                    break;
                case 'once':
                    switch (log.action) {
                        case 'ask':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .text').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { talk('user', 'once', 'answer') }), '+=' + typeing_time);
                            break;
                        case 'error':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .error', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .error').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { talk('user', 'once', 'answer') }), '+=' + typeing_time);
                            break;
                    }
                    break;
                case 'perMonth':
                    switch (log.action) {
                        case 'ask':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .text').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { talk('user', 'perMonth', 'answer') }), '+=' + typeing_time);
                            break;
                        case 'error':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .error', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .error').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { talk('user', 'perMonth', 'answer') }), '+=' + typeing_time);
                            break;
                    }
                    break;
                case 'email':
                    switch (log.action) {
                        case 'ask':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .text').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { talk('user', 'email', 'answer') }), '+=' + typeing_time);
                            break;
                        case 'error':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .error', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .error').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { talk('user', 'email', 'answer') }), '+=' + typeing_time);
                            break;
                        case 'encourage':
                             log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .sticker', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .sticker').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { talk('robot', 'email', 'feedback') }), '+=' + typeing_time);
                            break;
                        case 'feedback':
                            log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .typeing', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                                .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .001, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                                    $('#' + log.talk_id + ' .typeing').hide();
                                    $('#' + log.talk_id + ' .text').show();
                                    scrollTo_talk(log.talk_id);
                                }).eventCallback("onComplete", function() { talk('system', 'go', 'dewfault') }));
                            break;
                    }
                    break;
            }
        } else if (log.role == "user") {
            var robot_feedback_time = 0.6 + Math.random() * 0.6;
            switch (log.section) {
                case 'purpose':
                    log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                        .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                            $('#' + log.talk_id + ' .text').show();
                            scrollTo_talk(log.talk_id);
                        }).eventCallback("onComplete", function() { setTimeout(function() { talk('robot', 'purpose', 'feedback') }, robot_feedback_time * 1000); }));
                    break;
                case 'amount':
                    autosizeInput(document.querySelector('#' + log.input_id));
                    log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                        .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                            $('#' + log.talk_id + ' .text').show();
                            scrollTo_talk(log.talk_id);
                        }).eventCallback("onComplete", function() { if(!isBreakPoint(600) && !isBreakPoint(992)){$('#' + log.input_id).focus();} }));
                    $('#' + log.input_id).on('blur', function(event) {
                        if (iOS) {
                            itemInput($(this));
                        }
                    });
                    $('#' + log.input_id).on('keydown', function(event) {
                        var key = event.which;
                        if (key == 13 || key == 9) {
                            event.preventDefault();
                            itemInput($(this));
                            return false;
                        }
                    });
                    break;
                case 'years':
                    autosizeInput(document.querySelector('#' + log.input_id));
                    log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                        .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                            $('#' + log.talk_id + ' .text').show();
                            scrollTo_talk(log.talk_id);
                        }).eventCallback("onComplete", function() { if(!isBreakPoint(600) && !isBreakPoint(992)){$('#' + log.input_id).focus();} }));
                    $('#' + log.input_id).on('blur', function(event) {
                        if (iOS) {
                            itemInput($(this));
                        }
                    });
                    $('#' + log.input_id).on('keydown', function(event) {
                        var key = event.which;
                        if (key == 13 || key == 9) {
                            event.preventDefault();
                            itemInput($(this));
                            return false;
                        }
                    });
                    break;
                case 'income':
                    log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                        .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                            $('#' + log.talk_id + ' .text').show();
                            scrollTo_talk(log.talk_id);
                        }).eventCallback("onComplete", function() { setTimeout(function() { talk('robot', 'percentage', 'ask') }, robot_feedback_time * 1000); }));
                    break;
                case 'percentage':
                    log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                        .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                            $('#' + log.talk_id + ' .text').show();
                            scrollTo_talk(log.talk_id);
                        }).eventCallback("onComplete", function() { setTimeout(function() { talk('robot', 'experience', 'ask') }, robot_feedback_time * 1000); }));
                    break;
                case 'experience':
                    log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                        .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                            $('#' + log.talk_id + ' .text').show();
                            scrollTo_talk(log.talk_id);
                        }).eventCallback("onComplete", function() { setTimeout(function() { talk('robot', 'flux', 'ask') }, robot_feedback_time * 1000); }));
                    break;
                case 'flux':
                    log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                        .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                            $('#' + log.talk_id + ' .text').show();
                            scrollTo_talk(log.talk_id);
                        }).eventCallback("onComplete", function() { setTimeout(function() { talk('robot', 'risk', 'ask') }, robot_feedback_time * 1000); }));
                    break;
                case 'risk':
                    log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                        .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                            $('#' + log.talk_id + ' .text').show();
                            scrollTo_talk(log.talk_id);
                        }).eventCallback("onComplete", function() { setTimeout(function() { talk('robot', 'risk', 'feedback') }, robot_feedback_time * 1000); }));
                    break;
                case 'mode':
                    log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                        .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                            $('#' + log.talk_id + ' .text').show();
                            scrollTo_talk(log.talk_id);
                        }).eventCallback("onComplete", function() { setTimeout(function() { if ($('input:hidden[name=mode]').val() == 1) { talk('robot', 'once', 'ask') } else { talk('robot', 'perMonth', 'ask') } }, robot_feedback_time * 1000); }));
                    break;
                case 'once':
                    autosizeInput(document.querySelector('#' + log.input_id));
                    log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                        .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                            $('#' + log.talk_id + ' .text').show();
                            scrollTo_talk(log.talk_id);
                        }).eventCallback("onComplete", function() { if(!isBreakPoint(600) && !isBreakPoint(992)){$('#' + log.input_id).focus();} }));
                    $('#' + log.input_id).on('blur', function(event) {
                        if (iOS) {
                            itemInput($(this));
                        }
                    });
                    $('#' + log.input_id).on('keydown', function(event) {
                        var key = event.which;
                        if (key == 13 || key == 9) {
                            event.preventDefault();
                            itemInput($(this));
                            return false;
                        }
                    });
                    break;
                case 'perMonth':
                    autosizeInput(document.querySelector('#' + log.input_id));
                    log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                        .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                            $('#' + log.talk_id + ' .text').show();
                            scrollTo_talk(log.talk_id);
                        }).eventCallback("onComplete", function() { if(!isBreakPoint(600) && !isBreakPoint(992)){$('#' + log.input_id).focus();} }));
                    $('#' + log.input_id).on('blur', function(event) {
                        if (iOS) {
                            itemInput($(this));
                        }
                    });
                    $('#' + log.input_id).on('keydown', function(event) {
                        var key = event.which;
                        if (key == 13 || key == 9) {
                            event.preventDefault();
                            itemInput($(this));
                            return false;
                        }
                    });
                    break;
                case 'email':
                    autosizeInput(document.querySelector('#' + log.input_id));
                    log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .avatar', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)))
                        .add(TweenMax.fromTo('#' + log.talk_id + ' .text', .3, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                            $('#' + log.talk_id + ' .text').show();
                            scrollTo_talk(log.talk_id);
                        }).eventCallback("onComplete", function() { if(!isBreakPoint(600) && !isBreakPoint(992)){$('#' + log.input_id).focus();} }));
                    $('#' + log.input_id).on('blur', function(event) {
                        if (iOS) {
                            itemInput($(this));
                        }
                    });
                    $('#' + log.input_id).on('keydown', function(event) {
                        var key = event.which;
                        if (key == 13 || key == 9) {
                            event.preventDefault();
                            itemInput($(this));
                            return false;
                        }
                    });
                    break;
            }
        } else if (log.role == "system") {
            switch (log.section) {
                case 'go':
                    log.talk_timeLine.add(TweenMax.fromTo('#' + log.talk_id + ' .btn', .5, { autoAlpha: 0 }, { autoAlpha: 1 }, Back.easeOut.config(1.4)).eventCallback("onStart", function() {
                        scrollTo_talk(log.talk_id);
                    }).eventCallback("onComplete", function() { $('#' + log.talk_id + ' .btn').focus(); }), '+=.5');
                    $('#' + log.talk_id + ' .btn').on('keydown', function(event) {
                        var key = event.which;
                        if (key == 13 || key == 9) {
                            event.preventDefault();
                            $(this).click();
                            return false;
                        }
                    });
                    break;
            }
        }
    }
    var itemHover = function(event) {
        var talk_id = $(event.target).parent().attr('id');
        $('#' + talk_id).children('.option').removeClass('active');
        $(this).addClass('active');
    }
    var itemSelect = function(event) {
        var talk_id = $(event.target).parent().attr('id');
        var log_index = parseInt(talk_id.replace(/talk_/i, ''), 10) - 1;
        var log = talk_log[log_index];
        var value = $(event.target).index() + 1;
        $('#' + talk_id).children('.option').removeClass('active');
        $('#' + talk_id).off('keydown');
        $('#' + talk_id).children('.option').off('click');
        $('#' + talk_id).children('.option').off('mouseenter');
        $('#' + talk_id).children('.option').removeClass('hover');
        $(event.target).addClass('active');
        switch (log.section) {
            case 'purpose':
                $('input:hidden[name=purpose]').val(value);
                talk('user', 'purpose', 'answer');
                append_summary_html(log.section, dialog_data.purpose.answer.option[value]);
                break;
            case 'income':
                $('input:hidden[name=income]').val(value);
                talk('user', 'income', 'answer');
                append_summary_html(log.section, dialog_data.income.answer.option[value]);
                break;
            case 'percentage':
                $('input:hidden[name=percentage]').val(value);
                talk('user', 'percentage', 'answer');
                append_summary_html(log.section, dialog_data.percentage.answer.option[value]);
                break;
            case 'experience':
                $('input:hidden[name=experience]').val(value);
                talk('user', 'experience', 'answer');
                append_summary_html(log.section, dialog_data.experience.answer.option[value]);
                break;
            case 'flux':
                $('input:hidden[name=flux]').val(value);
                talk('user', 'flux', 'answer');
                append_summary_html(log.section, dialog_data.flux.answer.option[value]);
                break;
            case 'risk':
                $('input:hidden[name=risk]').val(value);
                talk('user', 'risk', 'answer');
                append_summary_html(log.section, dialog_data.risk.answer.option[value]);
                break;
            case 'mode':
                $('input:hidden[name=mode]').val(value);
                talk('user', 'mode', 'answer');
                append_summary_html(log.section, dialog_data.mode.answer.option[value]);
                break;
        }
    }
    var itemInput = function(event_target) {
        var talk_id = event_target.parent().parent().attr('id');
        var log_index = parseInt(talk_id.replace(/talk_/i, ''), 10) - 1;
        var log = talk_log[log_index];
        var value = event_target.val();
        var patt, int_value, link_ar, i, is_like;
        event_target.off('blur');
        event_target.off('keydown');
        event_target.blur();
        event_target.prop('readonly', true);
        switch (log.section) {
            case 'amount':
                patt = /^\d+$/;
                if (value && patt.test(value)) {
                    int_value = parseInt(value, 10);
                    //if (int_value > (dialog_data.amount.answer.min_value - 1) && int_value < (dialog_data.amount.answer.max_value + 1)) {
                    if (int_value > (dialog_data.amount.answer.min_value - 1)) {
                        $('input:hidden[name=amount]').val(value);
                        //talk('robot', 'years', 'ask');
                        talk('robot', 'amount', 'feedback');
                        append_summary_html(log.section, value);
                    } else {
                        talk('robot', 'amount', 'error');
                    }
                } else {
                    talk('robot', 'amount', 'error');
                }
                break;
            case 'years':
                patt = /^\d+$/;
                if (value && patt.test(value)) {
                    int_value = parseInt(value, 10);
                    if (int_value > (dialog_data.years.answer.min_value - 1) && int_value < (dialog_data.years.answer.max_value + 1)) {
                        $('input:hidden[name=years]').val(value);
                        talk('robot', 'income', 'ask');
                        append_summary_html(log.section, value);
                    } else {
                        talk('robot', 'years', 'error');
                    }
                } else {
                    talk('robot', 'years', 'error');
                }
                break;
            case 'once':
                patt = /^\d+$/;
                if (value && patt.test(value)) {
                    int_value = parseInt(value, 10);
                    //if (int_value > (dialog_data.once.answer.min_value - 1) && int_value < (dialog_data.once.answer.max_value + 1)) {
                    if (int_value > (dialog_data.once.answer.min_value - 1)) {
                        $('input:hidden[name=once]').val(value);
                        talk('robot', 'email', 'ask');
                        append_summary_html(log.section, value);
                    } else {
                        talk('robot', 'once', 'error');
                    }
                } else {
                    talk('robot', 'once', 'error');
                }
                break;
            case 'perMonth':
                patt = /^\d+$/;
                if (value && patt.test(value)) {
                    int_value = parseInt(value, 10);
                    //if (int_value > (dialog_data.perMonth.answer.min_value - 1) && int_value < (dialog_data.perMonth.answer.max_value + 1)) {
                    if (int_value > (dialog_data.perMonth.answer.min_value - 1)) {
                        $('input:hidden[name=perMonth]').val(value);
                        talk('robot', 'email', 'ask');
                        append_summary_html(log.section, value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                    } else {
                        talk('robot', 'perMonth', 'error');
                    }
                } else {
                    talk('robot', 'perMonth', 'error');
                }
                break;
            case 'email':
                patt = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                link_ar = ['@gamil.com','@gmial.com','@gmali.com','@yhaoo.com.tw','@yaho.com.tw'];
                if (value && patt.test(value)) {
                    is_like = false;
                    for(var i=0;i<link_ar.length;i++){
                        if(value.indexOf(link_ar[i]) != -1){
                            is_like = true;
                            break;
                        }
                    }
                    if(is_like){
                        talk('robot', 'email', 'error');
                    }else{
                        int_value = parseInt(value, 10);
                        $('input:hidden[name=email]').val(value);
                        talk('robot', 'email', 'encourage');
                    }
                } else {
                    talk('robot', 'email', 'error');
                }
                break;
        }
    }
    var scrollTo_talk = function(talk_id) {
        var dialog_bottom = $('#' + talk_id).offset().top + $('#' + talk_id).outerHeight() + parseInt($('#' + talk_id).css('margin-bottom').replace(/px/i, ''), 10);
        var screen_height = $(window).height() - parseInt($('.dialog ul').css('padding-bottom').replace(/px/i, ''), 10);
        if (dialog_bottom > screen_height) {
            off_scroll_detact = true;
            var interval = setTimeout(function() {
                $(window).scrollTop(dialog_bottom - screen_height);
                clearInterval(interval);
            }, 0)
        }
    }

    var nanoReset = function() {
        TweenMax.killAll();
        now_id = 1;
        talk_log = talk_log.slice(0, 1);
        summary_log = [];
        $(".frame2 form ul").empty();
        $(".frame2 .summary ul").empty();
        $('input:hidden:not([name=search_mode]):not([name=search_target])').val("");
        setTimeout(function() {
            $(window).scrollTop(0);
            talk('robot', 'purpose', 'ask');
        }, 1000);
    }
    $.fn.nanoReset = nanoReset;

    //init
    random_robot();
    init();

    //event
    $('.startBtn').on('click', goTo_dialog);
    $('.startBtn').on('keydown', function(event) {
        var key = event.which;
        if (key == 13 || key == 9) {
            event.preventDefault();
            $(this).click();
            return false;
        }
        event.preventDefault();
    });
    $('.pcReset').on('click', function(event) {
        $.fancybox.open([{
            type: 'iframe',
            src: 'iframe_nano_quit.html?jump=restart'
        }], {
            toolbar: false,
            smallBtn: false,
            baseClass: 'alert'
        });
    });

    $(window).on("scroll", function() {
        var scrollBottom = $(document).height() - $(window).height() - $(window).scrollTop();
        var footerHeight = $('footer').outerHeight();
        var st = $(window).scrollTop();
        //wave position
        if (scrollBottom <= footerHeight) {
            $(".waveBg_f, .waveBg_b, .summary").css('bottom', footerHeight - scrollBottom);
        } else {
            $(".waveBg_f, .waveBg_b, .summary").css('bottom', 0);
        }
        //restart display
        if (!off_scroll_detact) {
            if (st > last_scroll) {
                //console.log('DOWN');
                TweenMax.to(".mobileReset", .5, { opacity: 0 }).eventCallback("onStart", function() { $('.mobileReset').off('click') });
            } else if (st < last_scroll) {
                //console.log('Up');
                TweenMax.to(".mobileReset", .5, { opacity: 1 }).eventCallback("onComplete", function() {
                    $('.mobileReset').on('click', function(event) {
                        $.fancybox.open([{
                            type: 'iframe',
                            src: 'iframe_nano_quit.html?jump=restart'
                        }], {
                            toolbar: false,
                            smallBtn: false,
                            baseClass: 'alert'
                        });
                    });
                    auto_hide_timer = setTimeout(function() { TweenMax.to(".mobileReset", .5, { opacity: 0 }).eventCallback("onStart", function() { $('.mobileReset').off('click') }) }, 1000);
                });
            }
        } else {
            off_scroll_detact = false;
        }
        last_scroll = st;
    });

    $(window).on("resize", function() {
        $('.waveBg_b').height(Math.floor(window.innerHeight * (182/1080)));
        $('.waveBg_f').height(Math.floor(window.innerHeight * (224/1080)));
        $(window).scroll();
        $('.dialog>ul>li').each(function(){
            var $this = $(this);
            var option_length = $this.find('.iconItem').length;
            if(option_length>1){
                var option_h = [];
                for(var i=0;i<option_length;i++){
                    option_h.push( $this.children().eq(i).find('.height-center').height() );
                }
                var option_padding;
                $(window).width() < 600 ? option_padding = 12 : option_padding = 24;
                var max_h = Math.max.apply(null, option_h) + option_padding;
                $this.find('.iconItem').css('height',max_h);
            }
        });
    }).resize();

    $(".dialog").submit(function(event) {
        if (!$('input:hidden[name=email]').val()) {
            itemInput($(':focus'));
            return false;
        }
    });

    $('.nav_container a, .footer_container a').each(function(index, element) {
        if($(element).html() != '模擬投資拿豪禮'){
            if($(element).html() == '看報告') {
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
            } else if ($(element).html() != 'Q&amp;A') {
                $(element).addClass('fancybox.iframe');
                $(element).attr('data-type', 'iframe');
                $(element).attr('data-src', 'iframe_nano_quit.html?jump=' + $(element).attr('href'));
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
});