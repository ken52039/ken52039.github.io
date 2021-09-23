/*
    20210825 完成大部分功能
    20210826 修正為未符合後台結果時不消失
    20210829 整理邏輯
*/

$(function () {

    var allCategories = $("div[id^=cat]");
    var allCategoriesBlock = $("div[id^=cat] > div[id^=myDIV]");
    var allQuestions = $("div[id^=myDIV] > div > button.QA");
    var allAnswers = $("div[id^=QA-DIV]");

    // 計算搜尋輸入框字數
    function faqKeyLengthCal() {
        $("#searchKeyLength").text($(".searchTerm").val().length + "/10");
        if ($(".searchTerm").val() != "") {
            $("#searchDelIcon").show();
        } else {
            $("#searchDelIcon").hide();
        }
    }

    // 檢查關鍵字是否合法
    function isMatchesReg(keyword) {
        var faqSearchKeyReg = "^[(\u4e00-\u9fa5)(a-zA-Z0-9)]{0,10}$";
        if (keyword.length > 0 && !keyword.match(faqSearchKeyReg)) {
            $("#searchKeyError").text("請輸入中文、英文、數字~");
            return false;
        }
        $("#searchKeyError").text("");
        return true;
    }

    // highlight plugin
    function faqHighlightJSKey(keyword) {
        $(allCategories).removeHighlight();
        if (keyword.length > 0) {
            $(allCategories).highlight(keyword);
        }
    }

    // 篩選搜尋關鍵字，並展開答案
    function faqSearch(keyword) {

        // 換關鍵字搜尋時，無論如何所有答案都要關閉
        $(allCategoriesBlock).removeClass('active');
        $(allQuestions).removeClass('active');
        $(allAnswers).removeClass('active');

        // 若關鍵字為空，重新收合所有標籤
        if ($(".searchTerm").val() == "") {
            $(allCategories).show();
            $(allCategoriesBlock).removeClass('active');
            $(allQuestions).removeClass('active');
            $(allAnswers).removeClass('active');
            // $(allQuestions).show();
            // $(allAnswers).hide();
            return;
        }

        allCategories.filter(function () {
            // 類別是否有找到
        });

        allQuestions.filter(function () {
            if ($(this).text().indexOf(keyword) > -1) {
                $(this).closest("div[id^=myDIV]").addClass('active');
                $(this).parent().parent().parent().find('button.tab').addClass('active');
            }
        });

        allAnswers.filter(function () {
            if ($(this).text().indexOf(keyword) > -1) {
                $(this).closest("div[id^=myDIV]").addClass('active');
                $(this).addClass('active');
                $(this).parent().parent().parent().find('button.tab').addClass('active');
                $(this).parent().find('button.QA').addClass('active');
            }
        });
    }

    // 點搜尋按鈕，觸發關鍵字搜尋
    $(".searchButton").on("click", function () {
        var faqSearchKeyStr = $(".searchTerm").val();
        if (isMatchesReg(faqSearchKeyStr)) {
            faqSearch(faqSearchKeyStr);
            faqHighlightJSKey(faqSearchKeyStr);
        }
    });

    // 輸入時，觸發計算字數功能、檢查合法輸入值
    // 按 enter 時同點擊搜尋按鈕
    $(".searchTerm").on("keyup", function (e) {
        faqKeyLengthCal();
        if (isMatchesReg($(this).val()) &&
            e.key === "Enter") {
            $(".searchButton").trigger("click");
        }
    });

    // 文字刪除(X)按鈕
    $(".search").on("click", "#searchDelIcon", function () {
        $(".searchTerm").val("");
        $(allCategories).removeHighlight();
        faqKeyLengthCal();
        $(".searchTerm").trigger("focus");

        $(allCategoriesBlock).removeClass('active');
        $(allQuestions).removeClass('active');
        $(allQuestions).parent().removeClass('active');
        $(allAnswers).removeClass('active');
        $('.faq-wrap button.tab').removeClass('active');
    });

});