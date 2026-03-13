# Email Templates — Openday (Openday)

## 通用约定 / General Conventions

- 发件人格式：`Openday <noreply@yourdomain.com>`（通过 `EMAIL_FROM` 环境变量配置）
- 所有邮件底部必须包含退订链接
- 语言：中文（面向中国留学申请者）
- HTML 格式为主，同时提供纯文本备用（Nodemailer 的 `text` 字段）
- Token 有效期：验证邮件 24 小时，退订链接永久有效

---

## 1. 验证邮件 / Verification Email

**触发时机：** 访客提交订阅表单（`POST /api/subscriptions`）

**主题格式：**

```
请验证您的 Openday 订阅邮箱
```

**HTML 正文：**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, sans-serif; color: #333; max-width: 600px; margin: 0 auto; }
    .btn { display: inline-block; padding: 12px 24px; background: #2563eb; color: white;
           text-decoration: none; border-radius: 6px; font-size: 16px; }
    .footer { margin-top: 32px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 16px; }
  </style>
</head>
<body>
  <h2>验证您的订阅邮箱</h2>
  <p>您好！</p>
  <p>您已向 <strong>Openday</strong> 提交了申请开放通知订阅请求。请点击下方按钮验证您的邮箱地址：</p>
  <p style="text-align: center; margin: 32px 0;">
    <a href="{{VERIFY_URL}}" class="btn">验证邮箱</a>
  </p>
  <p>验证链接 24 小时内有效。如果您没有订阅 Openday，请忽略此邮件。</p>
  <p>您订阅的偏好：</p>
  <ul>
    <li><strong>学位层级：</strong>{{DEGREES}}</li>
    <li><strong>专业方向：</strong>{{FIELDS}}</li>
    <li><strong>目标国家：</strong>{{COUNTRIES}}</li>
  </ul>
  <div class="footer">
    <p>此邮件由 Openday 自动发送，请勿直接回复。</p>
    <p>如果按钮无法点击，请复制以下链接到浏览器：<br>{{VERIFY_URL}}</p>
  </div>
</body>
</html>
```

**变量说明：**

| 变量 | 说明 | 示例 |
|------|------|------|
| `{{VERIFY_URL}}` | 验证链接 | `https://yourdomain.com/api/subscriptions/verify?token=uuid` |
| `{{DEGREES}}` | 学位偏好（中文） | `硕士、博士` |
| `{{FIELDS}}` | 专业偏好 | `计算机科学、数据科学` |
| `{{COUNTRIES}}` | 国家偏好 | `美国、英国` |

**纯文本备用：**

```
验证您的 Openday 订阅邮箱

请访问以下链接验证您的邮箱：
{{VERIFY_URL}}

链接 24 小时内有效。

您的订阅偏好：
- 学位层级：{{DEGREES}}
- 专业方向：{{FIELDS}}
- 目标国家：{{COUNTRIES}}
```

---

## 2. 申请开放通知邮件 / Notification Email

**触发时机：** 管理员手动触发 `POST /api/admin/programs/[id]/notify`

**主题格式：**

```
🎓 [项目名] @ [学校名] 申请现已开放！截止 {{DEADLINE}}
```

示例：`🎓 MSc Computer Science @ University of Oxford 申请现已开放！截止 2025-01-15`

**HTML 正文：**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, sans-serif; color: #333; max-width: 600px; margin: 0 auto; }
    .program-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 16px 0; }
    .status-badge { display: inline-block; padding: 4px 12px; background: #dcfce7; color: #166534;
                    border-radius: 4px; font-size: 14px; font-weight: 500; }
    .field-row { display: flex; gap: 8px; margin: 8px 0; font-size: 14px; }
    .field-label { color: #6b7280; min-width: 80px; }
    .btn { display: inline-block; padding: 12px 24px; background: #2563eb; color: white;
           text-decoration: none; border-radius: 6px; font-size: 16px; }
    .countdown { font-size: 24px; font-weight: bold; color: #dc2626; text-align: center; margin: 16px 0; }
    .footer { margin-top: 32px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 16px; }
  </style>
</head>
<body>
  <h2>📬 您关注的项目申请开放了！</h2>
  <p>您好！根据您的订阅偏好，以下项目的申请窗口现已开放：</p>

  <div class="program-card">
    <div style="display: flex; justify-content: space-between; align-items: start;">
      <div>
        <h3 style="margin: 0 0 4px;">{{PROGRAM_NAME}}</h3>
        <p style="margin: 0; color: #6b7280;">{{SCHOOL_NAME}} · {{COUNTRY_FLAG}} {{COUNTRY}}</p>
      </div>
      <span class="status-badge">申请开放</span>
    </div>

    <div style="margin-top: 16px;">
      <div class="field-row">
        <span class="field-label">📚 学位：</span>
        <span>{{DEGREE}}</span>
      </div>
      <div class="field-row">
        <span class="field-label">🎓 专业：</span>
        <span>{{FIELD}}</span>
      </div>
      <div class="field-row">
        <span class="field-label">🗣️ 语言：</span>
        <span>{{LANGUAGE_REQ}}</span>
      </div>
      <div class="field-row">
        <span class="field-label">📊 GPA：</span>
        <span>{{GPA_REQ}}</span>
      </div>
      <div class="field-row">
        <span class="field-label">💰 申请费：</span>
        <span>{{FEE}}</span>
      </div>
    </div>

    {{#if DEADLINE}}
    <div class="countdown">
      ⏰ 截止日期：{{DEADLINE}}（还有 {{DAYS_LEFT}} 天）
    </div>
    {{/if}}
  </div>

  <p style="text-align: center; margin: 24px 0;">
    <a href="{{APPLY_URL}}" class="btn">立即前往申请 →</a>
  </p>

  <p style="text-align: center; margin-top: 8px;">
    <a href="{{PROGRAM_DETAIL_URL}}" style="color: #6b7280; font-size: 14px;">查看完整项目详情</a>
  </p>

  {{#if CUSTOM_MESSAGE}}
  <div style="background: #f3f4f6; border-radius: 6px; padding: 16px; margin-top: 16px;">
    <p style="margin: 0; font-size: 14px; color: #374151;">📝 补充说明：{{CUSTOM_MESSAGE}}</p>
  </div>
  {{/if}}

  <div class="footer">
    <p>您收到此邮件是因为您订阅了 Openday 的申请通知服务。</p>
    <p><a href="{{UNSUB_URL}}" style="color: #999;">退订通知</a> · <a href="{{SITE_URL}}" style="color: #999;">访问 Openday</a></p>
  </div>
</body>
</html>
```

**变量说明：**

| 变量 | 说明 | 示例 |
|------|------|------|
| `{{PROGRAM_NAME}}` | 项目名称 | `MSc Computer Science` |
| `{{SCHOOL_NAME}}` | 学校名称 | `University of Oxford` |
| `{{COUNTRY}}` | 国家 | `英国` |
| `{{COUNTRY_FLAG}}` | 国旗 emoji | `🇬🇧` |
| `{{DEGREE}}` | 学位（中文） | `硕士` |
| `{{FIELD}}` | 专业方向 | `Computer Science` |
| `{{LANGUAGE_REQ}}` | 语言要求 | `IELTS 7.0 / TOEFL 100` |
| `{{GPA_REQ}}` | GPA 要求 | `3.5/4.0` |
| `{{FEE}}` | 申请费 | `$75` |
| `{{DEADLINE}}` | 截止日期 | `2025 年 1 月 15 日` |
| `{{DAYS_LEFT}}` | 距截止天数 | `23` |
| `{{APPLY_URL}}` | 官方申请链接 | `https://...` |
| `{{PROGRAM_DETAIL_URL}}` | 站内详情页 | `https://yourdomain.com/programs/uuid` |
| `{{CUSTOM_MESSAGE}}` | 管理员附加说明（可选） | - |
| `{{UNSUB_URL}}` | 退订链接 | `https://yourdomain.com/unsubscribe?token=uuid` |
| `{{SITE_URL}}` | 网站首页 | `https://yourdomain.com` |

---

## 3. 欢迎邮件 / Welcome Email

**触发时机：** 邮箱验证成功（`GET /api/subscriptions/verify` 验证通过后）

**主题格式：**

```
🎉 订阅成功！以下是您的偏好匹配项目
```

**HTML 正文：**

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><!-- 样式与其他邮件一致 --></head>
<body>
  <h2>🎉 订阅成功！</h2>
  <p>您好！您已成功订阅 Openday 申请开放通知。</p>
  <p>根据您的偏好（{{DEGREES}} · {{FIELDS}} · {{COUNTRIES}}），</p>
  <p>目前有 <strong>{{MATCH_COUNT}} 个项目</strong>与您的偏好匹配，其中 <strong>{{OPEN_COUNT}} 个</strong>目前申请开放：</p>

  {{#if OPEN_PROGRAMS}}
  <h3>🟢 当前开放的匹配项目</h3>
  {{#each OPEN_PROGRAMS}}
  <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; margin: 8px 0;">
    <strong>{{this.name}}</strong> — {{this.school}} ({{this.country}})<br>
    <small style="color: #6b7280;">截止：{{this.deadline}} · <a href="{{this.applyUrl}}">申请链接</a></small>
  </div>
  {{/each}}
  {{/if}}

  <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
    当有新项目开放时，我们会第一时间发送通知到您的邮箱。
  </p>

  <div class="footer">
    <p><a href="{{UNSUB_URL}}">退订通知</a> · <a href="{{SITE_URL}}">访问 Openday</a></p>
  </div>
</body>
</html>
```

**变量说明：**

| 变量 | 说明 |
|------|------|
| `{{DEGREES}}` | 订阅的学位偏好（中文，逗号分隔） |
| `{{FIELDS}}` | 订阅的专业偏好（逗号分隔） |
| `{{COUNTRIES}}` | 订阅的国家偏好（逗号分隔） |
| `{{MATCH_COUNT}}` | 匹配项目总数 |
| `{{OPEN_COUNT}}` | 当前开放的匹配项目数 |
| `{{OPEN_PROGRAMS}}` | 当前开放项目列表（数组，最多展示 5 条） |
| `{{UNSUB_URL}}` | 退订链接 |
| `{{SITE_URL}}` | 网站首页 |

---

## 4. 退订确认邮件 / Unsubscribe Confirmation Email

**触发时机：** 用户成功退订（`DELETE /api/subscriptions/unsubscribe`）

**主题格式：**

```
您已成功退订 Openday 通知
```

**HTML 正文：**

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
  <h2>退订成功</h2>
  <p>您好，</p>
  <p>您已成功退订 Openday 的申请开放通知。我们不会再向 <strong>{{EMAIL}}</strong> 发送任何通知邮件。</p>
  <p>如果您是误操作，可以随时重新访问 <a href="{{SITE_URL}}/subscribe">Openday 订阅页面</a> 重新订阅。</p>
  <p style="margin-top: 32px; font-size: 12px; color: #999;">
    此邮件由 Openday 自动发送。
  </p>
</body>
</html>
```

**变量说明：**

| 变量 | 说明 |
|------|------|
| `{{EMAIL}}` | 已退订的邮箱地址 |
| `{{SITE_URL}}` | 网站首页 |

---

## 邮件发送实现说明 / Implementation Notes

### Nodemailer 配置

```typescript
// lib/email/index.ts
import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmail({
  to, subject, html, text
}: {
  to: string
  subject: string
  html: string
  text?: string
}) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Openday <noreply@example.com>',
    to,
    subject,
    html,
    text,
  })
}
```

### 模板渲染

推荐使用简单的字符串替换或轻量模板库（如 `mustache`）渲染上述模板中的 `{{变量}}` 占位符。无需引入完整的模板引擎。
