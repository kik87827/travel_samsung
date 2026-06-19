document.addEventListener("DOMContentLoaded", () => {
  browserCheck(); // ui.js 추가했는데 개발에서 반영안할 경우 대비
});

function tabUI(option) {
  const options = option;
  options.forEach((item) => {
    const tabmenuDom = document.querySelectorAll(item.tabmenu);
    let tabmenuActive = Array.from(tabmenuDom).find((el) => el.classList.contains("active"));
    const tabcontgroup = document.querySelector(item.tabcontgroup);
    const tabcontDom = tabcontgroup.querySelectorAll(item.tabcont);
    let tabcontActive = Array.from(tabcontDom).find((el) => el.classList.contains("active"));
    tabmenuDom.forEach((menu) => {
      menu.addEventListener("click", (e) => {
        e.preventDefault();
        const thisEvent = e.currentTarget;
        const thisTarget = document.querySelector(thisEvent.getAttribute("href"));
        let menu_or_cont = [tabmenuActive, tabcontActive];

        menu_or_cont.forEach((multiITem) => {
          multiITem.classList.remove("active");
        });

        if (!!thisTarget) {
          thisTarget.classList.add("active");
          tabcontActive = thisTarget;
        }
        thisEvent.classList.add("active");
        tabmenuActive = thisEvent;

        if (item.callback) {
          item.callback();
        }
      });
    });
  });
}

// ui.js 추가했는데 개발에서 반영안할 경우 대비
function browserCheck() {
  function isKakaoWebBrowser() {
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes("kakaotalk") || ua.includes("kakaobrowser");
  }
  if (isKakaoWebBrowser()) {
    document.querySelector("html").classList.add("kakao");
  }
  /* 251109 추가 */
  const isRatio = window.devicePixelRatio;
  document.querySelector("html").classList.toggle("ratio", isRatio > 1);
}

/* dragg */

function dragSwiper(selector) {
  const tabWrap = document.querySelector(selector);
  let touchstart = "ontouchstart" in window;

  if (!tabWrap || touchstart) return; // 요소가 없으면 종료

  const tabList = tabWrap.querySelector(".baguette_tab_list");
  if (!tabList) return;

  let isDown = false;
  let startX;
  let scrollLeft;
  let isDragging = false;

  tabWrap.addEventListener("mousedown", (e) => {
    if (window.innerWidth >= 1024) {
      return;
    }
    isDown = true;
    isDragging = false;
    tabWrap.classList.add("active");
    startX = e.pageX - tabWrap.offsetLeft;
    scrollLeft = tabWrap.scrollLeft;
  });

  tabWrap.addEventListener("mouseleave", () => {
    if (window.innerWidth >= 1024) {
      return;
    }
    isDown = false;
    tabWrap.classList.remove("active");
  });

  tabWrap.addEventListener("mouseup", () => {
    if (window.innerWidth >= 1024) {
      return;
    }
    isDown = false;
    tabWrap.classList.remove("active");
    setTimeout(() => (isDragging = false), 0);
  });

  tabWrap.addEventListener("mousemove", (e) => {
    if (window.innerWidth >= 1024) {
      return;
    }
    if (!isDown) return;
    e.preventDefault();
    isDragging = true;
    const x = e.pageX - tabWrap.offsetLeft;
    const walk = (x - startX) * 1;
    tabWrap.scrollLeft = scrollLeft - walk;
  });

  // 탭 클릭 방지 (드래그 중일 때)
  tabList.querySelectorAll(".baguette_tab").forEach((tab) => {
    tab.addEventListener("click", (e) => {
      if (isDragging) e.preventDefault();
    });
  });
}