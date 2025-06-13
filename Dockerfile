# 使用多阶段构建
# 第一阶段：构建前端
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY web/package*.json ./
RUN npm install
COPY web/ ./
RUN npm run build

# 第二阶段：构建Go应用
FROM golang:1.22-alpine AS backend-builder
WORKDIR /app
# 安装依赖
RUN apk add --no-cache gcc musl-dev
# 复制Go模块定义
COPY go.mod go.sum ./
RUN go mod download
# 复制源代码
COPY . .
# 复制前端构建产物
COPY --from=frontend-builder /app/dist ./web/dist
# 构建Go应用
RUN go build -o veloera .

# 第三阶段：创建最终镜像
FROM alpine:3.18
WORKDIR /app
# 安装基本依赖
RUN apk add --no-cache ca-certificates tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone
# 复制构建产物
COPY --from=backend-builder /app/veloera /app/
# 创建数据目录
RUN mkdir -p /app/data
# 设置环境变量
ENV GIN_MODE=release
# 暴露端口
EXPOSE 3000
# 启动应用
CMD ["/app/veloera"]
