# API Design — Openday (Openday)

## 通用约定 / General Conventions

- 所有接口返回 `Content-Type: application/json`
- 成功响应：`{ data: ... }`
- 错误响应：`{ error: string, details?: any }`
- 分页参数：`?page=1&limit=20`（默认 `limit=20`，最大 `100`）
- 管理接口（`/api/admin/*`）需要 HTTP Basic Auth 头：`Authorization: Basic <base64(user:password)>`

---

## 公开 API / Public API

### `GET /api/programs` — 项目列表

查询项目列表，支持多维度筛选和分页。

**Query Parameters：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `country` | `string` | 国家筛选，如 `US`，支持逗号分隔多选 |
| `degree` | `string` | 学位筛选：`bachelor` / `master` / `phd` |
| `field` | `string` | 专业方向筛选，模糊匹配 |
| `status` | `string` | 状态筛选：`open` / `closed` / `unknown` |
| `q` | `string` | 关键词搜索（name + school） |
| `page` | `number` | 页码，默认 `1` |
| `limit` | `number` | 每页数量，默认 `20`，最大 `100` |

**Response：**

```json
{
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "MSc Computer Science",
        "school": "University of Oxford",
        "country": "UK",
        "degree": "master",
        "field": "Computer Science",
        "status": "open",
        "deadline": "2025-01-15",
        "languageReq": "IELTS 7.0",
        "gpaReq": 3.5,
        "fee": 75,
        "applyUrl": "https://...",
        "updatedAt": "2025-01-01T00:00:00Z"
      }
    ],
    "total": 200,
    "page": 1,
    "limit": 20,
    "totalPages": 10
  }
}
```

---

### `GET /api/programs/[id]` — 项目详情

返回单个项目的完整信息。

**Response：**

```json
{
  "data": {
    "id": "uuid",
    "name": "MSc Computer Science",
    "school": "University of Oxford",
    "country": "UK",
    "degree": "master",
    "field": "Computer Science",
    "status": "open",
    "deadline": "2025-01-15",
    "languageReq": "IELTS 7.0",
    "gpaReq": 3.5,
    "fee": 75,
    "applyUrl": "https://...",
    "description": "...",
    "updatedAt": "2025-01-01T00:00:00Z",
    "createdAt": "2024-06-01T00:00:00Z"
  }
}
```

**Error：**

```json
// 404
{ "error": "Program not found" }
```

---

### `POST /api/subscriptions` — 提交订阅

访客提交邮箱和偏好，触发验证邮件发送。

**Request Body：**

```json
{
  "email": "user@example.com",
  "degrees": ["master", "phd"],      // 必填，1-3个
  "fields": ["Computer Science"],    // 必填，1-5个
  "countries": ["US", "UK"]          // 必填，1-3个
}
```

**Response（201）：**

```json
{
  "data": {
    "message": "验证邮件已发送，请检查您的邮箱。",
    "email": "user@example.com"
  }
}
```

**Error：**

```json
// 400 - 参数错误
{ "error": "Invalid email format" }
{ "error": "degrees must have 1-3 items" }

// 409 - 邮箱已订阅
{ "error": "Email already subscribed" }

// 500 - 邮件发送失败
{ "error": "Failed to send verification email" }
```

**副作用：**
1. 写入 `subscriptions` 表（`verified=false`）
2. 发送验证邮件（含 `verify_token` 链接）

---

### `GET /api/subscriptions/verify` — 邮箱验证

**Query Parameters：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `token` | `string` | 验证 token（UUID） |

**Response（302 重定向）：**
- 成功：重定向到 `/subscribe/verify?status=success`
- 失败：重定向到 `/subscribe/verify?status=invalid`

**副作用：**
1. 更新 `subscriptions.verified = 1`
2. 清除 `verify_token`（可选）
3. 发送欢迎邮件（含匹配项目汇总）

---

### `DELETE /api/subscriptions/unsubscribe` — 退订

**Query Parameters：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `token` | `string` | 退订 token（UUID） |

**Response（200）：**

```json
{
  "data": {
    "message": "已成功退订，您将不再收到通知邮件。"
  }
}
```

**Error：**

```json
// 404
{ "error": "Invalid unsubscribe token" }
```

---

## 管理 API / Admin API

> 所有 `/api/admin/*` 接口需要 HTTP Basic Auth。
>
> 凭证通过环境变量配置：`ADMIN_USER` + `ADMIN_PASSWORD`

---

### `GET /api/admin/programs` — 管理：项目列表

支持与公开接口相同的筛选参数，额外返回内部字段。

**Response：**

```json
{
  "data": {
    "items": [...],  // 完整字段，含 createdAt
    "total": 200,
    "page": 1,
    "limit": 20
  }
}
```

---

### `POST /api/admin/programs` — 管理：新增项目

**Request Body：**

```json
{
  "name": "MSc Computer Science",
  "school": "University of Oxford",
  "country": "UK",
  "degree": "master",
  "field": "Computer Science",
  "status": "closed",
  "deadline": "2025-01-15",
  "languageReq": "IELTS 7.0",
  "gpaReq": 3.5,
  "fee": 75,
  "applyUrl": "https://...",
  "description": "..."
}
```

**Response（201）：**

```json
{
  "data": { "id": "uuid", ... }
}
```

---

### `PUT /api/admin/programs/[id]` — 管理：更新项目

**Request Body：** 同新增（可部分更新）

**副作用：** 写入 `program_updates` 变更日志（每个变更字段一条记录）

**Response（200）：**

```json
{
  "data": { "id": "uuid", ... }
}
```

---

### `DELETE /api/admin/programs/[id]` — 管理：删除项目

**Response（200）：**

```json
{
  "data": { "message": "Program deleted" }
}
```

---

### `POST /api/admin/programs/[id]/notify` — 管理：手动触发推送

将项目通知推送给所有匹配的已验证订阅者。

**Request Body：** 空（或可选附加自定义消息）

```json
{
  "customMessage": "该项目申请现已开放，截止日期为..."  // 可选
}
```

**Response（200）：**

```json
{
  "data": {
    "sent": 42,       // 成功发送数量
    "skipped": 5,     // 已推送过，跳过数量
    "failed": 1       // 发送失败数量
  }
}
```

**推送匹配逻辑：**

```
订阅者的 degrees 包含项目的 degree
  AND 订阅者的 fields 包含项目的 field（或部分匹配）
  AND 订阅者的 countries 包含项目的 country
  AND 订阅者 verified = true
  AND (program_id, email) 不在 notification_logs 中
```

---

### `GET /api/admin/subscriptions` — 管理：订阅者列表

**Query Parameters：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `verified` | `boolean` | 筛选验证状态 |
| `page` | `number` | 页码 |
| `limit` | `number` | 每页数量 |

**Response：**

```json
{
  "data": {
    "items": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "degrees": ["master"],
        "fields": ["Computer Science"],
        "countries": ["US", "UK"],
        "verified": true,
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "total": 150,
    "page": 1,
    "limit": 20
  }
}
```

---

### `GET /api/admin/stats` — 管理：数据统计

**Response：**

```json
{
  "data": {
    "programs": {
      "total": 200,
      "open": 45,
      "closed": 150,
      "unknown": 5
    },
    "subscriptions": {
      "total": 500,
      "verified": 420,
      "unverified": 80
    },
    "notifications": {
      "totalSent": 1250,
      "last30Days": 340
    }
  }
}
```

---

## 错误码汇总 / Error Codes

| HTTP 状态码 | 含义 |
|------------|------|
| `400` | 请求参数错误（缺失或格式不对） |
| `401` | 未认证（管理接口缺少 Basic Auth） |
| `403` | 认证失败（用户名/密码错误） |
| `404` | 资源不存在 |
| `409` | 资源冲突（如邮箱已订阅） |
| `500` | 服务器内部错误 |
