<div align="center">

# Openday

**专为申请海外研究生的中国学生打造的全流程申请助手。**

从浏览项目、追踪截止时间、到管理申请进度、沉淀申请材料，Openday 陪你走完整个申请季。

[在线演示](#) · [提交 Bug](https://github.com/your-org/openday/issues) · [功能建议](https://github.com/your-org/openday/issues)

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)

</div>

---

## 产品简介

每年申请季，学生要同时追踪几十个项目的开放时间、整理申请材料、记录每所学校的进度 —— 信息散落在无数个网页书签和 Excel 表格里。

**Openday** 把这些事情合并到一个地方：

- **知道该申请哪些** — 浏览 200+ 个 QS Top 200 院校的热门项目，按国家、学位、专业一键筛选
- **不错过任何开放** — 订阅目标项目偏好，申请窗口开放时 1 小时内邮件提醒
- **管理整个申请季** — 用看板追踪每个学校的申请进度，从"规划中"到"拿到结果"
- **沉淀申请材料** — 在个人档案里记录实习经历和论文发表，随时调取

---

## 核心功能

### 项目发现

| 功能 | 描述 |
|---|---|
| **多维筛选** | 按国家（美/英/澳/加等）、学位层级（本/硕/博）、专业方向、申请状态筛选 |
| **全文搜索** | 按学校名或项目名搜索 |
| **申请状态标识** | 实时显示 Open / Closed / Coming Soon 状态 |
| **项目详情页** | 截止日期倒计时、语言要求、GPA 门槛、申请费用、官方申请链接、相关项目推荐 |

### 申请提醒

| 功能 | 描述 |
|---|---|
| **邮件订阅** | 填写邮箱，设置学位 / 专业 / 国家偏好，完成订阅 |
| **1 小时内推送** | 申请窗口开放后即时触发，3 维度偏好 AND 匹配精准推送 |
| **随时退订** | 一键退订，无障碍 |

### 个人主页 (My Page)

| 功能 | 描述 |
|---|---|
| **申请看板** | 四列拖拽式看板：规划中 → 准备中 → 已提交 → 出结果；底部实时统计 Offer 数 |
| **学术背景档案** | 记录当前学位、学校、专业、GPA、排名、雅思 / 托福、GRE / GMAT |
| **实习经历管理** | 添加 / 编辑 / 删除实习记录，含公司、职位、时间、描述、技能标签 |
| **论文 & 研究** | 记录发表论文，含作者顺序、会议 / 期刊、年份、标签 |
| **订阅偏好** | 直接跳转修改订阅偏好或退订 |

### 管理后台

| 功能 | 描述 |
|---|---|
| **项目管理** | 新建、编辑、删除项目，管理全字段申请要求 |
| **订阅管理** | 查看所有订阅者及其偏好设置 |

---

## 技术栈

| 层级 | 技术 |
|---|---|
| 框架 | [Next.js 16](https://nextjs.org)（App Router） |
| 语言 | TypeScript 5 |
| 样式 | Tailwind CSS v4 |
| 运行时 | React 19 |
| 包管理 | pnpm |

---

## 快速开始

### 环境要求

- Node.js 18+
- pnpm 9+

### 安装

```bash
# 克隆仓库
git clone https://github.com/your-org/openday.git
cd openday

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

开发模式访问个人主页：[http://localhost:3000/my?token=dev](http://localhost:3000/my?token=dev)

### 常用命令

```bash
pnpm dev      # 启动开发服务器（支持热更新）
pnpm build    # 构建生产版本
pnpm start    # 启动生产服务器
pnpm lint     # 运行 ESLint 检查
```

---

## 项目结构

```
openday/
├── app/
│   ├── page.tsx                  # 首页：项目列表 + 筛选 + 订阅入口
│   ├── programs/[id]/            # 项目详情页
│   ├── subscribe/                # 订阅流程（邮箱输入 → 偏好设置 → 验证）
│   ├── unsubscribe/              # 退订页
│   ├── my/                       # 个人主页（看板 + 档案）
│   └── admin/                    # 管理后台（项目 + 订阅管理）
├── components/
│   ├── FilterBar.tsx             # 筛选栏
│   ├── ProgramCard.tsx           # 项目卡片
│   ├── CountdownTimer.tsx        # 倒计时组件
│   ├── StatusBadge.tsx           # 申请状态标识
│   └── Pagination.tsx            # 分页组件
├── lib/
│   ├── mock-data.ts              # 项目数据（MVP 阶段）
│   ├── storage.ts                # localStorage 读写（看板/档案）
│   └── types.ts                  # TypeScript 类型定义
└── public/                       # 静态资源
```

---

## 开发计划

**P0 — MVP（当前阶段）**

- [x] 项目数据库浏览（筛选、搜索、分页）
- [x] 项目详情页（倒计时、申请要求、相关推荐）
- [x] 邮件订阅 + 偏好设置
- [x] 个人主页：申请看板（4列 + 统计）
- [x] 个人主页：学术背景档案
- [x] 个人主页：实习经历 & 论文管理
- [ ] 申请开放邮件通知（后端触发，1 小时内推送）
- [ ] 项目数据库对接真实数据源（200 个项目）

**P1 — 后续迭代**

- [ ] 看板内程序添加（从项目列表直接加入看板）
- [ ] 移动端推送通知
- [ ] 申请 Deadline 日历视图
- [ ] 社区问答（每个项目下的 Q&A）

---

## 参与贡献

欢迎提交 Issue 和 Pull Request。查看 [Issues 页面](https://github.com/your-org/openday/issues) 了解当前待解决的问题。

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feat/amazing-feature`)
3. 提交变更 (`git commit -m 'feat: 添加某个新功能'`)
4. 推送分支 (`git push origin feat/amazing-feature`)
5. 发起 Pull Request

---

## 开源协议

基于 MIT 协议开源，详见 `LICENSE`。

---

<div align="center">

为每一位正在探索海外申请之路的同学而建。

</div>
