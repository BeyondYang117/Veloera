#!/bin/bash

# 设置颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 打印带颜色的标题
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}    Veloera 开发环境停止脚本          ${NC}"
echo -e "${GREEN}======================================${NC}"

# 尝试停止tmux会话
if command -v tmux &> /dev/null; then
    if tmux has-session -t veloera-dev 2>/dev/null; then
        echo -e "${YELLOW}正在停止 tmux 会话...${NC}"
        tmux kill-session -t veloera-dev
        echo -e "${GREEN}tmux 会话已停止${NC}"
    fi
fi

# 尝试停止后台进程
if [ -f "/tmp/veloera-dev.pid" ]; then
    echo -e "${YELLOW}正在停止后台进程...${NC}"
    PIDS=$(cat /tmp/veloera-dev.pid)
    kill $PIDS 2>/dev/null
    rm -f /tmp/veloera-dev.pid
    echo -e "${GREEN}后台进程已停止${NC}"
fi

# 查找可能的遗留进程
echo -e "${YELLOW}检查遗留进程...${NC}"

# 查找可能的后端进程
BACKEND_PIDS=$(ps aux | grep "./tmp/main" | grep -v grep | awk '{print $2}')
if [ ! -z "$BACKEND_PIDS" ]; then
    echo -e "${RED}发现遗留的后端进程: $BACKEND_PIDS${NC}"
    echo -e "${YELLOW}正在停止...${NC}"
    kill $BACKEND_PIDS 2>/dev/null
    echo -e "${GREEN}后端进程已停止${NC}"
fi

# 查找可能的前端进程
FRONTEND_PIDS=$(ps aux | grep "vite" | grep -v grep | awk '{print $2}')
if [ ! -z "$FRONTEND_PIDS" ]; then
    echo -e "${RED}发现遗留的前端进程: $FRONTEND_PIDS${NC}"
    echo -e "${YELLOW}正在停止...${NC}"
    kill $FRONTEND_PIDS 2>/dev/null
    echo -e "${GREEN}前端进程已停止${NC}"
fi

# 清理临时文件
echo -e "${YELLOW}清理临时日志文件...${NC}"
rm -f /tmp/veloera-backend.log /tmp/veloera-frontend.log

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}开发环境已完全停止!${NC}"
echo -e "${GREEN}======================================${NC}" 