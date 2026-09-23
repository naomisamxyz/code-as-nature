(function () {
  "use strict";

  var guides = [
    ["your-first-website.html", "⭐︎ Open Portal ⭐︎"],
    ["portfolio-template.html", "⟡ Forge Your Archive ⟡"],
    ["cheatsheet-html.html", "༺ HTML ༻"],
    ["cheatsheet-css.html", "༺ CSS ༻"],
    ["cheatsheet-js.html", "⚔︎ JS ⚔︎"],
    ["cheatsheet-p5.html", "✧ p5.js ✧"],
    ["cheatsheet-ml5.html", "⌁ ml5.js ⌁"],
    ["github-basics.html", "❥ GitHub basics <span class=\"mirror-symbol\">❥</span>"],
    ["publish-to-github.html", "☙ Publish to GitHub ❧"],
    ["ai-assisted-workflows.html", "✢ Machine Rituals ✢"],
    ["meme-generator.html", "♦︎ Meme Generator ♦︎"],
    ["databases.html", "⌗ Databases ⌗"],
    ["multiplayer-sketch.html", "⠿ Networked Systems ⠿"],
    ["google-collab.html", "☁︎ Google Collab ☁︎"],
    ["hallucinations.html", "𖦹 Hallucinations 𖦹"],
    ["web-ar-characters.html", "༶ Web AR ༶"],
    ["unreal-engine-blueprints.html", "⟷ UE Blueprints ⟷"],
    ["unreal-interconnected.html", "◇ UE Interconnected ◇"],
    ["autonomous-artworks-exhibition-systems.html", "✣ Autonomous Artworks ✣"]
  ];

  var disabledGuides = new Set([
    "meme-generator.html",
    "databases.html",
    "multiplayer-sketch.html",
    "google-collab.html",
    "hallucinations.html",
    "web-ar-characters.html",
    "unreal-engine-blueprints.html",
    "unreal-interconnected.html",
    "autonomous-artworks-exhibition-systems.html"
  ]);

  var sharedHeader = [
    '<pre class="header-ornament" aria-hidden="true"></pre>',
    '<h1 class="site-title">IIMC-446/IIMC-646: Code As Nature</h1>',
    '<p class="site-meta"><span>Fall 2026</span><span>Wednesdays, 10:00–11:50 AM</span><span>September 8–December 13</span><span>Main Building, MACLAB Studio</span></p>',
    '<a class="site-home-link" href="../../index.html" aria-label="Code As Nature home"></a>'
  ].join("");

  document.querySelectorAll("[data-site-header]").forEach(function (header) {
    header.innerHTML = sharedHeader;
  });

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
      } else if (disabledGuides.has(file)) {
        parts.push(
          '<a class="is-disabled-guide" role="link" aria-disabled="true" tabindex="0" data-href="' +
          (onGuide ? file : "assets/guides/" + file) + '">' + label + "</a>"
        );
      } else {
        parts.push('<a href="' + (onGuide ? file : "assets/guides/" + file) + '">' + label + "</a>");
      }
    });

    nav.innerHTML = parts.join("");
  });

  function markExternalLinks(root) {
    var links = [];
    if (root.nodeType === 1 && root.matches("a[href]")) links.push(root);
    if (root.querySelectorAll) {
      links = links.concat(Array.from(root.querySelectorAll("a[href]")));
    }
    links.forEach(function (link) {
      try {
        var url = new URL(link.getAttribute("href"), window.location.href);
        if (!/^https?:$/.test(url.protocol) || url.origin === window.location.origin) return;
        link.target = "_blank";
        link.rel = "noopener";
      } catch (error) {
        // Leave incomplete or nonstandard links unchanged.
      }
    });
  }

  markExternalLinks(document);
  new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(markExternalLinks);
    });
  }).observe(document.body, { childList: true, subtree: true });
})();
