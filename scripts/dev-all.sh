#!/bin/bash

# 设置颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的标题
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}    Veloera 全栈开发环境启动脚本      ${NC}"
echo -e "${GREEN}======================================${NC}"

# 切换到项目根目录
cd "$(dirname "$0")/.." || exit 1

# 检查 tmux 是否安装
if command -v tmux &> /dev/null; then
    # 使用 tmux 启动服务
    echo -e "${BLUE}使用 tmux 启动服务...${NC}"
    
    # 创建新的 tmux 会话
    SESSION_NAME="veloera-dev"
    
    # 如果会话已存在，先关闭它
    tmux kill-session -t "$SESSION_NAME" 2>/dev/null
    
    # 创建新会话
    tmux new-session -d -s "$SESSION_NAME"
    
    # 分割窗口
    tmux split-window -h -t "$SESSION_NAME"
    
    # 在左侧窗口启动后端服务
    tmux send-keys -t "${SESSION_NAME}.0" "cd $(pwd) && ./scripts/dev.sh" C-m
    
    # 等待几秒钟，让后端服务启动
    echo -e "${BLUE}正在启动后端服务...${NC}"
    sleep 3
    
    # 在右侧窗口启动前端服务
    tmux send-keys -t "${SESSION_NAME}.1" "cd $(pwd) && ./scripts/dev-frontend.sh" C-m
    
    # 显示提示信息
    echo -e "${GREEN}开发环境已启动:${NC}"
    echo -e "  - 后端服务: ${GREEN}http://localhost:3000${NC}"
    echo -e "  - 前端服务: ${GREEN}http://localhost:5173${NC} (推荐访问)"
    echo -e "${YELLOW}提示: 使用 'tmux attach -t ${SESSION_NAME}' 查看服务日志${NC}"
    echo -e "${YELLOW}提示: 使用 'Ctrl+B 然后 D' 分离 tmux 会话${NC}"
    echo -e "${YELLOW}提示: 使用 'tmux kill-session -t ${SESSION_NAME}' 停止所有服务${NC}"
    echo -e "${GREEN}======================================${NC}"
    
    # 附加到 tmux 会话
    tmux attach -t "$SESSION_NAME"
else
    # 不使用 tmux，直接启动服务
    echo -e "${YELLOW}未找到 tmux 命令，将使用后台进程启动服务${NC}"
    
    # 启动后端服务
    echo -e "${BLUE}正在启动后端服务...${NC}"
    ./scripts/dev.sh > /tmp/veloera-backend.log 2>&1 &
    BACKEND_PID=$!
    echo -e "后端服务已启动 (PID: $BACKEND_PID，日志: /tmp/veloera-backend.log)"
    
    # 等待几秒钟，让后端服务启动
    sleep 3
    
    # 启动前端服务
    echo -e "${BLUE}正在启动前端服务...${NC}"
    ./scripts/dev-frontend.sh > /tmp/veloera-frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo -e "前端服务已启动 (PID: $FRONTEND_PID，日志: /tmp/veloera-frontend.log)"
    
    # 显示提示信息
    echo -e "${GREEN}开发环境已启动:${NC}"
    echo -e "  - 后端服务: ${GREEN}http://localhost:3000${NC}"
    echo -e "  - 前端服务: ${GREEN}http://localhost:5173${NC} (推荐访问)"
    echo -e "${YELLOW}提示: 查看后端日志: tail -f /tmp/veloera-backend.log${NC}"
    echo -e "${YELLOW}提示: 查看前端日志: tail -f /tmp/veloera-frontend.log${NC}"
    echo -e "${YELLOW}提示: 停止服务: kill $BACKEND_PID $FRONTEND_PID${NC}"
    echo -e "${GREEN}======================================${NC}"
    
    # 保存PID到文件，方便后续停止服务
    echo "$BACKEND_PID $FRONTEND_PID" > /tmp/veloera-dev.pid
    echo -e "${YELLOW}服务PID已保存到 /tmp/veloera-dev.pid${NC}"
    
    # 等待用户按Ctrl+C
    echo -e "${YELLOW}按 Ctrl+C 停止所有服务${NC}"
    trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo '已停止所有服务'; rm -f /tmp/veloera-dev.pid" EXIT
    tail -f /tmp/veloera-backend.log /tmp/veloera-frontend.log
fi 