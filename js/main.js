/* ════════════════════════════════════════════════════════════
   CARSON & GRAY — Shared JavaScript
════════════════════════════════════════════════════════════ */

/* ── SHARED NAV HTML ── */
function getNavHTML(activePage) {
  const links = [
    { href: 'for-clients.html',    label: 'For Clients' },
    { href: 'for-candidates.html', label: 'For Candidates' },
    { href: 'talent-pool.html',    label: 'Talent Pool' },
    { href: 'about.html',          label: 'About' },
    { href: 'contact.html',        label: 'Contact' },
  ];

  const navLinks = links.map(l =>
    `<a href="${l.href}" class="${activePage === l.href ? 'active' : ''}">${l.label}</a>`
  ).join('');

  const mobileLinks = links.map(l =>
    `<a href="${l.href}">${l.label}</a>`
  ).join('');

  return `
    <nav class="site-nav" id="site-nav" role="navigation" aria-label="Main navigation">
      <span class="nav-logo">Carson <em style="font-style:italic;">&amp;</em> Gray</span>
      <div class="nav-links">${navLinks}</div>
      <div class="nav-cta">
        <a href="contact.html" class="btn btn--filled">Book a Call</a>
      </div>
      <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </nav>
    <div class="mobile-menu" id="mobile-menu" role="dialog" aria-label="Mobile navigation">
      ${mobileLinks}
      <a href="contact.html" class="btn btn--filled">Book a Call</a>
    </div>
  `;
}

/* ── SHARED FOOTER HTML ── */
function getFooterHTML() {
  return `
    <footer class="site-footer" role="contentinfo">
      <div class="footer-wordmark" aria-hidden="true">Carson <em style="font-style:italic;">&amp;</em> Gray</div>
      <div class="footer-grid">
        <div class="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:raquel@carsonandgray.com">raquel@carsonandgray.com</a></li>
            <li><a href="https://calendly.com" target="_blank" rel="noopener">[Book via Calendly →]</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Follow</h4>
          <ul>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener">LinkedIn</a></li>
            <li><a href="https://tiktok.com/@carsonandgray" target="_blank" rel="noopener">TikTok @carsonandgray</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Services</h4>
          <ul>
            <li><a href="for-clients.html">For Clients</a></li>
            <li><a href="for-candidates.html">For Candidates</a></li>
            <li><a href="talent-pool.html">Talent Pool</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 Carson <em style="font-style:italic;">&amp;</em> Gray · Cape Town, South Africa · Confidential</p>
      </div>
    </footer>
  `;
}

/* ── INIT NAV & FOOTER ── */
function initNav(activePage) {
  const placeholder = document.getElementById('nav-placeholder');
  if (placeholder) placeholder.outerHTML = getNavHTML(activePage);

  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) footerPlaceholder.outerHTML = getFooterHTML();
}

/* ── NAV SCROLL BEHAVIOUR ── */
function initNavScroll() {
  const nav = document.getElementById('site-nav');
  if (!nav) return;

  const update = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ── HAMBURGER MENU ── */
function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ── SCROLL FADE-IN ── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));

  // Immediately show any reveal in the viewport (hero items)
  setTimeout(() => {
    els.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, 80);
}

/* ── FAQ ACCORDION ── */
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      // Toggle current
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* ── TALENT POOL FILTERS ── */
function initFilters() {
  const grid = document.getElementById('talent-grid');
  if (!grid) return;

  const selects = document.querySelectorAll('.filter-select[data-filter]');

  function applyFilters() {
    const active = {};
    selects.forEach(s => { active[s.dataset.filter] = s.value; });

    grid.querySelectorAll('.cand-card').forEach(card => {
      const role  = card.dataset.role  || '';
      const exp   = card.dataset.exp   || '';
      const avail = card.dataset.avail || '';

      const show =
        (!active.role  || active.role  === role)  &&
        (!active.exp   || active.exp   === exp)   &&
        (!active.avail || active.avail === avail);

      card.dataset.hidden = String(!show);
    });
  }

  selects.forEach(s => s.addEventListener('change', applyFilters));
}

/* ── APPLICATION FORM ── */
function initApplicationForm() {
  const form = document.getElementById('application-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    form.innerHTML = `
      <div style="text-align:center; padding: 64px 0;">
        <p style="font-family:var(--font-display); font-size:24px; font-style:italic; color:var(--ink); margin-bottom:12px;">Application received.</p>
        <p style="font-size:14px; color:var(--ink-mute);">We read every application personally. You'll hear from us within 5 business days.</p>
      </div>
    `;
  });
}

/* ── CONTACT FORM ── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    form.innerHTML = `
      <div style="padding: 40px 0;">
        <p style="font-family:var(--font-display); font-size:20px; font-style:italic; color:var(--ink); margin-bottom:12px;">Message sent.</p>
        <p style="font-size:14px; color:var(--ink-mute);">We'll be in touch shortly.</p>
      </div>
    `;
  });
}

/* ── MASTER INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initHamburger();
  initReveal();
  initFAQ();
  initFilters();
  initApplicationForm();
  initContactForm();
});
