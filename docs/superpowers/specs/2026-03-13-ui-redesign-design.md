# Openday UI Redesign — Design Spec

**Date:** 2026-03-13
**Status:** Approved
**Scope:** Full site redesign — all user-facing pages + admin

---

## Context

Openday 当前 UI 是标准的蓝色/白色现代风格（卡片、圆角、标准无衬线字体）。本次重构参考「系统存档美学」（System Archive Aesthetic）设计语言，全站统一为**浅色系统美学**风格，作为未来所有前端开发的视觉参考基准。

目标：让界面传达出数据系统的严肃感和技术精度，同时保持对中国学生用户的可读性。

---

## Design Language

### 核心原则

| 原则 | 描述 |
|------|------|
| **System Identity** | 界面语言来自系统/档案，而非消费产品 |
| **Monospace-first** | 标签、状态码、数字、导航编号全用等宽字体 |
| **Grid Structure** | 用 1px 边框网格取代圆角卡片，元素通过线条而非阴影分隔 |
| **Typography Contrast** | 等宽字体（技术元数据）与无衬线字体（中文正文）形成对比 |
| **Muted Palette** | 米白底 `#f5f4f0`，深灰底 `#ece9e0`，主文字 `#1a1a1a` |
| **No Emoji** | 全站移除所有 emoji（国旗、图标等），替换为 ISO 国家代码或文字标签 |

### 颜色系统

```
背景主色:    #f5f4f0  (米白，替代纯白)
背景次色:    #ece9e0  (浅灰米，用于 filter bar、左侧面板、悬停)
主文字:      #1a1a1a  (近黑)
次文字:      #888888  (中灰，标签/元数据)
辅助文字:    #bbbbbb  (极浅灰，REF编号、占位符)
分割线:      #cccccc  (浅灰边框)
深色反转:    #1a1a1a 背景 + #f5f4f0 文字（Header 黑色块、Subscribe Banner）
强调蓝:      #2563eb  (主要按钮、链接)
开放绿:      #16a34a  (OPEN badge 文字和边框)
截止橙:      #e85d04  (倒计时、紧迫状态)
待确认黄:    #d97706  (PENDING badge)
关闭灰:      #888888  (CLOSED badge)
```

**深色模式:** 本设计系统为纯浅色主题，`globals.css` 中需删除 `@media (prefers-color-scheme: dark)` 覆盖规则，避免系统暗色模式干扰界面。

### 字体策略

**字体加载:** 移除 `layout.tsx` 中现有的 `next/font/google` Geist 字体导入（`Geist` 和 `Geist_Mono`）及相关 CSS 变量注入，全部使用系统字体。

`<body>` className 改为 `font-mono antialiased`（等宽为全局默认字体，无衬线在需要中文正文的组件内通过 `font-sans` class 单独指定）。

```
等宽字体 (monospace): 'Courier New', 'Menlo', monospace
  → 用途: 系统标签(SYS_REF)、导航编号(01.)、状态码(OPEN/CLOSED)
           数字统计、时间戳、REF编号、按钮文字、badge、body 默认字体

无衬线字体 (sans-serif): -apple-system, 'PingFang SC', sans-serif
  → 用途: 中文正文、项目描述、中文标签（通过 className 指定，非全局默认）

等宽大标题: 'Courier New' + font-weight: 900 + letter-spacing: -1px~-2px
  → 用途: Hero 标题、页面主标题
```

### 间距与边框

- 元素间距用 **1px 边框网格**，不用阴影
- 所有按钮、输入框、badge：**无圆角**（`border-radius: 0`，覆盖 Tailwind 默认）
- 卡片网格技术：`display: grid; gap: 1px; background: #ccc` — gap 本身显示为灰线，卡片背景 `#f5f4f0` 遮住灰色形成分隔线效果
- 悬停效果：背景变 `#ece9e0`，无 box-shadow

### 交互状态

| 元素 | 默认 | 悬停 | 选中/激活 | Focus |
|------|------|------|-----------|-------|
| 按钮（主要） | `#2563eb` 背景 | 加深至 `#1d4ed8` | — | `outline: 2px solid #2563eb; outline-offset: 2px` |
| Chip/Filter | `#f5f4f0` 背景，`#ccc` 边框 | `#ece9e0` 背景，`#888` 边框 | `#1a1a1a` 背景，白色文字 | outline |
| 程序卡片 | `#f5f4f0` | `#ece9e0` | — | outline |
| 按钮（outline） | 透明背景，`#1a1a1a` 边框 | `#ece9e0` 背景 | — | outline |

---

## 设计令牌（Tailwind v4 集成方式）

Tailwind v4 通过 CSS 文件中的 `@theme` 块注册设计令牌。**完整替换 `globals.css`** 为以下内容（删除旧 `:root` 块、`@theme inline` 块、`body` 规则、暗色模式 `@media` 块）：

```css
/* globals.css */
@import "tailwindcss";

@theme {
  /* 颜色 */
  --color-bg-primary: #f5f4f0;
  --color-bg-secondary: #ece9e0;
  --color-bg-inverse: #1a1a1a;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #888888;
  --color-text-muted: #bbbbbb;
  --color-text-inverse: #f5f4f0;
  --color-border: #cccccc;        /* bg-border = 网格线颜色，intentional */
  --color-border-light: #e5e5e5;  /* 用于卡片内部分隔线（截止日期行上方）*/
  --color-accent-blue: #2563eb;
  --color-accent-blue-dark: #1d4ed8;
  --color-accent-green: #16a34a;
  --color-accent-orange: #e85d04;
  --color-accent-yellow: #d97706;

  /* 字体 */
  --font-mono: 'Courier New', 'Menlo', monospace;
  --font-sans: -apple-system, 'PingFang SC', sans-serif;
}

/* 全局 body 默认字体为等宽，背景为米白 */
body {
  background-color: #f5f4f0;
  font-family: 'Courier New', 'Menlo', monospace;
  color: #1a1a1a;
}
```

> **注意:** 不保留任何旧内容 — 删除旧 `:root { --background / --foreground }`、`@theme inline` 块、原来的 `body` 规则（含 Geist 字体引用）、以及 `@media (prefers-color-scheme: dark)` 块。

这样组件可以使用 Tailwind utility class 如 `bg-bg-primary`、`text-accent-blue`、`border-border`、`bg-border`（网格容器背景色）等。

---

## Status 类型更新

当前 `lib/types.ts` 中 `ProgramStatus = 'open' | 'closed' | 'unknown'`。

**`unknown` 重命名为 `pending`**（仅 UI 显示标签变化，逻辑不变）：
- 类型定义: `'open' | 'closed' | 'pending'`
- Badge 显示: `OPEN` / `CLOSED` / `PENDING`
- 现有数据中的 `'unknown'` 值需在 mock 数据和相关 switch/if 中同步更新

---

## 全站共享组件规范

### MetaBar（新增组件 `components/MetaBar.tsx`）

服务端组件，在 `app/layout.tsx` 中渲染于 `<Header />` 之上：

```
背景: #1a1a1a | 高度: ~28px
左: SYS_REF // OPENDAY_PLATFORM · PROTOCOL: PUB-01
右: CORE ● ONLINE · 当前日期（格式: YYYY.MM.DD.DAY，服务端渲染）
字号: 10px | letter-spacing: 1.5px | 颜色: #555
● 颜色: #4ade80（绿色状态点）
```

### Header（更新 `components/Header.tsx`）

```
背景: bg-bg-primary | 底边: 2px solid #1a1a1a
Logo: "OPENDAY" 等宽粗体，"DAY" 用 text-accent-blue
导航链接: 数字编号 "01. PROGRAMS / 02. SUBSCRIBE / 03. HOW IT WORKS"
  字号 10px，letter-spacing 1.5px，右侧 1px border 分隔，无圆角
  激活态: bg-bg-secondary
右侧: "SUBSCRIBE →" 蓝色实心按钮，无圆角
```

### ProgramCard（更新 `components/ProgramCard.tsx`）

```
网格容器（由父级页面控制）: grid grid-cols-3 gap-px bg-border
卡片: bg-bg-primary hover:bg-bg-secondary，无圆角，无 shadow
结构:
  [REF_编号 // 国家代码]   ← 9px text-muted 等宽
  [校名大写]               ← 11px 加粗等宽
  [项目名称]               ← 12px 无衬线中文，text-text-secondary
  [Badge行: 状态 + 学位 + 专业]
  [底部: 截止日期 | 倒计时天数(橙红加粗)]
```

### StatusBadge（更新 `components/StatusBadge.tsx`）

```
无圆角，border: 1px solid，padding: 2px 6px
字体: 等宽，9px，letter-spacing: 1px，大写英文
OPEN:    text-accent-green / border-accent-green / bg-green-50
CLOSED:  text-text-secondary / border-border
PENDING: text-accent-yellow / border-yellow-300 / bg-yellow-50
```

### FilterBar（更新 `components/FilterBar.tsx`）

**结构变更:** 将现有 `<select>` 下拉框改为 chip 按钮组（完整重写 JSX 结构，保留现有 state 逻辑）。

```
背景: bg-bg-secondary | 底边: 1px border-border
左: "FILTER //" 标签（9px letter-spacing 2px text-muted）
Chip 按钮: 无圆角，1px 边框，等宽 10px
  默认: bg-bg-primary border-border text-text-secondary
  悬停: bg-bg-secondary border-text-secondary
  选中: bg-bg-inverse text-text-inverse border-bg-inverse
右: 搜索输入框（无圆角，1px border，bg-white）
移除 🔍 emoji，替换为纯文字
重置按钮: "RESET" 文字按钮（无圆角，text-text-secondary，hover: text-text-primary）
```

### CountdownTimer（更新 `components/CountdownTimer.tsx`）

保留 `'use client'` 结构不变，更新样式：
```
已截止: "已截止" 纯文字，text-text-secondary
进行中: "X DAYS" 橙红加粗（text-accent-orange font-bold）
格式统一: "14 DAYS" 而非 "14天"
```

### Pagination（更新 `components/Pagination.tsx`）

```
容器: 无圆角，inline flex，1px border 外框
每个按钮: 无圆角，border-right: 1px，px-3 py-2
激活页: bg-bg-inverse text-text-inverse
悬停: bg-bg-secondary
```

### Footer（更新 `components/Footer.tsx`）

```
背景: bg-bg-inverse | 文字: text-text-inverse
内容: SYS_REF // OPENDAY · © 2026 · PROTOCOL: PUB-01
字体: 等宽，10px，letter-spacing 1.5px，颜色 #555
```

---

## 页面规范

### 主页 (`app/page.tsx`)

**布局（从上到下）:**
1. MetaBar（layout.tsx 全局注入）
2. Header（layout.tsx 全局注入）
3. Hero 区（双栏）
   - 左: `SYS_REF` 小标签 → 大标题（36px 等宽 900 weight）→ 中文副标题（无衬线）→ 两个按钮
   - 右: 2×2 数据格网格（PROGRAMS / OPEN_NOW / SUBSCRIBERS / LATENCY）
4. FilterBar
5. Grid Header（"PROGRAMS // N TOTAL" + 排序标签）
6. ProgramCard 网格（3列 × 4行 = 12张）
7. Subscribe Banner（黑底，左侧标题 + 右侧邮件输入 + 提交按钮）
8. Pagination

**响应式:**
- `lg:` (≥1024px): Hero 双栏，ProgramCard 3列
- `md:` (768-1023px): Hero 单栏，ProgramCard 2列
- `sm:` (<768px): 全部单栏，ProgramCard 1列，FilterBar 横向滚动

### 项目详情页 (`app/programs/[id]/page.tsx`)

**布局:**
```
Breadcrumb: PROGRAMS // [国家] // [校名] // [专业代码]（等宽，10px）
主体: lg:双栏（主内容 flex:1 | sidebar 280px）
      sm/md: 单栏（sidebar 移到主内容下方）
```

**主内容:**
1. 标题块: `REF_编号 // 国家` → 校名大写 → 项目名（无衬线）→ Badge 行
2. 三格数据条: DEADLINE / REMAINING / STATUS（1px 网格分隔）
3. 倒计时高亮块（`bg-bg-secondary`）: 橙红大数字 + 北京时间换算文字
4. 申请要求表格: 左列标签（等宽 text-muted）/ 右列数值（等宽加粗）+ 中文补充
5. 项目简介: 无衬线中文正文

**Sidebar:**
1. 申请 CTA: 截止日期 + 倒计时 + "APPLY NOW →"（蓝色）+ "SUBSCRIBE ALERTS"（outline）
2. 系统状态面板（黑底）: PORTAL / STATUS / URGENCY / UPDATED 四行
3. 相关项目列表（3条，可点击）

**`CountdownTimer` 在 sidebar 中作为 client island，detail page 本身为 server component。**

### 订阅页 (`app/subscribe/page.tsx`)

**布局: 三栏（lg+），单栏（md-）**

| 栏 | 宽度 | 内容 |
|----|------|------|
| 左栏 | 1fr | bg-bg-secondary，"NEVER MISS AN OPENING." 大标题 + 中文副标题 + 四步流程（编号 + 文字） |
| 中栏 | 480px | 黑色 header（SUBSCRIPTION SETUP）+ 表单主体 + 提交按钮 |
| 右栏 | 1fr | 系统状态面板（CORE/LATENCY/PROGRAMS/SUBSCRIBERS/ALERTS_SENT）+ 服务承诺列表 |

**表单字段（标签改为大写英文 + 中文副标题双行形式，内容变更非仅样式）:**
1. `TERMINAL_ID // EMAIL` + 副标题「邮箱地址」（文本输入，无圆角）
2. `DEGREE_LEVEL //` + 副标题「学位层级」（chip 多选: MASTER / PHD / BACHELOR）
3. `FIELD_OF_STUDY //` + 副标题「专业方向，最多5个」（chip 多选: CS / AI·ML / EE / DS / HCI / FINANCE / BIO / MECH）
4. `TARGET_COUNTRY //` + 副标题「目标国家，最多3个」（chip 多选: USA / UK / CA / AU / SG / DE）
   > 国家列表与 FilterBar 保持一致，统一为: USA / UK / AU / CA / SG / DE（无 HK，当前代码无此选项）

**移动端响应式:** 三栏折叠为单栏，左右信息栏折叠（可隐藏或移到表单下方）。

### 邮箱验证页 (`app/subscribe/verify/page.tsx`)

保持单列居中布局，应用设计令牌：系统风格标题（"CONNECTION VERIFIED"）+ 等宽确认文字。无结构性变化。

### 取消订阅页 (`app/unsubscribe/page.tsx`)

保持单列居中布局，应用设计令牌：系统风格标题 + 等宽文字确认信息。无结构性变化。

### Admin 后台 (`app/admin/**`)

不做结构性重构，应用设计令牌：
- 背景色: `bg-bg-primary` / `bg-bg-secondary`
- 表格: 移除圆角，边框改用 `border-border`，无 shadow
- 按钮: 移除圆角
- Sidebar 导航: 等宽字体，无圆角激活态 `bg-bg-secondary`
- 表单输入: 无圆角

---

## 实施策略：设计令牌先行

**执行顺序（每步可独立 commit）:**

1. **`globals.css`** — 更新 `@theme` 块，删除暗色模式覆盖，移除旧 CSS 变量
2. **`app/layout.tsx`** — 移除 Geist 字体导入，添加 `<MetaBar />`，更新 `<body>` 字体 class
3. **`lib/types.ts`** — `'unknown'` → `'pending'`，同步更新 `lib/mock-data.ts` 及所有 switch/if（先改类型再改组件，避免 TS 构建错误）
4. **共享组件** — `MetaBar`（新建）→ `Header` → `Footer` → `StatusBadge` → `ProgramCard` → `FilterBar` → `Pagination` → `CountdownTimer`
5. **主页** (`app/page.tsx`) — Hero + Grid + Subscribe Banner
6. **详情页** (`app/programs/[id]/page.tsx`) — 双栏布局 + 倒计时 client island
7. **订阅页** (`app/subscribe/page.tsx`) — 三栏布局 + chip 选择器
8. **邮箱验证页** (`app/subscribe/verify/page.tsx`) — 令牌应用
9. **取消订阅页** (`app/unsubscribe/page.tsx`) — 令牌应用
10. **Admin 页面** (`app/admin/**`) — 令牌应用，无结构变更

---

## 无障碍注意事项

- 9px–10px 小字（meta bar、badge）颜色需通过 WCAG AA 对比度（4.5:1 以上）
- 深色底（`#1a1a1a`）上的次要文字使用 `#757575`（WCAG AA 最低合规值，对比度 4.5:1）而非 `#555`（3.5:1，不合规）。MetaBar 的系统元数据文字（纯装饰性）可酌情使用 `#666`，但需接受 WCAG 例外
- 所有交互元素保留 `focus-visible` outline（`outline: 2px solid #2563eb; outline-offset: 2px`）
- Badge 的 `aria-label` 保持中文描述（如 `aria-label="申请开放"`）即使显示文字为英文

---

## 验证方式

```bash
pnpm dev      # 启动开发服务器，逐页目测验证
pnpm build    # 确保无 TypeScript/构建错误
pnpm lint     # 确保无 lint 错误
```

逐页检查清单：
- [ ] MetaBar 在所有页面顶部显示，日期正确
- [ ] Header 数字编号导航，Logo 蓝色 "DAY"，无圆角按钮
- [ ] 主页 Hero 双栏（桌面）/单栏（移动端）
- [ ] ProgramCard 网格线分隔（gap-px + bg-border 技术），无圆角，无 shadow
- [ ] Badge 无圆角，等宽字体，OPEN/CLOSED/PENDING 颜色正确
- [ ] 全站无 emoji（国旗等已替换为文字）
- [ ] FilterBar chip 按钮（非 select 下拉），选中态黑底白字
- [ ] 主页 Subscribe Banner 黑底，邮件输入正常
- [ ] 详情页 sidebar + 倒计时橙红色显示
- [ ] 订阅页三栏布局（桌面），chip 多选交互
- [ ] 暗色模式不触发旧的背景色覆盖（macOS 系统深色模式下测试）
- [ ] `pnpm build` 无 TypeScript 错误
