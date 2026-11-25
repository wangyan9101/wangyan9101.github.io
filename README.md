# 王彦 · 技术主页

纯静态 GitHub Pages 网站，无后端，无第三方构建依赖。

- `/`：正式技术主页与代表项目摘要。
- `/projects/`：全部 9 个项目的完整介绍，包含研发背景、技术栈、主要工作、价值与状态说明。不是第二份简历。
- `/resume/print.html`：正式三页 A4 打印页。
- `/resume/wangyan-resume.pdf`：正式三页 PDF。
- `/legacy/`：保留旧版视觉风格的技术主页。

原 `/resume-v2/` 已拆分并迁移到 `/projects/` 与 `/resume/`，站内入口已更新。

## 项目内容维护

原始项目材料保存在本地的 `Requirements/SourceData/工作经历与项目材料.md`。修改后运行：

```powershell
python projects/build.py
```

脚本生成 `projects/index.html` 和公开项目材料 `projects/materials.md`。从 Git 克隆的副本可使用公开材料重新生成项目页。

主页摘要、正式打印版仍为独立内容，必要时同步修改。PDF 不会随 HTML 自动更新。

## 预览与发布

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

访问 `http://127.0.0.1:4173/` 或 `/projects/`。

审核后自行提交和推送；目录迁移需要暂存删除的旧路径：

```powershell
git add -A -- .
git diff --cached --stat
git commit -m "Separate project details from printable resume"
git push origin main
```

沿用 main 分支根目录的 GitHub Pages 发布设置。未经明确要求，代理不会执行提交或推送。
