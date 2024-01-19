window.onload = function () {
  const logo = document.querySelector(".logo");
  const input = document.querySelector("#search");
  const themeBtn = document.querySelector("#theme");
  const mainContainer = document.querySelector("main");
  const container = document.querySelector(".container");
  const tooltipContainer = document.querySelector("#tooltip");
  const bookmarksBtn = document.querySelector("#toggle-bookmarks");
  const homeBtn = document.querySelectorAll("[data-action=home]");
  const tooltips = document.querySelectorAll("[data-tooltip]");
  const popups = document.querySelectorAll("[data-popup]");

  window.addEventListener("click", hidePopup);

  input.addEventListener("focus", (e) => {
    e.currentTarget.select();
    container.classList.toggle("focus");
    logo.classList.toggle("focus");
  });

  popups.forEach((popup) => popup.addEventListener("click", showPopup));

  function showPopup(e) {
    e.stopPropagation();
    e.preventDefault();
    closeActivePopup();

    const { popup } = e.currentTarget.dataset;
    const popupTarget = document.querySelector(`#${popup}-popup`);

    if (popupTarget) {
      popupTarget.classList.toggle("active");
      e.currentTarget.classList.toggle("active");
    }
  }

  function closeActivePopup() {
    const currentActive = document.querySelector("[data-popup].active");

    if (currentActive) {
      const { popup } = currentActive.dataset;
      const popupTarget = document.querySelector(`#${popup}-popup`);

      currentActive.classList.remove("active");
      popupTarget.classList.remove("active");
    }
  }

  function hidePopup({ target }) {
    const currentActive = document.querySelector("[data-popup].active");

    if (currentActive) {
      const { popup } = currentActive.dataset;
      const popupTarget = document.querySelector(`#${popup}-popup`);

      if (!popupTarget.contains(target)) {
        currentActive.classList.remove("active");
        popupTarget.classList.remove("active");
      }
    }
  }

  input.addEventListener("blur", () => {
    logo.classList.toggle("focus");
    container.classList.toggle("focus");
  });

  themeBtn.addEventListener("click", () =>
    document.body.classList.toggle("dark-theme")
  );

  bookmarksBtn.addEventListener("click", () => setActiveTab(false));

  homeBtn.forEach((btn) =>
    btn.addEventListener("click", () => setActiveTab(true))
  );

  tooltips.forEach((e) => {
    e.addEventListener("mouseenter", showTooltip);
    e.addEventListener("mouseleave", hideTooltip);
  });

  setupCarousel();

  function setActiveTab(isHomeBtn = false) {
    const home = document.querySelector(".main-nav li:first-child");
    const bookmarks = document.querySelector(".main-nav li:last-child");

    if (isHomeBtn && home.classList.contains("active")) {
      return;
    }

    if (!isHomeBtn) {
      home.classList.toggle("active");
      bookmarks.classList.toggle("active");
      mainContainer.classList.toggle("show-bookmarks");
    } else {
      home.classList.add("active");
      bookmarks.classList.remove("active");
      mainContainer.classList.remove("show-bookmarks");
    }
  }

  function showTooltip(e) {
    const setTooltip = () => {
      const element = e.target;
      const { tooltip, position = "down" } = element.dataset;
      const { top, left, height, width } = element.getBoundingClientRect();

      tooltipContainer.innerHTML = `<p>${tooltip}</p`;

      const {
        width: w2,
        height: h2
      } = tooltipContainer.getBoundingClientRect();

      if (position === "down") {
        tooltipContainer.style.top = `${top + height + 5}px`;
        tooltipContainer.style.left = `${left + width / 2 - w2 / 2}px`;
      } else if (position === "top") {
        tooltipContainer.style.top = `${top - height - 5}px`;
        tooltipContainer.style.left = `${left + width / 2 - w2 / 2}px`;
      } else if (position === "top-pad") {
        tooltipContainer.style.top = `${top - height - 15}px`;
        tooltipContainer.style.left = `${left + width / 2 - w2 / 2}px`;
      } else {
        tooltipContainer.style.top = `${top + height / 2 - h2 / 2}px`;
        tooltipContainer.style.left = `${left - w2 - 5}px`;
      }
    };

    // TODO: Add delay logic
    setTooltip();
  }

  function hideTooltip() {
    tooltipContainer.innerHTML = "";
    tooltipContainer.style.top = "-9999px";
    tooltipContainer.style.left = "-9999px";
  }

  function setupCarousel() {
    const wrapper = document.querySelector(".carousel > ul");
    const buttons = document.querySelectorAll(".carousel > button");

    const enableButtons = () => {
      const width = wrapper.scrollWidth;

      buttons[0].style.display = wrapper.scrollLeft > 0 ? "block" : "none";
      buttons[1].style.display =
        wrapper.scrollLeft + wrapper.offsetWidth < width ? "block" : "none";
    };

    const scroll = (direction) => {
      let currentLeft = wrapper.scrollLeft;

      if (direction === -1) {
        wrapper.scrollLeft = Math.min(currentLeft + direction * 250, 0);
      } else {
        wrapper.scrollLeft = Math.max(
          currentLeft + direction * 250,
          wrapper.scrollWidth
        );
      }
      setTimeout(enableButtons, 100);
    };

    buttons[0].addEventListener("click", scroll.bind(null, -1));
    buttons[1].addEventListener("click", scroll.bind(null, 1));
    enableButtons();
  }
};
