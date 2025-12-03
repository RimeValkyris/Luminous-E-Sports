const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-links a");
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

// Respect reduced motion for any counting animations that may be present
document.addEventListener('DOMContentLoaded', () => {
  if (prefersReducedMotion) return;
  const counters = document.querySelectorAll('.stat-number, .prize-amount');
  counters.forEach(el => {
    const text = el.textContent.trim();
    const isMoney = /\$/.test(text);
    const target = parseInt(text.replace(/[^\d]/g, ''), 10);
    let current = 0;
    const duration = 1200;
    const step = Math.max(1, Math.round(target / (duration / 20)));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = isMoney ? `$${current}${text.endsWith('K') ? 'K' : ''}` : `${current}`;
    }, 20);
  });
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

// Animated counter for tournament stats
function animateCounter(element, target, duration = 2000, prefix = '', suffix = '') {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = prefix + target + suffix;
      clearInterval(timer);
    } else {
      element.textContent = prefix + Math.floor(current) + suffix;
    }
  }, 16);
}

// 3D Tilt Effect for News Cards
const newsCards = document.querySelectorAll('.news-card');

newsCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.01)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
  });
});

// Initialize counters when page loads
window.addEventListener('DOMContentLoaded', () => {
  const statNumbers = document.querySelectorAll('.stat-number');
  const prizeAmount = document.querySelector('.prize-amount');
  
  // Create an Intersection Observer to trigger animation when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        entry.target.classList.add('animated');
        const target = parseInt(entry.target.textContent);
        animateCounter(entry.target, target, 2000);
      }
    });
  }, { threshold: 0.5 });
  
  statNumbers.forEach(stat => observer.observe(stat));
  
  // Animate prize pool separately with $ prefix and K suffix
  if (prizeAmount && !prizeAmount.classList.contains('animated')) {
    const prizeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
          entry.target.classList.add('animated');
          animateCounter(entry.target, 50, 2000, '$', 'K');
        }
      });
    }, { threshold: 0.5 });
    
    prizeObserver.observe(prizeAmount);
  }
});

