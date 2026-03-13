# Database Schema — Openday (Openday)

数据库使用 **SQLite**（better-sqlite3），通过 **Drizzle ORM** 管理 schema 和迁移。

---

## 表概览 / Tables Overview

| 表名 | 说明 |
|------|------|
| `programs` | 海外申请项目数据 |
| `subscriptions` | 访客邮件订阅记录 |
| `notification_logs` | 通知推送记录（防重复） |
| `program_updates` | 项目数据变更日志 |

---

## `programs` — 项目数据表

存储所有海外申请项目的核心信息。

```sql
CREATE TABLE programs (
  id           TEXT PRIMARY KEY,          -- UUID
  name         TEXT NOT NULL,             -- 项目名称，如 "MSc Computer Science"
  school       TEXT NOT NULL,             -- 学校名称，如 "University of Oxford"
  country      TEXT NOT NULL,             -- 国家，如 "UK"、"US"、"Canada"
  degree       TEXT NOT NULL,             -- 学位层级：'bachelor' | 'master' | 'phd'
  field        TEXT NOT NULL,             -- 专业方向，如 "Computer Science"
  status       TEXT NOT NULL DEFAULT 'closed',  -- 申请状态：'open' | 'closed' | 'unknown'
  deadline     TEXT,                      -- 申请截止日期，ISO 8601 格式，如 "2025-01-15"
  language_req TEXT,                      -- 语言要求，如 "IELTS 7.0 / TOEFL 100"
  gpa_req      REAL,                      -- GPA 要求，如 3.5（满分 4.0）
  fee          INTEGER,                   -- 申请费（美元）
  apply_url    TEXT,                      -- 官方申请链接
  description  TEXT,                      -- 项目简介（可选）
  updated_at   TEXT NOT NULL DEFAULT (datetime('now')),  -- 最后更新时间
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))   -- 创建时间
);
```

**Drizzle Schema 定义：**

```typescript
import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const programs = sqliteTable('programs', {
  id:           text('id').primaryKey(),
  name:         text('name').notNull(),
  school:       text('school').notNull(),
  country:      text('country').notNull(),
  degree:       text('degree').notNull(),  // 'bachelor' | 'master' | 'phd'
  field:        text('field').notNull(),
  status:       text('status').notNull().default('closed'),  // 'open' | 'closed' | 'unknown'
  deadline:     text('deadline'),
  languageReq:  text('language_req'),
  gpaReq:       real('gpa_req'),
  fee:          integer('fee'),
  applyUrl:     text('apply_url'),
  description:  text('description'),
  updatedAt:    text('updated_at').notNull().default(sql`(datetime('now'))`),
  createdAt:    text('created_at').notNull().default(sql`(datetime('now'))`),
})
```

**索引：**

```sql
CREATE INDEX idx_programs_status   ON programs(status);
CREATE INDEX idx_programs_country  ON programs(country);
CREATE INDEX idx_programs_degree   ON programs(degree);
CREATE INDEX idx_programs_field    ON programs(field);
```

**字段枚举值 / Enum Values：**

- `degree`：`bachelor` | `master` | `phd`
- `status`：`open`（申请开放）| `closed`（申请关闭）| `unknown`（状态未知）
- `country`（常见值）：`US` | `UK` | `Canada` | `Australia` | `Germany` | `Singapore` | `HongKong`

---

## `subscriptions` — 邮件订阅表

存储访客的订阅偏好，用于匹配通知推送。

```sql
CREATE TABLE subscriptions (
  id           TEXT PRIMARY KEY,          -- UUID
  email        TEXT NOT NULL,             -- 订阅邮箱
  degrees      TEXT NOT NULL,             -- JSON 数组，如 '["master","phd"]'（≤ 3个）
  fields       TEXT NOT NULL,             -- JSON 数组，如 '["CS","EE"]'（≤ 5个）
  countries    TEXT NOT NULL,             -- JSON 数组，如 '["US","UK"]'（≤ 3个）
  verified     INTEGER NOT NULL DEFAULT 0,  -- 邮箱是否已验证：0=未验证, 1=已验证
  verify_token TEXT,                      -- 邮箱验证 token（UUID，验证后可清除）
  unsub_token  TEXT NOT NULL,             -- 退订 token（UUID，永久保留）
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
```

**Drizzle Schema 定义：**

```typescript
export const subscriptions = sqliteTable('subscriptions', {
  id:          text('id').primaryKey(),
  email:       text('email').notNull(),
  degrees:     text('degrees').notNull(),   // JSON string: string[]
  fields:      text('fields').notNull(),    // JSON string: string[]
  countries:   text('countries').notNull(), // JSON string: string[]
  verified:    integer('verified').notNull().default(0),
  verifyToken: text('verify_token'),
  unsubToken:  text('unsub_token').notNull(),
  createdAt:   text('created_at').notNull().default(sql`(datetime('now'))`),
})
```

**索引：**

```sql
CREATE UNIQUE INDEX idx_subscriptions_email       ON subscriptions(email);
CREATE UNIQUE INDEX idx_subscriptions_verify_token ON subscriptions(verify_token);
CREATE UNIQUE INDEX idx_subscriptions_unsub_token  ON subscriptions(unsub_token);
```

**约束说明：**
- 同一邮箱只能有一条订阅记录（`email` UNIQUE）
- `degrees`、`fields`、`countries` 以 JSON 字符串存储数组，读取时需 `JSON.parse()`
- 未验证（`verified=0`）的订阅不参与通知推送

---

## `notification_logs` — 推送记录表

防止对同一订阅者重复推送同一项目的通知。

```sql
CREATE TABLE notification_logs (
  id           TEXT PRIMARY KEY,          -- UUID
  program_id   TEXT NOT NULL,             -- 关联 programs.id
  email        TEXT NOT NULL,             -- 接收通知的邮箱
  sent_at      TEXT NOT NULL DEFAULT (datetime('now'))  -- 发送时间
);
```

**Drizzle Schema 定义：**

```typescript
export const notificationLogs = sqliteTable('notification_logs', {
  id:        text('id').primaryKey(),
  programId: text('program_id').notNull().references(() => programs.id),
  email:     text('email').notNull(),
  sentAt:    text('sent_at').notNull().default(sql`(datetime('now'))`),
})
```

**索引：**

```sql
CREATE UNIQUE INDEX idx_notification_logs_program_email
  ON notification_logs(program_id, email);
```

**防重复推送逻辑：** 推送前先查询 `notification_logs`，若 `(program_id, email)` 已存在则跳过该订阅者。

---

## `program_updates` — 项目变更日志表

记录项目数据的每次字段变更，用于审计和数据溯源。

```sql
CREATE TABLE program_updates (
  id            TEXT PRIMARY KEY,          -- UUID
  program_id    TEXT NOT NULL,             -- 关联 programs.id
  field_changed TEXT NOT NULL,             -- 变更的字段名，如 "status"
  old_val       TEXT,                      -- 变更前的值（字符串化）
  new_val       TEXT,                      -- 变更后的值（字符串化）
  updated_at    TEXT NOT NULL DEFAULT (datetime('now')),  -- 变更时间
  updated_by    TEXT                       -- 操作者（管理员标识，可选）
);
```

**Drizzle Schema 定义：**

```typescript
export const programUpdates = sqliteTable('program_updates', {
  id:           text('id').primaryKey(),
  programId:    text('program_id').notNull().references(() => programs.id),
  fieldChanged: text('field_changed').notNull(),
  oldVal:       text('old_val'),
  newVal:       text('new_val'),
  updatedAt:    text('updated_at').notNull().default(sql`(datetime('now'))`),
  updatedBy:    text('updated_by'),
})
```

**索引：**

```sql
CREATE INDEX idx_program_updates_program_id ON program_updates(program_id);
CREATE INDEX idx_program_updates_updated_at ON program_updates(updated_at);
```

---

## ER 关系图 / ER Diagram

```
programs (1) ──── (N) notification_logs
    │
    └──── (N) program_updates

subscriptions ──── (独立，通过 email 关联 notification_logs)
```

---

## 数据迁移说明 / Migration Notes

- 使用 `drizzle-kit` 生成迁移文件：`npx drizzle-kit generate`
- 迁移文件位于 `lib/db/migrations/`
- 生产环境通过 `npx drizzle-kit migrate` 执行迁移
- SQLite → Postgres 迁移时，修改 `lib/db/index.ts` 的 driver，`TEXT[]` 可替换 JSON 字符串存储数组
