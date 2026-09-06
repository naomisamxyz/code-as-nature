(function () {
  "use strict";

  var guides = [
    ["your-first-website.html", "⭐︎ Open Portal ⭐︎"],
    ["portfolio-template.html", "⟡ Forge Your Archive ⟡"],
    ["cheatsheet-html.html", "༺ HTML ༻"],
    ["cheatsheet-css.html", "༺ CSS ༻"],
    ["cheatsheet-js.html", "⚔︎ JS ⚔︎"],
    ["cheatsheet-p5.html", "✧ p5.js ✧"],
    ["github-basics.html", "❥ GitHub basics <span class=\"mirror-symbol\">❥</span>"],
    ["publish-to-github.html", "☙ Publish to GitHub ❧"],
    ["ai-assisted-workflows.html", "✢ Machine Rituals ✢"]
  ];

  document.querySelectorAll("[data-site-navigation]").forEach(function (nav) {
    var onGuide = document.body.classList.contains("guide-page");
    var currentFile = window.location.pathname.split("/").pop() || "index.html";
    var parts = [];

    if (onGuide) {
      parts.push('<a href="../../index.html">&larr; Course home</a>');
    } else {
      parts.push('<span class="current">&larr; Course home</span>');
    }

    guides.forEach(function (guide) {
      var file = guide[0];
      var label = guide[1];
      if (onGuide && currentFile === file) {
        parts.push('<span class="current">' + label + "</span>");
      } else {
        parts.push('<a href="' + (onGuide ? file : "assets/guides/" + file) + '">' + label + "</a>");
      }
    });

    nav.innerHTML = parts.join("");
  });
})();
