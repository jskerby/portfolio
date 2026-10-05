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

  // A saved choice wins; otherwise fall back to the visitor's OS-level preference.
  const THEME_KEY = 'jkb-portfolio-theme';
  let savedTheme = null;
  try { savedTheme = localStorage.getItem(THEME_KEY); } catch (err) { /* storage unavailable, ignore */ }

  if (savedTheme === 'dark' || savedTheme === 'light') {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  themeToggle?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (err) { /* storage unavailable, ignore */ }
  });

  /* ---------- Lightbox: full-size image viewer ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let lbImages = [];
  let lbIndex = 0;
  let lbReturnFocusTo = null;

  const renderLightbox = () => {
    const img = lbImages[lbIndex];
    if (!img) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.dataset.caption || '';
  };

  const openLightbox = (images, startIndex, triggerEl) => {
    lbImages = images;
    lbIndex = startIndex;
    lbReturnFocusTo = triggerEl;
    renderLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    lbReturnFocusTo?.focus();
  };

  const stepLightbox = (delta) => {
    lbIndex = (lbIndex + delta + lbImages.length) % lbImages.length;
    renderLightbox();
  };

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', () => stepLightbox(-1));
  lightboxNext?.addEventListener('click', () => stepLightbox(1));
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });

  /* ---------- Project galleries: browse on the card, click the photo to view full-size ---------- */
  document.querySelectorAll('[data-gallery]').forEach((gallery) => {
    const frame = gallery.querySelector('.gallery__frame');
    const images = Array.from(gallery.querySelectorAll('.gallery__img'));
    const dots = Array.from(gallery.querySelectorAll('.gallery__dot'));
    const caption = gallery.querySelector('.gallery__caption');
    const prevBtn = gallery.querySelector('.gallery__nav--prev');
    const nextBtn = gallery.querySelector('.gallery__nav--next');
    const projectTitle = gallery.closest('.project-card')?.querySelector('h3')?.textContent.trim() || 'Project';
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
      frame.setAttribute('aria-label', `${projectTitle} gallery — showing ${label}. Activate to view it full-size.`);
    };

    const go = (newIndex) => {
      index = (newIndex + images.length) % images.length;
      render();
    };

    // Clicking (or pressing Enter/Space on) the photo opens the full-size viewer.
    frame.addEventListener('click', () => openLightbox(images, index, frame));
    frame.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(images, index, frame);
      }
    });
    // The small arrows and dots still just browse the card itself, without opening the viewer.
    prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); go(index - 1); });
    nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); go(index + 1); });
    dots.forEach((dot, i) => dot.addEventListener('click', (e) => { e.stopPropagation(); go(i); }));

    render();
  });

  /* ---------- "Web Works" combo card: click through multiple full projects in one card ---------- */
  document.querySelectorAll('[data-combo]').forEach((combo) => {
    const slides = Array.from(combo.querySelectorAll('[data-slide]'));
    const dots = Array.from(combo.querySelectorAll('.combo__dot'));
    const prevBtn = combo.querySelector('.combo__nav--prev');
    const nextBtn = combo.querySelector('.combo__nav--next');
    const countEl = combo.closest('.project-card')?.querySelector('[data-combo-count]');
    let index = slides.findIndex(s => s.classList.contains('is-active'));
    if (index < 0) index = 0;

    const render = () => {
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-selected', String(i === index));
      });
      if (countEl) countEl.textContent = `${index + 1} / ${slides.length}`;
    };

    const go = (newIndex) => {
      index = (newIndex + slides.length) % slides.length;
      render();
    };

    prevBtn?.addEventListener('click', () => go(index - 1));
    nextBtn?.addEventListener('click', () => go(index + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));

    render();
  });

  /* ---------- Contact modal ---------- */
  const contactModal = document.getElementById('contactModal');
  const contactModalClose = document.getElementById('contactModalClose');
  const openContactLinks = document.querySelectorAll('.js-open-contact');
  let contactReturnFocusTo = null;

  const openContactModal = (triggerEl) => {
    if (!contactModal) return;
    contactReturnFocusTo = triggerEl || document.activeElement;
    contactModal.hidden = false;
    document.body.style.overflow = 'hidden';
    contactModalClose?.focus();
    // Show "Contact" as the active nav item while the modal is open.
    document.querySelectorAll('.nav__link, .bottom-nav__link').forEach((link) => {
      const isContact = link.dataset.section === 'contact';
      link.classList.toggle('is-active', isContact);
      if (isContact) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const closeContactModal = () => {
    if (!contactModal) return;
    contactModal.hidden = true;
    document.body.style.overflow = '';
    contactReturnFocusTo?.focus();
  };

  openContactLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openContactModal(link);
    });
  });
  contactModalClose?.addEventListener('click', closeContactModal);
  contactModal?.addEventListener('click', (e) => {
    if (e.target === contactModal) closeContactModal();
  });
  document.addEventListener('keydown', (e) => {
    if (contactModal && !contactModal.hidden && e.key === 'Escape') closeContactModal();
  });

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        status.textContent = 'Please fill in every field before sending.';
        return;
      }

      const endpoint = form.getAttribute('action') || '';
      if (!endpoint || endpoint.includes('YOUR_FORM_ID')) {
        status.textContent = 'Form endpoint not set up yet — add your Formspree URL to the form\u2019s action attribute.';
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      status.textContent = 'Sending…';

      const formData = new FormData(form);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });

        if (response.ok) {
          status.textContent = 'Thanks — your message is on its way. I\u2019ll get back to you soon.';
          form.reset();
        } else {
          status.textContent = 'Something went wrong sending that. Please try again or email me directly.';
        }
      } catch (err) {
        status.textContent = 'Network error — please check your connection and try again.';
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  /* ---------- Scroll-reveal: cards fade/rise into view as you scroll ---------- */
  const revealTargets = document.querySelectorAll(
    '.project-card, .skill-category, .service'
  );

  if ('IntersectionObserver' in window && revealTargets.length) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach((el) => {
      // Add the "start hidden" class only now, via JS — so visitors without
      // JavaScript always see full content, never a stuck-invisible element.
      el.classList.add('reveal-init');
      revealObserver.observe(el);
    });
  }

  /* ---------- Skill bars: animate from 0 to their target width on scroll ---------- */
  const skillBars = document.querySelectorAll('.skill-bar__fill');

  if ('IntersectionObserver' in window && skillBars.length) {
    const barObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const target = bar.style.width;
          bar.style.width = '0%';
          // Force a reflow so the browser registers the 0% before animating to target.
          void bar.offsetWidth;
          requestAnimationFrame(() => { bar.style.width = target; });
          obs.unobserve(bar);
        }
      });
    }, { threshold: 0.4 });

    skillBars.forEach((bar) => barObserver.observe(bar));
  }
})();