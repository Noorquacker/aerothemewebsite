// ============================================================
// ADD "TODAY" PLUGINS HERE
// Each entry becomes a row on the Today screen. Tapping opens
// the URL in a full-screen iframe (soft key becomes "OK" to
// return to Today).
//
//   primary   : main line
//   secondary : dimmer sub-line (optional)
//   url       : URL to load
//   icon      : path to a small (24x24) PNG in assets/icons/
//               (any existing desktop icon works)
// ============================================================
const PLUGINS = [
  { primary: "About Me",         secondary: "Noorquacker Industries", url: "pages/about-me/",              icon: "assets/icons/user.png" },
  { primary: "Projects",         secondary: "Project write-ups",      url: "pages/projects/",              icon: "assets/icons/folder.png" },
  { primary: "Minecraft Server", secondary: "mc.nqind.com",           url: "pages/minecraft-server-info/", icon: "assets/icons/minecraft.png" },
];
// ============================================================

const pluginsEl = document.getElementById("plugins");
PLUGINS.forEach(p => {
  const el = document.createElement("div");
  el.className = "plugin";
  el.innerHTML = `
    <img src="${p.icon}" alt="">
    <div class="lines">
      <div class="primary">${p.primary}</div>
      ${p.secondary ? `<div class="secondary">${p.secondary}</div>` : ""}
    </div>
    <span class="chev">&#9654;</span>
  `;
  el.addEventListener("click", () => openApp(p));
  pluginsEl.appendChild(el);
});

// -------------------- App open/close --------------------
const app = document.getElementById("app");
const appFrame = document.getElementById("app-frame");
const appTitle = document.getElementById("app-title");
const skLeft   = document.getElementById("sk-left");
const skRight  = document.getElementById("sk-right");

// Pages visited inside the app iframe, so the left soft key can act as
// "Back" once you've followed a link (e.g. Projects -> a project).
let appHistory = [];

function updateSoftkeys() {
  if (!app.classList.contains("open")) {
    skLeft.textContent  = "Contacts";
    skRight.textContent = "Calendar";
    return;
  }
  skLeft.textContent  = appHistory.length > 1 ? "Back" : "Menu";
  skRight.textContent = "OK";
}

function openApp(p) {
  appHistory = [];
  appFrame.src = p.url;
  appTitle.textContent = p.primary;
  app.classList.add("open");
  updateSoftkeys();
}
function closeApp() {
  app.classList.remove("open");
  appHistory = [];
  appFrame.src = "about:blank";
  appTitle.textContent = "";
  updateSoftkeys();
}

// Track navigation inside the iframe (same-origin pages only) and show
// the page's own title, minus the site-name suffix.
appFrame.addEventListener("load", () => {
  if (!app.classList.contains("open")) return;
  try {
    const href = appFrame.contentWindow.location.href;
    if (href === "about:blank") return;
    if (appHistory.length > 1 && appHistory[appHistory.length - 2] === href) {
      appHistory.pop();            // we went back
    } else if (appHistory[appHistory.length - 1] !== href) {
      appHistory.push(href);       // new page
    }
    const t = appFrame.contentDocument.title.replace(/ - Noorquacker Industries$/, "");
    if (t) appTitle.textContent = t;
  } catch (err) { /* cross-origin: keep the plugin's name */ }
  updateSoftkeys();
});

skLeft.addEventListener("click", () => {
  if (app.classList.contains("open") && appHistory.length > 1) {
    try { appFrame.contentWindow.history.back(); } catch (err) {}
  }
});
skRight.addEventListener("click", () => {
  if (app.classList.contains("open")) closeApp();
});

// -------------------- Clock + date --------------------
function tick() {
  const d = new Date();
  document.getElementById("clock").textContent =
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  document.getElementById("date").textContent =
    d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}
tick();
setInterval(tick, 30000);
