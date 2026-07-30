(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var siteNav = document.querySelector(".site-nav");

  if (toggle && siteNav) {
    toggle.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  var navItems = document.querySelectorAll(".nav-item");

  navItems.forEach(function (item) {
    var trigger = item.querySelector(".nav-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      var willOpen = !item.classList.contains("is-open");

      navItems.forEach(function (other) {
        other.classList.remove("is-open");
        var otherTrigger = other.querySelector(".nav-trigger");
        if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
      });

      if (willOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".nav-item")) {
      navItems.forEach(function (item) {
        item.classList.remove("is-open");
        var trigger = item.querySelector(".nav-trigger");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      });
    }
    if (siteNav && toggle && !e.target.closest(".site-nav") && !e.target.closest(".nav-toggle")) {
      if (window.innerWidth < 900) {
        siteNav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 900 && siteNav) {
      siteNav.classList.remove("is-open");
    }
  });
})();
