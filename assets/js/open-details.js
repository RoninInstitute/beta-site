document.addEventListener("DOMContentLoaded", () => {
  const activate = hash => {
    if (!hash) return;
    const s = document.querySelector(hash);
    if (!s || s.tagName.toLowerCase() !== "summary") return;
    const d = s.parentElement;
    if (d?.tagName.toLowerCase() !== "details") return;

    document.querySelectorAll("details.is-targeted")
      .forEach(x => x.classList.remove("is-targeted"));

    d.open = true;
    d.classList.add("is-targeted");

    setTimeout(() => d.scrollIntoView({ block: "start" }), 50);
  };

  activate(location.hash);
  window.addEventListener("hashchange", () => activate(location.hash));
});

document.addEventListener("click", e => {
  const a = e.target.closest("a.summary-permalink");
  if (!a) return;

  e.preventDefault();

  const summary = a.closest("summary");
  if (!summary?.id) return;

  const url = new URL(location.href);
  url.hash = summary.id;

  navigator.clipboard?.writeText(url.toString()).then(() => {
    // show visual feedback
    a.classList.add("copied");

    // update tooltip
    const oldTitle = a.getAttribute("title");
    a.removeAttribute("title");
    a.setAttribute("title", "Copied!");

    // remove feedback after 1.2s
    setTimeout(() => {
      a.classList.remove("copied");
      a.removeAttribute("title");
      a.setAttribute("title", oldTitle || "Copy permalink");
    }, 1200);
  });
});
