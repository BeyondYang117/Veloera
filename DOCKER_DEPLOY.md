# Veloera Docker 部署指南

本文档介绍如何使用 Docker 构建和部署 Veloera。

## 构建 Docker 镜像

### 使用构建脚本

项目提供了一个便捷的脚本来构建和推送 Docker 镜像：

```bash
# 使用默认版本号（当前时间戳）
./scripts/build-docker.sh

# 指定版本号
./scripts/build-docker.sh v1.0.0
```

脚本会自动构建镜像，并询问是否推送到 DockerHub。

### 手动构建

如果您想手动构建镜像，可以使用以下命令：

```bash
# 构建镜像
docker build -t veloera/veloera:latest .

# 推送镜像到 DockerHub（需要先登录）
docker push veloera/veloera:latest
```

## 部署 Veloera

### 使用部署辅助脚本（推荐）

项目提供了一个交互式部署脚本，可以帮助您快速配置和部署 Veloera：

```bash
# 运行部署辅助脚本
./scripts/deploy-docker.sh
```

脚本将引导您完成以下步骤：
1. 创建 `.env` 配置文件，设置数据库连接等参数
2. 启动 Docker 容器
3. 查看服务状态和日志

### 使用 Docker Compose 手动部署

1. 确保您已安装 Docker 和 Docker Compose。

2. 使用项目提供的 `docker-compose.yml` 文件：

```bash
docker-compose up -d
```

这将启动 Veloera 服务和 Redis 服务，并映射 3000 端口到主机。

### 配置远程 MySQL 数据库

Veloera 使用远程 MySQL 数据库进行数据存储。在部署前，您需要配置数据库连接信息：

1. 创建一个 `.env` 文件在与 `docker-compose.yml` 同级的目录中：

```bash
# 数据库连接字符串
SQL_DSN=mysql://username:password@mysql_host:3306/veloera?charset=utf8mb4&parseTime=True&loc=Local

# 会话密钥（请修改为随机字符串）
SESSION_SECRET=your_secure_random_string
```

2. 确保您的 MySQL 数据库已创建并可以从 Docker 容器访问。

### 自定义配置

您可以通过修改 `docker-compose.yml` 文件来自定义部署配置：

- 端口映射：修改 `ports` 部分
- 数据存储：修改 `volumes` 部分
- 环境变量：修改 `environment` 部分或在 `.env` 文件中设置

### 数据持久化

Veloera 使用以下目录和卷进行数据持久化：

- `/app/data`：应用数据存储目录，映射到主机的 `./data` 目录
- `redis-data`：Redis 数据持久化卷

## 更新 Veloera

要更新到最新版本的 Veloera，请执行以下步骤：

```bash
# 拉取最新镜像
docker pull veloera/veloera:latest

# 重启服务
docker-compose down
docker-compose up -d
```

## 查看日志

```bash
# 查看 Veloera 容器日志
docker logs veloera

# 实时查看日志
docker logs -f veloera

# 查看 Redis 容器日志
docker logs veloera-redis
```

## 故障排除

1. 如果容器无法启动，请检查日志：

```bash
docker logs veloera
```

2. 如果无法访问服务，请确认端口映射是否正确：

```bash
docker ps
```

3. 如果需要进入容器进行调试：

```bash
docker exec -it veloera sh
```

4. 数据库连接问题：

   - 确认 MySQL 连接字符串格式正确
   - 检查 MySQL 服务器是否允许远程连接
   - 验证数据库用户权限是否正确

5. Redis 连接问题：

   - 检查 Redis 服务是否正常运行：`docker ps | grep redis`
   - 检查 Redis 日志：`docker logs veloera-redis` 