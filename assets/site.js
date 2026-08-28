(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var lightAreas = Array.from(
    document.querySelectorAll(".diagram-embed")
  );

  function updateHeaderContrast() {
    if (!header) return;

    var headerBounds = header.getBoundingClientRect();
    var overlapsLightArea = lightAreas.some(function (element) {
      if (element.hidden) return false;
      var bounds = element.getBoundingClientRect();
      return headerBounds.bottom > bounds.top && headerBounds.top < bounds.bottom;
    });

    header.classList.toggle("on-light", overlapsLightArea);
  }

  if (header && lightAreas.length) {
    document.addEventListener("scroll", updateHeaderContrast, { passive: true });
    window.addEventListener("resize", updateHeaderContrast);
    updateHeaderContrast();
  }

  document.querySelectorAll(".diagram-embed").forEach(function (frame) {
    var fallback = frame.parentElement.querySelector(".embed-fallback");

    function showFallback() {
      frame.hidden = true;
      if (fallback) fallback.hidden = false;
      updateHeaderContrast();
    }

    function resizeFrame() {
      try {
        var documentElement = frame.contentWindow.document.documentElement;
        frame.style.height = documentElement.scrollHeight + "px";
      } catch (error) {
        showFallback();
      }
    }

    frame.addEventListener("error", showFallback);
    frame.addEventListener("load", function () {
      try {
        var frameDocument = frame.contentWindow.document;
        if (!frameDocument.querySelector(".diagram-frame")) {
          showFallback();
          return;
        }

        resizeFrame();
        frameDocument.querySelectorAll(".step").forEach(function (step) {
          step.addEventListener("click", function () {
            window.requestAnimationFrame(resizeFrame);
          });
        });
      } catch (error) {
        showFallback();
      }
    });
  });
})();
