#!/bin/bash

# 停止现有容器
echo "停止现有容器..."
docker-compose down

# 拉取最新镜像
echo "拉取最新镜像..."
docker-compose pull

# 启动容器
echo "启动容器..."
docker-compose up -d

# 等待服务启动
echo "等待服务启动..."
sleep 5

# 检查服务状态
echo "检查服务状态..."
docker-compose ps

echo "服务已重启，OAuth配置已更新"
echo "请访问您的网站并测试GitHub和LinuxDO登录功能"
echo "如果仍有问题，请检查日志：docker-compose logs -f"

# 确保配置目录存在
mkdir -p config

# 检查OAuth配置文件
if [ ! -f "config/oauth.json" ]; then
  echo "创建默认OAuth配置文件..."
  cat > config/oauth.json << EOF
{
  "LinuxDOOAuthEnabled": true,
  "LinuxDOClientId": "",
  "LinuxDOClientSecret": "",
  "GitHubOAuthEnabled": true,
  "GitHubClientId": "",
  "GitHubClientSecret": ""
}
EOF
fi

# 提示用户填写LinuxDO OAuth配置
read -p "是否要配置LinuxDO OAuth? (y/n): " configure_linuxdo
if [ "$configure_linuxdo" = "y" ]; then
  read -p "请输入LinuxDO Client ID: " linuxdo_client_id
  read -p "请输入LinuxDO Client Secret: " linuxdo_client_secret
  
  # 更新配置文件
  sed -i "s/\"LinuxDOClientId\": \"\"/\"LinuxDOClientId\": \"$linuxdo_client_id\"/" config/oauth.json
  sed -i "s/\"LinuxDOClientSecret\": \"\"/\"LinuxDOClientSecret\": \"$linuxdo_client_secret\"/" config/oauth.json
  
  echo "LinuxDO OAuth配置已更新"
fi

# 提示用户填写GitHub OAuth配置
read -p "是否要配置GitHub OAuth? (y/n): " configure_github
if [ "$configure_github" = "y" ]; then
  read -p "请输入GitHub Client ID: " github_client_id
  read -p "请输入GitHub Client Secret: " github_client_secret
  
  # 更新配置文件
  sed -i "s/\"GitHubClientId\": \"\"/\"GitHubClientId\": \"$github_client_id\"/" config/oauth.json
  sed -i "s/\"GitHubClientSecret\": \"\"/\"GitHubClientSecret\": \"$github_client_secret\"/" config/oauth.json
  
  echo "GitHub OAuth配置已更新"
fi

# 启动容器
echo "启动应用..."
docker-compose up -d

echo "应用已启动，请确保您的反向代理配置正确"
echo "如果使用Nginx，请将nginx.conf文件复制到适当的位置并重启Nginx"

# 显示应用状态
echo "容器状态："
docker-compose ps 