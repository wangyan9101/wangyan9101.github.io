# 王彦 · 技术主页

纯静态 GitHub Pages 网站，无后端、无需安装依赖。

- `/`：个人信息、关键技能、工作经历、项目职责与重难点、教育及联系方式。
- `/resume-v2/`：完整项目详情与分类筛选。
- `/resume-v2/print.html`：正式三页 A4 打印版。
- `/resume-v2/wangyan-resume.pdf`：已生成的三页 PDF。
- `/legacy/`：保留的第一版博客模板首页。

## 本地预览

在仓库根目录运行 `python -m http.server 4173 --bind 127.0.0.1`，访问 `http://127.0.0.1:4173/`。

## 更新与推送

```powershell
cd D:\Working\blog-homepage
git status
git add index.html styles.css main.js README.md resume-v2 legacy assets/SB.jpg
git diff --cached --stat
git commit -m "Update technical homepage and resume"
git push origin main
```

当前远程：`git@github.com:wangyan9101/wangyan9101.github.io.git`。

沿用 GitHub Pages 的 main 分支根目录发布配置，部署完成后首页为 `https://wangyan9101.github.io/`。如果推送被提示远程有更新，先 `git pull --rebase origin main`，处理冲突后再推送，不使用强制推送。

## 内容维护

首页内容直接编辑根目录 `index.html`，样式编辑 `styles.css`。
V2 项目内容编辑 `resume-v2/content.js` 后运行 `node resume-v2/build.cjs`。
正式版编辑 `resume-v2/print.html` / `print.css`，再重新导出 `wangyan-resume.pdf`；HTML 更新不会自动更新 PDF。

正式内容已移除旧界面框架名称，保留真实导航编辑器开发经历；没有编造算法归属或未经核实的性能数字。

## 主页交互样式

导航及操作入口采用胶囊圆角；滚动后导航栏使用半透明磨砂背景。`main.js` 更新滚动状态、当前章节和导航高度，CSS 提供轻量悬停与按压反馈，并尊重系统减少动态效果设置。未启用 JavaScript 时内容和锚点仍可使用。
