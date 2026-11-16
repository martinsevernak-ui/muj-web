// ===== Navigace a patička (úprava na jednom místě = změna na všech stránkách) =====
const JMENO = "Tvoje Jméno";
const stranky = [
  ["../../index.html","Domů"],["../../o-mne.html","O mně & Škola"],["../../kontakt.html","Kontakt"]
];
const dalsiStranky = [
  ["knihy.html","Knihy"],["../../projekty.html","Projekty & Zájmy"],["../../auta.html","Auta"],
  ["../../znamky.html","Známky"],["../../denik.html","Deník"]
];
const aktualni = location.pathname.split("/").pop() || "index.html";
const aktivniDalsiStranka = dalsiStranky.some(([u]) => u.split("/").pop()===aktualni);
document.getElementById("site-header").innerHTML = `
 <div class="wrap nav">
  <a class="logo" href="../../index.html">${JMENO.split(" ")[0]}<span>.</span></a>
  <ul class="menu" id="menu">
   ${stranky.map(([u,n])=>`<li><a href="${u}" class="${u.split("/").pop()===aktualni?"active":""}">${n}</a></li>`).join("")}
   <li class="dropdown" id="more-dropdown">
    <button class="more-toggle${aktivniDalsiStranka?" active":""}" id="more-toggle" aria-label="Další stránky" aria-expanded="false" aria-controls="more-menu"><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span></button>
    <ul class="dropdown-menu" id="more-menu" aria-label="Další stránky">
     ${dalsiStranky.map(([u,n])=>`<li><a href="${u}" class="${u.split("/").pop()===aktualni?"active":""}">${n}</a></li>`).join("")}
    </ul>
   </li>
   <li><button class="icon-btn" id="theme" aria-label="Přepnout světlý/tmavý režim">🌙</button></li>
  </ul>
  <button class="icon-btn" id="burger" aria-label="Otevřít navigaci" aria-expanded="false" aria-controls="menu">☰</button>
 </div>`;
document.getElementById("site-footer").innerHTML =
  `<div class="wrap">© ${new Date().getFullYear()} ${JMENO} · Vytvořeno s láskou a trochou kávy ☕</div>`;

// Navigace
const menu = document.getElementById("menu");
const burger = document.getElementById("burger");
const dropdown = document.getElementById("more-dropdown");
const moreToggle = document.getElementById("more-toggle");
burger.onclick = () => {
  const isOpen = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(isOpen));
  if (!isOpen) {
    dropdown.classList.remove("open");
    moreToggle.setAttribute("aria-expanded", "false");
  }
};
moreToggle.onclick = () => {
  const isOpen = dropdown.classList.toggle("open");
  moreToggle.setAttribute("aria-expanded", String(isOpen));
};
document.addEventListener("click", e => {
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove("open");
    moreToggle.setAttribute("aria-expanded", "false");
  }
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && (dropdown.classList.contains("open") || menu.classList.contains("open"))) {
    const dropdownWasOpen = dropdown.classList.contains("open");
    const menuWasOpen = menu.classList.contains("open");
    dropdown.classList.remove("open");
    moreToggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    (menuWasOpen || !dropdownWasOpen ? burger : moreToggle).focus();
  }
});
menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  menu.classList.remove("open");
  burger.setAttribute("aria-expanded", "false");
}));

// Tmavý / světlý režim
const root = document.documentElement, tbtn = document.getElementById("theme");
const nastav = t => { root.dataset.theme = t; tbtn.textContent = t==="dark"?"☀️":"🌙"; try{localStorage.setItem("tema",t)}catch(e){} };
let ulozene; try{ulozene = localStorage.getItem("tema")}catch(e){}
nastav(ulozene || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
tbtn.onclick = () => nastav(root.dataset.theme==="dark"?"light":"dark");

// Plynulé zobrazení prvků při scrollu
const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)} }), {threshold:.12});
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Filtr knih
document.querySelectorAll(".chip").forEach(ch => ch.onclick = () => {
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("on"));
  ch.classList.add("on");
  document.querySelectorAll(".book").forEach(b => b.classList.toggle("hide", ch.dataset.f!=="vse" && !b.dataset.z.split(/\s+/).includes(ch.dataset.f)));
});

document.querySelectorAll(".author-books [data-author]").forEach(list => {
  [...list.children].forEach(item => {
    const title = document.createElement("span");
    title.className = "book-title";
    while (item.firstChild) title.append(item.firstChild);
    const author = document.createElement("span");
    author.className = "book-author";
    author.textContent = list.dataset.author;
    item.append(title, author);
  });
});

// Kontaktní formulář – otevře e-mail (změň adresu níže)
const f = document.getElementById("kform");
if(f) f.onsubmit = e => {
  e.preventDefault();
  const d = new FormData(f);
  location.href = `mailto:tvuj@email.cz?subject=${encodeURIComponent("Zpráva z webu od "+d.get("jmeno"))}&body=${encodeURIComponent(d.get("zprava")+"\n\n"+d.get("email"))}`;
};
