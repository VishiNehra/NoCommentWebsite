const homeTitle = "NoComment. — Keep the feed. Skip the arguments.";
const privacyTitle = "Privacy policy — NoComment.";

function viewName() {
  if (location.hash === "#privacy" || /\/privacy\/?$/.test(location.pathname)) {
    return "privacy";
  }
  return "home";
}

function show(name) {
  document.documentElement.dataset.view = name;
  document.title = name === "privacy" ? privacyTitle : homeTitle;
  document.querySelectorAll("[data-view='privacy']").forEach((link) => {
    if (name === "privacy") link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  if (name === "home" && location.hash === "#how") {
    document.getElementById("how")?.scrollIntoView();
  } else {
    window.scrollTo(0, 0);
  }
}

function go(hash) {
  if (location.hash === hash) {
    show(viewName());
    return;
  }
  if (hash === "") {
    history.pushState(null, "", location.pathname.replace(/\/privacy\/?$/, "/") + location.search);
    show("home");
    return;
  }
  location.hash = hash;
}

document.addEventListener("click", (event) => {
  const play = event.target.closest("a.play-badge");
  if (play) {
    event.preventDefault();
    const tab = window.open(play.href, "_blank");
    if (tab) tab.opener = null;
    return;
  }
  const mail = event.target.closest('a[href^="mailto:"]');
  if (mail) {
    event.preventDefault();
    window.open(mail.getAttribute("href"), "_blank", "noopener");
    return;
  }
  const link = event.target.closest("[data-view]");
  if (!link) return;
  event.preventDefault();
  if (link.dataset.view === "privacy") {
    go("#privacy");
    return;
  }
  const href = link.getAttribute("href") || "";
  go(href === "#how" ? "#how" : "");
});

window.addEventListener("hashchange", () => show(viewName()));
show(viewName());

const scroller = document.querySelector("#shot-scroller");
const shotButtons = [...document.querySelectorAll(".shot-nav button")];

function showShot(index) {
  if (!scroller) return;
  scroller.scrollTo({ left: scroller.clientWidth * index, behavior: "smooth" });
}

function markShot() {
  if (!scroller || !shotButtons.length) return;
  const index = Math.round(scroller.scrollLeft / scroller.clientWidth);
  shotButtons.forEach((button, i) => {
    if (i === index) button.setAttribute("aria-current", "true");
    else button.removeAttribute("aria-current");
  });
}

shotButtons.forEach((button, index) => {
  button.addEventListener("click", () => showShot(index));
});
scroller?.addEventListener("scroll", markShot, { passive: true });
