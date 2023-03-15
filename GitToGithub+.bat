@echo off

echo 正在添加全部文件...
git add .

echo 正在提交...
git commit -m "latest"

echo 正在推送...
git push origin main

pause