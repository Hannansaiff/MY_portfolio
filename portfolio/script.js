/**
 * HANAN KHAN PORTFOLIO – script.js
 * Java Backend Developer Portfolio
 */

'use strict';

/* ===== PRELOADER ===== */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('hidden'), 600);
  }
});

/* ===== AOS INIT ===== */
AOS.init({
  duration: 750,
  easing: 'ease-out-quad',
  once: true,
  offset: 60,
});

/* ===== DARK / LIGHT MODE ===== */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const html        = document.documentElement;

const savedTheme = localStorage.getItem('hk-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('hk-theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

/* ===== NAVBAR – SCROLL & ACTIVE LINKS ===== */
const navbar   = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.navbar .nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled class
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Active nav link
  let current = '';
  sections.forEach(section => {
    const sTop = section.offsetTop - 80;
    if (window.scrollY >= sTop) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });

  // Back to top
  const btt = document.getElementById('backToTop');
  if (btt) btt.classList.toggle('visible', window.scrollY > 400);
});

// Smooth close navbar on mobile link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const collapse = document.getElementById('navbarNav');
    if (collapse && collapse.classList.contains('show')) {
      new bootstrap.Collapse(collapse).hide();
    }
  });
});

/* ===== BACK TO TOP ===== */
const bttBtn = document.getElementById('backToTop');
if (bttBtn) {
  bttBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== TYPED TEXT EFFECT ===== */
const typedEl  = document.getElementById('typed-text');
const phrases  = [
  'Java Developer',
  'Spring Boot Developer',
  'Backend Developer',
  'Software Engineering Student',
  'Python Developer',
  'Data Science Enthusiast',
];
let phraseIndex = 0, charIndex = 0, deleting = false;

function type() {
  if (!typedEl) return;
  const current = phrases[phraseIndex];
  if (!deleting) {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(type, 1600);
      return;
    }
  } else {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 60 : 90);
}
type();

/* ===== ANIMATED COUNTERS ===== */
function animateCounter(el) {
  const target = +el.getAttribute('data-count');
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

/* ===== SKILL BAR ANIMATION ===== */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.getAttribute('data-width') + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillSection = document.getElementById('skills');
if (skillSection) skillObserver.observe(skillSection);

/* ===== PROJECT SEARCH & FILTER ===== */
const searchInput  = document.getElementById('projectSearch');
const filterTags   = document.querySelectorAll('.filter-tag');
const projectItems = document.querySelectorAll('.project-item');
const noResults    = document.getElementById('noResults');

let activeFilter = 'all';

function filterProjects() {
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  let visible = 0;

  projectItems.forEach(item => {
    const category = item.getAttribute('data-category');
    const text     = item.textContent.toLowerCase();

    const matchFilter = activeFilter === 'all' || category === activeFilter;
    const matchSearch = !query || text.includes(query);

    if (matchFilter && matchSearch) {
      item.style.display = '';
      visible++;
    } else {
      item.style.display = 'none';
    }
  });

  if (noResults) noResults.classList.toggle('d-none', visible > 0);
}

filterTags.forEach(tag => {
  tag.addEventListener('click', () => {
    filterTags.forEach(t => t.classList.remove('active'));
    tag.classList.add('active');
    activeFilter = tag.getAttribute('data-filter');
    filterProjects();
  });
});

if (searchInput) searchInput.addEventListener('input', filterProjects);

/* ===== CONTACT FORM VALIDATION ===== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('contactName');
    const email   = document.getElementById('contactEmail');
    const subject = document.getElementById('contactSubject');
    const message = document.getElementById('contactMessage');
    const success = document.getElementById('formSuccess');
    const error   = document.getElementById('formError');
    const btnText    = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');

    let valid = true;
    const fields = [name, email, subject, message];

    fields.forEach(field => {
      const fb = field.parentElement.querySelector('.invalid-feedback-custom')
                  || field.closest('.form-group-custom').querySelector('.invalid-feedback-custom');
      if (!field.value.trim() || (field.type === 'email' && !isValidEmail(field.value))) {
        field.classList.add('error');
        if (fb) fb.style.display = 'block';
        valid = false;
      } else {
        field.classList.remove('error');
        if (fb) fb.style.display = 'none';
      }
    });

    if (!valid) {
      if (error) { error.classList.remove('d-none'); setTimeout(() => error.classList.add('d-none'), 4000); }
      return;
    }

    // Simulate submission (replace with real PHP endpoint)
    btnText.classList.add('d-none');
    btnLoading.classList.remove('d-none');

    await new Promise(r => setTimeout(r, 1500));

    btnText.classList.remove('d-none');
    btnLoading.classList.add('d-none');
    contactForm.reset();
    success.classList.remove('d-none');
    setTimeout(() => success.classList.add('d-none'), 5000);
  });

  // Live validation clear
  contactForm.querySelectorAll('.form-control-custom').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const fb = input.closest('.form-group-custom')?.querySelector('.invalid-feedback-custom');
      if (fb) fb.style.display = 'none';
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72; // navbar height
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});
