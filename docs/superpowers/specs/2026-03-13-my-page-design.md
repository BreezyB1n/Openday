# My Page — UI/UX Design Spec

**Date:** 2026-03-13
**Status:** Approved
**Project:** Openday (海外留学生申请开放通知平台)

---

## 1. Context

用户订阅项目偏好后，需要一个统一的个人中心来管理：自己的学术背景信息、当前订阅偏好、以及申请进度追踪。My Page 是 Openday 的个人中心页面，目标是让用户在一个页面内完成"了解自己的竞争力 → 追踪申请进度 → 管理通知偏好"的全流程。

---

## 2. 访问方式与鉴权

**混合方案**：UI 设计完整，认证逻辑作为 placeholder 后续接入。

- 导航栏新增 `03. MY_PAGE` 入口（延续现有 `01. PROGRAMS` / `02. SUBSCRIBE` 命名规范）
- MVP 阶段：通过邮件 token 链接访问，路径为 `/my?token=xxx`（与现有 unsubscribe 页面相同模式）
- 后续：接入邮箱 + 密码登录系统（P0 模块）

### Token 错误状态

与 `app/unsubscribe/page.tsx` 保持一致，需处理三种异常：

| 状态 | 显示内容 |
|------|---------|
| token 缺失（直接访问 `/my`） | `ACCESS_DENIED // 请通过邮件中的链接访问` |
| token 无效（不存在） | `INVALID_TOKEN // 链接无效，请重新订阅` |
| token 已过期 | `TOKEN_EXPIRED // 链接已过期，请重新从邮件进入` |

以上错误状态均居中展示，提供返回首页的链接。

---

## 3. 整体布局

### 桌面端（lg 及以上）

**两栏布局**。My Page 不使用全局 `<Footer>`，在 `app/my/layout.tsx` 中返回不含 Footer 的页面结构：

```
┌─────────────────────────────────────────────────────────┐
│  MetaBar + Header（由根 layout 渲染，sticky）            │
├──────────────────┬──────────────────────────────────────┤
│  LEFT SIDEBAR    │  RIGHT: KANBAN                       │
│  320px 固定宽    │  flex-1                              │
│  overflow-y:auto │  overflow-y:auto                     │
│  两栏高度用       │  CSS var(--content-height) 控制      │
└──────────────────┴──────────────────────────────────────┘
```

- **Footer 处理**：`app/my/layout.tsx` 作为嵌套 layout，通过在 `app/my/page.tsx` 中使用 `overflow-hidden` 的全屏容器实现两栏独立滚动；根 layout 的 Footer 因内容区高度撑满视口而自然不可见（不删除 Footer，避免破坏其他页面）
- **列高方案**：两栏均使用 Tailwind class `h-[calc(100svh-var(--header-h))]`，同时在根 layout 中通过 inline style 将实际渲染高度写入 `--header-h` CSS 变量；MVP 阶段可先用固定值 `h-[calc(100svh-72px)]` 加 `overflow-hidden` 兜底，防止精度误差导致双滚动条
- 左右两栏均独立滚动，互不影响

### 移动端（lg 以下）

单栏堆叠布局，从上到下：
1. 用户身份栏
2. 学术背景（折叠/展开）
3. 实习经历（折叠/展开）
4. 科研论文（折叠/展开）
5. 订阅偏好
6. 申请看板（全宽，列横向可滚动）

MVP 阶段移动端看板列使用 `overflow-x: auto` 横向滚动，不做折叠处理。

---

## 4. 左侧边栏（Profile + Subscriptions）

### 4.1 用户身份栏（顶部深色）

```
┌─────────────────────────────────┐
│  [ZB]  zhangbin@example.com     │  ← 黑底白字
│        SUBSCRIBER SINCE 2025-09 │
└─────────────────────────────────┘
```

- 头像区：邮箱首字母缩写（无需上传图片）
- 订阅时间来源：复用 `Subscription.createdAt`（不在 UserProfile 中重复存储）

---

### 4.2 学术背景（ACADEMIC_BACKGROUND）

2×2 数据格展示基础字段：

| 字段 | 说明 |
|------|------|
| CURRENT DEGREE | 当前学历（MSc / BSc 等） |
| SCHOOL | 就读院校 |
| MAJOR | 专业 |
| TARGET YEAR | 目标入学年份（如 2026 Fall） |
| GPA | 绩点（如 3.8 / 4.0） |
| RANK | 排名（如 Top 10%） |
| IELTS / TOEFL | 语言成绩（二选一填写） |
| GRE / GMAT | 标准化考试成绩（可选填） |

底部：`[编辑]` 按钮，点击进入内联编辑模式。

---

### 4.3 实习经历（INTERNSHIP）

每条实习为一个 Entry 卡片，包含：
- 公司名称（大号字）
- 职位 · 部门
- 时间段（右对齐，YYYY.MM 格式）
- 工作描述（1-2 行，sans-serif）
- 技能标签（如 Go、Python、量化金融）

操作：`[+ 添加]` 按钮，支持多条记录。

**空状态**：显示 `暂无实习经历 — 点击添加`（灰色虚线边框占位）。

---

### 4.4 科研 & 论文（RESEARCH & PAPERS）

每条论文为一个 Entry 卡片，包含：
- 论文标题
- 作者顺序（第一作者 / 第二作者等）
- 发表年份
- 期刊/会议标签（如 ACL 2024、AAAI 2023 Workshop）
- 研究方向标签（如 NLP、GNN）

操作：`[+ 添加]` 按钮，支持多条记录。

**空状态**：显示 `暂无论文记录 — 点击添加`（灰色虚线边框占位）。

---

### 4.5 订阅偏好（SUBSCRIPTION_PREFS）

展示当前三维度偏好，支持两种操作：
- `[修改偏好]` 按钮跳转至 `/subscribe` 页面使用完整表单修改（复用现有验证逻辑：≤5 个专业方向、≤3 个国家、学位必填）
- `[退订]` 按钮（灰色，低优先级）

> **注意**：My Page 内不做 inline 编辑订阅偏好，统一跳转至 `/subscribe` 以复用验证逻辑，避免数据不一致。

| 维度 | 已选示例 |
|------|---------|
| FIELD | CS · EE |
| COUNTRY | UK · US |
| DEGREE | Masters |

---

## 5. 右侧申请看板（APPLICATION_KANBAN）

### 5.1 看板列

四列固定状态，从左到右：

| 列名 | 含义 |
|------|------|
| PLANNING | 计划申请，尚未开始准备 |
| PREPARING | 正在准备材料 |
| SUBMITTED | 已提交申请 |
| RESULT | 已收到结果 |

每列底部有 `[+ 添加]` 快捷入口。

**空状态**（列内无卡片）：
- 整体看板为空（首次访问）：显示全宽提示 `APPLICATION_KANBAN // 暂无记录 — 从项目详情页添加到看板`
- 单列为空：`[+ 添加]` 占位块即为空状态，无需额外提示

---

### 5.2 项目卡片结构

每张卡片分为四个区域：

**① 头部（学校信息）**
```
学校名称（大字）
项目名称（小字，sans-serif）
[UK]  [Masters]
```

国家使用文字 badge（与现有 `StatusBadge` 风格一致），不使用 emoji 旗帜（跨平台渲染不一致，且与系统美学不符）。

**② 匹配度（2×1 格）**
```
GPA              LANGUAGE
要求 3.5         IELTS 6.5
我 3.8 ✓         我 7.0 ✓    ← 绿色达标 / 红色不达标
```

- **数值字段规范**：`UserProfile` 中的 `gpa`、`ielts`、`toefl`、`gre`、`gmat` 均为纯数字字符串（如 `"3.8"`、`"7.0"`），UI 输入层只允许输入数字和小数点。比较前使用 `parseFloat()`，若结果为 `NaN`（用户输入异常）则显示原始文本，不显示达标/不达标标记
- **GPA 匹配**：`parseFloat(UserProfile.gpa)` 与 `Program.gpaReq`（`number | null`）比较；`gpaReq` 为 `null` 时不显示匹配格
- **语言匹配**：`Program.languageReq` 为自由文本（如 `"IELTS 6.5 / TOEFL 90"`），解析策略：
  - 检测字符串是否包含 `IELTS` → 用正则提取数值，与 `parseFloat(UserProfile.ielts)` 比较
  - 检测字符串是否包含 `TOEFL` → 用正则提取数值，与 `parseFloat(UserProfile.toefl)` 比较
  - 无法解析时：显示原始 `languageReq` 文本，不显示达标/不达标标记
- **用户未填语言成绩**：显示 `未填写` + 橙色 ✗

**③ 待补材料**
```
待补材料
[SOP] [推荐信 ×3]   ← 橙色边框，突出未完成
[成绩单̶]̶ [简历̶]̶      ← 划线置灰，已完成
```

- 材料列表由用户在添加项目到看板时手动配置，支持后续勾选
- SUBMITTED 列：标题改为"材料状态"，全部项默认已完成
- RESULT 列：隐藏材料区域

**④ 底栏（时间 + 行动）**
```
截止 2025-01-15 · 剩 27 天          [申请 →]
```

| 场景 | 颜色 | 文案 |
|------|------|------|
| 剩余 ≤30 天 | 橙色 `#e85d04` | `截止 YYYY-MM-DD · 剩 N 天` |
| 剩余 >30 天 | 灰色 `#555` | `截止 YYYY-MM-DD · 剩 N 天` |
| 已提交 | 蓝色 `#2563eb` | `已提交 YYYY-MM-DD · 等待结果` |
| OFFER | 绿色 `#16a34a` | `OFFER · YYYY-MM-DD` |
| DECLINED | 灰色 `#999` | `DECLINED · YYYY-MM-DD` |
| WAITLIST | 黄色 `#d97706` | `WAITLIST · YYYY-MM-DD` |
| RESULT 列但结果未知 | 蓝色 | `等待结果中…` |

`[申请 →]` 链接至 `Program.applyUrl`；已提交/有结果时改为 `[查看 →]`。

---

### 5.3 看板底部统计栏

```
TOTAL   IN PROGRESS   SUBMITTED   OFFERS
  6          4             1         1
```

---

### 5.4 卡片状态视觉区分

| 状态 | 视觉 |
|------|------|
| 默认（PLANNING/PREPARING） | 无特殊边线 |
| SUBMITTED | 左侧 3px 蓝色边线 |
| OFFER | 左侧 3px 绿色边线 |
| DECLINED | 左侧 3px 灰色边线 + `opacity-50` |
| WAITLIST | 左侧 3px 黄色边线 `#d97706` |

---

## 6. 设计语言（延续现有系统美学）

- **字体**：标签使用 `Courier New` monospace；正文内容使用 `-apple-system` sans-serif
- **颜色**：沿用现有 token（`#f5f4f0` 背景、`#ece9e0` 次级背景、`#1a1a1a` 强调）
- **间距**：1px gap 的网格分割，无阴影，纯边框
- **标签命名**：全大写 + 下划线（`ACADEMIC_BACKGROUND //`、`SUBSCRIPTION_PREFS //`）
- **状态色**：绿 `#16a34a`、橙 `#e85d04`、蓝 `#2563eb`、黄 `#d97706`、灰 `#999`

---

## 7. 数据模型（新增字段）

### UserProfile（新建，存储于 localStorage，key: `openday_profile_<email>`）

```ts
interface UserProfile {
  email: string
  // 学术背景
  currentDegree: string
  school: string
  major: string
  targetYear: string            // e.g. "2026 Fall"
  gpa: string                   // e.g. "3.8"（用于数值比较）
  rank?: string                 // e.g. "Top 10%"
  ielts?: string                // e.g. "7.0"
  toefl?: string                // e.g. "100"
  gre?: string                  // e.g. "320"
  gmat?: string                 // e.g. "720"
  // 经历
  internships: Internship[]
  papers: Paper[]
}

interface Internship {
  id: string
  company: string
  role: string
  department?: string
  startDate: string             // YYYY.MM
  endDate: string               // YYYY.MM
  description: string
  tags: string[]
}

interface Paper {
  id: string
  title: string
  authorOrder: string           // e.g. "第一作者"
  venue: string                 // e.g. "ACL 2024"
  year: number
  tags: string[]
}
```

### ApplicationRecord（新建，存储于 localStorage，key: `openday_kanban_<email>`）

```ts
interface ApplicationRecord {
  id: string
  programId: string             // 关联 Program.id
  email: string                 // 用于用户归属
  status: 'planning' | 'preparing' | 'submitted' | 'result'
  result?: 'offer' | 'declined' | 'waitlist'  // 仅当 status === 'result' 时有意义，其他状态下必须为 undefined
  submittedAt?: string          // ISO date，仅当 status === 'submitted' | 'result'
  resultAt?: string             // ISO date，仅当 status === 'result' 且 result 已知
  materials: MaterialItem[]
  notes?: string
}

interface MaterialItem {
  name: string                  // e.g. "SOP", "推荐信 ×3"
  done: boolean
}
```

> **MVP 持久化策略**：Profile 与 ApplicationRecord 均存储在 `localStorage`，以邮箱为 key 隔离不同用户数据。后续接入真实后端时替换为 API 调用，组件接口不变。

---

## 8. 路由与文件结构

| 路径 | 文件 | 说明 |
|------|------|------|
| `/my` | `app/my/page.tsx` | My Page 主页面（Server Component 外壳） |
| `/my` layout | `app/my/layout.tsx` | 路由级 layout，设置 `h-screen overflow-hidden` |

新增组件（放置于 `app/my/` 内）：
- `ProfileSidebar.tsx` — 左侧边栏（含 Profile、Internship、Papers、Subscriptions）
- `ApplicationKanban.tsx` — 右侧看板
- `KanbanCard.tsx` — 单张项目卡片
- `InternshipCard.tsx` — 实习条目卡片
- `PaperCard.tsx` — 论文条目卡片（两者字段差异较大，分开维护更清晰）

**开发环境 token stub**：`/my?token=dev` 为本地开发专用 bypass，跳过 token 验证直接进入页面（仅在 `process.env.NODE_ENV === 'development'` 时生效）。

---

## 9. 验证方式

1. `pnpm dev` 启动开发服务器
2. 访问 `/my`（无 token）→ 应显示 `ACCESS_DENIED` 错误状态
3. 访问 `/my?token=invalid` → 应显示 `INVALID_TOKEN` 错误状态
4. 访问 `/my?token=dev`（开发环境）→ 应显示完整 My Page 两栏布局
5. 验证桌面端左右两栏独立滚动，互不影响
6. 验证移动端（< lg）单栏堆叠，看板横向可滚动
7. 验证看板卡片匹配度颜色逻辑（达标绿色 ✓ / 不达标橙色 ✗ / 无法解析时显示原文）
8. 验证材料勾选状态（未完成橙色边框、已完成划线置灰）
9. 验证截止日期颜色（≤30天橙色、>30天灰色）
10. 验证首次访问时看板空状态提示
11. 验证订阅偏好点击 `[修改偏好]` 跳转至 `/subscribe`
