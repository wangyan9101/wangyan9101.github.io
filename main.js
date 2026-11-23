(() => {
  'use strict';
  const header = document.querySelector('.site-header');
  const links = [...document.querySelectorAll('nav a[href^="#"]')];
  const sections = links.map(link => ({ link, target: document.getElementById(link.hash.slice(1)) }))
    .filter(section => section.target);
  if (!header) return;
  let framePending = false;
  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 16);
    const marker = header.getBoundingClientRect().bottom + 32;
    let active = null;
    for (const section of sections) {
      if (section.target.getBoundingClientRect().top <= marker) active = section.link;
    }
    for (const { link } of sections) {
      if (link === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    framePending = false;
  };
  const scheduleUpdate = () => {
    if (!framePending) { framePending = true; requestAnimationFrame(update); }
  };
  const measure = () => {
    document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
    scheduleUpdate();
  };
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', measure);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(header);
  window.addEventListener('pageshow', measure);
  measure();
  // Keep the photo proportional to the full information column, including actions.
  const profile = document.querySelector('.profile-intro');
  const copy = document.querySelector('.profile-copy');
  const sizePortrait = () => {
    if (!profile || !copy || window.innerWidth <= 700) return;
    const height = Math.round(copy.getBoundingClientRect().height);
    profile.style.setProperty('--portrait-height', `${height}px`);
    profile.style.setProperty('--portrait-width', `${(height * 358 / 441).toFixed(2)}px`);
  };
  if (copy && 'ResizeObserver' in window) new ResizeObserver(sizePortrait).observe(copy);
  window.addEventListener('resize', sizePortrait);
  sizePortrait();
  const toggle = document.querySelector('.theme-toggle');
  if (toggle) toggle.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme !== 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    toggle.setAttribute('aria-pressed', String(dark));
    const label = dark ? '切换至浅色主题' : '切换至深色主题';
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
  });
})();
