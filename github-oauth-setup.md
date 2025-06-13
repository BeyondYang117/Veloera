# GitHub OAuth配置指南

## 问题描述
GitHub登录回调404错误通常是由于GitHub OAuth应用的回调URL设置与实际应用的URL不匹配导致的。

## 解决步骤

### 1. 确认您的应用URL
首先，确定您的应用实际可访问的URL。如果使用了Nginx反向代理，这应该是您的域名，例如`https://your-domain.com`。

### 2. 配置GitHub OAuth应用
1. 登录GitHub账户
2. 访问OAuth应用设置页面：https://github.com/settings/developers
3. 找到为Veloera创建的OAuth应用
4. 编辑应用设置，确保回调URL设置正确：
   - 回调URL应为：`https://your-domain.com/oauth/github`
   - 将`your-domain.com`替换为您的实际域名
5. 保存设置

### 3. 更新应用的OAuth配置
1. 编辑`config/oauth.json`文件：
```json
{
  "LinuxDOOAuthEnabled": true,
  "LinuxDOClientId": "",
  "LinuxDOClientSecret": "",
  "GitHubOAuthEnabled": true,
  "GitHubClientId": "您的GitHub Client ID",
  "GitHubClientSecret": "您的GitHub Client Secret"
}
```
2. 填入您的GitHub OAuth应用的Client ID和Client Secret

### 4. 重启应用
```bash
docker-compose down
docker-compose up -d
```

### 5. 验证配置
1. 访问您的应用登录页面
2. 点击GitHub登录按钮
3. 完成授权流程，验证回调是否正常工作

## 常见问题排查
1. **404错误**: 确认回调URL与应用实际URL匹配
2. **无法连接到GitHub服务器**: 检查网络连接和防火墙设置
3. **授权失败**: 确认Client ID和Client Secret正确
4. **state参数不匹配**: 这通常是会话问题，尝试清除浏览器缓存或使用隐私模式

如果问题仍然存在，请检查应用日志获取更多信息。 