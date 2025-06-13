#!/bin/bash

# 设置颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印带颜色的标题
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}    Veloera 前端开发服务器启动脚本    ${NC}"
echo -e "${GREEN}======================================${NC}"

# 切换到项目根目录
cd "$(dirname "$0")/.." || exit 1

# 检查前端目录是否存在
if [ ! -d "web" ]; then
    echo -e "${YELLOW}错误: 未找到前端目录 (web)${NC}"
    exit 1
fi

# 进入前端目录
cd web || exit 1

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}警告: 未找到 node_modules，正在安装依赖...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo "安装依赖失败，请手动运行: cd web && npm install"
        exit 1
    fi
    echo "依赖安装成功"
fi

# 打印启动信息
echo -e "${GREEN}启动前端开发服务器...${NC}"
echo -e "服务将运行在: ${GREEN}http://localhost:5173${NC}"
echo -e "${YELLOW}提示: API 请求将自动代理到后端服务${NC}"
echo -e "${GREEN}======================================${NC}"

# 启动 Vite 开发服务器
npm run dev 