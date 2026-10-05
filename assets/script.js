(() => {
  'use strict';

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.getElementById('mobileToggle');
  const navList = document.getElementById('navList');
  const nav = navList ? navList.closest('.nav') : null;
  const backdrop = document.getElementById('sidebarBackdrop');

  function closeNav() {
    if (!nav) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    backdrop.hidden = true;
  }
  function openNav() {
    if (!nav) return;
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    backdrop.hidden = false;
  }

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.contains('is-open');
      isOpen ? closeNav() : openNav();
    });
    backdrop.addEventListener('click', closeNav);
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- Scrollspy: highlight active nav item (sidebar + bottom tab bar) ---------- */
  const sections = document.querySelectorAll('main .section[id]');
  const navLinks = document.querySelectorAll('.nav__link, .bottom-nav__link');

  const setActive = (id) => {
    navLinks.forEach(link => {
      const isMatch = link.dataset.section === id;
      link.classList.toggle('is-active', isMatch);
      if (isMatch) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
  }

  /* ---------- Accessible font-size control ---------- */
  const root = document.documentElement;
  const STEP = 0.1;   // rem
  const MIN = 0.9;
  const MAX = 1.6;
  let currentSize = 1.15; // matches --fs-base default

  const applySize = () => {
    root.style.setProperty('--fs-base', currentSize.toFixed(2) + 'rem');
  };

  document.getElementById('fontUp')?.addEventListener('click', () => {
    currentSize = Math.min(MAX, +(currentSize + STEP).toFixed(2));
    applySize();
  });
  document.getElementById('fontDown')?.addEventListener('click', () => {
    currentSize = Math.max(MIN, +(currentSize - STEP).toFixed(2));
    applySize();
  });
  document.getElementById('fontReset')?.addEventListener('click', () => {
    currentSize = 1.15;
    applySize();
  });

  /* ---------- Dark mode ---------- */
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle?.querySelector('i');

  const applyTheme = (theme) => {
    html.setAttribute('data-theme', theme);
    const isDark = theme === 'dark';
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(isDark));
      themeToggle.setAttribute('aria-label', isDark ? 'Turn off dark mode' : 'Turn on dark mode');
    }
    if (themeIcon) {
      themeIcon.className = isDark ? 'ph ph-sun' : 'ph ph-moon';
    }
  };

  // Respect the visitor's OS-level preference on first load.
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  themeToggle?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });

  /* ---------- Click-through project galleries ---------- */
  document.querySelectorAll('[data-gallery]').forEach((gallery) => {
    const frame = gallery.querySelector('.gallery__frame');
    const images = Array.from(gallery.querySelectorAll('.gallery__img'));
    const dots = Array.from(gallery.querySelectorAll('.gallery__dot'));
    const caption = gallery.querySelector('.gallery__caption');
    const prevBtn = gallery.querySelector('.gallery__nav--prev');
    const nextBtn = gallery.querySelector('.gallery__nav--next');
    let index = images.findIndex(img => img.classList.contains('is-active'));
    if (index < 0) index = 0;

    const render = () => {
      images.forEach((img, i) => img.classList.toggle('is-active', i === index));
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-selected', String(i === index));
      });
      const label = images[index].dataset.caption || '';
      if (caption) caption.textContent = label;
      frame.setAttribute('aria-label', `Dream House gallery — showing ${label}. Activate to see the next image.`);
    };

    const go = (newIndex) => {
      index = (newIndex + images.length) % images.length;
      render();
    };

    frame.addEventListener('click', () => go(index + 1));
    frame.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        go(index + 1);
      }
    });
    prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); go(index - 1); });
    nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); go(index + 1); });
    dots.forEach((dot, i) => dot.addEventListener('click', (e) => { e.stopPropagation(); go(i); }));

    render();
  });

  /* ---------- Contact form (front-end only placeholder) ---------- */  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        status.textContent = 'Please fill in every field before sending.';
        return;
      }
      // Wire this up to your email service or a form endpoint (e.g. Formspree).
      status.textContent = 'Thanks — this form is a placeholder, so connect it to a real endpoint to receive messages.';
      form.reset();
    });
  }
})();