@echo off

echo 正在创建分支...
git checkout --orphan lb

echo 正在添加全部文件...
git add .

echo 正在提交...
git commit -am "latest"

echo 正在删除原分支...
git branch -D main

echo 正在重命名现分支...
git branch -M main

echo 正在推送...
git push -f origin main

pause