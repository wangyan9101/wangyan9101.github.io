(() => {
  'use strict';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'back-to-top';
  button.hidden = true;
  button.setAttribute('aria-label', '返回顶部');
  button.title = '返回顶部';
  button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 12 6-6 6 6M12 6v13"/></svg>';
  document.body.append(button);
  let pending = false;
  const update = () => {
    const remaining = document.documentElement.scrollHeight - innerHeight - scrollY;
    button.hidden = scrollY < 200 || remaining > 100;
    pending = false;
  };
  const schedule = () => {
    if (!pending) {
      pending = true;
      requestAnimationFrame(update);
    }
  };
  button.addEventListener('click', () => {
    window.scrollTo({top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  });
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(document.body);
  update();
})();
