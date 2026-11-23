(() => {
'use strict';
const $ = (selector) => document.querySelector(selector);
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
 document.querySelectorAll('[data-filter]').forEach(b => {b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
 let count=0;
 document.querySelectorAll('.project').forEach(card=>{card.hidden = button.dataset.filter!=='all'&&!card.dataset.categories.split('|').includes(button.dataset.filter);if(!card.hidden) count++;});
 $('#filter-status').textContent=`当前显示 ${count} 个项目`;
}));
let savedTheme;
try {savedTheme=localStorage.getItem('resume-v2-theme');} catch {}
const setTheme = (dark) => {document.documentElement.dataset.theme=dark?'dark':'light';$('#theme').setAttribute('aria-pressed',String(dark));$('#theme').setAttribute('aria-label',dark?'切换至浅色主题':'切换至深色主题');$('#theme span').textContent=dark?'浅色':'深色';};
const media=matchMedia('(prefers-color-scheme: dark)');
setTheme(savedTheme?savedTheme==='dark':media.matches);
$('#theme').addEventListener('click',()=>{const dark=document.documentElement.dataset.theme!=='dark';setTheme(dark);savedTheme=dark?'dark':'light';try{localStorage.setItem('resume-v2-theme',savedTheme);}catch{}});
media.addEventListener('change',event=>{if(!savedTheme)setTheme(event.matches);});
let printState;
const preparePrint = () => {if(printState)return;printState=[...document.querySelectorAll('.project')].map(card=>({card,hidden:card.hidden,open:card.querySelector('details').open}));printState.forEach(({card})=>{card.hidden=false;card.querySelector('details').open=true;});};
const restorePrint = () => {if(!printState)return;printState.forEach(({card,hidden,open})=>{card.hidden=hidden;card.querySelector('details').open=open;});printState=null;};
window.addEventListener('beforeprint',preparePrint);window.addEventListener('afterprint',restorePrint);
document.querySelectorAll('[data-print]').forEach(b=>b.addEventListener('click',()=>window.print()));
const navLinks=[...document.querySelectorAll('.header nav a')].sort((a,b)=>$(a.hash).offsetTop-$(b.hash).offsetTop);
const syncNav=()=>{const y=window.scrollY+160;let current='';navLinks.forEach(a=>{if($(a.hash).offsetTop<=y)current=a.hash;});if(window.innerHeight+scrollY>=document.documentElement.scrollHeight-5)current='#contact';navLinks.forEach(a=>{const active=a.hash===current;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});};
let queued=false;window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(()=>{syncNav();queued=false;});}},{passive:true});window.addEventListener('resize',syncNav);syncNav();
})();
