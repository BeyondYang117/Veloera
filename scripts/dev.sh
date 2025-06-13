#!/bin/bash

# 设置颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印带颜色的标题
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}    Veloera 后端开发服务器启动脚本    ${NC}"
echo -e "${GREEN}======================================${NC}"

# 检查 air 是否安装
if ! command -v air &> /dev/null; then
    echo -e "${YELLOW}警告: 未找到 air 命令${NC}"
    echo "正在安装 air..."
    go install github.com/cosmtrek/air@latest
    if [ $? -ne 0 ]; then
        echo "安装 air 失败，请手动安装: go install github.com/cosmtrek/air@latest"
        exit 1
    fi
    echo "air 安装成功"
fi

# 切换到项目根目录
cd "$(dirname "$0")/.." || exit 1

# 检查 .air.toml 是否存在
if [ ! -f ".air.toml" ]; then
    echo "创建 .air.toml 配置文件..."
    cat > .air.toml << 'EOF'
root = "."
tmp_dir = "tmp"

[build]
cmd = "go build -o ./tmp/main ."
bin = "./tmp/main"
include_ext = ["go", "html", "css", "js", "sql", "json", "yaml", "yml"]
exclude_dir = ["assets", "tmp", "vendor", "web/node_modules", "web/dist"]
delay = 1000

[misc]
clean_on_exit = true

[screen]
clear_on_rebuild = true
EOF
fi

# 设置开发模式环境变量
export DEV_MODE=true

echo -e "${GREEN}启动后端开发服务器 (开发模式)...${NC}"
echo -e "服务将运行在: ${GREEN}http://localhost:3000${NC}"
echo -e "${YELLOW}提示: 前端修改将从文件系统加载，无需重新编译后端${NC}"
echo -e "${GREEN}======================================${NC}"

# 启动 air
air -c .air.toml 