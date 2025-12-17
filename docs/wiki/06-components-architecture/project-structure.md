# 项目结构

## 📁 完整目录树

```
inkmaster-ai/
├── .github/                          # GitHub配置
│   └── workflows/
│       └── ci-cd.yml                 # CI/CD流程
│
├── .vscode/                          # VSCode配置
│   ├── settings.json                 # 编辑器设置
│   ├── extensions.json               # 推荐扩展
│   └── launch.json                   # 调试配置
│
├── docs/                             # 项目文档
│   └── wiki/                         # Wiki库（36个文件）
│       ├── README.md                 # Wiki首页
│       ├── _sidebar.md               # 导航菜单
│       ├── 01-quick-reference/       # 快速参考 (4)
│       ├── 02-phase1-ai-evaluation/  # Phase1 (5)
│       ├── 03-project-management/    # 项目管理 (3)
│       ├── 04-technical-design/      # 技术设计 (3)
│       ├── 05-development-guide/     # 开发指南 (5)
│       ├── 06-components-architecture/ # 组件架构 (3)
│       ├── 07-deployment-devops/     # 部署运维 (4)
│       ├── 08-knowledge-base/        # 知识库 (5)
│       └── 09-operations-maintenance/ # 运营维护 (4)
│
├── public/                           # 静态资源
│   ├── favicon.ico                   # 网站图标
│   ├── manifest.json                 # PWA清单
│   └── robots.txt                    # SEO配置
│
├── src/                              # 源代码
│   ├── components/                   # React组件库
│   │   ├── ARLightBox/
│   │   │   ├── ARLightBox.tsx        # AR透台组件
│   │   │   ├── ARLightBox.module.css
│   │   │   └── types.ts
│   │   │
│   │   ├── ScoreCard/
│   │   │   ├── ScoreCard.tsx         # 评分卡片
│   │   │   ├── ScoreCard.module.css
│   │   │   └── index.ts
│   │   │
│   │   ├── SuggestionPanel/
│   │   │   ├── SuggestionPanel.tsx   # 建议面板
│   │   │   └── SuggestionPanel.module.css
│   │   │
│   │   ├── FeedbackForm/
│   │   │   ├── FeedbackForm.tsx      # 反馈表单
│   │   │   └── FeedbackForm.module.css
│   │   │
│   │   ├── Button.tsx                # 通用按钮
│   │   ├── Loading.tsx               # 加载动画
│   │   ├── Modal.tsx                 # 模态框
│   │   └── index.ts                  # 导出
│   │
│   ├── pages/                        # 页面组件
│   │   ├── EvaluationPage/
│   │   │   ├── EvaluationPage.tsx    # 评估页面
│   │   │   ├── EvaluationPage.module.css
│   │   │   └── hooks.ts
│   │   │
│   │   ├── HistoryPage/
│   │   │   ├── HistoryPage.tsx
│   │   │   ├── HistoryPage.module.css
│   │   │   └── index.ts
│   │   │
│   │   └── HomePage/
│   │       ├── HomePage.tsx
│   │       └── HomePage.module.css
│   │
│   ├── services/                     # 业务逻辑服务
│   │   ├── aiService.ts              # Gemini API集成
│   │   │   ├── initializeAI()
│   │   │   ├── evaluateHandwriting()
│   │   │   ├── parseEvaluationResult()
│   │   │   └── calculateTotalScore()
│   │   │
│   │   ├── firebaseService.ts        # Firebase集成
│   │   │   ├── initializeFirebase()
│   │   │   ├── saveEvaluation()
│   │   │   ├── getEvaluationHistory()
│   │   │   └── saveFeedback()
│   │   │
│   │   ├── imageService.ts           # 图片处理
│   │   │   ├── fileToBase64()
│   │   │   ├── compressImage()
│   │   │   ├── validateImage()
│   │   │   └── resizeImage()
│   │   │
│   │   ├── storageService.ts         # 存储管理
│   │   │   ├── uploadImage()
│   │   │   ├── deleteImage()
│   │   │   └── getImageUrl()
│   │   │
│   │   └── index.ts                  # 导出所有服务
│   │
│   ├── hooks/                        # 自定义React Hooks
│   │   ├── useEvaluation.ts          # 评估逻辑
│   │   ├── useImageUpload.ts         # 图片上传
│   │   ├── useARGestures.ts          # AR手势
│   │   ├── useHistory.ts             # 历史记录
│   │   ├── useFeedback.ts            # 反馈逻辑
│   │   └── index.ts                  # 导出
│   │
│   ├── stores/                       # Zustand全局状态
│   │   ├── evaluationStore.ts        # 评估Store
│   │   │   ├── currentResult
│   │   │   ├── evaluationHistory
│   │   │   └── actions
│   │   │
│   │   ├── uiStore.ts                # UI状态Store
│   │   │   ├── isLoading
│   │   │   ├── error
│   │   │   └── notifications
│   │   │
│   │   ├── userStore.ts              # 用户Store
│   │   │   ├── userId
│   │   │   ├── preferences
│   │   │   └── statistics
│   │   │
│   │   └── index.ts                  # 导出所有store
│   │
│   ├── types/                        # TypeScript类型
│   │   ├── index.ts                  # 通用类型
│   │   │   ├── ScoreObject
│   │   │   ├── EvaluationResult
│   │   │   └── UserFeedback
│   │   │
│   │   ├── evaluation.ts             # 评估相关
│   │   │   ├── ScoreObject
│   │   │   ├── SuggestionItem
│   │   │   └── EvaluationLevel
│   │   │
│   │   ├── ar.ts                     # AR相关
│   │   │   ├── ARGestureEvent
│   │   │   ├── ARTransform
│   │   │   └── ARState
│   │   │
│   │   └── firebase.ts               # Firebase相关
│   │       ├── FirebaseUser
│   │       ├── EvaluationRecord
│   │       └── FeedbackRecord
│   │
│   ├── styles/                       # 全局样式
│   │   ├── globals.css               # 全局重置
│   │   ├── variables.css             # CSS变量定义
│   │   │   ├── --color-primary: #2563eb
│   │   │   ├── --color-success: #10b981
│   │   │   └── --spacing-unit: 4px
│   │   │
│   │   └── animations.css            # 动画定义
│   │       ├── @keyframes fadeIn
│   │       ├── @keyframes slideUp
│   │       └── @keyframes pulse
│   │
│   ├── utils/                        # 工具函数
│   │   ├── constants.ts              # 常量定义
│   │   │   ├── SCORING_WEIGHTS
│   │   │   ├── MAX_IMAGE_SIZE
│   │   │   └── EVALUATION_LEVELS
│   │   │
│   │   ├── helpers.ts                # 辅助函数
│   │   │   ├── formatScore()
│   │   │   ├── getScoreLevel()
│   │   │   └── generateSuggestions()
│   │   │
│   │   ├── validators.ts             # 验证函数
│   │   │   ├── validateImage()
│   │   │   ├── validateScore()
│   │   │   └── validateEmail()
│   │   │
│   │   └── index.ts                  # 导出
│   │
│   ├── contexts/                     # React Context
│   │   ├── ThemeContext.ts           # 主题Context
│   │   ├── AuthContext.ts            # 认证Context
│   │   └── AppContext.ts             # 应用Context
│   │
│   ├── App.tsx                       # 主应用组件
│   ├── App.module.css                # App样式
│   ├── main.tsx                      # 应用入口
│   └── vite-env.d.ts                # Vite环境声明
│
├── tests/                            # 测试文件
│   ├── unit/                         # 单元测试
│   │   ├── services/
│   │   │   ├── aiService.spec.ts
│   │   │   ├── imageService.spec.ts
│   │   │   └── firebaseService.spec.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── calculateScore.spec.ts
│   │   │   └── parseResult.spec.ts
│   │   │
│   │   └── hooks/
│   │       ├── useEvaluation.spec.ts
│   │       └── useImageUpload.spec.ts
│   │
│   ├── integration/                  # 集成测试
│   │   ├── evaluationFlow.spec.ts
│   │   └── firebaseIntegration.spec.ts
│   │
│   ├── e2e/                          # 端到端测试
│   │   └── evaluation.e2e.spec.ts
│   │
│   └── fixtures/                     # 测试数据
│       ├── mockImages.ts
│       ├── mockResults.ts
│       └── mockFirebase.ts
│
├── scripts/                          # 自动化脚本
│   ├── fill-wiki.sh                  # Wiki填充脚本
│   ├── setup.sh                      # 项目初始化
│   └── deploy.sh                     # 部署脚本
│
├── dist/                             # 构建输出
│   ├── index.html
│   ├── assets/
│   │   ├── index-xxxxx.js
│   │   └── style-xxxxx.css
│   └── ...
│
├── .env.example                      # 环境变量模板
├── .env.local                        # 本地环境变量 (Git忽略)
├── .eslintrc.json                    # ESLint规则
├── .gitignore                        # Git忽略文件
├── .prettierrc.json                  # Prettier配置
├── package.json                      # 项目配置
├── package-lock.json                 # 依赖锁定
├── tsconfig.json                     # TypeScript配置
├── tsconfig.node.js                  # Node TypeScript配置
├── vite.config.ts                    # Vite构建配置
├── tailwind.config.js                # Tailwind配置
├── postcss.config.js                 # PostCSS配置
├── vitest.config.ts                  # Vitest配置
├── playwright.config.ts              # Playwright配置
├── README.md                         # 项目说明
└── LICENSE                           # 许可证
```

---

## 📊 文件统计

| 目录 | 文件数 | 总行数 | 说明 |
|------|--------|--------|------|
| src/components/ | 8+ | 1500+ | React组件库 |
| src/pages/ | 3+ | 800+ | 页面组件 |
| src/services/ | 4+ | 1200+ | 业务逻辑 |
| src/hooks/ | 5+ | 600+ | 自定义Hooks |
| src/types/ | 4+ | 300+ | TypeScript类型 |
| src/stores/ | 3+ | 400+ | 全局状态 |
| src/styles/ | 3+ | 200+ | 样式文件 |
| src/utils/ | 3+ | 300+ | 工具函数 |
| tests/ | 15+ | 2000+ | 测试代码 |
| docs/wiki/ | 36+ | 8000+ | 文档 |
| **总计** | **100+** | **15000+** | |

---

## 🔗 导入路径配置

### tsconfig.json路径别名

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@pages/*": ["src/pages/*"],
      "@services/*": ["src/services/*"],
      "@hooks/*": ["src/hooks/*"],
      "@types/*": ["src/types/*"],
      "@stores/*": ["src/stores/*"],
      "@styles/*": ["src/styles/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

### 使用示例

```typescript
// ✅ 好
import { evaluateHandwriting } from '@services/aiService';
import { useEvaluation } from '@hooks/useEvaluation';
import type { EvaluationResult } from '@types/evaluation';
import { Button } from '@components/Button';

// ❌ 避免
import { evaluateHandwriting } from '../../../../services/aiService';
import { useEvaluation } from '../../hooks/useEvaluation';
```

---

## 📈 模块依赖关系

```
pages/
  ├─→ components/
  ├─→ hooks/
  ├─→ services/
  └─→ stores/

components/
  ├─→ types/
  ├─→ styles/
  └─→ utils/

hooks/
  ├─→ services/
  ├─→ stores/
  └─→ types/

services/
  ├─→ types/
  └─→ utils/

stores/
  ├─→ types/
  └─→ services/
```

---

## 🎯 关键文件位置查询

| 需求 | 文件位置 | 说明 |
|------|---------|------|
| 修改评估逻辑 | `src/services/aiService.ts` | AI集成核心 |
| 修改UI样式 | `src/styles/*.css` | 全局样式 |
| 修改表单 | `src/components/FeedbackForm/` | 反馈表单 |
| 修改评分显示 | `src/components/ScoreCard/` | 评分卡片 |
| 修改数据保存 | `src/services/firebaseService.ts` | Firebase集成 |
| 修改全局状态 | `src/stores/*.ts` | Zustand stores |
| 修改自定义Hook | `src/hooks/*.ts` | 自定义逻辑 |
| 修改类型定义 | `src/types/*.ts` | TypeScript类型 |
| 修改工具函数 | `src/utils/*.ts` | 通用函数 |
| 修改页面结构 | `src/pages/*.tsx` | 页面组件 |
| 添加测试 | `tests/**/*.spec.ts` | 测试文件 |
| 修改文档 | `docs/wiki/**/*.md` | 项目文档 |

---

**最后更新**: 2025-12-04
