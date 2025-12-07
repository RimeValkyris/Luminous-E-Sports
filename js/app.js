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

// Timeline: animate items and draw vertical line when items enter viewport
document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('.timeline-item');
  const line = document.querySelector('.timeline-line');

  if (!items || items.length === 0) return;

  // If user prefers reduced motion, reveal everything immediately
  if (prefersReducedMotion) {
    items.forEach(i => i.classList.add('in-view'));
    if (line) line.classList.add('drawn');
    return;
  }

  // Track scroll direction so animations trigger only when scrolling down
  let lastScrollY = window.scrollY || window.pageYOffset || 0;
  let scrollDirection = 'down';
  window.addEventListener('scroll', () => {
    const currentY = window.scrollY || window.pageYOffset || 0;
    scrollDirection = (currentY > lastScrollY) ? 'down' : 'up';
    lastScrollY = currentY;
  }, { passive: true });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Only activate animations when user is scrolling downwards
        if (scrollDirection === 'down') {
          entry.target.classList.add('in-view');
          // add drawn class to line the first time any item becomes visible
          if (line) line.classList.add('drawn');
        }
      }
    });
  }, { threshold: 0.18 });

  items.forEach(item => io.observe(item));
});

// Close mobile menu when resizing to larger screens
window.addEventListener('resize', () => {
  if (window.innerWidth > 1024 && navMenu.classList.contains('active')) {
    toggleMenu();
  }
});

// (counter initialization removed here — handled below via IntersectionObserver)

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

// Partners spotlight hover (follow-mouse lit effect)
document.addEventListener('DOMContentLoaded', () => {
  const partnerTiles = document.querySelectorAll('.partners-grid > div');
  if (!partnerTiles || partnerTiles.length === 0) return;

  partnerTiles.forEach(tile => {
    // initialize CSS variables
    tile.style.setProperty('--px', '50%');
    tile.style.setProperty('--py', '50%');

    const handleMove = (e) => {
      const rect = tile.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Use pixel values so radial-gradient position follows precisely
      tile.style.setProperty('--px', `${x}px`);
      tile.style.setProperty('--py', `${y}px`);
      tile.classList.add('is-hover');
    };

    const handleLeave = () => {
      tile.classList.remove('is-hover');
      tile.style.setProperty('--px', '50%');
      tile.style.setProperty('--py', '50%');
    };

    tile.addEventListener('mousemove', handleMove);
    tile.addEventListener('mouseleave', handleLeave);
    tile.addEventListener('touchstart', (e) => {
      // on touch, approximate center
      const rect = tile.getBoundingClientRect();
      tile.style.setProperty('--px', `${rect.width/2}px`);
      tile.style.setProperty('--py', `${rect.height/2}px`);
      tile.classList.add('is-hover');
    }, { passive: true });
    tile.addEventListener('touchend', handleLeave);
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
        // Allow dataset to specify the numeric target and optional prefix/suffix
        const target = parseInt(entry.target.dataset.target || entry.target.textContent, 10) || 0;
        const prefix = entry.target.dataset.prefix || '';
        const suffix = entry.target.dataset.suffix || '';
        animateCounter(entry.target, target, 2000, prefix, suffix);
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

// Scroll animations removed — no-op placeholder

// Tap-to-toggle player info overlay for touch devices
(function() {
  // Only enable on coarse pointers (most touch devices)
  const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (!isTouch) return;

  const cards = document.querySelectorAll('.player-card');
  if (!cards || cards.length === 0) return;

  // Helper to remove show state from all cards
  function clearAll() {
    cards.forEach(c => c.classList.remove('show-info'));
  }

  // Close when tapping outside any card
  function onDocTouch(e) {
    if (!e.target.closest || !e.target.closest('.player-card')) {
      clearAll();
    }
  }

  cards.forEach(card => {
    // use touchstart so the overlay appears immediately
    card.addEventListener('touchstart', (e) => {
      const already = card.classList.contains('show-info');
      // remove from others
      clearAll();
      if (!already) {
        card.classList.add('show-info');
        // add a short-lived document listener to close when tapping elsewhere
        document.addEventListener('touchstart', onDocTouch, { passive: true });
        // auto-hide after 6 seconds; clear any previous timer
        if (card.dataset.hideTimer) {
          clearTimeout(Number(card.dataset.hideTimer));
          delete card.dataset.hideTimer;
        }
        const t = setTimeout(() => {
          card.classList.remove('show-info');
          document.removeEventListener('touchstart', onDocTouch);
          delete card.dataset.hideTimer;
        }, 6000);
        card.dataset.hideTimer = String(t);
      } else {
        // manual close: clear timer if present
        if (card.dataset.hideTimer) {
          clearTimeout(Number(card.dataset.hideTimer));
          delete card.dataset.hideTimer;
        }
        card.classList.remove('show-info');
        document.removeEventListener('touchstart', onDocTouch);
      }
      // prevent the touch from triggering other handlers
      // allow event to continue if the target is an interactive element
      const interactive = e.target.closest('a, button, input, label');
      if (interactive) return;
      e.stopPropagation();
    }, { passive: true });
  });
})();

// Enable hover-like effect while click-dragging across job cards
document.addEventListener('DOMContentLoaded', () => {
  const jobsGrid = document.querySelector('.jobs-grid');
  if (!jobsGrid) return;

  const cardSelector = '.job-card-pink, .job-card-blue';
  let dragging = false;
  let currentCard = null;

  function setDraggingCard(card) {
    if (currentCard && currentCard !== card) currentCard.classList.remove('dragging');
    currentCard = card;
    if (currentCard) currentCard.classList.add('dragging');
  }

  function clearDragging() {
    dragging = false;
    if (currentCard) {
      currentCard.classList.remove('dragging');
      currentCard = null;
    }
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(e) {
    if (!dragging) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;
    const card = el.closest(cardSelector);
    if (card) {
      setDraggingCard(card);
    } else if (currentCard) {
      currentCard.classList.remove('dragging');
      currentCard = null;
    }
  }

  function onMouseUp() {
    clearDragging();
  }

  jobsGrid.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    dragging = true;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    const startCard = e.target.closest(cardSelector);
    if (startCard) setDraggingCard(startCard);
  });

  window.addEventListener('blur', clearDragging);
});

