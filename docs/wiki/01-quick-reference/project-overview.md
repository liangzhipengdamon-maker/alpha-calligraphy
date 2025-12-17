# 项目概述

## 📌 项目信息

**项目名称**: 名师手把手（Master's HandGuid AI）
**原项目名**: 墨韵智师（InkMaster AI）
**项目类型**: React 18 + TypeScript + Vite SPA
**项目定位**: K12学生的AI硬笔书法教学与评估系统
**版本**: 0.1.0 Alpha
**最后更新**: 2025-12-04

## 🎯 项目愿景

通过**AI视觉分析技术**，为硬笔书法学习者提供：

- ✅ **实时评估**: AI秒级分析笔画质量
- ✅ **多维反馈**: 四维评分体系全面评价
- ✅ **个性指导**: 基于评分的智能建议
- ✅ **循序渐进**: Phase规划化学习路径

## 🧠 MVP核心功能（Phase 1）

### AI硬笔评估系统

基于**Gemini 2.0 Flash Vision API**的四维评分体系：

| 维度 | 权重 | 评估内容 |
|------|------|---------|
| **笔画质量** | 25% | 线条流畅性、笔力表现 |
| **结构分析** | 35% | 字形比例、部件协调 |
| **笔画连接** | 15% | 笔画呼应、转折自然 |
| **整体评价** | 25% | 风格统一、审美表现 |

### 评估流程

```
用户上传字迹图片
        ↓
    AR透台预览
    (实时对比范字)
        ↓
   AI分析评估
  (Gemini API)
        ↓
  生成评估报告
(四维评分 + 建议)
        ↓
  展示改进方案
  (教学建议)
```

## 📊 技术栈

### 前端框架
- **React 18.2**: 现代化UI构建、并发渲染
- **TypeScript 5.2**: 严格类型检查、代码安全
- **Vite 4.5**: 极速开发构建（<100ms HMR）
- **Tailwind CSS 3.3**: 原子化样式、响应式设计

### 状态管理
- **Zustand 4.4**: 轻量级全局状态
- **React Hooks**: useState、useEffect、useContext等

### 动画与交互
- **GSAP 3.12**: 高性能动画库
- **@use-gesture/react 10.3**: React手势识别

### 后端服务
- **Firebase 10.4**: Firestore(新加坡) + Storage(美国)
- **Gemini 2.0 Flash**: AI视觉分析

### 开发工具
- **Vitest 0.34**: 单元测试
- **Playwright 1.39**: 端到端测试
- **ESLint + Prettier**: 代码检查与格式化

## 🗓️ 开发阶段规划

### Phase 1: MVP-AI评估（1-2周）✅ 进行中
- 评估页面设计（多邻国风格）
- 图片上传与处理
- AR透台实时预览
- Gemini API集成
- 四维评分系统实现
- 评估报告生成与展示

### Phase 2: 笔顺增强（1-2月）⏳ 规划中
- 笔顺检测算法
- 笔画顺序纠正
- 笔顺教学动画
- 练习进度追踪

### Phase 3: AlphaCalligraphy强化学习（6-12月）📋 长期规划
- 自监督学习模型
- 个性化评估权重
- AI教学内容生成
- 社区互动功能

## 👥 命名规范

### 项目前缀
- **项目官方名**: 名师手把手 / Master's HandGuid AI
- **代码前缀**: `MSS`（Master's HandGuid Smart System）
- **环境变量前缀**: `VITE_MSS_` 或 `VITE_`

### 代码标识符命名

```typescript
// 组件名（PascalCase）
<MSSEvaluationPage />
<MSSARLightBox />
<MSSScoreCard />

// 服务类（PascalCase）
MSSEvaluationService
MSSFirebaseService
MSSImageService

// 常量（UPPER_SNAKE_CASE）
SCORING_WEIGHTS
MAX_IMAGE_SIZE
EVALUATION_DIMENSIONS
```

### 文件命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| React组件 | PascalCase | `EvaluationPage.tsx` |
| 工具函数 | camelCase | `calculateScore.ts` |
| 常量文件 | UPPER_SNAKE_CASE | `SCORING_WEIGHTS.ts` |
| 测试文件 | *.spec.ts | `calculateScore.spec.ts` |

## 📁 项目目录结构

```
inkmaster-ai/
├── src/
│   ├── components/          # React组件库
│   ├── pages/              # 页面组件
│   ├── services/           # 业务逻辑服务
│   ├── hooks/              # 自定义Hooks
│   ├── types/              # TypeScript类型
│   ├── styles/             # 全局样式
│   ├── App.tsx             # 主组件
│   └── main.tsx            # 入口
├── docs/
│   └── wiki/               # Wiki文档库（36个文档）
├── dist/                   # 构建输出
├── public/                 # 静态资源
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🔗 重要链接

| 资源 | URL |
|------|-----|
| Gemini API | https://aistudio.google.com/apikey |
| Firebase Console | https://console.firebase.google.com |
| Project Wiki | ./docs/wiki/README.md |

## 🎓 快速导航

- **新人入门**: [快速开始](quick-start.md)
- **开发规范**: [开发规范](development-spec.md)
- **常见问题**: [FAQ](faq.md)

---

**项目维护**: InkMaster Team
**更新日期**: 2025-12-04
**许可证**: MIT
