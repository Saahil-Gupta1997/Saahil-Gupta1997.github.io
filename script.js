// Your booking page, e.g. 'https://cal.com/your-name/20min'.
// While this is empty, the "Book a 20-min call" buttons stay hidden.
const BOOKING_URL = '';

(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');
  if (BOOKING_URL) {
    document.querySelectorAll('[data-book]').forEach(link => {
      link.href = BOOKING_URL;
      link.hidden = false;
    });
  }
  const themeButton = document.querySelector('.theme-toggle');
  const themeOrder = ['system', 'dark', 'light'];
  function labelTheme() {
    const preference = window.portfolioTheme.preference;
    const next = themeOrder[(themeOrder.indexOf(preference) + 1) % themeOrder.length];
    themeButton.textContent = 'Theme: ' + preference[0].toUpperCase() + preference.slice(1);
    themeButton.setAttribute('aria-label', 'Theme: ' + preference + '. Switch to ' + next + '.');
  }
  if (window.portfolioTheme) {
    themeButton.hidden = false;
    labelTheme();
    themeButton.addEventListener('click', () => {
      const index = themeOrder.indexOf(window.portfolioTheme.preference);
      window.portfolioTheme.set(themeOrder[(index + 1) % themeOrder.length]);
      labelTheme();
    });
  }

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('navigation');
  menuButton.hidden = false;
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }
  menuButton.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      menuButton.focus();
    }
  });

  const form = document.getElementById('inquiry-form');
  const service = document.getElementById('service');
  const problem = document.getElementById('problem');
  const context = document.getElementById('context');
  const draft = document.getElementById('email-draft');
  const draftText = document.getElementById('draft-text');
  const draftLink = document.getElementById('draft-link');
  const serviceNames = {
    automation: 'Automate a process',
    delivery: 'AI and automation project delivery',
    both: 'Not sure yet / help defining the scope'
  };
  form.hidden = false;
  document.querySelectorAll('[data-service]').forEach(link => {
    link.addEventListener('click', () => {
      service.value = link.dataset.service;
      draft.hidden = true;
    });
  });
  form.addEventListener('input', () => { draft.hidden = true; });
  form.addEventListener('change', () => { draft.hidden = true; });
  problem.addEventListener('input', () => problem.setCustomValidity(''));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const description = problem.value.trim();
    problem.setCustomValidity(description ? '' : 'Please describe the workflow or project you need help with.');
    if (!form.reportValidity()) return;
    const selectedService = serviceNames[service.value] || serviceNames.both;
    const body = 'Hi Saahil,\n\nI’m interested in: ' + selectedService + '.\n\n'
      + 'What’s getting stuck:\n' + description + '\n\n'
      + (context.value.trim() ? 'Tools, team & timing:\n' + context.value.trim() + '\n\n' : '')
      + 'Could we discuss the scope, your availability, and a quote?';
    const subject = 'Project inquiry — ' + selectedService;
    draftText.textContent = body;
    draftLink.href = 'mailto:gupta.saahil97@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    draft.hidden = false;
    draft.focus({ preventScroll: true });
    draft.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  });

  const copyButton = document.querySelector('.copy-email');
  const copyStatus = document.querySelector('.copy-status');
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    copyButton.hidden = false;
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('gupta.saahil97@gmail.com');
        copyStatus.textContent = 'Email address copied.';
      } catch (_) {
        copyStatus.textContent = 'Please select and copy the email address above.';
      }
    });
  }
})();
