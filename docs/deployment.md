# Deployment Guide — Openday (Openday)

## 环境变量清单 / Environment Variables

在项目根目录创建 `.env.local`（本地开发）或 `.env`（生产），配置以下变量：

```bash
# =====================
# 数据库 / Database
# =====================
DATABASE_URL="file:./data/applyping.db"
# SQLite 文件路径，相对于项目根目录
# Docker 部署时建议挂载持久化卷：file:/data/applyping.db

# =====================
# 管理员认证 / Admin Auth
# =====================
ADMIN_USER="admin"
ADMIN_PASSWORD="your-secure-password-here"
# 用于保护 /admin/* 和 /api/admin/* 路由的 HTTP Basic Auth
# 请使用强密码（建议 16+ 字符，包含大小写字母、数字、特殊字符）

# =====================
# 邮件服务 / Email (SMTP)
# =====================
SMTP_HOST="smtp.gmail.com"       # SMTP 服务器地址
SMTP_PORT="587"                  # 端口（587=STARTTLS, 465=SSL, 25=无加密）
SMTP_SECURE="false"              # true=SSL(465), false=STARTTLS(587)
SMTP_USER="your@gmail.com"       # SMTP 用户名（通常是邮箱地址）
SMTP_PASS="your-app-password"    # SMTP 密码（Gmail 请使用应用专用密码）
EMAIL_FROM="Openday <noreply@yourdomain.com>"  # 发件人显示名和地址

# =====================
# 站点配置 / Site Config
# =====================
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
# 用于生成邮件中的链接（验证链接、退订链接、项目详情链接）
# 本地开发：http://localhost:3000
```

### 常见 SMTP 配置参考

| 邮件服务 | SMTP_HOST | SMTP_PORT | SMTP_SECURE |
|---------|-----------|-----------|-------------|
| Gmail | smtp.gmail.com | 587 | false |
| Outlook/Hotmail | smtp-mail.outlook.com | 587 | false |
| QQ 邮箱 | smtp.qq.com | 587 | false |
| 163 邮箱 | smtp.163.com | 465 | true |
| Resend | smtp.resend.com | 465 | true |
| SendGrid | smtp.sendgrid.net | 587 | false |

---

## 方式一：本地开发 / Local Development

```bash
# 1. 克隆项目
git clone https://github.com/yourusername/applyping.git
cd applyping

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入实际值

# 4. 初始化数据库（创建表结构）
pnpm db:migrate

# 5. （可选）导入示例数据
pnpm db:seed

# 6. 启动开发服务器
pnpm dev
# 访问 http://localhost:3000
# 管理后台 http://localhost:3000/admin
```

**package.json 脚本说明：**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:seed": "tsx scripts/seed.ts",
    "db:studio": "drizzle-kit studio"
  }
}
```

---

## 方式二：Docker 自部署 / Docker Self-Hosting

### 创建 `Dockerfile`

```dockerfile
FROM node:20-alpine AS base
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN mkdir -p /data && chown nextjs:nodejs /data

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### 创建 `docker-compose.yml`

```yaml
version: '3.8'

services:
  applyping:
    build: .
    container_name: applyping
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - applyping-data:/data   # SQLite 数据库持久化
    environment:
      - DATABASE_URL=file:/data/applyping.db
      - ADMIN_USER=${ADMIN_USER}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=${SMTP_PORT}
      - SMTP_SECURE=${SMTP_SECURE}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASS=${SMTP_PASS}
      - EMAIL_FROM=${EMAIL_FROM}
      - NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

volumes:
  applyping-data:
    driver: local
```

### 启动步骤

```bash
# 1. 创建 .env 文件（同本地开发配置）
cp .env.example .env
# 编辑 .env，填入实际值

# 2. 构建并启动
docker compose up -d

# 3. 初始化数据库（首次部署）
docker compose exec applyping node scripts/migrate.js

# 4. （可选）导入初始数据
docker compose exec applyping node scripts/seed.js

# 5. 查看日志
docker compose logs -f

# 停止服务
docker compose down

# 更新部署
git pull
docker compose up -d --build
```

### 使用 Nginx 反向代理（可选）

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # 重定向到 HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 方式三：Vercel 一键部署 / Vercel Deployment

> **注意：** Vercel 的无服务器函数不支持持久化文件系统，SQLite 文件每次函数调用后会重置。
> Vercel 部署建议：使用 [Turso](https://turso.tech)（libsql 云托管）替代本地 SQLite 文件，只需修改 `DATABASE_URL` 格式。

**步骤：**

1. Fork 本项目到 GitHub
2. 访问 [vercel.com](https://vercel.com)，导入 GitHub 仓库
3. 在 Vercel 控制台 → Settings → Environment Variables，添加所有环境变量
4. 点击 Deploy

**Vercel 环境变量配置：**

| 变量名 | 说明 |
|--------|------|
| `DATABASE_URL` | Turso URL，如 `libsql://your-db.turso.io` |
| `DATABASE_AUTH_TOKEN` | Turso 认证 token |
| `ADMIN_USER` | 管理员用户名 |
| `ADMIN_PASSWORD` | 管理员密码 |
| `SMTP_HOST` 等 | 邮件配置 |
| `NEXT_PUBLIC_SITE_URL` | 部署后的域名 |

---

## 方式四：Railway 部署 / Railway Deployment

Railway 支持持久化存储卷，可以直接使用 SQLite。

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 初始化项目
railway init

# 添加卷（用于 SQLite 持久化）
railway volume add

# 部署
railway up
```

在 Railway 控制台配置环境变量，将 `DATABASE_URL` 设置为挂载卷路径。

---

## 数据库初始化 / Database Initialization

### 迁移脚本（`scripts/migrate.ts`）

```typescript
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { db } from '../lib/db'

migrate(db, { migrationsFolder: './lib/db/migrations' })
console.log('Database migrations completed.')
```

### Seed 脚本（`scripts/seed.ts`）

导入示例项目数据（QS Top 200 热门项目），用于快速启动演示环境。

```typescript
import { db } from '../lib/db'
import { programs } from '../lib/db/schema'
import { randomUUID } from 'crypto'

const samplePrograms = [
  {
    id: randomUUID(),
    name: 'MSc Computer Science',
    school: 'University of Oxford',
    country: 'UK',
    degree: 'master',
    field: 'Computer Science',
    status: 'open',
    deadline: '2025-01-15',
    languageReq: 'IELTS 7.5',
    gpaReq: 3.7,
    fee: 75,
    applyUrl: 'https://www.ox.ac.uk/admissions/graduate/courses/msc-computer-science',
  },
  // ... 更多示例数据
]

await db.insert(programs).values(samplePrograms)
console.log(`Seeded ${samplePrograms.length} programs.`)
```

---

## 升级指南 / Upgrade Guide

```bash
# 1. 备份数据库（重要！）
cp data/applyping.db data/applyping.db.backup.$(date +%Y%m%d)

# 2. 拉取最新代码
git pull

# 3. 更新依赖
pnpm install

# 4. 运行数据库迁移
pnpm db:migrate

# 5. 重启服务
# Docker:
docker compose up -d --build
# PM2:
pm2 restart applyping
```

---

## 常见问题 / FAQ

**Q: 邮件发送失败怎么办？**
A: 检查 SMTP 配置，Gmail 需要开启"应用专用密码"（不能直接用账号密码），并确保开启了 IMAP。

**Q: 管理后台浏览器弹出认证框但无法登录？**
A: 确认 `.env` 中 `ADMIN_USER` 和 `ADMIN_PASSWORD` 已设置，并重启应用。

**Q: Docker 重启后数据丢失？**
A: 确保 `docker-compose.yml` 中配置了持久化卷（`volumes: applyping-data:/data`），且 `DATABASE_URL` 指向 `/data/` 路径下。

**Q: 如何迁移到 PostgreSQL？**
A: 修改 `lib/db/index.ts` 使用 `drizzle-orm/postgres-js` driver，更新 `DATABASE_URL` 为 postgres 连接字符串，重新生成迁移文件并执行。
