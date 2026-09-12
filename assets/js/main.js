/* ==========================================================================
   Deeksha Model School, Jaipur — prototype interactions (vanilla JS, no deps)
   Works in all modern browsers (Chrome, Firefox, Safari, Edge), IE-free.
   ========================================================================== */
(function () {
  "use strict";

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header shadow ---------- */
  var header = $(".site-header");
  function onScrollHeader() {
    if (!header) return;
    if (window.pageYOffset > 8) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Mobile navigation drawer ---------- */
  var navToggle = $("#navToggle");
  var mainNav = $("#mainNav");
  function closeNav() {
    if (!mainNav || !navToggle) return;
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("a", mainNav).forEach(function (a) { a.addEventListener("click", closeNav); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
    document.addEventListener("click", function (e) {
      if (mainNav.classList.contains("open") && !mainNav.contains(e.target) && !navToggle.contains(e.target)) closeNav();
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = $$(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window && !reduceMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("in"); });
    }
  }

  /* ---------- Animated counters ---------- */
  var counters = $$("[data-count]");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var start = null, dur = 1400;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
  }
  if (counters.length) {
    if ("IntersectionObserver" in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(animateCount);
    }
  }

  /* ---------- Testimonial slider ---------- */
  var track = $(".t-track");
  if (track) {
    var slides = $$(".t-slide", track);
    var dotsWrap = $(".t-dots");
    var idx = 0, timer = null;
    var dots = slides.map(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Show testimonial " + (i + 1));
      b.addEventListener("click", function () { go(i, true); });
      if (dotsWrap) dotsWrap.appendChild(b);
      return b;
    });
    function go(i, user) {
      idx = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + idx * 100 + "%)";
      dots.forEach(function (d, k) { d.classList.toggle("on", k === idx); });
      if (user) restart();
    }
    function restart() {
      if (timer) window.clearInterval(timer);
      if (!reduceMotion) timer = window.setInterval(function () { go(idx + 1); }, 6500);
    }
    var prev = $(".t-prev"), next = $(".t-next");
    if (prev) prev.addEventListener("click", function () { go(idx - 1, true); });
    if (next) next.addEventListener("click", function () { go(idx + 1, true); });
    var slider = $(".t-slider");
    if (slider) {
      slider.addEventListener("mouseenter", function () { if (timer) window.clearInterval(timer); });
      slider.addEventListener("mouseleave", restart);
    }
    go(0); restart();
  }

  /* ---------- Accordion ---------- */
  $$(".acc-item").forEach(function (item) {
    var btn = $(".acc-btn", item), panel = $(".acc-panel", item);
    if (!btn || !panel) return;
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", function () {
      var open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
    });
  });

  /* ---------- Gallery filter ---------- */
  var filterBtns = $$(".filter-btn");
  var gItems = $$(".g-item");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("on"); b.setAttribute("aria-pressed", "false"); });
      btn.classList.add("on");
      btn.setAttribute("aria-pressed", "true");
      var f = btn.getAttribute("data-filter");
      gItems.forEach(function (it) {
        var show = f === "all" || it.getAttribute("data-cat") === f;
        it.classList.toggle("hidden", !show);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var lb = $("#lightbox");
  if (lb) {
    var lbImg = $(".lb-img", lb), lbCap = $(".lb-cap", lb);
    var visible = [];
    var cur = 0;
    function openLb(item) {
      visible = gItems.filter(function (it) { return !it.classList.contains("hidden"); });
      cur = visible.indexOf(item);
      show();
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
      $(".lb-close", lb).focus();
    }
    function show() {
      var item = visible[cur];
      if (!item) return;
      var img = $("img", item);
      lbImg.src = img.getAttribute("src");
      lbImg.alt = img.getAttribute("alt") || "";
      lbCap.textContent = $("figcaption", item) ? $("figcaption", item).textContent : "";
    }
    function closeLb() {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    }
    gItems.forEach(function (it) {
      it.setAttribute("tabindex", "0");
      it.setAttribute("role", "button");
      it.addEventListener("click", function () { openLb(it); });
      it.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(it); }
      });
    });
    $(".lb-close", lb).addEventListener("click", closeLb);
    $(".lb-prev", lb).addEventListener("click", function () { cur = (cur - 1 + visible.length) % visible.length; show(); });
    $(".lb-next", lb).addEventListener("click", function () { cur = (cur + 1) % visible.length; show(); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") { cur = (cur - 1 + visible.length) % visible.length; show(); }
      if (e.key === "ArrowRight") { cur = (cur + 1) % visible.length; show(); }
    });
  }

  /* ---------- Forms (prototype: client-side only) ---------- */
  $$("form[data-proto-form]").forEach(function (form) {
    form.setAttribute("novalidate", "novalidate");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      $$("[required]", form).forEach(function (input) {
        var field = input.closest(".field");
        var valid = input.value.trim() !== "";
        if (valid && input.type === "tel") valid = /^[0-9]{10}$/.test(input.value.replace(/\D/g, "").slice(-10));
        if (valid && input.type === "email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        if (field) field.classList.toggle("invalid", !valid);
        if (!valid) ok = false;
      });
      var success = form.parentElement.querySelector(".form-success");
      if (ok) {
        form.style.display = "none";
        if (success) {
          success.classList.add("show");
          success.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        }
      } else {
        var firstBad = $(".field.invalid", form);
        if (firstBad) firstBad.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      }
    });
    $$("input,select,textarea", form).forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field) field.classList.remove("invalid");
      });
    });
  });

  /* ---------- Back to top ---------- */
  var toTop = $(".to-top");
  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("show", window.pageYOffset > 420);
    }, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Footer year ---------- */
  $$(".js-year").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
