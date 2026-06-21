window.addEventListener("DOMContentLoaded", () => {
  uiBase.init();
});
window.addEventListener("load", () => {
  headerMenu();
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

/* header */
function headerMenu() {
  const mobile_total_layer = document.querySelector(".mobile_total_layer");
  const mobile_total_menu = document.querySelectorAll("[name='totalmenu']");
  const btn_mb_total_close = document.querySelector(".btn_mb_total_close");

  const mb_total_quick_slide = document.querySelectorAll(".mb_total_quick_list .swiper-slide");
  const bodyDom = document.querySelector("body");
  let touchstart = "ontouchstart" in window;
  let mbquickObj = null;


  if (!!mobile_total_menu) {
    mobile_total_menu.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        if (!!mobile_total_layer) {
          mobile_total_layer.classList.add("active");
        }
        console.log('mb total');
        mbQuickMenu();
        if (touchstart) {
          bodyDom.classList.add("touchDis");
        }
      });
    });
  }

  if (!!btn_mb_total_close) {
    btn_mb_total_close.addEventListener("click", (e) => {
      e.preventDefault();
      mobile_total_layer.classList.remove("active");
      bodyDom.classList.remove("touchDis");
    });
  }

  mbTotalBoth();

  function mbTotalBoth() {
    const bo_menu = document.querySelectorAll(".bo_menu");
    const bt_menu_li = document.querySelectorAll(".bt_menu_list > li");
    const bt_menu_cont = document.querySelectorAll(".bt_menu_cont");
    let bo_menu_active = document.querySelector(".bo_menu_list > li.active");
    let bo_cont_active = document.querySelector(".bt_menu_cont.active");
    let depth_bt_menu = null;
    if (!bo_menu) {
      return;
    }
    bo_menu.forEach((t_bo, menu_index) => {
      t_bo.addEventListener("click", (e) => {
        e.preventDefault();
        const etarget = e.currentTarget;
        const eparents = etarget.closest("li");

        if (bo_menu_active || bo_cont_active) {
          bo_menu_active.classList.remove("active");
          bo_cont_active.classList.remove("active");
        }
        eparents.classList.add("active");
        bo_menu_active = eparents;

        bt_menu_cont[menu_index].classList.add("active");
        bo_cont_active = bt_menu_cont[menu_index];
      });
    });

    bt_menu_li.forEach((t_menu) => {
      const t_depth_wrap = t_menu.querySelector(".bt_depth_wrap");
      if (!!t_depth_wrap) {
        t_menu.classList.add("has_depth");
      }
    });
    depth_bt_menu = document.querySelectorAll(".bt_menu_list > li.has_depth .bt_menu");
    depth_bt_menu.forEach((dt_menu) => {
      dt_menu.addEventListener("click", (e) => {
        e.preventDefault();
        const etarget = e.currentTarget;
        etarget.closest("li").classList.toggle("active");
      });
    });
  }

  function mbQuickMenu() {
    if (mb_total_quick_slide.length > 1) {
      if (mbquickObj == null) {
        mbquickObj = new Swiper(".mb_total_quick_wrap", {
          speed: 1000,
          slidesPerView: 4,
          slidesPerGroup: 4,
          freeMode: false,
          slidesPerGroupAuto: false,
          loop: false,
          pagination: {
            el: ".mb_total_quick_wrap .swiper-pagination",
            clickable: true,
          },
        });
      }
    }
  }
}

/* popup */
class DesignPopup {
  constructor(option) {
    // variable
    this.option = option;
    this.selector = document.querySelector(this.option.selector);
    this.touchstart = "ontouchstart" in window;
    if (!this.selector) {
      return;
    }

    this.design_popup_wrap = document.querySelectorAll(".popup_wrap");
    this.domHtml = document.querySelector("html");
    this.domBody = document.querySelector("body");
    this.pagewrap = document.querySelector(".page_wrap");
    this.layer_wrap_parent = null;
    this.btn_closeTrigger = null;
    this.scrollValue = 0;

    // init
    const popupGroupCreate = document.createElement("div");
    popupGroupCreate.classList.add("layer_wrap_parent");
    if (!this.layer_wrap_parent && !document.querySelector(".layer_wrap_parent")) {
      this.pagewrap.append(popupGroupCreate);
    }
    this.layer_wrap_parent = document.querySelector(".layer_wrap_parent");

    // event
    this.btn_close = this.selector.querySelectorAll(".btn_popup_close");
    this.bg_design_popup = this.selector.querySelector(".bg_dim");
    let closeItemArray = [...this.btn_close];
    if (!!this.selector.querySelectorAll(".close_trigger")) {
      this.btn_closeTrigger = this.selector.querySelectorAll(".close_trigger");
      closeItemArray.push(...this.btn_closeTrigger);
    }
    if (closeItemArray.length) {
      closeItemArray.forEach((element) => {
        element.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            this.popupHide(this.selector);
          },
          false
        );
      });
    }
  }
  dimCheck() {
    const popupActive = document.querySelectorAll(".popup_wrap.active");
    if (!!popupActive[0]) {
      popupActive[0].classList.add("active_first");
    }
    if (popupActive.length > 1) {
      this.layer_wrap_parent.classList.add("has_active_multi");
    } else {
      this.layer_wrap_parent.classList.remove("has_active_multi");
    }
  }
  popupShow(option) {
    let target = this.option.selector;
    let instance_option = option || {};
    this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
    if (this.selector == null) {
      return;
    }
    if (this.touchstart) {
      this.domHtml.classList.add("touchDis");
    }
    this.selector.classList.add("active");
    setTimeout(() => {
      this.selector.classList.add("motion_end");
      if ("openCallback" in instance_option) {
        instance_option.openCallback();
      }
    }, 30);
    if ("beforeCallback" in this.option) {
      this.option.beforeCallback();
    }
    if ("callback" in this.option) {
      this.option.callback();
    }
    this.layer_wrap_parent.append(this.selector);
    this.dimCheck();
  }
  popupHide(option) {
    let target = this.option.selector;
    let instance_option = option || {};
    if (!!target) {
      this.selector.classList.remove("motion");
      if ("beforeClose" in this.option) {
        this.option.beforeClose();
      }
      if ("beforeClose" in instance_option) {
        instance_option.beforeClose();
      }
      //remove
      this.selector.classList.remove("motion_end");
      setTimeout(() => {
        this.selector.classList.remove("active");
        let closeTimer = 0;
        if (closeTimer) {
          clearTimeout(closeTimer);
          closeTimer = 0;
        } else {
          if ("closeCallback" in this.option) {
            this.option.closeCallback();
          }
          closeTimer = setTimeout(() => {
            if ("closeCallback" in instance_option) {
              instance_option.closeCallback();
            }
          }, 30);
        }
      }, 400);
      this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
      this.dimCheck();

      if (this.design_popup_wrap_active.length == 1) {
        this.domHtml.classList.remove("touchDis");
      }
    }
  }
}


function pcTotalFunc() {
  const desk_tabmenu = $(".desk_tabmenu.d_tab");
  const desk_depth_wrap = $(".desk_depth_wrap");
  const desk_total_layer = $(".desk_total_layer");
  const desk_panel_container = $(".desk_panel_container");
  const hgroup_side_totalmenu = $(".hgroup_side_totalmenu");
  const btn_desk_total_close = $(".btn_desk_total_close");
  desk_tabmenu.on("click", function(e) {
    e.preventDefault();
    const $this = $(this);
    const $target = $($this.attr("href"));
    desk_tabmenu.removeClass("active");
    $this.addClass("active");
    if ($target) {
      desk_depth_wrap.removeClass("active");
      $target.addClass("active");
    }
  });
  btn_desk_total_close.on("click", function(e) {
    e.preventDefault();
    hgroup_side_totalmenu.removeClass("active");
    desk_total_layer.removeClass("active");
  });
  hgroup_side_totalmenu.on("click", function(e) {
    e.preventDefault();
    $(this).toggleClass("active");
    desk_total_layer.toggleClass("active");
  });
  $(document).on("click", function(e) {
    if ($(e.target).closest(".desk_panel_container,.hgroup_side_totalmenu").length === 0) {
      hgroup_side_totalmenu.removeClass("active");
      desk_total_layer.removeClass("active");
    }
  });
}


function mainBannerSwiperFunc() {
  const mainBannerSwiper = new Swiper(".swiper-container.mv-swiper", {
    slidesPerView: "auto",
    centeredSlides: true,
    spaceBetween: 26,
    loop: true,
    speed: 800,

    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },

    pagination: {
      el: ".swiper-pagination.mv-pagination",
      clickable: true,
    },

    observer: true,
    observeParents: true,

    navigation: {
      nextEl: ".mv-swiper-global .btn-navi.next",
      prevEl: ".mv-swiper-global .btn-navi.prev",
    },
    breakpoints: {
      1023: {
        spaceBetween: 18,
      },
    },
  });
}