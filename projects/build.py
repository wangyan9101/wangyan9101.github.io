"""Build the complete project page from the supplied Markdown. No dependencies."""
from pathlib import Path
import re
from html import escape
from hashlib import sha256
root=Path(__file__).resolve().parent
local_source = root.parent / 'Requirements/SourceData/工作经历与项目材料.md'
public_source = root / 'materials.md'
source = local_source if local_source.is_file() else public_source
text = source.read_text(encoding='utf-8-sig')
text = re.sub(r'^##### POI Agent 实现材料[^\n]*\n.*?(?=^\*\*项目价值：\*\*|^#### |\Z)', '', text, flags=re.M | re.S)
ids=['unity-editor','poi','cad-bim','web-design','ue4','speedtree','particles','tcg','navigation']
projects=[]
for match in re.finditer(r'^#### 项目[^：]+：(.+)\n([\s\S]*?)(?=^#### |^### |^## |\Z)',text,re.M):
 title,body=match.groups()
 # A section boundary can leave the following employer's date out of the project.
 projects.append((title.strip(),body.strip()))
assert len(projects)==9
if source == local_source:
 # Publish only content rendered on the project page.
 project_text = '\n\n'.join(
  f'#### 项目{number}：{title}\n\n{body}'
  for number, (title, body) in enumerate(projects, start=1)
 )
 project_text = re.sub(r'MFC[、/]?\s*', '', project_text)
 public_source.write_text('\n'.join(line.rstrip() for line in project_text.splitlines()) + '\n', encoding='utf-8')
# Keep stable anchors while ordering the timeline by project start date.
ordered=sorted(zip(ids,projects), key=lambda entry: re.search(r'\*\*项目时间：\*\* (\d{4}\.\d{2})',entry[1][1]).group(1), reverse=True)
ids,projects=map(list,zip(*ordered))

def inline(s):
 s=re.sub(r'MFC[、/]?\s*','',s)
 return re.sub(r'\*\*(.*?)\*\*',r'<strong>\1</strong>',escape(s))
def render(body):
 out=[];listing=False
 for line in body.splitlines():
  line=line.strip()
  if not line:continue
  match=re.match(r'^\d+\. (.+)',line)
  if match:
   if not listing:out.append('<ol>');listing=True
   out.append('<li>'+inline(match[1])+'</li>')
  else:
   if listing:out.append('</ol>');listing=False
   # Project headings and all factual source paragraphs remain visible.
   out.append('<p>'+inline(line)+'</p>')
 if listing:out.append('</ol>')
 return ''.join(out)

def phase(i):
 date=re.search(r'\*\*项目时间：\*\* (.+)',projects[i][1]).group(1)
 tech={'unity-editor':'Unity / C#','poi':'Unity / 数字孪生','cad-bim':'CAD / Revit / Unity','web-design':'TypeScript / Three.js','ue4':'UE4 / Slate / UMG','speedtree':'C++ / DirectX / HLSL','particles':'C++ / 粒子系统 / GLSL ES','tcg':'C++ / 场景编辑器','navigation':'C++ / 导航编辑器'}[ids[i]]
 return escape(date)+' · '+tech

categories={'unity-editor':['Editor'],'poi':['Digital Twin','Editor'],'cad-bim':['Geometry','Digital Twin','Editor'],'web-design':['Geometry','Editor'],'ue4':['Geometry'],'speedtree':['Graphics'],'particles':['Graphics'],'tcg':['Editor'],'navigation':['Editor']}
filters='<div class="project-filters" role="group" aria-label="项目分类筛选">'+''.join('<button type="button" data-filter="'+value+'" aria-pressed="'+('true' if value=='all' else 'false')+'">'+label+'</button>' for value,label in [('all','全部项目'),('Graphics','Graphics'),('Editor','Editor'),('Geometry','Geometry'),('Digital Twin','Digital Twin')])+'</div><p class="filter-status" role="status" aria-live="polite">显示全部 9 个项目</p>'
toc=''.join('<a class="project-nav-item'+(' is-active' if i==0 else '')+'" data-categories="'+'|'.join(categories[ident])+'" href="#'+ident+'"'+(' aria-current="location"' if i==0 else '')+'><span class="nav-title">'+escape(title)+'</span><span class="nav-meta" aria-hidden="'+('false' if i==0 else 'true')+'"><span>'+phase(i)+'</span></span></a>' for i,(ident,(title,_)) in enumerate(zip(ids,projects)))
def render_project(body):
 department = re.search(r'^\*\*项目部门：\*\* (.+)$', body, re.M)
 if department:
  body = body.replace(department[0], '', 1)
  return '<p class="project-department">北京像素软件科技股份有限公司 · '+escape(department[1])+'</p>'+render(body)
 return render(body)

cards=''.join('<article class="project-detail" data-categories="'+'|'.join(categories[ident])+'" id="'+ident+'"><p class="project-phase">'+phase(i)+'</p><h2>'+escape(title)+'</h2>'+render_project(body)+'</article>' for i,(ident,(title,body)) in enumerate(zip(ids,projects)))
page='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>完整项目详情 | 王彦</title><meta name="description" content="王彦的九个研发项目详情：Unity 编辑器、POI、CAD/Revit、Web3D 云设计、UE4 样板间、SpeedTree、导航编辑器、TCG 编辑器和粒子系统。"><link rel="icon" href="./mark.svg" type="image/svg+xml"><link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="./styles.css"><script src="../main.js" defer></script><script src="./main.js" defer></script><link rel="stylesheet" href="../back-to-top.css"><script defer src="../back-to-top.js"></script></head><body><a class="skip" href="#main">跳至正文</a><div class="site-header"><a class="brand" href="../">王彦</a><details class="page-switcher"><summary>项目详情页<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m5 8 5 5 5-5"/></svg></summary><div class="page-switcher-menu"><a href="../">技术主页</a><a href="./" aria-current="page">项目详情页</a></div></details><button class="theme-toggle" type="button" aria-label="切换至深色主题" aria-pressed="false" title="切换至深色主题"><svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M20.5 13.2A8.7 8.7 0 0 1 10.8 3.5a8.7 8.7 0 1 0 9.7 9.7Z"/></svg><svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg></button></div><main id="main" class="projects-page"><h1 class="page-title-visually-hidden">项目详情页</h1><div class="projects-layout"><aside class="project-sidebar" id="project-index"><button class="project-menu-toggle" type="button" aria-expanded="true" aria-controls="project-time-nav">项目导航<span aria-hidden="true">⌄</span></button>'''+filters+'''<p class="sidebar-label">项目经历 · 由近至远</p><nav class="project-index" id="project-time-nav" aria-label="项目时间导航">'''+toc+'''</nav></aside><div class="project-content">'''+cards+'''</div></div></main><footer class="site-footer"><span>王彦 · 完整项目详情</span><a class="button" href="../#projects">返回技术主页</a></footer></body></html>'''
for asset, target in [('back-to-top.css','../back-to-top.css'),('back-to-top.js','../back-to-top.js'),('styles.css','../styles.css'),('main.js','../main.js'),('projects/styles.css','./styles.css'),('projects/main.js','./main.js')]:
 version=sha256((root.parent/asset).read_bytes()).hexdigest()[:12]
 page=page.replace('"'+target+'"','"'+target+'?v='+version+'"')
(root/'index.html').write_text(page,encoding='utf-8')
print('Built all 9 complete projects from source Markdown.')
