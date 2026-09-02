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
  { primary: "Wireless Manager",  secondary: "All wireless: On",             url: "about:blank",                              icon: "assets/icons/network.png" },
  { primary: "Outlook E-mail",    secondary: "No unread messages",           url: "about:blank",                              icon: "assets/icons/mail.png" },
  { primary: "Calendar",          secondary: "No upcoming appointments",     url: "about:blank",                              icon: "assets/icons/documents.png" },
  { primary: "Internet Explorer", secondary: "en.wikipedia.org",             url: "https://en.wikipedia.org/wiki/Windows_Mobile_6", icon: "assets/icons/ie.png" },
  { primary: "Music",             secondary: "Windows Media",                url: "about:blank",                              icon: "assets/icons/music.png" },
  { primary: "Getting Started",   secondary: "9 tasks remaining",            url: "about:blank",                              icon: "assets/icons/computer.png" },
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

function openApp(p) {
  appFrame.src = p.url;
  appTitle.textContent = p.primary;
  app.classList.add("open");
  skLeft.textContent  = "Menu";
  skRight.textContent = "OK";
}
function closeApp() {
  app.classList.remove("open");
  appFrame.src = "about:blank";
  appTitle.textContent = "";
  skLeft.textContent  = "Contacts";
  skRight.textContent = "Calendar";
}
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
