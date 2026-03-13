# Architecture — Openday (Openday)

## 项目概述 / Overview

Openday 是一个**开源自部署优先**的海外申请开放通知平台。访客无需注册账号，只需提交邮箱和偏好即可订阅通知；管理员通过环境变量配置的 Basic Auth 管理项目数据。

Openday is an **open-source, self-hosted** study abroad application notification platform. Visitors subscribe by submitting their email and preferences — no account registration required. Admins manage program data via environment-variable-configured Basic Auth.

---

## 整体架构 / System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Browser / Client                   │
│   Public Pages         │        Admin Pages             │
│ (/, /programs, /sub)   │   (/admin/*, Basic Auth)       │
└────────────┬───────────┴──────────────┬─────────────────┘
             │  HTTP                    │  HTTP + Auth Header
             ▼                          ▼
┌─────────────────────────────────────────────────────────┐
│               Next.js App Router (Node.js)              │
│                                                         │
│  React Server Components + Client Components            │
│  API Routes (/api/*)                                    │
│  Middleware (Basic Auth for /admin/*, /api/admin/*)     │
└────────────────────────────┬────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     ┌──────────────┐  ┌──────────┐  ┌──────────────┐
     │ SQLite DB    │  │ Nodemailer│  │ File System  │
     │ (libsql/     │  │ (SMTP)   │  │ (assets,     │
     │ better-      │  │          │  │  uploads)    │
     │ sqlite3)     │  │          │  │              │
     └──────────────┘  └──────────┘  └──────────────┘
```

---

## 技术栈 / Tech Stack

| 层 / Layer | 选型 / Choice | 理由 / Reason |
|-----------|--------------|--------------|
| 框架 | Next.js 16 (App Router) | 全栈 SSR + API Routes，单一代码库 |
| 语言 | TypeScript | 类型安全，减少运行时错误 |
| 样式 | Tailwind CSS v4 | 快速开发，零运行时 |
| 运行时 | React 19 | 最新并发特性 |
| 数据库 | SQLite（better-sqlite3） | 零配置，单文件，自部署最友好；后期可迁移 Postgres |
| ORM | Drizzle ORM | 类型安全、轻量，同时支持 SQLite/Postgres |
| 邮件 | Nodemailer + SMTP | 环境变量配置，自部署用自有 SMTP，可切换 Resend/SendGrid |
| 管理认证 | HTTP Basic Auth（env 变量） | `ADMIN_USER` + `ADMIN_PASSWORD`，middleware 拦截，零依赖 |
| 包管理 | pnpm | 快速，磁盘高效 |

---

## 目录结构 / Directory Structure

```
openday/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页（项目列表 + 搜索）
│   ├── programs/
│   │   └── [id]/
│   │       └── page.tsx        # 项目详情页
│   ├── subscribe/
│   │   ├── page.tsx            # 订阅偏好设置
│   │   └── verify/
│   │       └── page.tsx        # 邮箱验证成功
│   ├── unsubscribe/
│   │   └── page.tsx            # 退订确认
│   ├── admin/
│   │   ├── layout.tsx          # 管理后台布局
│   │   ├── page.tsx            # 管理首页（统计）
│   │   ├── programs/
│   │   │   ├── page.tsx        # 项目列表
│   │   │   ├── new/
│   │   │   │   └── page.tsx    # 新增项目
│   │   │   └── [id]/
│   │   │       └── page.tsx    # 编辑项目
│   │   └── subscriptions/
│   │       └── page.tsx        # 订阅者管理
│   └── api/
│       ├── programs/
│       │   ├── route.ts        # GET /api/programs
│       │   └── [id]/
│       │       └── route.ts    # GET /api/programs/[id]
│       ├── subscriptions/
│       │   ├── route.ts        # POST /api/subscriptions
│       │   ├── verify/
│       │   │   └── route.ts    # GET /api/subscriptions/verify
│       │   └── unsubscribe/
│       │       └── route.ts    # DELETE /api/subscriptions/unsubscribe
│       └── admin/
│           ├── programs/
│           │   ├── route.ts    # GET/POST /api/admin/programs
│           │   └── [id]/
│           │       ├── route.ts        # PUT/DELETE /api/admin/programs/[id]
│           │       └── notify/
│           │           └── route.ts    # POST /api/admin/programs/[id]/notify
│           ├── subscriptions/
│           │   └── route.ts    # GET /api/admin/subscriptions
│           └── stats/
│               └── route.ts    # GET /api/admin/stats
├── lib/
│   ├── db/
│   │   ├── index.ts            # 数据库连接
│   │   ├── schema.ts           # Drizzle schema 定义
│   │   └── migrations/         # 数据库迁移文件
│   ├── email/
│   │   ├── index.ts            # Nodemailer 配置
│   │   └── templates/          # 邮件模板
│   └── auth.ts                 # Basic Auth 验证工具
├── middleware.ts                # Basic Auth 中间件（/admin/*）
├── docs/                       # 技术文档
├── public/                     # 静态资源
├── prd/                        # 产品需求文档
└── scripts/
    └── seed.ts                 # 数据库初始化脚本
```

---

## 数据流 / Data Flow

### 订阅流程 / Subscription Flow

```
访客填写邮箱+偏好
        │
        ▼
POST /api/subscriptions
        │
        ├─ 验证邮箱格式
        ├─ 生成 verify_token（UUID）
        ├─ 写入 subscriptions 表（verified=false）
        └─ 发送验证邮件（Nodemailer）
                │
                ▼
        访客点击邮件中验证链接
                │
                ▼
        GET /api/subscriptions/verify?token=xxx
                │
                ├─ 查找 token，更新 verified=true
                └─ 重定向到 /subscribe/verify（成功页）
```

### 通知推送流程 / Notification Flow

```
管理员在后台更新项目状态（status → open）
        │
        ▼
POST /api/admin/programs/[id]/notify
        │
        ├─ 查询匹配订阅者（degree AND field AND country）
        ├─ 过滤 notification_logs（防重复推送）
        ├─ 批量发送通知邮件
        └─ 写入 notification_logs 记录
```

### 退订流程 / Unsubscribe Flow

```
用户点击邮件底部退订链接
        │
        ▼
DELETE /api/subscriptions/unsubscribe?token=xxx
        │
        └─ 软删除或物理删除 subscriptions 记录
```

---

## 开源自部署 vs SaaS 演进路径 / Evolution Path

| 阶段 | 模式 | 数据库 | 认证 | 邮件 |
|------|------|--------|------|------|
| **P0（现在）** | 开源自部署 | SQLite 单文件 | Basic Auth（env） | 自有 SMTP |
| **P1（未来）** | SaaS 多租户 | Postgres（单实例） | NextAuth + OAuth | Resend / SendGrid |
| **P2（扩展）** | SaaS 企业版 | Postgres + 读副本 | SSO / SAML | 邮件服务商 API |

迁移路径：Drizzle ORM 支持 SQLite → Postgres 切换，只需修改 `DATABASE_URL` 和 `db/index.ts` 的 driver import。
