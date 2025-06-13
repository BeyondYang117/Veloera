# OAuth 登录配置指南

本文档提供了如何配置LinuxDO和GitHub OAuth登录的详细说明。

## 配置步骤

### 1. 准备工作

确保已经完成以下准备工作：

- 已经部署了Veloera服务
- 拥有管理员权限
- 已经在LinuxDO和GitHub上创建了OAuth应用

### 2. 启动服务

使用提供的启动脚本启动服务：

```bash
./start.sh
```

这将自动创建必要的配置文件并启动服务。

### 3. 配置LinuxDO OAuth

1. 访问 [LinuxDO OAuth应用管理页面](https://connect.linux.do/)
2. 创建一个新的OAuth应用
3. 设置回调URL为：`https://您的域名/oauth/linuxdo`
4. 获取Client ID和Client Secret
5. 在Veloera系统设置中填入这些信息并启用LinuxDO OAuth

### 4. 配置GitHub OAuth

1. 访问 [GitHub OAuth应用管理页面](https://github.com/settings/developers)
2. 创建一个新的OAuth应用
3. 设置回调URL为：`https://您的域名/oauth/github`
4. 获取Client ID和Client Secret
5. 在Veloera系统设置中填入这些信息并启用GitHub OAuth

## 配置持久化

所有OAuth配置都会保存在`config/oauth.json`文件中，确保此目录已正确挂载到容器中。这样，即使重新部署服务，配置也不会丢失。

## 故障排除

如果遇到"unauthorized_client"错误，请检查：

1. 回调URL是否正确配置
2. Client ID和Client Secret是否正确
3. OAuth应用是否已激活

如果问题仍然存在，请查看服务日志获取更多信息。 