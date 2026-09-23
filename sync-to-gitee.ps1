# 南京苏州旅行攻略：GitHub + Gitee 双仓库同步
# 第一次使用前，把下面两个变量改成自己的仓库地址。

$GitHubRepo = "https://github.com/你的用户名/nanjing-suzhou-trip-2026.git"
$GiteeRepo  = "https://gitee.com/你的用户名/nanjing-suzhou-trip-2026.git"

if (-not (Test-Path ".git")) {
    git init
    git branch -M main
}

$origin = git remote get-url origin 2>$null
if (-not $origin) {
    git remote add origin $GitHubRepo
}

$gitee = git remote get-url gitee 2>$null
if (-not $gitee) {
    git remote add gitee $GiteeRepo
}

git add .
git commit -m "更新南京苏州旅行攻略" 2>$null

git push -u origin main
git push -u gitee main

Write-Host ""
Write-Host "GitHub 和 Gitee 已尝试同步。" -ForegroundColor Green
