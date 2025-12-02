const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-links a");

function toggleMenu() {
  const isActive = hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
  // update aria for accessibility
  hamburger.setAttribute("aria-expanded", isActive ? "true" : "false");
  // mark overlay state on body to control logo visibility
  if (isActive) {
    document.body.classList.add('overlay-open');
  } else {
    document.body.classList.remove('overlay-open');
  }
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

// Carousel functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
  // Remove active class from all slides and dots
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  // Add active class to current slide and dot
  if (slides[index]) {
    slides[index].classList.add('active');
  }
  if (dots[index]) {
    dots[index].classList.add('active');
  }
}

function changeSlide(direction) {
  currentSlideIndex += direction;
  
  // Loop around if we go past the bounds
  if (currentSlideIndex >= slides.length) {
    currentSlideIndex = 0;
  } else if (currentSlideIndex < 0) {
    currentSlideIndex = slides.length - 1;
  }
  
  showSlide(currentSlideIndex);
}

function currentSlide(index) {
  currentSlideIndex = index - 1; // Convert to 0-based index
  showSlide(currentSlideIndex);
}

// Auto-play carousel (optional)
function autoSlide() {
  changeSlide(1);
}

// Start auto-play when carousel exists
if (slides.length > 0) {
  // Auto-advance every 5 seconds
  setInterval(autoSlide, 5000);
}

// Keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
  if (slides.length > 0) {
    if (e.key === 'ArrowLeft') {
      changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
      changeSlide(1);
    }
  }
});
