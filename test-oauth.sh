#!/bin/bash

echo "开始测试OAuth配置..."

# 检查配置文件
echo "检查OAuth配置文件..."
if [ -f "config/oauth.json" ]; then
    echo "找到OAuth配置文件"
    cat config/oauth.json
else
    echo "错误：未找到OAuth配置文件"
    exit 1
fi

# 检查Docker容器状态
echo -e "\n检查Docker容器状态..."
docker-compose ps

# 检查端口映射
echo -e "\n检查端口映射..."
docker-compose port big-api 3000

# 检查网络连接
echo -e "\n测试网络连接..."
curl -I http://localhost:3004

# 测试OAuth端点
echo -e "\n测试OAuth端点..."
curl -I http://localhost:3004/oauth/github
curl -I http://localhost:3004/oauth/linuxdo

echo -e "\nOAuth配置测试完成"
echo "请确认以上输出中没有错误信息"
echo "如果测试成功，您可以尝试在浏览器中访问您的应用并测试OAuth登录" 