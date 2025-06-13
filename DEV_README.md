# Veloera 开发环境指南

本文档介绍如何使用新的开发环境设置，以实现前端修改实时生效，无需重新编译后端。

## 开发脚本说明

项目提供了以下几个开发脚本（位于 `scripts` 目录）：

1. **`scripts/dev.sh`** - 启动后端开发服务器（开发模式）
   - 自动重新编译后端代码
   - 设置开发模式标志，从文件系统读取前端文件
   - 后端服务运行在 http://localhost:3000

2. **`scripts/dev-frontend.sh`** - 启动前端开发服务器
   - 使用 Vite 的热重载功能
   - 前端服务运行在 http://localhost:5173
   - 自动将 API 请求代理到后端服务

3. **`scripts/dev-all.sh`** - 同时启动前端和后端开发服务器
   - 推荐用于日常开发
   - 如果安装了tmux，将使用tmux同时管理前后端服务
   - 如果没有安装tmux，将使用后台进程模式运行服务
   - 自动处理前后端服务的启动顺序和依赖关系

4. **`scripts/clear-cache.sh`** - 清理缓存和临时文件
   - 清理后端临时文件
   - 清理前端构建缓存
   - 重新构建前端
   - 重新编译后端

5. **`scripts/stop-dev.sh`** - 停止开发环境
   - 停止tmux会话（如果存在）
   - 停止后台进程（如果存在）
   - 查找并停止可能的遗留进程
   - 清理临时日志文件

## 开发工作流程

### 标准开发流程

1. 启动完整开发环境：
   ```bash
   ./scripts/dev-all.sh
   ```
   或使用根目录快捷脚本：
   ```bash
   ./dev-all.sh
   ```

2. 在浏览器中访问 http://localhost:5173 进行开发
   - 前端修改将实时生效（热重载）
   - API 请求会自动代理到后端服务

3. 如果遇到缓存问题，运行清理脚本：
   ```bash
   ./scripts/clear-cache.sh
   ```

4. 停止开发环境：
   ```bash
   ./scripts/stop-dev.sh
   ```
   或使用根目录快捷脚本：
   ```bash
   ./stop-dev.sh
   ```

### 分离开发流程

如果您只需要开发前端或后端，可以单独启动相应的服务：

- 仅启动后端：
  ```bash
  ./scripts/dev.sh
  ```
  或使用根目录快捷脚本：
  ```bash
  ./dev.sh
  ```
  然后访问 http://localhost:3000

- 仅启动前端：
  ```bash
  ./scripts/dev-frontend.sh
  ```
  然后访问 http://localhost:5173

## 缓存控制

本开发环境已实施以下缓存控制措施：

1. 后端中间件设置了禁用缓存的 HTTP 头
2. 前端开发服务器设置了禁用缓存的 HTTP 头
3. 构建配置中添加了时间戳，确保每次构建生成不同的文件名
4. 开发模式下，静态文件直接从文件系统读取，绕过嵌入式文件系统

如果仍然遇到缓存问题，请尝试：

1. 运行 `./scripts/clear-cache.sh` 脚本
2. 在浏览器中使用强制刷新（Ctrl+F5 或 Cmd+Shift+R）

## 无tmux模式说明

如果系统中没有安装tmux，`dev-all.sh`脚本将自动切换到后台进程模式：

1. 前端和后端服务将在后台运行
2. 日志将输出到以下文件：
   - 后端日志：`/tmp/veloera-backend.log`
   - 前端日志：`/tmp/veloera-frontend.log`
3. 可以使用以下命令查看日志：
   ```bash
   tail -f /tmp/veloera-backend.log /tmp/veloera-frontend.log
   ```
4. 进程PID将保存在`/tmp/veloera-dev.pid`文件中
5. 使用`./stop-dev.sh`脚本可以停止所有服务 