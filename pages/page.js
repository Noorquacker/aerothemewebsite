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

  // Tell the desktop's IE window (if we're inside one) that this page is
  // up, before slow embeds finish and fire "load". See js/desktop.js.
  if (window.parent !== window) {
    document.addEventListener("DOMContentLoaded", function () {
      window.parent.postMessage("page-ready", "*");
    });
  }
})();
