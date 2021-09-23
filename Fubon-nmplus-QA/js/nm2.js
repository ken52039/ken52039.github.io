$(function () {
  // 引入header footer
  $("#header-wrap").load("header.html");
  $("#footer-wrap").load("footer.html");

  // arrow-link 背景圖形移動
  $(".arrow-link,.again-button").mousemove(function (e) {
    var a = $(this).offset().left;
    var b = $(this).offset().top;
    var x = e.pageX - a;
    var y = e.pageY - b;

    $(this)
      .find(".deco-circle")
      .css({
        left: x + "px",
        top: y + "px",
      });
  });

  // sec1 slider
  $("#sec1-slider").slick({
    variableWidth: true,
    centerMode: true,
    infinite: false,
    slidesToShow: 3,
  });
  $("#sec1-slider").on(
    "beforeChange",
    function (event, slick, currentSlide, nextSlide) {
      $("#sec1-slider-tags li").removeClass("now");
      $("#sec1-slider-tags li").eq(nextSlide).addClass("now");
      // mobile版本關閉提示
      $("#sec1-tip-icon").fadeOut();
    }
  );
  $("#sec1-slider-tags li").click(function () {
    var $index = $(this).index();
    $("#sec1-slider").slick("slickGoTo", $index);
  });

  // sec1 卡片標籤(績效表現/投組配置)
  $("#section1 .card-tags .tag").click(function () {
    $(this).addClass("active");
    $(this).siblings().removeClass("active");
    if ($(this).html() === "績效表現") {
      $(this).parent().next().find(".card-table-wrap").hide();
      $(this).parent().next().find(".card-barchart-wrap").show();
    } else {
      $(this).parent().next().find(".card-barchart-wrap").hide();
      $(this).parent().next().find(".card-table-wrap").show();
    }
  });

  // mobile版 了解更多+ 按鈕
  $("#section1 .btn-card-more-info").click(function () {
    $(this).toggleClass("active");
    $(this).siblings(".card-info-bottom").slideToggle();
  });

  gsap.registerPlugin(ScrollTrigger);

  // sec1 slider 手機板滑動提示
  var sec1tl = gsap.timeline();
  sec1tl.to("#sec1-tip-icon", {
    opacity: 0,
    delay: 3,
  });
  ScrollTrigger.create({
    animation: sec1tl,
    trigger: "#sec1-slider",
    start: "top center",
  });

  // sec2 timeline
  var sec2tl = gsap.timeline();
  var sec2ani = {
    opacity: 0,
    y: -100,
    stagger: 0.1,
  };
  if (window.innerWidth < 1280) {
    sec2ani = {
      opacity: 0,
      x: -100,
      stagger: 0.1,
    };
  }
  sec2tl.from("#section2 ul li", sec2ani);
  ScrollTrigger.create({
    animation: sec2tl,
    trigger: "#section2",
    start: "top center",
  });

  // sec3 timeline
  var sec3tl = gsap.timeline();
  var sec3ani = {
    opacity: 0,
    y: -100,
    stagger: 0.1,
  };
  if (window.innerWidth < 1280) {
    sec3ani = {
      opacity: 0,
      x: -100,
      stagger: 0.1,
    };
  }
  sec3tl.from("#section3 ul li", sec3ani);
  ScrollTrigger.create({
    animation: sec3tl,
    trigger: "#section3",
    start: "top center",
  });
  // sec4 timeline
  var sec4tl = gsap.timeline();
  sec4tl.from("#section4 .main-wrap", {
    opacity: 0,
    y: -100,
  });
  // .from("#section4 .main-wrap .zero-amount", {
  //   textContent: 10,
  //   duration: 1,
  //   snap: { textContent: 0.4 },
  // })
  // .from(
  //   "#section4 .main-wrap .other-amount",
  //   {
  //     textContent: 999,
  //     duration: 1,
  //     snap: { textContent: 1 },
  //   },
  //   "-=1"
  // );
  ScrollTrigger.create({
    animation: sec4tl,
    trigger: "#section4",
    start: "top center",
  });
  // sec5 timeline
  var sec5tl = gsap.timeline();
  sec5tl.from("#section5 .main-wrap", {
    opacity: 0,
    y: -100,
  });
  ScrollTrigger.create({
    animation: sec5tl,
    trigger: "#section5",
    start: "top center",
  });

  // Q&A toggle
  $("#section6 .question-wrap").click(function () {
    $(this).toggleClass("opened");
    $(this).siblings(".answer-wrap").slideToggle();
  });

  // 關閉跳窗
  $(".btn-close-popup").click(function () {
    $(this).closest(".popup-wrap").fadeOut();
    $("body").removeClass("scrolllock");
  });

  // 顯示跳窗 產業類別
  $("#section1 .btn-show-industrial-class").click(function () {
    $("body").addClass("scrolllock");
    $(".popup-industrial-class").fadeIn();
  });
  // 顯示跳窗 績效表現說明
  $("#section1 .btn-popup-performance-calc").click(function () {
    $("body").addClass("scrolllock");
    $(".popup-performance-cal").fadeIn();
  });
  // 顯示跳窗 其他投資-歷史績效表現說明
  $("#section5 .btn-popup-overall-performance-cal").click(function () {
    $("body").addClass("scrolllock");
    $(".popup-overall-performance-cal").fadeIn();
  });
  // 試算投資費用跳窗
  $("#btn-show-calc-popup").click(function () {
    $("body").addClass("scrolllock");
    $(".popup-calc").fadeIn();
  });
  $("#calc-input").change(function () {
    if (Number($(this).val()) < Number($(this).prop("min"))) {
      $(this).val($(this).prop("min")).trigger("change");
    }
    if (Number($(this).val()) > Number($(this).prop("max"))) {
      $(this).val($(this).prop("max")).trigger("change");
    }
    // When user select text in the document, also abort.
    var selection = window.getSelection().toString();
    if (selection !== "") {
      return;
    }
    var $this = $(this);
    // Get the value.
    var input = $this.val();
    input = input.replace(/[\D\s\._\-]+/g, "");
    input = input ? parseInt(input, 10) : 0;
    $this.val(function () {
      return input === 0 ? "" : input.toLocaleString("en-US");
    });
  });
  // 試算跳窗 試算按鈕
  $(".popup-calc .again-button").click(function () {
    $(this).find("span").text("再算一次");
    $(this).find("img").eq(0).hide();
    $(this).find("img").eq(1).show();
  });
});
