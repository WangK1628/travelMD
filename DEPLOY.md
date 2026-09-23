# 部署说明

## 推荐架构

```text
                    ┌──────────────┐
                    │   本地项目    │
                    └──────┬───────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
        ┌───────────┐             ┌───────────┐
        │  GitHub   │             │   Gitee   │
        │ 主仓库/版本 │             │ 国内镜像   │
        └─────┬─────┘             └─────┬─────┘
              │                         │
              ▼                         ▼
        GitHub Pages              Gitee Pages
```

## GitHub

本项目已经包含 `.github/workflows/pages.yml`。

在 GitHub 仓库中：

`Settings → Pages → Build and deployment → Source → GitHub Actions`

然后推送 `main` 分支即可触发部署。

## Gitee

将相同文件推送到 Gitee 仓库后，在 Gitee 当前版本的 Pages/服务入口启用静态页面发布，入口文件选择 `index.html`。

## 两边同步

```powershell
git add .
git commit -m "更新旅行攻略"
git push origin main
git push gitee main
```

或者修改 `sync-to-gitee.ps1` 中的两个仓库地址后运行：

```text
sync-to-gitee.bat
```

## 国内访问

如果你的主要用户在中国大陆，不建议把 GitHub Pages 作为唯一入口。可以同时保留 Gitee Pages；后续如果需要更稳定的正式域名，可再迁移到国内云厂商静态网站托管。
