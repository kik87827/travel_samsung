window.addEventListener("DOMContentLoaded", () => {
  uiBase.init();
});
window.addEventListener("load", () => {
  rankLayerFunc();
});

const uiBase = {
  init() {
    // 현재 객체 내의 모든 메서드 순회
    for (const key in this) {
      if (typeof this[key] === "function" && key !== "init") {
        this[key]();
      }
    }
  },
  commonInit() {
    let touchstart = "ontouchstart" in window;
    let userAgent = navigator.userAgent.toLowerCase();
    if (touchstart) {
      browserAdd("touchmode");
    }
    if (userAgent.indexOf("samsung") > -1) {
      browserAdd("samsung");
    }

    if (navigator.platform.indexOf("Win") > -1 || navigator.platform.indexOf("win") > -1) {
      browserAdd("window");
    }

    // 251012 추가
    function isKakaoWebBrowser() {
      const ua = navigator.userAgent.toLowerCase();
      return ua.includes("kakaotalk") || ua.includes("kakaobrowser");
    }
    if (isKakaoWebBrowser()) {
      browserAdd("kakao");
    }

    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
      // iPad or iPhone
      browserAdd("ios");
    }

    function browserAdd(opt) {
      document.querySelector("html").classList.add(opt);
    }
  },
  setVhProperty() {
    setProperty();
    window.addEventListener("resize", () => {
      setProperty();
    });

    function setProperty() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
  },
};

/* header 상단배너 */
function headerTapeFunc() {
  var mobileSwiper = null;
  var resizeTimer = null;
  var $slider = $(".header_sns_container");

  // 현재 PC / 모바일 상태 저장
  var currentMode = window.innerWidth <= 1023 ? "mobile" : "pc";

  function clearSwiperClass() {
    $slider.removeAttr("style").removeClass("swiper-container-horizontal swiper-container-vertical swiper-container-initialized");

    $slider.find(".swiper-wrapper").removeAttr("style");

    $slider.find(".swiper-slide").removeAttr("style").removeClass("swiper-slide-active swiper-slide-next swiper-slide-prev swiper-slide-duplicate");

    // loop:true 사용 시 생성된 clone 제거
    $slider.find(".swiper-slide-duplicate").remove();

    $slider.find(".swiper-pagination").empty();
  }

  function initMobileSwiper() {
    var isMobile = window.innerWidth <= 1023;

    if (isMobile && mobileSwiper === null) {
      mobileSwiper = new Swiper(".header_sns_container", {
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
      });
    }

    if (!isMobile && mobileSwiper !== null) {
      mobileSwiper.destroy(true, true);

      // loop:true 사용 시 destroy 후 남아있는 clone 제거
      $slider.find(".swiper-slide-duplicate").remove();

      mobileSwiper = null;

      clearSwiperClass();
    }

    if (!isMobile) {
      clearSwiperClass();
    }
  }

  function rowEventFunc() {
    $(".btn_row_close").on("click", function(e) {
      e.preventDefault();
      $(this).closest(".header_sns_top_row").slideUp();
    });
  }

  initMobileSwiper();
  rowEventFunc();

  $(window).on("resize.headerTapeFunc", function() {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(function() {
      var nextMode = window.innerWidth <= 1023 ? "mobile" : "pc";

      // 모바일 상태에서 발생하는 resize 무시
      // 예: 가로/세로 전환, 키보드 올라옴, 주소창 높이 변경
      if (currentMode === "mobile" && nextMode === "mobile") {
        return;
      }

      // PC 상태에서 발생하는 resize 무시
      if (currentMode === "pc" && nextMode === "pc") {
        return;
      }

      // PC ↔ 모바일 경계가 바뀔 때만 실행
      currentMode = nextMode;
      initMobileSwiper();
    }, 200);
  });
}

function rankLayerFunc() {
  let rankSwiperObj = null;
  let rankResizeTimer = null;

  function rankFunc() {
    const pcWidth = 768;
    const header_wrap = document.querySelector(".header_wrap");
    const header_rank_field = document.querySelector(".header_rank_field");
    const rank_all_item_wrap = document.querySelector(".rank_all_item_wrap");

    function initRankSwiper() {
      const isPc = window.innerWidth >= pcWidth;
      const slides = document.querySelectorAll(".rank-container .swiper-slide");

      if (!isPc) {
        if (rankSwiperObj !== null) {
          rankSwiperObj.destroy(true, true);
          rankSwiperObj = null;
        }
        return;
      }

      if (slides.length <= 1) return;

      if (rankSwiperObj === null) {
        rankSwiperObj = new Swiper(".rank-container", {
          loop: true,
          direction: "vertical",
          autoplay: {
            delay: 4000,
            disableOnInteraction: false,
          },
          observer: true,
          observeParents: true,
        });
      } else {
        rankSwiperObj.update();
        rankSwiperObj.autoplay.start();
      }
    }

    initRankSwiper();

    window.addEventListener("resize", function() {
      clearTimeout(rankResizeTimer);

      rankResizeTimer = setTimeout(function() {
        initRankSwiper();
      }, 200);
    });

    if (header_rank_field && rank_all_item_wrap && header_wrap) {
      header_rank_field.addEventListener("mouseenter", function() {
        rank_all_item_wrap.style.display = "block";
      });

      rank_all_item_wrap.addEventListener("mouseenter", function() {
        rank_all_item_wrap.style.display = "block";
      });

      header_wrap.addEventListener("mouseleave", function() {
        rank_all_item_wrap.style.display = "none";
      });
    }
  }
  rankFunc();
}