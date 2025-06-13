#!/bin/bash

# 执行OAuth配置初始化脚本
./scripts/update-oauth-config.sh

# 启动容器
docker-compose up -d

echo "服务已启动，请访问 http://localhost:3004"
echo "如需配置OAuth登录，请在系统设置中进行配置" 