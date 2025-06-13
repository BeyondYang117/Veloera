# OAuth配置指南

本文档提供了配置GitHub和LinuxDO OAuth登录的详细步骤。

## 前提条件

1. 已部署Veloera应用
2. 拥有域名并配置了HTTPS证书
3. 拥有GitHub和LinuxDO账号

## GitHub OAuth配置

1. 访问 [GitHub开发者设置](https://github.com/settings/developers)
2. 点击"New OAuth App"
3. 填写应用信息:
   - Application name: Veloera (或您喜欢的名称)
   - Homepage URL: https://your-domain.com
   - Authorization callback URL: https://your-domain.com/oauth/github
4. 点击"Register application"
5. 获取Client ID和Client Secret
6. 更新`config/oauth.json`文件:
   ```json
   {
     "GitHubOAuthEnabled": true,
     "GitHubClientId": "您的GitHub Client ID",
     "GitHubClientSecret": "您的GitHub Client Secret"
   }
   ```

## LinuxDO OAuth配置

1. 访问 [LinuxDO开发者平台](https://connect.linux.do/console/applications)
2. 创建新应用
3. 填写应用信息:
   - 应用名称: Veloera (或您喜欢的名称)
   - 重定向URI: https://your-domain.com/oauth/linuxdo
4. 获取Client ID和Client Secret
5. 更新`config/oauth.json`文件:
   ```json
   {
     "LinuxDOOAuthEnabled": true,
     "LinuxDOClientId": "您的LinuxDO Client ID",
     "LinuxDOClientSecret": "您的LinuxDO Client Secret"
   }
   ```

## Docker配置

确保`docker-compose.yml`中的端口映射允许外部访问:

```yaml
ports:
  - "3004:3000"  # 不要使用127.0.0.1前缀
```

## Nginx配置

配置Nginx反向代理以处理OAuth回调:

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    # SSL证书配置
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # 反向代理配置
    location / {
        proxy_pass http://localhost:3004;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 特别处理OAuth回调路径
    location /oauth/ {
        proxy_pass http://localhost:3004;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 重启应用

使用提供的重启脚本应用新配置:

```bash
chmod +x restart-with-oauth.sh
./restart-with-oauth.sh
```

## 故障排除

如果遇到问题，请检查:

1. 日志: `docker-compose logs -f`
2. 确认回调URL配置正确
3. 确认客户端ID和密钥正确
4. 检查网络和防火墙设置

## 常见问题

### 回调URL 404错误

- 确认Nginx配置正确
- 确认Docker端口映射正确
- 检查应用是否正常运行

### client_id=[object Object]错误

这表明传递了JavaScript对象而非字符串。已在代码中修复此问题，请确保使用最新版本。 