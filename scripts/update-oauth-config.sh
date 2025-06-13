#!/bin/bash

# 确保配置目录存在
mkdir -p config

# 检查配置文件是否存在
if [ ! -f "config/oauth.json" ]; then
    # 创建默认配置文件
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
    echo "已创建默认OAuth配置文件"
else
    echo "OAuth配置文件已存在"
fi

# 提示用户设置OAuth配置
echo "请确保在系统设置中配置正确的OAuth参数："
echo "1. LinuxDO OAuth配置"
echo "   - 回调URL: https://您的域名/oauth/linuxdo"
echo "2. GitHub OAuth配置"
echo "   - 回调URL: https://您的域名/oauth/github"
echo ""
echo "配置文件路径: config/oauth.json"
echo "重启容器后生效" 