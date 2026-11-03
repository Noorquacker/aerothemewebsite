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
    if (img) {
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
})();
