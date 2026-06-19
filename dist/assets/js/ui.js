window.addEventListener("DOMContentLoaded", () => {
  uiBase.init();
});
window.addEventListener("load", () => {
  headerMenu();
  rankFunc();
  layoutCommon();
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
  pageTopgo() {
    const btn_topgo = document.querySelector(".btn_pagetop");
    if (!!btn_topgo) {
      btn_topgo.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth"
        });
      });
    }
  },
  footerFunc() {
    var noticeFooterSwiper = new Swiper(".footer_notice_container", {
      direction: "vertical",
      loop: true,
      autoplay: {
        delay: 4000, // 4초마다 롤링
        disableOnInteraction: false, // 사용자 인터랙션 후에도 계속 롤링
      },
      allowTouchMove: false, // 터치/드래그 비활성화
      speed: 500, // 전환 애니메이션 속도 (ms)
    });

    const foot_copy_toggle = document.querySelector(".foot_copy_toggle");
    const foot_copy_toggle_contents = document.querySelector(".foot_copy_toggle_contents");

    if (!!foot_copy_toggle) {
      foot_copy_toggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.currentTarget.classList.toggle("active");
        foot_copy_toggle_contents.classList.toggle("active");
      });
    }
  },
};

function headerMenu() {
  const header_wrap = document.querySelector(".header_wrap");
  const btn_header_total = document.querySelector("[name='pcmenu']");
  const global_menu_layer = document.querySelector(".global_menu_layer");
  const gmenu_toggle = document.querySelectorAll(".gmenu_toggle");
  const tmenu_one = document.querySelectorAll(".tmenu_one");
  // const tmenu_one_text = document.querySelectorAll(".tmenu_one_text");
  const mobile_total_layer = document.querySelector(".mobile_total_layer");
  const gnb_twodepth_layer = document.querySelector(".gnb_twodepth_layer");
  const gnb_twodepth_layer_gnbtwocont = document.querySelectorAll(".gnb_twodepth_layer .gnb_two_cont");
  const mobile_total_menu = document.querySelectorAll("[name='totalmenu']");
  const btn_mb_total_close = document.querySelector(".btn_mb_total_close");
  const hgroup_nav_menu = document.querySelectorAll(".hgroup_nav_menu");
  const hgroup_gnb_row = document.querySelector(".hgroup_gnb_row");
  const hgroup_main_row = document.querySelector(".hgroup_main_row");
  const gnb_two_cont = document.querySelectorAll(".gnb_two_cont");
  const hgroup_nav_item = document.querySelectorAll(".hgroup_nav_item");

  const mb_total_quick_slide = document.querySelectorAll(".mb_total_quick_list .swiper-slide");
  const bodyDom = document.querySelector("body");
  const htmlDom = document.querySelector("html");
  let windowWidth = 0;

  let mbquickObj = null;
  if (btn_header_total === null || global_menu_layer === null) {
    return;
  }

  btn_header_total.addEventListener("click", (e) => {
    e.preventDefault();
    const thisTarget = e.currentTarget;
    thisTarget.classList.toggle("active");
    global_menu_layer.classList.toggle("active");
    textHeightResize2(global_menu_layer.querySelectorAll(".gmenu_one"));
    if (!!gnb_twodepth_layer) {
      gnb_twodepth_layer.classList.remove("active");
    }
  });

  window.addEventListener("resize", () => {
    if (windowWidth !== window.innerWidth) {
      if (window.innerWidth < 1024) {
        gnbgmenuFunc();
      }
    }
    windowWidth = window.innerWidth;
  });

  if (!!gmenu_toggle) {
    gmenu_toggle.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const thisTarget = e.currentTarget;
        thisTarget.closest(".gmenu_item").classList.toggle("active");
        textHeightResize2(thisTarget.closest(".gmenu_item").querySelectorAll(".gmenu_one"));
      });
    });
  }

  gnbgmenuFunc();

  function gnbgmenuFunc() {
    const gnb_two_cont = document.querySelectorAll(".gnb_two_cont");
    const gnb_two_cont_li = document.querySelectorAll(".gnb_two_cont .gmenu_list > li");
    if (!!gnb_two_cont) {
      gnb_two_cont.forEach((item) => {
        if (item.querySelectorAll(".gmenu_list > li").length < 4) {
          item.classList.add("short");
        } else {
          item.classList.add("pos_center");
        }
      });
    }
  }

  if (!!hgroup_nav_menu) {
    hgroup_nav_menu.forEach((item) => {
      item.addEventListener("mouseenter", (e) => {
        const etarget = e.currentTarget;
        if (global_menu_layer.classList.contains("active")) {
          return;
        }
        if (etarget.getAttribute("href") === "#") {
          return;
        }
        const etwo = document.querySelector(etarget.getAttribute("href"));
        const etwo_li = etwo.querySelectorAll(".gmenu_list > li");
        if (!!gnb_two_cont) {
          gnb_two_cont.forEach((item) => {
            item.classList.remove("active", "pos_left", "pos_right", "ready");
          });
          etwo.classList.add("ready");
          gnb_twodepth_layer.classList.add("active");
          etwo.style.left = etarget.getBoundingClientRect().left + etarget.getBoundingClientRect().width / 2 - etwo.getBoundingClientRect().width / 2 + "px";
          if (etwo.getBoundingClientRect().left < 0) {
            etwo.classList.add("pos_left");
          } else if (etwo.getBoundingClientRect().left + etwo.getBoundingClientRect().width > window.innerWidth) {
            etwo.classList.add("pos_right");
          }
          etwo.classList.remove("ready");
          etwo.classList.add("active");
          textHeightResize(etarget.getAttribute("href") + " .gmenu_one");
        }
      });
    });
  }
  if (!!hgroup_nav_item) {
    hgroup_nav_item.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        if (!!gnb_twodepth_layer) {
          gnb_twodepth_layer.classList.remove("active");
        }
      });
    });
  }

  if (!!hgroup_gnb_row) {
    hgroup_gnb_row.addEventListener("mouseleave", () => {
      if (!!gnb_twodepth_layer) {
        gnb_twodepth_layer.classList.remove("active");
      }
    });
  }

  if (!!hgroup_main_row) {
    hgroup_main_row.addEventListener("mouseleave", () => {
      if (!!gnb_twodepth_layer) {
        gnb_twodepth_layer.classList.remove("active");
      }
    });
  }

  /* if (!!tmenu_one_text) {
    tmenu_one_text.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const thisTarget = e.currentTarget;
        thisTarget.closest(".tmenu_toggle_item").classList.toggle("active");
      });
    });
  } */

  if (!!mobile_total_menu) {
    mobile_total_menu.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        if (!!mobile_total_layer) {
          mobile_total_layer.classList.add("active");
        }

        mbQuickMenu();
        bodyDom.classList.add("touchDis");
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

function rankFunc() {
  let rank_container_slide = document.querySelectorAll(".rank-container .swiper-slide");
  const header_wrap = document.querySelector(".header_wrap");
  const header_search_wrap = document.querySelector(".header_search_wrap");
  const header_rank_field = document.querySelector(".header_rank_field");
  const rank_all_item_wrap = document.querySelector(".rank_all_item_wrap");
  let rank_swiper_obj = null;
  if (rank_swiper_obj !== null) {
    rank_swiper_obj.update();
  } else {
    if (rank_container_slide.length > 1) {
      rank_swiper_obj = new Swiper(".rank-container", {
        loop: true,
        direction: "vertical",
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
      });
    }
  }
  if (!!header_rank_field) {
    header_rank_field.addEventListener("mouseenter", () => {
      rank_all_item_wrap.style.display = "block";
    });
    rank_all_item_wrap.addEventListener("mouseenter", () => {
      rank_all_item_wrap.style.display = "block";
    });
    header_wrap.addEventListener("mouseleave", () => {
      rank_all_item_wrap.style.display = "none";
    });
  }
}

function layoutCommon() {
  const header_wrap = document.querySelector(".header_wrap");
  const middle_wrap = document.querySelector(".middle_wrap");
  const footer_wrap = document.querySelector(".footer_wrap");
  const floating_layer = document.querySelector(".floating_layer");
  let header_wrap_height = 0;
  let footer_wrap_height = !!footer_wrap ? footer_wrap.getBoundingClientRect().height : 0;
  const bodyDom = document.querySelector("body");
  const htmlDom = document.querySelector("html");
  let scrollend = bodyDom.scrollHeight - window.innerHeight;
  const footerlistItems = document.querySelectorAll(".foot_main_menu_list > li:not(.mb_menu)");
  const footerlistLastItem = footerlistItems[footerlistItems.length - 1];

  // footer menu selector
  if (!!footerlistLastItem) {
    footerlistLastItem.classList.add("last");
  }

  //minHeightFunc();
  btnTop();

  let windowWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    if (window.innerWidth !== windowWidth) {
      //minHeightFunc();
      footer_wrap_height = !!footer_wrap ? footer_wrap.getBoundingClientRect().height : 0;
      if (window.innerWidth > 1023) {
        if (!!footerlistLastItem) {
          footerlistLastItem.classList.add("last");
        }
      } else {
        if (!!footerlistLastItem) {
          footerlistLastItem.classList.remove("last");
        }
      }
    }
    windowWidth = window.innerWidth;
  });

  scrollFloating();
  window.addEventListener("scroll", () => {
    scrollFloating();
  });

  /* function minHeightFunc(){
		if(!!middle_wrap){
			header_wrap_height = !!header_wrap ? header_wrap.getBoundingClientRect().height : 0;
			footer_wrap_height = !!footer_wrap ? footer_wrap.getBoundingClientRect().height : 0;
			middle_wrap.style.minHeight = 'calc(100vh - '+(footer_wrap_height+header_wrap_height) +'px)';
		}
	} */

  function btnTop() {
    let btn_gotop = document.querySelector(".btn_pagetop");
    if (btn_gotop === null) {
      return;
    }
    btn_gotop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo(0, 0);
    });
  }

  function scrollFloating() {
    if (!floating_layer) {
      return;
    }
    if (scrollend <= window.scrollY) {
      floating_layer.style.display = "none";
    } else {
      floating_layer.style.display = "block";
    }
  }
}

function textHeightResize(target) {
  const targetDom = $(target) || target;

  action();

  window.addEventListener("resize", () => {
    action();
  });

  function action() {
    targetDom.css({
      height: ""
    });
    let arrayHeight = [];
    targetDom.each(function() {
      arrayHeight.push($(this).height());
    });
    targetDom.css({
      height: Math.max.apply(null, arrayHeight)
    });
  }
}

function textHeightResize2(target) {
  const targetDom = target;

  action();

  window.addEventListener("resize", () => {
    action();
  });

  function action() {
    targetDom.forEach((item) => {
      item.removeAttribute("style");
    });
    let arrayHeight = [];
    targetDom.forEach((item) => {
      arrayHeight.push(item.getBoundingClientRect().height);
    });
    targetDom.forEach((item) => {
      item.style.height = Math.max.apply(null, arrayHeight) + "px";
    });
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

function stickyTab() {
  const header_wrap = document.querySelector(".header_wrap");
  const detailAnchorContentsWrap = document.querySelector(".detail_anchor_contents_wrap");
  const stickyTabsContainerZone = document.querySelector(".sticky_tabs_container_zone");
  const tabContents = document.querySelectorAll(".tab_contents");
  const stickyTabsInnerWrap = document.querySelector(".sticky_tabs_inner_wrap");
  const stickyTabsInner = document.querySelector(".sticky_tabs_inner");
  const stickyTab = document.querySelectorAll(".sticky_tab");
  let detailAnchorContentsWrapPos = !!detailAnchorContentsWrap ? detailAnchorContentsWrap.getBoundingClientRect().top + window.scrollY : 0;
  let getPosValue = getLayerPos();
  let getPosHeight = getHeight();
  let getPosArrayValue = getPosArray();
  let getWindowWid = window.innerWidth;
  let activeItem = document.querySelector(".sticky_tab.active");
  let btnClickIs = false;

  let detail_anctab_obj = null;
  const detail_anctab_swiper = document.querySelector(".sticky_tabs_swiper_container");
  const detail_anctab_slide = !!detail_anctab_swiper ? detail_anctab_swiper.querySelectorAll(".swiper-slide") : null;

  if (!!stickyTabsContainerZone && !!stickyTabsInnerWrap) {
    stickyTabsContainerZone.style.minHeight = stickyTabsInnerWrap.getBoundingClientRect().height + "px";
  }

  if (!!detail_anctab_slide) {
    if (detail_anctab_obj !== null) {
      detail_anctab_obj.update();
    } else {
      if (window.innerWidth < 1024) {
        mbFunc();
      }

      window.addEventListener("resize", () => {
        if (getWindowWid !== window.innerWidth) {
          if (detail_anctab_obj !== null) {
            detail_anctab_obj.destroy();
          }
          if (window.innerWidth < 1024) {
            mbFunc();
          }
        }
        getWindowWid = window.innerWidth;
      });
    }

    function mbFunc() {
      detail_anctab_obj = new Swiper(".sticky_tabs_swiper_container", {
        slidesPerView: "auto",
        slidesPerGroupAuto: true,
        freeMode: true,
      });
    }
  }
  updateActiveMenu();
  let windowwid = window.innerWidth;
  window.addEventListener("resize", () => {
    //btnClickIs = false;
    activeSlideTo();
    if (windowwid !== window.innerWidth) {
      updateOnlyActiveMenu();
      triggerActiveScroll();
    }
    windowwid = window.innerWidth;
  });

  window.addEventListener("touchstart", () => {
    btnClickIs = false;
  });

  window.addEventListener("mousewheel", () => {
    btnClickIs = false;
  });

  window.addEventListener("mousedown", () => {
    btnClickIs = false;
    updateValue();
  });

  window.addEventListener("scroll", () => {
    updateValue();
    scrollAction();
  });

  /* window.addEventListener("touchmove", () => {
    updateValue();
    scrollAction();
  }); */

  detailAnchorContentsWrap.addEventListener("updateScroll", () => {
    updateValue();
    scrollAction();
  });

  function updateValue() {
    getPosValue = getLayerPos();
    getPosHeight = getHeight();
    getPosArrayValue = getPosArray();
    detailAnchorContentsWrapPos = !!detailAnchorContentsWrap ? detailAnchorContentsWrap.getBoundingClientRect().top + window.scrollY : 0;
  }

  stickyTab.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const thisTarget = e.currentTarget;
      const thisScrollPosTop = document.querySelector(thisTarget.getAttribute("href")).getBoundingClientRect().top;
      let thisScrollGo = 0;
      let headerWrapHeight = !!header_wrap ? header_wrap.getBoundingClientRect().height : 0;
      let stickyHeight = !!stickyTabsInner ? stickyTabsInner.getBoundingClientRect().height : 0;
      let thisScrollPos = thisScrollPosTop + window.scrollY - getPosHeight;
      let thisScrollMbPos = thisScrollPosTop + window.scrollY - (stickyHeight + headerWrapHeight);

      if (window.innerWidth > 1023) {
        thisScrollGo = thisScrollPos;
      } else {
        thisScrollGo = thisScrollMbPos;
      }

      if (!!thisScrollPos && !detail_anctab_swiper.classList.contains("normal_ui_tab")) {
        window.scrollTo({
          top: thisScrollGo,
          left: 0,
          behavior: "smooth",
        });
      } else {
        let thisTargetAtt = thisTarget.getAttribute("href");
        let thisTargetDom = document.querySelector(thisTargetAtt);
        let thisTagetDomNo = siblings(thisTargetDom);

        if (!!thisTargetDom) {
          if (!!thisTagetDomNo) {
            thisTagetDomNo.forEach((item) => {
              item.classList.remove("active");
            });
          }
          thisTargetDom.classList.add("active");
          triggerScrollEvent();
        }
      }
      btnClickIs = true;
      activeTab(thisTarget);
    });
  });

  // 스크롤 이벤트를 강제로 트리거
  function triggerScrollEvent() {
    const scrollEvent = new Event("scroll");
    window.dispatchEvent(scrollEvent);
  }

  function triggerActiveScroll() {
    const stickyTabActive = document.querySelector(".sticky_tab.active");
    if (!stickyTabActive) {
      return;
    }
    // Create the event
    let event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    if (document.querySelectorAll(".sticky_tab")[0] == stickyTabActive && !stickyTabsInnerWrap.classList.contains("fixed")) {
      return;
    }
    setTimeout(() => {
      stickyTabActive.dispatchEvent(event);
    }, 100);
  }

  function getLayerPos() {
    if (!!stickyTabsContainerZone) {
      let localTop = stickyTabsContainerZone.getBoundingClientRect().top;
      return localTop - stickyTabsInnerWrap.getBoundingClientRect().height / 2 + window.scrollY;
    }
  }

  function getPosArray() {
    let posArray = [];
    let headerWrapHeight = !!header_wrap ? header_wrap.getBoundingClientRect().height : 0;
    let stickyFixedHeight = !!stickyTabsInner ? stickyTabsInner.getBoundingClientRect().height : 0;
    if (!!tabContents) {
      tabContents.forEach((item) => {
        let eachTop = item.getBoundingClientRect().top;
        if (window.innerWidth > 1023) {
          posArray.push(eachTop + window.scrollY - getPosHeight);
        } else {
          posArray.push(eachTop + window.scrollY - (stickyFixedHeight + headerWrapHeight));
        }
      });
    }
    return posArray;
  }

  function getHeight() {
    if (!!stickyTabsInner) {
      return stickyTabsInner.getBoundingClientRect().height;
    }
  }

  function scrollAction() {
    if (!stickyTabsInnerWrap) {
      return;
    }
    if (getPosValue < window.scrollY) {
      stickyTabsInnerWrap.classList.add("fixed");
    } else {
      stickyTabsInnerWrap.classList.remove("fixed");
    }
    if (!btnClickIs) {
      updateActiveMenu();
    }
  }

  function updateActiveMenu() {
    if (!!detail_anctab_swiper.classList.contains("normal_ui_tab")) {
      return;
    }
    stickyTab.forEach((item, index) => {
      if (getPosArrayValue[index] <= window.scrollY) {
        activeTab(item);
      }
    });
  }

  function activeSlideTo() {
    stickyTab.forEach((item, index) => {
      if (detail_anctab_obj !== null && window.innerWidth < 1024) {
        if (item.classList.contains("active")) {
          detail_anctab_obj.slideTo(index);
        }
      }
    });
  }

  function updateOnlyActiveMenu() {
    if (!!detail_anctab_swiper.classList.contains("normal_ui_tab")) {
      return;
    }
    if (!btnClickIs) {
      stickyTab.forEach((item, index) => {
        if (getPosArrayValue[index] <= window.scrollY) {
          activeTab(item);
        }
      });
    }
  }

  function activeTab(target) {
    if (activeItem) {
      activeItem.classList.remove("active");
    }
    target.classList.add("active");
    if (!!detail_anctab_obj) {
      detail_anctab_obj.update();
    }
    activeSlideTo();
    activeItem = target;
  }
}

function stickyPanel() {
  const detailCalculationZone = document.querySelector(".detail_calculation_zone");
  const detailCalculationWrap = document.querySelector(".detail_calculation_wrap");
  const dc_inner_get_container = document.querySelector(".dc_inner_get_container");
  const detailContentsGlobalZone = document.querySelector(".detail_contents_global_zone");
  const detailContentsZone = document.querySelector(".detail_contents_zone");
  const footerWrap = document.querySelector(".footer_wrap");
  let footerWrapPos = !!footerWrap ? footerWrap.getBoundingClientRect().top + window.scrollY : 0;
  let footerWrapHeight = !!footerWrap ? footerWrap.getBoundingClientRect().height : 0;
  let detailContentsZoneHeight = !!detailContentsZone ? detailContentsZone.getBoundingClientRect().height : 0;
  let detailCalculationWrapHeight = !!detailCalculationWrap ? detailCalculationWrap.getBoundingClientRect().height : 0;
  let detailCalculationZonePos = !!detailCalculationZone ? detailCalculationZone.getBoundingClientRect().top + window.scrollY : 0;
  let detailContentsGlobalZonePos = !!detailContentsGlobalZone ? detailContentsGlobalZone.getBoundingClientRect().top + detailContentsGlobalZone.getBoundingClientRect().height + window.scrollY : 0;
  let getWindowWid = window.innerWidth;
  let dcInnerGetContainerHeight = !!dc_inner_get_container ? dc_inner_get_container.getBoundingClientRect().height : 0;
  let bodyHeight = document.querySelector("body").getBoundingClientRect().height;
  window.addEventListener("resize", () => {
    if (getWindowWid !== window.innerWidth) {
      detailCalculationZonePos = !!detailCalculationZone ? detailCalculationZone.getBoundingClientRect().top + window.scrollY : 0;
    }
    getWindowWid = window.innerWidth;
  });

  window.addEventListener("scroll", () => {
    scrollAction();
  });

  window.addEventListener("touchmove", () => {
    scrollAction();
  });

  function scrollAction() {
    detailContentsZoneHeight = !!detailContentsZone ? detailContentsZone.getBoundingClientRect().height : 0;
    detailCalculationWrapHeight = !!detailCalculationWrap ? detailCalculationWrap.getBoundingClientRect().height : 0;
    footerWrapPos = !!footerWrap ? footerWrap.getBoundingClientRect().top + 120 + window.scrollY : 0;
    footerWrapHeight = !!footerWrap ? footerWrap.getBoundingClientRect().height : 0;
    dcInnerGetContainerHeight = !!dc_inner_get_container ? dc_inner_get_container.getBoundingClientRect().height : 0;
    //detailContentsGlobalZonePos = !!detailContentsGlobalZone ? detailContentsGlobalZone.getBoundingClientRect().top + detailContentsGlobalZone.getBoundingClientRect().height + window.scrollY : 0;
    detailContentsGlobalZonePos = !!detailContentsGlobalZone ? detailContentsGlobalZone.getBoundingClientRect().bottom + window.scrollY : 0;

    if (!!detailCalculationWrap) {
      //if(detailCalculationWrapHeight+30 >=detailContentsZoneHeight){return;}
      if (detailCalculationZonePos < window.scrollY) {
        detailCalculationWrap.classList.add("fixed");
        if (detailContentsGlobalZonePos - dcInnerGetContainerHeight < window.scrollY) {
          detailCalculationWrap.classList.add("bottom");
        } else {
          detailCalculationWrap.classList.remove("bottom");
        }
      } else {
        detailCalculationWrap.classList.remove("fixed");
      }
    }
  }
}

function mobileBottomLayer() {
  const footer_wrap = document.querySelector(".footer_wrap");
  const mb_bottom_layer = document.querySelector(".mb_bottom_layer");
  const open_trigger = document.querySelectorAll(".open_trigger");
  const middle_wrap = document.querySelector(".middle_wrap");
  const domHtml = document.querySelector("html");
  let btn_mbb_toggle = null;
  let mb_bottom_content = null;
  if (!!mb_bottom_layer) {
    btn_mbb_toggle = mb_bottom_layer.querySelector(".btn_mbb_toggle");
    mb_bottom_content = mb_bottom_layer.querySelector(".mb_bottom_content");
  }
  let windowWid = window.innerWidth;

  if (!mb_bottom_layer) {
    return;
  }
  action();
  window.addEventListener("resize", () => {
    if (windowWid !== window.innerWidth) {
      action();
    }
    windowWid = window.innerWidth;
  });
  btn_mbb_toggle.addEventListener("click", (e) => {
    e.preventDefault();
    btn_mbb_toggle.classList.toggle("active");
    mb_bottom_content.classList.toggle("active");
    domHtml.classList.toggle("touchDis");
  });

  if (open_trigger.length) {
    open_trigger.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        openAction();
      });
    });
  }

  function openAction() {
    btn_mbb_toggle.classList.add("active");
    mb_bottom_content.classList.add("active");
    domHtml.classList.add("touchDis");
  }

  function action() {
    if (window.innerWidth < 1024) {
      footer_wrap.style.paddingBottom = mb_bottom_layer.getBoundingClientRect().height + 40 + "px";
    } else {
      domHtml.classList.remove("touchDis");
      footer_wrap.style.paddingBottom = "0px";
    }
  }
}

function fieldboxGridFunc() {
  const search_fieldbox_wrap = $(".search_fieldbox_wrap");
  const keylabel = search_fieldbox_wrap.find(".obj_form_item .keylabel");

  action();
  $(window).on("resize", function() {
    action();
  });

  function action() {
    keylabel.css("width", "");

    if ($(window).width() > 1023) {
      const columns = 3;
      const columnGroups = Array.from({
        length: columns
      }, () => []);

      keylabel.each(function(index) {
        const columnIndex = index % columns;
        columnGroups[columnIndex].push(this);
      });

      columnGroups.forEach((group, colIndex) => {
        let maxWidth = 0;
        group.forEach((el) => {
          const width = $(el).outerWidth();
          if (width > maxWidth) maxWidth = width;
        });
        $(group).css("width", maxWidth);
      });
    } else {
      let maxWidthLabel = [];
      keylabel.each(function(index) {
        maxWidthLabel.push($(this).outerWidth());
      });
      keylabel.css("width", Math.max.apply(null, maxWidthLabel));
    }
  }
}

function responThFunc(targets) {
  // 문자열이면 배열로 변환
  const targetArray = typeof targets === "string" ? [targets] : targets;

  const $elements = targetArray.map((selector) => $(selector)).filter(Boolean);

  action(); // 초기 실행
  $(window).on("resize", action); // 리사이즈 대응

  function action() {
    $elements.forEach(($fieldset) => {
      $fieldset.each(function() {
        const $thisTb = $(this);
        const $thisThText = $thisTb.find(".d_label_text");
        const $thisThCols = $thisTb.find(".d_label_cols");
        let $thisMaxArray = [];
        $thisThCols.css("flex-basis", "");

        if ($(window).width() <= 1023) {
          $thisThText.each(function() {
            $thisMaxArray.push($(this).outerWidth());
          });
          $thisThCols.css("flex-basis", Math.max.apply(null, $thisMaxArray));
        }
      });
    });
  }
}

function responWidFunc() {
  const responDom = $("[data-pcwid]");
  action();
  $(window).on("resize", function() {
    action();
  });

  function action() {
    responDom.css("width", "");
    if ($(window).width() > 1023) {
      responDom.each(function() {
        const $this = $(this);
        if ($this.attr("data-pconly") === "true") {
          if ($(window).width() > 1440) {
            $this.css("width", $this.attr("data-pcwid"));
          }
          return;
        }
        $this.css("width", $this.attr("data-pcwid"));
      });
    }
  }
}

function dragScrollX(selector) {
  var isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (isTouch) return; // 터치모드는 기본 스크롤
  if ($(window).width() > 1023) {
    return;
  }
  $(selector).each(function() {
    var $el = $(this);
    var isDown = false;
    var startX, scrollLeft;
    var moved = false;

    $el.css("cursor", "grab");

    $el.on("mousedown.dragScroll", function(e) {
      if (e.button !== 0) return;
      isDown = true;
      moved = false;
      $el.css("cursor", "grabbing");
      startX = e.pageX;
      scrollLeft = $el.scrollLeft();
      e.preventDefault();
    });

    $(document).on("mousemove.dragScroll", function(e) {
      if (!isDown) return;
      var dx = e.pageX - startX;
      if (Math.abs(dx) > 5) moved = true;
      $el.scrollLeft(scrollLeft - dx);
    });

    $(document).on("mouseup.dragScroll mouseleave.dragScroll", function() {
      if (isDown) {
        isDown = false;
        $el.css("cursor", "grab");
      }
    });

    // a태그 처리
    $el.find("a").on("click", function(e) {
      if ($(this).attr("href") === "#") {
        e.preventDefault();
      }
      if (moved) {
        e.preventDefault(); // 드래그 후 클릭 방지
      }
    });
  });
}

function adjustRevisionDomWidths() {
  function action() {
    var maxWidths = [];
    $(".key_secvalue_list").each(function() {
      $(this)
        .find(".revision_price_dom")
        .each(function(index) {
          $(this).css("width", ""); // 초기화
          var w = $(this).outerWidth();
          if (!maxWidths[index] || w > maxWidths[index]) {
            maxWidths[index] = w;
          }
        });
    });

    $(".key_secvalue_list").each(function() {
      $(this)
        .find(".revision_price_dom")
        .each(function(index) {
          $(this).css("width", maxWidths[index] + "px");
        });
    });
  }

  // 초기 실행
  action();

  // resize 이벤트 등록 (이벤트 네임스페이스 사용)
  // 이렇게 하면 여러 번 호출해도 중복 등록 안 됨
  $(window).off("resize.adjustRevision").on("resize.adjustRevision", action);

  // 외부에서 action 호출 가능
  return action;
}

function calendarCombo() {
  $(document).on("click", ".system_calendar_combo_target", function(e) {
    const $this = $(this);
    const $t_p = $this.closest(".system_calendar_combo_wrap");
    const $t_layer = $t_p.find(".sc_combo_option_layer");
    e.preventDefault();
    $t_layer.toggle();
  });
  $(document).on("click", ".sc_combo_option", function(e) {
    const $this = $(this);
    const $t_p = $this.closest(".system_calendar_combo_wrap");
    const $t_t = $t_p.find(".system_calendar_combo_target");
    const $t_layer = $t_p.find(".sc_combo_option_layer");
    e.preventDefault();
    $t_layer.hide();
    $t_t.find(".text_node").text($this.text());
  });
}

function comboFunc() {
  $(document).on("click", ".combo_box_target", function(e) {
    const $this = $(this);
    const $t_p = $this.closest(".combo_box_wrap");
    const $t_layer = $t_p.find(".combo_box_option_wrap");
    const $t_p_s = $($t_p.attr("data-comboparent"));
    e.preventDefault();
    $t_p_s.css("z-index", 5);
    $t_layer.toggle();
  });
  $(document).on("click", ".combo_box_option", function(e) {
    const $this = $(this);
    const $t_p = $this.closest(".combo_box_wrap");
    const $t_t = $t_p.find(".combo_box_target");
    const $t_layer = $t_p.find(".combo_box_option_wrap");
    const $t_p_s = $($t_p.attr("data-comboparent"));
    e.preventDefault();
    $t_p_s.css("z-index", "");
    $t_layer.hide();
    $t_t.find(".text_node").text($this.text());
  });
}

function localPopup() {
  const $eventTarget = $("[data-localtarget]");
  let $localpopup = null;

  $eventTarget.on("click", function() {
    const $this = $(this);
    const $thisTarget = $($this.attr("data-localtarget"));
    $thisTarget.addClass("active");
    $localpopup = $(".local_popup_wrap.active");
    posAction();
  });

  $(document).on("click", ".btn_local_popup_close", function() {
    $(this).closest(".local_popup_wrap").removeClass("active");
  });

  $(document).on("click", function(e) {
    if ($(e.target).closest(".local_popup_wrap,[data-localtarget]").length || $(e.target).attr("data-localtarget") !== undefined) {
      return;
    }
    $(".local_popup_wrap").removeClass("active");
  });

  $(window).on("resize", function() {
    posAction();
  });

  function posAction() {
    const posMargin = $(window).width() > 1023 ? 17 : 9;
    if (!$localpopup) {
      return;
    }
    $localpopup.removeClass("local_left local_right").css({
      top: "",
      left: ""
    });
    $localpopup.each(function() {
      const $this = $(this);
      const $call = $("[data-localtarget='#" + $this.attr("id") + "']");
      if ($call.length) {
        $this.css({
          top: $call.offset().top + $call.outerHeight() + posMargin,
          left: $call.offset().left + $call.outerWidth() / 2 - $this.outerWidth() / 2
        });
      }
      if ($this.offset().left < 0) {
        $this.addClass("local_left");
      }
      if ($this.offset().left + $this.outerWidth() > $(window).width()) {
        $this.addClass("local_right");
      }
    });
  }
}

function multi_box() {
  $(".multi_box").each(function() {
    var box = $(this);
    var multi_target = box.find(".multi_target");
    var layer = box.find(".multi_option_layer");
    var head = box.find(".multi_option_head");
    var checkAll = box.find(".check_all");
    var items = box.find(".option_item");
    var layerclose = layer.find(".btn_multi_layer_close");
    var multi_check_length = box.find(".multi_check_length");

    // 총 갯수
    var total = items.length;
    multi_check_length.text(total);

    // 열기/닫기
    multi_target.on("click", function() {
      $(".multi_box .multi_option_layer").not(layer).hide(); // 다른 박스 닫기
      layer.toggle();
    });
    layerclose.on("click", function() {
      layer.hide();
    });

    $(document).on("mousedown", function(e) {
      if (!box.is(e.target) && box.has(e.target).length === 0) {
        layer.hide();
      }
    });

    // 전체선택
    checkAll.on("change", function() {
      items.prop("checked", $(this).is(":checked"));
      updateHead();
    });

    // 개별선택
    items.on("change", function() {
      var checked = items.filter(":checked").length;
      checkAll.prop("checked", checked === total);
      updateHead();
    });

    // 업데이트
    function updateHead() {
      var checked = items.filter(":checked").length;
      head.text("총 " + total + " 중 " + checked + " 선택");

      var values = items
        .filter(":checked")
        .map(function() {
          return $(this).siblings(".text_node").text(); // 체크된 항목 텍스트
        })
        .get();

      // 선택값이 없으면 기본 문구 유지
      multi_target.text(values.length ? values.join(", ") : "선택하세요");
    }

    // 초기화
    updateHead();
  });
}