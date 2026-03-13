// lib/dev-seed.ts
// Seed data for the dev@example.com account. Used only in development
// when localStorage has no existing profile/kanban data.

import type { UserProfile, ApplicationRecord } from './types'

export const DEV_EMAIL = 'dev@example.com'

export const devProfile: UserProfile = {
  email: DEV_EMAIL,
  currentDegree: '本科在读',
  school: '上海交通大学',
  major: '计算机科学与技术',
  targetYear: '2026 Fall',
  gpa: '3.72',
  rank: 'Top 15%',
  ielts: '7.0',
  toefl: undefined,
  gre: '326',
  gmat: undefined,
  internships: [
    {
      id: 'i1',
      company: '字节跳动',
      role: '后端开发实习生',
      department: '推荐算法组',
      startDate: '2025.07',
      endDate: '2025.09',
      description: '参与千万级 DAU 推荐系统重构，优化 Golang 微服务吞吐量约 18%；负责 A/B 测试框架搭建。',
      tags: ['Golang', 'Kafka', 'Redis', 'A/B Testing'],
    },
    {
      id: 'i2',
      company: '微软亚洲研究院',
      role: '研究实习生',
      department: 'Natural Language Computing',
      startDate: '2024.12',
      endDate: '2025.03',
      description: '协助研究员完成大模型 instruction tuning 实验，整理并清洗 50k 条中英文对齐数据集。',
      tags: ['Python', 'PyTorch', 'LLM', 'NLP'],
    },
  ],
  papers: [
    {
      id: 'p1',
      title: 'Efficient Retrieval-Augmented Generation via Hierarchical Chunk Compression',
      authorOrder: '第一作者',
      venue: 'ACL 2025',
      year: 2025,
      tags: ['RAG', 'NLP', 'LLM'],
    },
  ],
}

export const devKanban: ApplicationRecord[] = [
  {
    id: 'k1',
    programId: '1',
    email: DEV_EMAIL,
    status: 'preparing',
    materials: [
      { name: 'SOP', done: true },
      { name: '推荐信 ×3', done: false },
      { name: '成绩单', done: true },
      { name: 'CV', done: true },
    ],
  },
  {
    id: 'k2',
    programId: '3',
    email: DEV_EMAIL,
    status: 'submitted',
    submittedAt: '2026-01-15',
    materials: [
      { name: 'SOP', done: true },
      { name: '推荐信 ×3', done: true },
      { name: '成绩单', done: true },
      { name: 'Writing Sample', done: true },
    ],
  },
  {
    id: 'k3',
    programId: '5',
    email: DEV_EMAIL,
    status: 'result',
    result: 'offer',
    submittedAt: '2025-12-20',
    resultAt: '2026-02-28',
    materials: [
      { name: 'SOP', done: true },
      { name: '推荐信 ×2', done: true },
    ],
  },
  {
    id: 'k4',
    programId: '7',
    email: DEV_EMAIL,
    status: 'planning',
    materials: [
      { name: 'SOP', done: false },
      { name: '推荐信 ×3', done: false },
      { name: 'Portfolio', done: false },
    ],
  },
  {
    id: 'k5',
    programId: '9',
    email: DEV_EMAIL,
    status: 'result',
    result: 'waitlist',
    submittedAt: '2026-01-05',
    resultAt: '2026-03-10',
    materials: [
      { name: 'SOP', done: true },
      { name: '推荐信 ×3', done: true },
    ],
  },
]
