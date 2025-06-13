#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 显示标题
echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}    Veloera Docker 部署辅助脚本      ${NC}"
echo -e "${BLUE}======================================${NC}"

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo -e "${RED}错误: Docker 未安装，请先安装 Docker${NC}"
    exit 1
fi

# 检查Docker Compose是否安装
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}错误: Docker Compose 未安装，请先安装 Docker Compose${NC}"
    exit 1
fi

# 创建.env文件
create_env_file() {
    if [ -f .env ]; then
        echo -e "${YELLOW}发现已存在的 .env 文件。是否覆盖? [y/N]${NC}"
        read -r response
        if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            echo -e "${GREEN}保留现有 .env 文件${NC}"
            return
        fi
    fi

    echo -e "${BLUE}配置数据库连接...${NC}"
    echo -e "${YELLOW}请输入MySQL主机地址 (默认: localhost):${NC}"
    read -r db_host
    db_host=${db_host:-localhost}

    echo -e "${YELLOW}请输入MySQL端口 (默认: 3306):${NC}"
    read -r db_port
    db_port=${db_port:-3306}

    echo -e "${YELLOW}请输入MySQL用户名:${NC}"
    read -r db_user

    echo -e "${YELLOW}请输入MySQL密码:${NC}"
    read -r db_password

    echo -e "${YELLOW}请输入MySQL数据库名 (默认: veloera):${NC}"
    read -r db_name
    db_name=${db_name:-veloera}

    # 生成随机会话密钥
    session_secret=$(openssl rand -hex 16)
    crypto_secret=$(openssl rand -hex 16)

    # 创建.env文件
    cat > .env << EOF
# 数据库配置 - 远程MySQL
SQL_DSN=mysql://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}?charset=utf8mb4&parseTime=True&loc=Local

# 会话密钥
SESSION_SECRET=${session_secret}

# 加密密钥
CRYPTO_SECRET=${crypto_secret}

# 数据库连接池配置
SQL_MAX_IDLE_CONNS=10
SQL_MAX_OPEN_CONNS=100
SQL_MAX_LIFETIME=60

# 同步频率（秒）
SYNC_FREQUENCY=60

# 其他配置
GIN_MODE=release
EOF

    echo -e "${GREEN}.env 文件已创建${NC}"
}

# 启动Docker容器
start_containers() {
    echo -e "${BLUE}启动Docker容器...${NC}"
    docker-compose pull
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Veloera 已成功启动!${NC}"
        echo -e "${GREEN}访问地址: http://localhost:3000${NC}"
    else
        echo -e "${RED}启动失败，请检查日志${NC}"
    fi
}

# 停止Docker容器
stop_containers() {
    echo -e "${BLUE}停止Docker容器...${NC}"
    docker-compose down
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Veloera 已停止${NC}"
    else
        echo -e "${RED}停止失败，请检查日志${NC}"
    fi
}

# 显示容器状态
show_status() {
    echo -e "${BLUE}容器状态:${NC}"
    docker-compose ps
    
    echo -e "\n${BLUE}Veloera 日志 (最近10行):${NC}"
    docker-compose logs --tail=10 veloera
}

# 主菜单
show_menu() {
    echo -e "\n${BLUE}请选择操作:${NC}"
    echo -e "${YELLOW}1. 创建/更新 .env 配置文件${NC}"
    echo -e "${YELLOW}2. 启动 Veloera${NC}"
    echo -e "${YELLOW}3. 停止 Veloera${NC}"
    echo -e "${YELLOW}4. 查看状态和日志${NC}"
    echo -e "${YELLOW}5. 退出${NC}"
    
    read -r choice
    
    case $choice in
        1) create_env_file ;;
        2) start_containers ;;
        3) stop_containers ;;
        4) show_status ;;
        5) exit 0 ;;
        *) echo -e "${RED}无效选择${NC}" ;;
    esac
    
    show_menu
}

# 开始执行
show_menu 