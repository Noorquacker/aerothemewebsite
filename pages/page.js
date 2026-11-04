// Shared script for every page in pages/.
// Click any article image to view it enlarged; click again (or press
// Escape) to close.
(function () {
  function close() {
    var box = document.querySelector(".lightbox");
    if (box) box.remove();
  }
  document.addEventListener("click", function (e) {
    var img = e.target.closest(".article img");
    // Images inside links (e.g. project cards) navigate instead.
    if (img && !img.closest("a")) {
      close();
      var box = document.createElement("div");
      box.className = "lightbox";
      var big = document.createElement("img");
      big.src = img.currentSrc || img.src;
      big.alt = img.alt || "";
      box.appendChild(big);
      document.body.appendChild(box);
      return;
    }
    if (e.target.closest(".lightbox")) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });

  // Links to other sites open in a new tab: most (YouTube, GitHub, ...)
  // refuse to load inside the desktop's IE window. The page HTML already
  // has target="_blank" on them; this also catches links that scripts add
  // later, like the ones inside GitHub Gist embeds.
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href]");
    if (a && /^https?:$/.test(a.protocol) && a.host !== location.host && !a.target) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
  });

  // Tell the desktop's IE window (if we're inside one) that this page is
  // up, before slow embeds finish and fire "load". See js/desktop.js.
  if (window.parent !== window) {
    document.addEventListener("DOMContentLoaded", function () {
      window.parent.postMessage("page-ready", "*");
    });
  }
})();
