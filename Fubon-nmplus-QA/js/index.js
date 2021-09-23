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

  // kv slider
  $("#kv-slider").slick({
    arrows: false,
    dots: true,
    autoplay: true,
    autoplaySpeed: 10000,
    pauseOnFocus: true,
    pauseOnHover: true,
  });

  // sec3 理財小學堂 切換tag
  $("#section3 .sec3-tags li").click(function () {
    $(this).addClass("now").siblings().removeClass("now");
    var $index = $(this).index();
    $("#section3 .sec3-card").hide();
    $("#section3 .sec3-card").eq($index).css("display", "flex").hide().fadeIn();
  });

  // sec4 slider
  $("#sec4-slider").slick({
    arrows: true,
    autoplay: true,
    autoplaySpeed: 10000,
    pauseOnFocus: true,
    pauseOnHover: true,
  });

  // kv 動畫
  var kvtl = gsap.timeline();
  kvtl.from("#kv-section .text-ani-container", {
    x: 100,
    opacity: 0,
    delay: 0.5,
  });

  // 捲動動畫
  gsap.registerPlugin(ScrollTrigger);
  function format_number(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  // sec1 數字 卡片下淡入
  var counter1 = document.getElementById("amount1");
  var counter1Value = {
    val: parseInt(counter1.innerText),
  };
  var sec1tl = gsap.timeline();
  sec1tl.from("#sec1-main-wrap", {
    opacity: 0,
    y: -100,
  });
  ScrollTrigger.create({
    animation: sec1tl,
    trigger: "#sec1-main-wrap",
    start: "top center",
  });
  // sec2 卡片下淡入
  var sec2tl = gsap.timeline();
  sec2tl.from("#section2 .main-wrap", {
    opacity: 0,
    y: -100,
    stagger: 0.2,
  });
  ScrollTrigger.create({
    animation: sec2tl,
    trigger: "#section2",
    start: "top center",
  });
  // sec4 數字
  var counter2 = document.getElementById("sec4-num1");
  var counter2Value = {
    val: parseInt(counter2.innerText),
  };
  var counter3 = document.getElementById("sec4-num2");
  var counter3Value = {
    val: parseInt(counter3.innerText),
  };
  var sec4tl = gsap.timeline();
  sec4tl
    .to(counter2Value, {
      val: 637000,
      duration: 2.5,
      roundProps: "val",
      onUpdate: function () {
        counter2.innerText = format_number(counter2Value.val);
      },
    })
    .to(
      counter3Value,
      {
        val: 35800,
        duration: 2.5,
        roundProps: "val",
        onUpdate: function () {
          counter3.innerText = format_number(counter3Value.val);
        },
      },
      "-=2.5"
    );
  ScrollTrigger.create({
    animation: sec4tl,
    trigger: "#section4",
    start: "top bottom",
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

  // 顯示跳窗 其他投資-歷史績效表現說明
  $("#section2 .btn-popup-overall-performance-cal").click(function () {
    $("body").addClass("scrolllock");
    $(".popup-overall-performance-cal").fadeIn();
  });

  // 顯示跳窗 比較奈米1,2號
  $("#btn-sec2-show-popup").click(function () {
    $("#popup-table").css("display", "flex").hide().fadeIn();
  });
  // 關閉跳窗 1,2號差異
  $("#btn-close-table-popup").click(function () {
    $("#popup-table").fadeOut();
  });
});
