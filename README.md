# GitHub Pages 博客主页模板

这是一个纯静态个人博客主页，可以直接上传到 `wangyan9101.github.io` 仓库，也可以复制进 Hexo 主题里改造成首页。

## 直接用于 GitHub Pages

1. 在 GitHub 新建仓库：`wangyan9101.github.io`。
2. 仓库设为 `Public`，不要勾选初始化 README。
3. 把本文件夹里的 `index.html`、`styles.css`、`assets/` 上传到仓库根目录。
4. 在 GitHub 仓库的 `Settings -> Pages` 中确认发布分支是 `main`，目录是 `/root`。
5. 等待 1 到 3 分钟后访问 `https://wangyan9101.github.io`。

## 替换个人信息

如果要继续定制，在 `index.html` 中改这些内容：

- `wangyan9101`
- 示例文章标题和简介
- 关于我的介绍文字
- 文章链接

## 放进 Hexo 的思路

如果你已经有 Hexo 项目，可以把页面拆成主题模板：

- `index.html` 的正文结构可迁到主题的首页模板。
- `styles.css` 可放进主题的样式目录。
- `assets/hero-blog.png` 可放进主题或 `source/images/`。

最省事的方式是先把 Hexo 正常部署跑通，再逐步把这个首页样式迁进去。
