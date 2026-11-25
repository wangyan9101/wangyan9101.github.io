(() => {
  'use strict';
  const sidebar = document.querySelector('.project-sidebar');
  const toggle = document.querySelector('.project-menu-toggle');
  const links = [...document.querySelectorAll('.project-nav-item')];
  const entries = links.map(link => ({link, section: document.getElementById(link.hash.slice(1))}));
  let active, pending = false, selected = null;
  const hovered = new Set();
  const refreshMeta = link => {
    const visible = link.classList.contains('is-active') || hovered.has(link) || link.matches(':focus-visible');
    link.querySelector('.nav-meta').setAttribute('aria-hidden', String(!visible));
  };
  for (const link of links) {
    link.addEventListener('pointerenter', () => {
      if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      hovered.add(link); refreshMeta(link);
    });
    link.addEventListener('pointerleave', () => { hovered.delete(link); refreshMeta(link); });
    link.addEventListener('focus', () => refreshMeta(link));
    link.addEventListener('blur', () => refreshMeta(link));
  }
  const highlight = link => {
    if (active === link) return;
    active = link;
    for (const entry of entries) {
      const current = entry.link === link;
      entry.link.classList.toggle('is-active', current);
      refreshMeta(entry.link);
      if (current) entry.link.setAttribute('aria-current', 'location');
      else entry.link.removeAttribute('aria-current');
    }
  };
  const sync = () => {
    const marker = (document.querySelector('.site-header')?.getBoundingClientRect().bottom || 0) + 45;
    if (selected && performance.now() < selected.until && Math.abs(selected.section.getBoundingClientRect().top - marker) > 35) {
      pending = false; return;
    }
    selected = null;
    const visible = entries.filter(entry => !entry.section.hidden);
    let current = visible[0];
    for (const entry of visible) if (entry.section.getBoundingClientRect().top <= marker + 10) current = entry;
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 5) current = visible.at(-1);
    highlight(current.link);
    pending = false;
  };
  const schedule = () => { if (!pending) { pending = true; requestAnimationFrame(sync); } };
  for (const entry of entries) entry.link.addEventListener('click', () => {
    highlight(entry.link);
    selected = {section: entry.section, until: performance.now() + 1400};
    if (matchMedia('(max-width: 900px)').matches) {
      sidebar.classList.add('is-collapsed'); toggle.setAttribute('aria-expanded', 'false');
    }
  });
  toggle.addEventListener('click', () => {
    const collapsed = sidebar.classList.toggle('is-collapsed');
    toggle.setAttribute('aria-expanded', String(!collapsed));
  });
  const filters = [...document.querySelectorAll('[data-filter]')];
  const applyFilter = (filter, scroll = true) => {
    selected = null;
    hovered.clear();
    for (const button of filters) button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
    for (const entry of entries) {
      const show = filter === 'all' || entry.section.dataset.categories.split('|').includes(filter);
      entry.section.hidden = !show;
      entry.link.hidden = !show;
      refreshMeta(entry.link);
    }
    const visible = entries.filter(entry => !entry.section.hidden);
    document.querySelector('.filter-status').textContent = `显示 ${visible.length} 个项目`;
    const current = visible.find(entry => scroll ? entry.link === active : entry.link.hash === location.hash) || visible[0];
    highlight(current.link);
    if (scroll) {
      selected = {section: current.section, until: performance.now() + 1400};
      history.replaceState(null, '', current.link.hash);
      current.section.scrollIntoView({block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    }
  };
  for (const button of filters) button.addEventListener('click', () => applyFilter(button.dataset.filter));
  window.addEventListener('hashchange', () => {
    const target = entries.find(entry => entry.link.hash === location.hash);
    if (target?.section.hidden) applyFilter('all', false);
  });
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule);
  window.addEventListener('hashchange', schedule);
  for (const event of ['wheel','touchstart','keydown']) window.addEventListener(event, () => {selected=null;}, {passive:true});
  if (matchMedia('(max-width: 900px)').matches) {
    sidebar.classList.add('is-collapsed'); toggle.setAttribute('aria-expanded', 'false');
  }
  const initial = entries.find(entry => entry.link.hash === location.hash);
  highlight((initial || entries[0]).link);
  window.addEventListener('load', schedule, {once:true});
})();
