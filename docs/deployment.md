# 部署说明

## 服务器环境

- 腾讯云轻量应用服务器
- Ubuntu Server 24.04 LTS
- 2 核 CPU / 4 GB 内存
- IP: 43.160.229.133

## 架构

```
Internet
  │
  ▼
Nginx (port 80)
  │
  └── → Writers' Den (localhost:3000, PM2 守护)
```

## 环境变量

服务器 `~/writers-den/.env`：

```
DATABASE_URL=file:./writers-den.db
SMTP_USER=2634887366@qq.com
SMTP_PASS=<QQ邮箱授权码>
```

## 部署命令

```bash
# 首次部署
git clone https://github.com/NNNINE-999/writers-den.git ~/writers-den
cd ~/writers-den
npm install
cp .env.example .env   # 编辑填入配置
npx drizzle-kit push    # 建表
npm run build
pm2 start npm --name "writers-den" -- start
pm2 save
pm2 startup

# 更新部署（日常使用）
cd ~/writers-den && git pull && npm run build && pm2 restart writers-den

# 如有数据库结构变更
cd ~/writers-den && git pull && npm run build && npx drizzle-kit push && pm2 restart writers-den
```

## Nginx 配置

配置文件 `/etc/nginx/sites-available/writers-den`：

```nginx
server {
    listen 80;
    server_name 43.160.229.133;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用：

```bash
sudo ln -s /etc/nginx/sites-available/writers-den /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 注意事项

- 当前无 SSL 证书，仅 HTTP 访问。Cookie `secure` 设为 `false`
- 如需 HTTPS，用 Certbot + Let's Encrypt 添加证书
- 预留了与 OpenClaw 共存的 Nginx 配置（通过不同域名分流）
