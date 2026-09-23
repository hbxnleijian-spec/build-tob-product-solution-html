(() => {
  "use strict";
  const search = document.querySelector("[data-tob-nav-search]");
  if (search) {
    search.addEventListener("input", () => {
      const query = search.value.trim().toLowerCase();
      document.querySelectorAll("[data-tob-nav-link]").forEach(link => {
        link.hidden = Boolean(query) && !link.textContent.toLowerCase().includes(query);
      });
    });
  }

  const backTop = document.querySelector("[data-tob-back-top]");
  if (backTop) backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const links = [...document.querySelectorAll("[data-tob-nav-link]")];
  const targets = links.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && targets.length) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach(link => link.removeAttribute("aria-current"));
      const active = links.find(link => link.getAttribute("href") === `#${visible.target.id}`);
      if (active) active.setAttribute("aria-current", "true");
    }, { rootMargin: "-20% 0px -70% 0px", threshold: [0, .25, .75] });
    targets.forEach(target => observer.observe(target));
  }
})();
