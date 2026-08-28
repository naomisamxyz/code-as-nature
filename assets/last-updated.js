(function () {
  "use strict";

  const updated = window.CANVAS_DATA?.lastUpdated;
  if (!updated) return;

  document.querySelectorAll("[data-last-updated]").forEach(element => {
    const time = document.createElement("time");
    time.dateTime = updated.datetime;
    time.textContent = updated.label;
    element.replaceChildren(
      document.createTextNode("Last updated "),
      time,
      document.createTextNode(" by " + updated.by)
    );
  });
})();
