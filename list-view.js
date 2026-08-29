(function () {
  "use strict";
  history.scrollRestoration = "manual";

  const data = window.CANVAS_DATA;
  const section = document.querySelector(".syllabus-section");

  const MONTHS = {
    January: "01", February: "02", March: "03", April: "04",
    May: "05", June: "06", July: "07", August: "08",
    September: "09", October: "10", November: "11", December: "12"
  };

  // The canvas week nodes only carry a human date string; derive the
  // machine-readable value for <time> from it. The course runs in 2026.
  function isoDate(text) {
    const match = String(text || "").match(/([A-Z][a-z]+)\s+(\d+)/);
    if (!match || !MONTHS[match[1]]) return "";
    return `2026-${MONTHS[match[1]]}-${match[2].padStart(2, "0")}`;
  }

  // Build the scrolling syllabus from the same data the canvas renders.
  // week -> heading, text -> intro paragraph, list -> readings. media and
  // sigil nodes are canvas-only and skipped here.
  function buildWeeks() {
    if (!data || !section) return;

    const byWeek = new Map();
    data.resources.forEach(resource => {
      if (!resource.week) return;
      if (!byWeek.has(resource.week)) byWeek.set(resource.week, []);
      byWeek.get(resource.week).push(resource);
    });

    [...byWeek.keys()].sort((a, b) => a - b).forEach(weekNumber => {
      const parts = byWeek.get(weekNumber);
      const head = parts.find(resource => resource.type === "week");
      if (!head) return;

      const paragraphs = parts
        .filter(resource => resource.type === "text" && resource.text)
        .map(resource => `<div class="syllabus-copy">${resource.text}</div>`);

      const lists = parts.filter(resource => resource.type === "list");
      lists.forEach(resource => {
        if (resource.description) {
          paragraphs.push(
            `<div class="syllabus-copy">${resource.description}</div>`
          );
        }
      });
      const items = lists.flatMap(resource => resource.items || []);

      const article = document.createElement("article");
      article.className = "syllabus-week";
      article.dataset.week = weekNumber;
      article.innerHTML =
        `<div class="section-heading week-heading">` +
          `<div class="week-title"><h2>${head.title}</h2></div>` +
          `<time datetime="${isoDate(head.date)}">${head.date || ""}</time>` +
        `</div>` +
        paragraphs.join("") +
        (items.length
          ? `<ul>${items.map(item => `<li><span>${item}</span></li>`).join("")}</ul>`
          : "");

      section.append(article);
    });
  }

  // The "Syllabus" heading and course description live in the same data as
  // the weeks (a section node + a text node), so one edit updates both views.
  // Rendered with the same markup as the other static section headings, reusing
  // their braille ornament so nothing has to be duplicated here.
  function buildIntro() {
    const container = document.querySelector("#syllabus-intro");
    if (!data || !container) return;
    const heading = data.resources.find(resource => resource.id === "syllabus");
    const body = data.resources.find(resource => resource.id === "syllabus-body");
    if (!heading && !body) return;
    const ornament = document.querySelector(".diagram-section .section-ornament");
    const ornamentHTML = ornament ? ornament.outerHTML : "";
    container.innerHTML =
      "<br><br>" +
      (heading
        ? `<div class="section-heading" id="${heading.id}">${ornamentHTML}<h2><a href="canvas.html#${heading.id}" style="color:inherit">${heading.title}</a></h2></div><br>`
        : "") +
      (body ? `<div class="syllabus-copy">${body.text}</div>` : "");
  }

  buildIntro();
  buildWeeks();

  const weeks = [...document.querySelectorAll(".syllabus-week")];

  weeks.forEach(week => {
    const id = `week${String(week.dataset.week || "0").padStart(2, "0")}`;
    week.id = id;
    const heading = week.querySelector("h2");
    if (heading && !heading.closest("a")) {
      const link = document.createElement("a");
      link.href = `canvas.html#${id}`;
      link.style.color = "inherit";
      link.innerHTML = heading.innerHTML;
      heading.replaceChildren(link);
    }
  });

  const toggle = document.createElement("div");
  toggle.className = "view-toggle is-list";
  toggle.innerHTML =
    '<span class="view-current" aria-current="page">list</span>' +
    '<span class="view-diamond" aria-hidden="true">✧</span>' +
    '<a href="canvas.html" data-view-switch="canvas">canvas</a>';
  document.body.append(toggle);

  function currentAnchor() {
    const threshold = innerHeight * 0.45;
    const syllabus = document.querySelector("#syllabus");
    const anchors = [syllabus, ...weeks].filter(Boolean);
    let current = anchors[0];
    for (const anchor of anchors) {
      if (anchor.getBoundingClientRect().top <= threshold) current = anchor;
      else break;
    }
    return current?.id || "syllabus";
  }

  toggle.querySelector("[data-view-switch]").addEventListener("click", event => {
    event.preventDefault();
    location.href = `canvas.html#${currentAnchor()}`;
  });

  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target) requestAnimationFrame(() => requestAnimationFrame(() => {
      window.scrollTo(0, Math.max(0, target.offsetTop - 112));
    }));
  }
})();
