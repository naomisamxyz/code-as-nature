(function () {
  "use strict";

  document.querySelectorAll(".diagram-embed").forEach(function (frame) {
    var fallback = frame.parentElement.querySelector(".embed-fallback");

    function showFallback() {
      frame.hidden = true;
      if (fallback) fallback.hidden = false;
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
