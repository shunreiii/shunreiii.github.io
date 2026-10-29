const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navigationLinks = [...document.querySelectorAll(".nav-links a")];
const sections = [...document.querySelectorAll("main section[id]")];
const currentYear = document.querySelector("#current-year");
const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = themeToggle.querySelector(".theme-label");
const themeTransitionDuration = 800;

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
