const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navigationLinks = [...document.querySelectorAll(".nav-links a")];
const sections = [...document.querySelectorAll("main section[id]")];
const currentYear = document.querySelector("#current-year");
const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = themeToggle.querySelector(".theme-label");
const themeTransitionDuration = 800;
const revealSections = [...document.querySelectorAll("main .section")];
const hero = document.querySelector(".hero");
let heroShadowFrame = 0;
let heroPointer = null;
let heroMotion = null;

const setTheme = (isDark) => {
  document.body.classList.toggle("dark-mode", isDark);
  document.documentElement.classList.toggle("dark-mode", isDark);
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
};

setTheme(localStorage.getItem("theme") === "dark");

themeToggle.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark-mode");
  document.body.classList.add("theme-transition");
  setTheme(isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
  window.setTimeout(() => {
    document.body.classList.remove("theme-transition");
  }, themeTransitionDuration);
});

// Keep the mobile menu accessible and close it after a navigation selection.
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.querySelector(".menu-icon").textContent = isOpen ? "×" : "+";
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.querySelector(".menu-icon").textContent = "+";
  });
});

// Mark the section closest to the top of the viewport as active.
const updateActiveLink = () => {
  const scrollPosition = window.scrollY + 140;
  let currentSectionId = sections[0]?.id;

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPosition) currentSectionId = section.id;
  });

  navigationLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentSectionId}`;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
};

window.addEventListener("scroll", updateActiveLink, { passive: true });
window.addEventListener("resize", updateActiveLink);
updateActiveLink();

currentYear.textContent = new Date().getFullYear();

const updateHeroShadow = () => {
  heroShadowFrame = 0;
  if (!hero || (!heroPointer && !heroMotion)) {
    hero?.style.setProperty("--hero-shadow-opacity", "0");
    return;
  }

  const bounds = hero.getBoundingClientRect();
  const centerX = bounds.left + bounds.width / 2;
  const centerY = bounds.top + bounds.height / 2;
  const pointerX = heroPointer ? (centerX - heroPointer.x) * 0.12 : 0;
  const pointerY = heroPointer ? (centerY - heroPointer.y) * 0.12 : 0;
  const motionX = heroMotion ? heroMotion.x : 0;
  const motionY = heroMotion ? heroMotion.y : 0;
  hero.style.setProperty("--hero-shadow-x", `${pointerX + motionX}px`);
  hero.style.setProperty("--hero-shadow-y", `${pointerY + motionY}px`);
  hero.style.setProperty("--hero-shadow-opacity", ".32");
};

const queueHeroShadowUpdate = () => {
  if (!heroShadowFrame) heroShadowFrame = window.requestAnimationFrame(updateHeroShadow);
};

window.addEventListener("pointermove", (event) => {
  heroPointer = { x: event.clientX, y: event.clientY };
  queueHeroShadowUpdate();
});

window.addEventListener("blur", () => {
  heroPointer = null;
  heroMotion = null;
  queueHeroShadowUpdate();
});

window.addEventListener("devicemotion", (event) => {
  const acceleration = event.accelerationIncludingGravity;
  if (!acceleration || acceleration.x === null || acceleration.y === null) return;

  heroMotion = {
    x: Math.max(-32, Math.min(32, -acceleration.x * 2)),
    y: Math.max(-32, Math.min(32, -acceleration.y * 2)),
  };
  queueHeroShadowUpdate();
});

revealSections.forEach((section, index) => {
  section.classList.add("reveal-section");
  if (index % 2 === 1) section.classList.add("reveal-from-right");
});

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  }, { threshold: .15 });

  revealSections.forEach((section) => sectionObserver.observe(section));
} else {
  revealSections.forEach((section) => section.classList.add("is-visible"));
}
