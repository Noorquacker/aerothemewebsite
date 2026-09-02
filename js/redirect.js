// Redirect mobile visitors to the WM6.1 Today screen.
// Loaded synchronously in the <head> of index.html so it runs before
// anything renders — mobile users never see a flash of desktop.
// Escape hatch: append ?desktop=1 to force the Windows 7 view on mobile.
(function () {
  try {
    if (/[?&]desktop=1\b/.test(location.search)) return;
    var ua       = navigator.userAgent || "";
    var uaMobile = (navigator.userAgentData && navigator.userAgentData.mobile) === true;
    var uaHit    = /Android|iPhone|iPad|iPod|IEMobile|BlackBerry|Opera Mini|Mobile Safari/i.test(ua);
    var coarse   = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    var narrow   = window.matchMedia && window.matchMedia("(max-width: 640px)").matches;
    if (uaMobile || uaHit || (coarse && narrow)) {
      location.replace("mobile.html");
    }
  } catch (e) { /* if anything odd, stay on desktop */ }
})();
