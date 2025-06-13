#!/bin/bash

# 设置颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的标题
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}      Veloera 缓存清理工具           ${NC}"
echo -e "${GREEN}======================================${NC}"

# 切换到项目根目录
cd "$(dirname "$0")/.." || exit 1

# 清理后端临时文件
echo -e "${BLUE}[1/5] 清理后端临时文件...${NC}"
if [ -d "tmp" ]; then
    rm -rf tmp
    echo "  - 已删除 tmp 目录"
fi

# 清理 Go 构建缓存
echo -e "${BLUE}[2/5] 清理 Go 构建缓存...${NC}"
go clean -cache -modcache
echo "  - 已清理 Go 构建缓存"

# 检查前端目录是否存在
if [ ! -d "web" ]; then
    echo -e "${YELLOW}错误: 未找到前端目录 (web)${NC}"
    exit 1
fi

# 清理前端构建缓存
echo -e "${BLUE}[3/5] 清理前端构建缓存...${NC}"
cd web || exit 1

if [ -d "dist" ]; then
    rm -rf dist
    echo "  - 已删除 dist 目录"
fi

if [ -d ".vite" ]; then
    rm -rf .vite
    echo "  - 已删除 .vite 目录"
fi

if [ -d "node_modules/.vite" ]; then
    rm -rf node_modules/.vite
    echo "  - 已删除 node_modules/.vite 目录"
fi

# 重新构建前端
echo -e "${BLUE}[4/5] 重新构建前端...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}警告: 前端构建失败，请手动运行: cd web && npm run build${NC}"
else
    echo "  - 前端构建成功"
fi

# 返回项目根目录
cd ..

# 重新编译后端
echo -e "${BLUE}[5/5] 重新编译后端...${NC}"
go build -o ./tmp/main .
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}警告: 后端编译失败，请手动运行: go build -o ./tmp/main .${NC}"
else
    echo "  - 后端编译成功"
fi

# 完成
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}缓存清理完成!${NC}"
echo -e "您可以使用以下命令启动开发环境:"
echo -e "  - 全栈开发: ${YELLOW}./scripts/dev-all.sh${NC}"
echo -e "  - 仅后端: ${YELLOW}./scripts/dev.sh${NC}"
echo -e "  - 仅前端: ${YELLOW}./scripts/dev-frontend.sh${NC}"
echo -e "${GREEN}======================================${NC}" 