# 🏮 南京 × 苏州｜10天9晚旅行攻略

> 2026.10.16 — 2026.10.25 · 武汉 → 南京 → 苏州 → 武汉

这是一个**纯静态旅行攻略网站**，无需 Node.js、数据库或服务器，适合直接部署到 GitHub Pages、Gitee Pages、腾讯云静态网站等。

## ✨ 项目内容

- `index.html`：完整交互版旅行攻略，直接打开即可查看
- `南京苏州10天9晚旅行攻略_2026.md`：完整 Markdown 原稿，方便后续编辑
- `docs/`：网页与 Markdown 的镜像副本，可用于 GitHub Pages 的 docs 目录部署方式
- `.github/workflows/pages.yml`：GitHub Pages 自动部署配置
- `.nojekyll`：避免 GitHub Pages 对静态资源进行 Jekyll 处理
- `LICENSE`：MIT License

## 🗺️ 行程核心

- 10/16：武汉 → 南京
- 10/17：中山陵、音乐台、美龄宫、明孝陵、秦淮河
- 10/18：南京博物院、总统府、新街口
- 10/19：老门东、中华门、秦淮河
- 10/20：南京 → 苏州，入住苏州
- 10/21：拙政园、苏州博物馆、狮子林、平江路
- **10/22：全天婚纱照——苏州 HX·合喜映画婚纱摄影**
- 10/23：留园、寒山寺、枫桥、山塘街
- 10/24：周庄一日游
- 10/25：金鸡湖、苏州中心 → 武汉

## 💍 婚纱照门店

**苏州 HX·合喜映画婚纱摄影**

江苏省苏州市姑苏区养育巷415号婚庆创意产业园15幢

地图：
https://map.qq.com/?addr=%E6%B1%9F%E8%8B%8F%E7%9C%81%E8%8B%8F%E5%B7%9E%E5%B8%82%E5%A7%91%E8%8B%8F%E5%8C%BA%E5%85%BB%E8%82%B2%E5%B7%B7415%E5%8F%B7%E5%A9%9A%E5%BA%86%E5%88%9B%E6%84%8F%E4%BA%A7%E4%B8%9A%E5%9B%AD15%E5%B9%A2&isopeninfowin=1&markertype=1&name=%E8%8B%8F%E5%B7%9EHX-%E5%90%88%E5%96%9C%E6%98%A0%E7%94%BB%E5%A9%9A%E7%BA%B1%E6%91%84%E5%BD%B1&pointx=120.614586&pointy=31.309179&ref=WeChat&type=marker

## 🏨 苏州住宿策略

10/20 入住苏州后，优先选择**养育巷—景德路—阊胥路**一带住宿，以减少 10/22 婚纱照当天往返距离。

实际房价、库存和最终可订性以预订平台当日结果为准。

## 💰 预算红线

| 项目 | 目标预算 |
|---|---:|
| 婚纱照 | ¥9,000 |
| 高铁 | 约 ¥800 |
| 南京住宿 | 约 ¥600 |
| 苏州住宿 | 约 ¥750 |
| 餐饮 | 约 ¥750 |
| 市内交通 | 约 ¥250 |
| 景点门票 | 约 ¥250 |
| 旅行摄影 | ¥1,000 |
| 伴手礼 | ¥300，硬上限 ¥500 |
| **总计** | **约 ¥13,700** |

## 📱 本地直接打开

直接双击 `index.html` 即可浏览，无需安装任何依赖。

## 🚀 部署到 GitHub Pages

### 方式 A：GitHub Actions（推荐）

1. 在 GitHub 新建仓库，例如：`nanjing-suzhou-trip-2026`
2. 将本项目所有文件上传到仓库根目录。
3. 默认分支使用 `main`。
4. GitHub → `Settings` → `Pages`。
5. `Build and deployment` 选择 `GitHub Actions`。
6. 推送代码后，`.github/workflows/pages.yml` 会自动部署。
7. 页面地址通常为：

```text
https://你的用户名.github.io/nanjing-suzhou-trip-2026/
```

> GitHub Pages 适合保存源码和提供海外访问；如果主要给国内亲友访问，建议再部署一份国内镜像。

## 🇨🇳 部署到 Gitee Pages

1. 在 Gitee 新建同名或不同名仓库。
2. 上传本项目全部文件。
3. 进入仓库的 Pages / 服务相关设置。
4. 选择静态页面发布，发布目录选择仓库根目录。
5. 首页文件使用 `index.html`。
6. 发布后使用 Gitee 提供的 Pages 地址访问。

Gitee Pages 的具体入口和可选项可能随平台界面变化，以 Gitee 当前页面为准。

## 🔄 GitHub + Gitee 双仓库建议

推荐结构：

```text
GitHub  → 主仓库 / 版本管理 / GitHub Pages
Gitee   → 国内镜像 / 国内访问
```

两个仓库保持相同目录结构即可。

## 🪟 Windows 一键同步到 GitHub

先在 GitHub 创建空仓库，然后在本项目目录执行：

```powershell
git init
git branch -M main
git add .
git commit -m "初始化南京苏州旅行攻略"
git remote add origin https://github.com/你的用户名/nanjing-suzhou-trip-2026.git
git push -u origin main
```

## 🪟 Windows 一键同步到 Gitee

创建 Gitee 仓库后：

```powershell
git remote add gitee https://gitee.com/你的用户名/nanjing-suzhou-trip-2026.git
git push -u gitee main
```

以后更新：

```powershell
git add .
git commit -m "更新旅行攻略"
git push origin main
git push gitee main
```

## ⚠️ 注意

- 本项目中的酒店价格、车票价格、景点开放状态等属于旅行规划信息，实际预订时请重新确认。
- 婚纱照门店地址使用本攻略提供的地址信息。
- 10/22 为婚纱照全天安排，不再叠加其他景点。
- 南京行程明确不安排南京大屠杀遇难同胞纪念馆/相关纪念馆。
