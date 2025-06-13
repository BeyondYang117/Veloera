#!/bin/bash

# 设置颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 打印带颜色的标题
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Veloera Docker 多架构镜像构建脚本  ${NC}"
echo -e "${GREEN}======================================${NC}"

# 切换到项目根目录
cd "$(dirname "$0")/.." || exit 1

# 检查参数
if [ $# -lt 2 ]; then
    echo -e "${YELLOW}用法: $0 <镜像名称> <版本号> [架构]${NC}"
    echo -e "${YELLOW}例如: $0 abu116/big-api v0.0.2 amd64${NC}"
    echo -e "${YELLOW}支持的架构: amd64, arm64, 或不指定(构建多架构)${NC}"
    exit 1
fi

IMAGE_NAME=$1
VERSION=$2
ARCH=$3

# 如果未指定架构，默认为多架构构建
if [ -z "$ARCH" ]; then
    ARCH="multi"
fi

# 验证架构参数
if [ "$ARCH" != "amd64" ] && [ "$ARCH" != "arm64" ] && [ "$ARCH" != "multi" ]; then
    echo -e "${RED}不支持的架构: $ARCH${NC}"
    echo -e "${YELLOW}支持的架构: amd64, arm64, 或不指定(构建多架构)${NC}"
    exit 1
fi

# 设置标签
if [ "$ARCH" == "multi" ]; then
    TAG="${IMAGE_NAME}:${VERSION}"
else
    TAG="${IMAGE_NAME}:${VERSION}-${ARCH}"
fi

echo -e "${GREEN}构建镜像: ${TAG}${NC}"

# 构建镜像
if [ "$ARCH" == "amd64" ]; then
    echo -e "${BLUE}开始构建 amd64 架构镜像...${NC}"
    docker build --platform linux/amd64 -t $TAG .
elif [ "$ARCH" == "arm64" ]; then
    echo -e "${BLUE}开始构建 arm64 架构镜像...${NC}"
    docker build --platform linux/arm64 -t $TAG .
else
    echo -e "${BLUE}开始构建多架构镜像...${NC}"
    
    # 检查是否已安装 buildx
    if ! docker buildx version > /dev/null 2>&1; then
        echo -e "${RED}未安装 Docker Buildx，无法构建多架构镜像${NC}"
        echo -e "${YELLOW}请参考 https://docs.docker.com/buildx/working-with-buildx/ 安装 Buildx${NC}"
        exit 1
    fi
    
    # 创建并使用 buildx builder
    docker buildx create --use --name multiarch-builder || true
    
    # 构建并推送多架构镜像
    echo -e "${BLUE}构建并推送多架构镜像 (amd64, arm64)...${NC}"
    docker buildx build --platform linux/amd64,linux/arm64 -t $TAG --push .
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}多架构镜像构建失败${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}多架构镜像已构建并推送: ${TAG}${NC}"
    exit 0
fi

# 检查构建是否成功
if [ $? -ne 0 ]; then
    echo -e "${RED}Docker镜像构建失败${NC}"
    exit 1
fi

echo -e "${GREEN}Docker镜像构建成功: ${TAG}${NC}"

# 询问是否推送到Docker Registry
read -p "是否推送镜像到Docker Registry? (y/n): " PUSH_CONFIRM

if [ "$PUSH_CONFIRM" = "y" ] || [ "$PUSH_CONFIRM" = "Y" ]; then
    # 检查是否已登录Docker Registry
    echo -e "${BLUE}检查Docker Registry登录状态...${NC}"
    docker info | grep "Username" > /dev/null
    
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}您尚未登录Docker Registry${NC}"
        echo -e "${BLUE}请登录Docker Registry...${NC}"
        docker login
        
        if [ $? -ne 0 ]; then
            echo -e "${RED}Docker Registry登录失败，无法推送镜像${NC}"
            exit 1
        fi
    fi
    
    # 推送镜像
    echo -e "${BLUE}推送镜像到Docker Registry...${NC}"
    docker push $TAG
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}镜像推送失败${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}镜像已成功推送到Docker Registry${NC}"
    echo -e "${GREEN}镜像标签: ${TAG}${NC}"
else
    echo -e "${BLUE}已取消推送镜像${NC}"
    echo -e "${GREEN}本地镜像已构建: ${TAG}${NC}"
    echo -e "${BLUE}您可以稍后使用以下命令手动推送:${NC}"
    echo -e "  docker push ${TAG}"
fi

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}    Docker 镜像构建完成              ${NC}"
echo -e "${GREEN}======================================${NC}" 