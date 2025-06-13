#!/bin/bash

# 设置颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 打印带颜色的标题
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}    Veloera Docker 镜像构建脚本      ${NC}"
echo -e "${GREEN}======================================${NC}"

# 切换到项目根目录
cd "$(dirname "$0")/.." || exit 1

# 检查go.mod文件中的Go版本
GO_VERSION=$(grep -E "^go [0-9]+\.[0-9]+(\.[0-9]+)?" go.mod | awk '{print $2}')
echo -e "${BLUE}检测到go.mod中的Go版本: ${GO_VERSION}${NC}"

# 检查Dockerfile中的Go版本
DOCKERFILE_GO_VERSION=$(grep -E "FROM golang:" Dockerfile | head -1 | sed -E 's/.*golang:([0-9]+\.[0-9]+).*/\1/')
echo -e "${BLUE}检测到Dockerfile中的Go版本: ${DOCKERFILE_GO_VERSION}${NC}"

# 版本比较警告
if [[ "${GO_VERSION}" != "${DOCKERFILE_GO_VERSION}"* ]]; then
    echo -e "${YELLOW}警告: go.mod中的Go版本(${GO_VERSION})与Dockerfile中的版本(${DOCKERFILE_GO_VERSION})不完全匹配${NC}"
    echo -e "${YELLOW}这可能会导致构建问题，但我们将继续尝试构建${NC}"
fi

# 检查是否提供了版本号
if [ -z "$1" ]; then
    # 如果没有提供版本号，使用当前日期和时间作为版本号
    VERSION=$(date +"%Y%m%d%H%M")
    echo -e "${YELLOW}未提供版本号，使用当前时间作为版本: ${VERSION}${NC}"
else
    VERSION=$1
    echo -e "${GREEN}使用提供的版本号: ${VERSION}${NC}"
fi

# 设置Docker镜像名称
IMAGE_NAME="veloera/veloera"
TAG="${IMAGE_NAME}:${VERSION}"
LATEST="${IMAGE_NAME}:latest"

# 构建Docker镜像
echo -e "${BLUE}开始构建Docker镜像...${NC}"
echo -e "${BLUE}构建命令: docker build -t $TAG -t $LATEST .${NC}"
docker build -t $TAG -t $LATEST . 2>&1 | tee build.log

# 检查构建是否成功
if [ $? -ne 0 ]; then
    echo -e "${RED}Docker镜像构建失败${NC}"
    echo -e "${YELLOW}构建日志已保存到build.log文件${NC}"
    echo -e "${YELLOW}常见错误:${NC}"
    echo -e "${YELLOW}1. Go版本不匹配: 请确保go.mod中的版本与Dockerfile中的版本兼容${NC}"
    echo -e "${YELLOW}2. 依赖问题: 请检查是否所有依赖都能正确下载${NC}"
    echo -e "${YELLOW}3. 编译错误: 请检查代码是否有编译错误${NC}"
    exit 1
fi

echo -e "${GREEN}Docker镜像构建成功: ${TAG}${NC}"

# 询问是否推送到DockerHub
read -p "是否推送镜像到DockerHub? (y/n): " PUSH_CONFIRM

if [ "$PUSH_CONFIRM" = "y" ] || [ "$PUSH_CONFIRM" = "Y" ]; then
    # 检查是否已登录DockerHub
    echo -e "${BLUE}检查DockerHub登录状态...${NC}"
    docker info | grep "Username" > /dev/null
    
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}您尚未登录DockerHub${NC}"
        echo -e "${BLUE}请登录DockerHub...${NC}"
        docker login
        
        if [ $? -ne 0 ]; then
            echo -e "${RED}DockerHub登录失败，无法推送镜像${NC}"
            exit 1
        fi
    fi
    
    # 推送镜像到DockerHub
    echo -e "${BLUE}推送镜像到DockerHub...${NC}"
    docker push $TAG
    docker push $LATEST
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}镜像推送失败${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}镜像已成功推送到DockerHub${NC}"
    echo -e "${GREEN}镜像标签: ${TAG} 和 ${LATEST}${NC}"
else
    echo -e "${BLUE}已取消推送镜像${NC}"
    echo -e "${GREEN}本地镜像已构建: ${TAG} 和 ${LATEST}${NC}"
    echo -e "${BLUE}您可以稍后使用以下命令手动推送:${NC}"
    echo -e "  docker push ${TAG}"
    echo -e "  docker push ${LATEST}"
fi

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}    Docker 镜像构建完成              ${NC}"
echo -e "${GREEN}======================================${NC}" 