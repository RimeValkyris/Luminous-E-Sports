const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-links a");

function toggleMenu() {
  const isActive = hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
  // update aria for accessibility
  hamburger.setAttribute("aria-expanded", isActive ? "true" : "false");
}

if (hamburger) {
  hamburger.addEventListener("click", toggleMenu);
  // allow keyboard activation
  hamburger.addEventListener("keydown", (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });
}

// Close menu when a nav link is clicked (mobile behavior)
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) toggleMenu();
  });
});

// Close mobile menu when resizing to larger screens
window.addEventListener('resize', () => {
  if (window.innerWidth > 1024 && navMenu.classList.contains('active')) {
    toggleMenu();
  }
});
