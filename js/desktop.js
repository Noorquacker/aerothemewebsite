// ============================================================
// ADD DESKTOP ICONS HERE
// Each entry becomes an icon on the desktop. Clicking (double-click
// or single-click) opens an Internet Explorer window with the URL
// loaded in an iframe.
//
//   label : text shown under the icon
//   url   : URL the iframe navigates to
//   icon  : path to a PNG in assets/icons/  (48x48 or 256x256, they scale)
//
// Icons already extracted from the "Windows 7 Aero" icon theme:
//   computer, ie, recycle-empty, recycle-full, documents,
//   folder, folder-html, music, network, games, mail, internet
//
// To add more: drop any PNG into assets/icons/  and reference it below.
// ============================================================
const ICONS = [
  { label: "Computer",       url: "about:blank",                       icon: "assets/icons/computer.png" },
  { label: "Recycle Bin",    url: "about:blank",                       icon: "assets/icons/recycle-empty.png" },
  { label: "Internet Explorer", url: "https://en.wikipedia.org/wiki/Internet_Explorer", icon: "assets/icons/ie.png" },
  { label: "Wikipedia",      url: "https://en.wikipedia.org/",         icon: "assets/icons/internet.png" },
  { label: "My Documents",   url: "about:blank",                       icon: "assets/icons/documents.png" },
  { label: "Music",          url: "about:blank",                       icon: "assets/icons/music.png" },
  { label: "Network",        url: "about:blank",                       icon: "assets/icons/network.png" },
  { label: "Games",          url: "about:blank",                       icon: "assets/icons/games.png" },
  { label: "Mail",           url: "about:blank",                       icon: "assets/icons/mail.png" },
];
// ============================================================

const desktop = document.getElementById("desktop");
const tasks   = document.getElementById("tasks");

// Render an icon reference: a path (contains "/" or ends in .png/.svg) → <img>,
// otherwise treat as a literal emoji/glyph. Lets ICONS mix both styles.
function renderIcon(ref, size) {
  const isPath = /\.(png|svg|jpg|jpeg|gif|webp)$/i.test(ref) || ref.includes("/");
  if (isPath) {
    const s = size ? ` style="width:${size}px;height:${size}px"` : "";
    return `<img src="${ref}" alt=""${s}>`;
  }
  return ref;
}

let zTop = 100;
const openWindows = new Map(); // id -> { win, taskBtn, label }

function makeIcon(entry) {
  const el = document.createElement("div");
  el.className = "icon";
  el.innerHTML = `
    <div class="glyph">${renderIcon(entry.icon)}</div>
    <div class="label">${entry.label}</div>
  `;
  // Single click = select (Win7 desktop behavior). Double click = open.
  el.addEventListener("click", () => {
    document.querySelectorAll(".icon.selected").forEach(i => i.classList.remove("selected"));
    el.classList.add("selected");
  });
  el.addEventListener("dblclick", (e) => {
    e.preventDefault();
    openIE(entry);
  });
  desktop.appendChild(el);
}
ICONS.forEach(makeIcon);

document.addEventListener("mousedown", (e) => {
  if (!e.target.closest(".icon")) {
    document.querySelectorAll(".icon.selected").forEach(i => i.classList.remove("selected"));
  }
});

// -------------------- Internet Explorer window --------------------
function openIE(entry) {
  const id = "win-" + Math.random().toString(36).slice(2, 9);
  const win = document.createElement("div");
  win.className = "window";
  const w = 780, h = 520;
  const cx = Math.max(20, (window.innerWidth  - w) / 2 + (openWindows.size * 24));
  const cy = Math.max(20, (window.innerHeight - h) / 2 + (openWindows.size * 24) - 20);
  win.style.left = cx + "px";
  win.style.top  = cy + "px";
  win.style.width  = w + "px";
  win.style.height = h + "px";
  win.style.zIndex = ++zTop;

  win.innerHTML = `
    <div class="titlebar">
      <div class="title"><span class="fav">${renderIcon(entry.icon, 16)}</span><span class="tt">${entry.label} - Windows Internet Explorer</span></div>
      <div class="win-btns">
        <button class="min"  title="Minimize">&#8211;</button>
        <button class="max"  title="Maximize">&#9633;</button>
        <button class="close" title="Close">&#10005;</button>
      </div>
    </div>

    <div class="ie-navbar">
      <button class="navbtn back" title="Back">&#10094;</button>
      <button class="navbtn fwd"  title="Forward">&#10095;</button>
      <div class="address">
        <span class="lock" title="Secure">&#128274;</span>
        <input type="text" value="${entry.url}" spellcheck="false">
        <button class="addr-btn stop"    title="Stop">&#10005;</button>
        <button class="addr-btn refresh" title="Refresh">&#10227;</button>
      </div>
      <div class="ie-search">
        <input type="text" placeholder="Bing" spellcheck="false">
        <span class="mag" title="Search">&#128269;</span>
      </div>
    </div>

    <div class="ie-cmdbar">
      <button class="cmd fav" title="Favorites"><span class="cmdico">&#9733;</span> Favorites</button>
      <div class="sep"></div>
      <button class="cmd home" title="Home"><span class="cmdico">&#127968;</span> Home</button>
      <button class="cmd" title="Feeds"><span class="cmdico">&#128260;</span> Feeds</button>
      <button class="cmd" title="Read Mail"><span class="cmdico">&#9993;</span> Read Mail</button>
      <button class="cmd" title="Print"><span class="cmdico">&#128424;</span> Print</button>
      <button class="cmd" title="Page">Page &#9662;</button>
      <button class="cmd" title="Safety">Safety &#9662;</button>
      <button class="cmd" title="Tools">Tools &#9662;</button>
      <div class="cmd-spacer"></div>
      <button class="cmd" title="Help">&#9432;</button>
    </div>

    <div class="ie-tabs">
      <div class="ie-tab active">
        <span class="fav">${renderIcon(entry.icon, 14)}</span>
        <span class="tab-label">${entry.label}</span>
        <span class="x" title="Close Tab">&#10005;</span>
      </div>
      <div class="ie-tab new-tab" title="New Tab">&#65291;</div>
    </div>

    <div class="content">
      <iframe src="${entry.url}" referrerpolicy="no-referrer"></iframe>
    </div>

    <div class="statusbar">
      <span class="stat">Done</span>
      <span class="zone">&#128274; Internet | Protected Mode: On</span>
      <span class="zoom">&#128269;<span>100%</span></span>
    </div>

    <div class="rh n"></div><div class="rh s"></div><div class="rh w"></div><div class="rh e"></div>
    <div class="rh nw"></div><div class="rh ne"></div><div class="rh sw"></div><div class="rh se"></div>
  `;
  document.body.appendChild(win);

  // Drag
  const titlebar = win.querySelector(".titlebar");
  dragify(win, titlebar);

  // Resize
  resizify(win);

  // Focus on click
  win.addEventListener("mousedown", () => { win.style.zIndex = ++zTop; setActiveTask(id); });

  // Buttons
  win.querySelector(".close").addEventListener("click", () => closeWin(id));
  win.querySelector(".min").addEventListener("click", () => {
    win.style.display = win.style.display === "none" ? "flex" : "none";
  });
  let savedRect = null;
  win.querySelector(".max").addEventListener("click", () => {
    const maximized = win.classList.contains("maximized");
    if (!maximized) {
      savedRect = { l: win.style.left, t: win.style.top, w: win.style.width, h: win.style.height };
      win.style.left = "0"; win.style.top = "0";
      win.style.width = "100%"; win.style.height = "calc(100% - 40px)";
      win.classList.add("maximized");
    } else {
      Object.assign(win.style, { left: savedRect.l, top: savedRect.t, width: savedRect.w, height: savedRect.h });
      win.classList.remove("maximized");
    }
  });

  // Address bar navigation
  const iframe  = win.querySelector("iframe");
  const address = win.querySelector(".address input");
  const titleEl = win.querySelector(".tt");
  function navigate() {
    let url = address.value.trim();
    if (!url) return;
    if (!/^([a-z]+:)/i.test(url)) url = "https://" + url;
    iframe.src = url;
  }
  address.addEventListener("keydown", (e) => { if (e.key === "Enter") navigate(); });
  win.querySelector(".addr-btn.refresh").addEventListener("click", () => {
    try { iframe.contentWindow.location.reload(); }
    catch(err) { iframe.src = iframe.src; }
  });
  win.querySelector(".addr-btn.stop").addEventListener("click", () => {
    try { iframe.contentWindow.stop(); } catch(err) {}
  });

  // Tab close = close window (single-tab model)
  win.querySelector(".ie-tab .x").addEventListener("click", (e) => {
    e.stopPropagation();
    closeWin(id);
  });

  // Taskbar entry
  const taskBtn = document.createElement("div");
  taskBtn.className = "task-btn active";
  taskBtn.title = entry.label;
  taskBtn.innerHTML = `<span class="tb-ico">${renderIcon(entry.icon, 24)}</span>`;
  taskBtn.addEventListener("click", () => {
    if (win.style.display === "none") { win.style.display = "flex"; }
    win.style.zIndex = ++zTop;
    setActiveTask(id);
  });
  tasks.appendChild(taskBtn);

  openWindows.set(id, { win, taskBtn });
  setActiveTask(id);
}

function setActiveTask(id) {
  openWindows.forEach((v, k) => v.taskBtn.classList.toggle("active", k === id));
}
function closeWin(id) {
  const rec = openWindows.get(id);
  if (!rec) return;
  rec.win.remove(); rec.taskBtn.remove();
  openWindows.delete(id);
}

// Attach mousedown handlers to the 8 .rh handles inside `el`.
function resizify(el) {
  const MIN_W = 480, MIN_H = 300;
  el.querySelectorAll(".rh").forEach(h => {
    h.addEventListener("mousedown", (e) => {
      if (el.classList.contains("maximized")) return;
      e.preventDefault(); e.stopPropagation();
      const dirs = h.className.replace("rh", "").trim().split(/\s+/).join("");
      const startX = e.clientX, startY = e.clientY;
      const rect = el.getBoundingClientRect();
      const startL = rect.left, startT = rect.top;
      const startW = rect.width, startH = rect.height;
      const north = dirs.includes("n"), south = dirs.includes("s"),
            west  = dirs.includes("w"), east  = dirs.includes("e");
      function onMove(ev) {
        const dx = ev.clientX - startX, dy = ev.clientY - startY;
        let l = startL, t = startT, w = startW, h2 = startH;
        if (east)  w = Math.max(MIN_W, startW + dx);
        if (south) h2 = Math.max(MIN_H, startH + dy);
        if (west) {
          const nw = Math.max(MIN_W, startW - dx);
          l = startL + (startW - nw);
          w = nw;
        }
        if (north) {
          const nh = Math.max(MIN_H, startH - dy);
          t = Math.max(0, startT + (startH - nh));
          h2 = nh;
        }
        el.style.left = l + "px";
        el.style.top  = t + "px";
        el.style.width  = w + "px";
        el.style.height = h2 + "px";
      }
      function onUp() {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      }
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
  });
}

function dragify(el, handle) {
  let dragging = false, ox = 0, oy = 0;
  handle.addEventListener("mousedown", (e) => {
    if (e.target.closest(".win-btns")) return;
    dragging = true;
    ox = e.clientX - el.offsetLeft;
    oy = e.clientY - el.offsetTop;
    e.preventDefault();
  });
  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    el.style.left = (e.clientX - ox) + "px";
    el.style.top  = Math.max(0, e.clientY - oy) + "px";
  });
  document.addEventListener("mouseup", () => { dragging = false; });
}

// -------------------- Show desktop --------------------
document.getElementById("showdesktop").addEventListener("click", () => {
  const anyVisible = [...openWindows.values()].some(v => v.win.style.display !== "none");
  openWindows.forEach(v => { v.win.style.display = anyVisible ? "none" : "flex"; });
});

// -------------------- Clock --------------------
function updateClock() {
  const d = new Date();
  const t = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dt = d.toLocaleDateString();
  document.getElementById("clock").innerHTML = `${t}<br>${dt}`;
}
updateClock();
setInterval(updateClock, 15000);
