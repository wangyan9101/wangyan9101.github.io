// Regenerate static project markup after editing content.js. No packages required.
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = __dirname;
const context = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(root,'content.js'),'utf8'),context);
const esc = value => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paragraphs = text => text.split('；').map(t=>`<li>${esc(t.replace(/[。；]$/,''))}</li>`).join('');
const html = context.window.resumeProjects.map(p => `<article class="project" data-categories="${esc(p.category.join('|'))}"><div class="project-body"><div class="project-meta"><span>${esc(p.category.join(' · '))}</span><span>${esc(p.era)}</span></div><h3>${esc(p.title)}</h3><p class="project-stack">${esc(p.stack)}</p><dl class="project-core"><dt>技术职责</dt><dd>${esc(p.role)}</dd><dt>重难点问题</dt><dd>${esc(p.challenge)}</dd><dt>处理与实现</dt><dd><ul>${paragraphs(p.implementation)}</ul></dd></dl><details><summary>项目背景与补充说明<span class="sr-only">：${esc(p.title)}</span></summary><dl><dt>项目背景</dt><dd>${esc(p.background)}</dd><dt>成果与待确认项</dt><dd>${esc(p.result)}</dd></dl></details></div></article>`).join('\n');
const filename=path.join(root,'index.html');
const page=fs.readFileSync(filename,'utf8').replace(/(<div class="projects-grid" id="projects-grid">)[\s\S]*?(<\/div><noscript>)/,(_,start,end)=>start+html+end);
fs.writeFileSync(filename,page);
console.log('Generated '+context.window.resumeProjects.length+' static projects.');
