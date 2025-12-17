# 系统架构设计

## 🏗️ 架构总览

### 三层架构

```
┌─────────────────────────────────────────────────────────┐
│                    表现层 (Presentation)                 │
│  EvaluationPage, ARLightBox, ScoreCard, etc.            │
└────────────┬────────────────────────────────┬───────────┘
             │                                │
┌────────────▼──────────────┐    ┌────────────▼──────────────┐
│   业务逻辑层 (Business)    │    │  Hooks & Zustand Store    │
│   useEvaluation           │    │  Global State Management  │
│   useImageUpload          │    │  useARGestures           │
│   useHistory              │    │  useScore                 │
└────────────┬──────────────┘    └────────────┬──────────────┘
             │                                │
┌────────────▼──────────────────────────────────┬──────────┐
│              服务层 (Services)                 │          │
│  aiService.ts (Gemini API)                   │          │
│  firebaseService.ts (Firestore, Storage)    │          │
│  imageService.ts (图片处理)                   │          │
│  svgPathService.ts (SVG绘制)                │          │
└────────────┬──────────────────────────────────┴──────────┘
             │
┌────────────▼──────────────────────────────────────────────┐
│               外部服务 (External Services)                 │
│  Gemini 2.0 Flash API          Google AI Studio          │
│  Firebase (Firestore, Storage) Google Cloud             │
└───────────────────────────────────────────────────────────┘
```

## 🔄 数据流

### 评估流程数据流

```
用户操作
  │
  ├─→ 上传图片
  │   │
  │   └─→ ImageService (压缩、验证)
  │       │
  │       ├─→ 本地预览 (ARLightBox)
  │       └─→ Base64编码
  │
  ├─→ 提交评估
  │   │
  │   └─→ AIService (Gemini API)
  │       │
  │       ├─→ 四维评分计算
  │       ├─→ 评级评定
  │       └─→ 建议生成
  │
  ├─→ 显示结果
  │   │
  │   └─→ ScoreCard组件
  │       ├─→ 评分展示
  │       ├─→ 建议列表
  │       └─→ 鼓励语言
  │
  └─→ 保存数据
      │
      └─→ FirebaseService
          ├─→ Firestore (评估记录)
          └─→ 用户反馈
```

## 🗂️ 项目结构细节

### src/ 目录详解

```
src/
├── components/                    # React组件库
│   ├── ARLightBox.tsx            # AR透台组件（核心）
│   ├── ARLightBox.module.css
│   ├── ScoreCard.tsx             # 评分卡片
│   ├── ScoreCard.module.css
│   ├── SuggestionPanel.tsx       # 建议面板
│   ├── FeedbackForm.tsx          # 反馈表单
│   ├── Button.tsx                # 通用按钮
│   ├── Loading.tsx               # 加载动画
│   └── index.ts                  # 导出所有组件
│
├── pages/                         # 页面级组件
│   ├── EvaluationPage.tsx        # 评估页面（核心）
│   ├── EvaluationPage.module.css
│   ├── HomePage.tsx              # 首页
│   └── HistoryPage.tsx           # 历史记录
│
├── services/                      # 业务逻辑服务
│   ├── aiService.ts              # Gemini API集成
│   │   ├── initializeAI()
│   │   ├── evaluateHandwriting()
│   │   ├── parseEvaluationResult()
│   │   └── calculateTotalScore()
│   │
│   ├── firebaseService.ts        # Firebase初始化
│   │   ├── initializeFirebase()
│   │   ├── saveEvaluation()
│   │   ├── getEvaluationHistory()
│   │   └── saveFeedback()
│   │
│   ├── imageService.ts           # 图片处理
│   │   ├── fileToBase64()
│   │   ├── compressImage()
│   │   ├── validateImage()
│   │   └── resizeImage()
│   │
│   └── svgPathService.ts         # SVG绘制
│       ├── drawPath()
│       ├── animatePath()
│       └── getStrokePath()
│
├── hooks/                         # 自定义React Hooks
│   ├── useEvaluation.ts          # 评估逻辑
│   │   ├── useState (loading, result, error)
│   │   ├── useEffect (初始化)
│   │   └── evaluate() 方法
│   │
│   ├── useImageUpload.ts         # 图片上传
│   │   ├── useState (image, preview)
│   │   ├── handleUpload()
│   │   └── validateAndCompress()
│   │
│   ├── useARGestures.ts          # AR手势
│   │   ├── useState (scale, rotation, opacity)
│   │   └── handlePinch(), handleRotate()
│   │
│   └── useHistory.ts             # 历史记录
│       ├── useState (evaluations)
│       ├── useEffect (加载历史)
│       └── fetchHistory()
│
├── types/                         # TypeScript类型定义
│   ├── index.ts                  # 公共类型
│   │   ├── ScoreObject
│   │   ├── EvaluationResult
│   │   └── UserFeedback
│   │
│   ├── ar.ts                     # AR相关类型
│   │   ├── ARGestureEvent
│   │   ├── ARTransform
│   │   └── ARState
│   │
│   ├── evaluation.ts             # 评估相关类型
│   │   ├── ScoreObject
│   │   ├── SuggestionItem
│   │   └── EvaluationLevel
│   │
│   └── firebase.ts               # Firebase相关类型
│       ├── FirebaseUser
│       ├── EvaluationRecord
│       └── FeedbackRecord
│
├── stores/                        # Zustand全局状态
│   ├── evaluationStore.ts        # 评估状态
│   │   ├── currentResult
│   │   ├── evaluationHistory
│   │   └── actions
│   │
│   ├── uiStore.ts                # UI状态
│   │   ├── loading
│   │   ├── error
│   │   └── notifications
│   │
│   └── userStore.ts              # 用户状态
│       ├── userId
│       ├── preferences
│       └── statistics
│
├── styles/                        # 全局样式
│   ├── globals.css               # 全局重置
│   ├── variables.css             # CSS变量
│   │   ├── --color-primary
│   │   ├── --color-success
│   │   └── --spacing-unit
│   │
│   └── animations.css            # 动画定义
│       ├── @keyframes fadeIn
│       ├── @keyframes slideUp
│       └── @keyframes pulse
│
├── utils/                         # 工具函数
│   ├── constants.ts              # 常量定义
│   │   ├── SCORING_WEIGHTS
│   │   ├── MAX_IMAGE_SIZE
│   │   └── EVALUATION_LEVELS
│   │
│   ├── helpers.ts                # 辅助函数
│   │   ├── formatScore()
│   │   ├── getScoreLevel()
│   │   └── generateSuggestions()
│   │
│   └── validators.ts             # 验证函数
│       ├── validateImage()
│       ├── validateScore()
│       └── validateEmail()
│
├── App.tsx                        # 主应用组件
├── App.css                        # App样式
├── main.tsx                       # 应用入口
└── vite-env.d.ts                # Vite类型声明
```

### 核心文件说明

#### EvaluationPage.tsx (核心页面)

```typescript
export default function EvaluationPage() {
  // 状态管理
  const { image, imageBase64, loading, result } = useEvaluation();
  const { scale, opacity } = useARGestures();
  
  // 事件处理
  const handleImageUpload = async (file: File) => { ... }
  const handleEvaluate = async () => { ... }
  const handleFeedback = async (helpful: boolean) => { ... }
  
  return (
    <div className="evaluation-container">
      {/* 三阶段UI */}
      {!result ? <UploadPhase /> : <ResultPhase />}
    </div>
  )
}
```

#### AIService.ts (AI集成)

```typescript
export async function evaluateHandwriting(
  imageBase64: string
): Promise<EvaluationResult> {
  // 1. 调用Gemini API
  // 2. 解析结果
  // 3. 计算总分
  // 4. 生成建议
}
```

#### FirebaseService.ts (后端服务)

```typescript
export async function saveEvaluation(
  evaluation: EvaluationResult
): Promise<string> {
  // 1. 上传图片到Storage
  // 2. 保存评估记录到Firestore
  // 3. 返回评估ID
}
```

## 🔌 接口设计

### 组件通信方式

#### Props传递（父→子）
```typescript
<ScoreCard
  brushQuality={22}
  structureAnalysis={28}
  strokeConnection={12}
  overallEvaluation={20}
/>
```

#### 事件回调（子→父）
```typescript
<Button
  onClick={() => handleEvaluate()}
  disabled={!imageBase64}
/>
```

#### 全局状态（Zustand）
```typescript
const useEvaluationStore = create((set) => ({
  currentResult: null,
  setResult: (result) => set({ currentResult: result })
}))
```

#### Context API（跨级通信）
```typescript
<ThemeProvider value={theme}>
  <App />
</ThemeProvider>
```

## 🔐 安全设计

### 环境变量保护

```env
# .env.local (不提交到Git)
VITE_GEMINI_API_KEY=...
VITE_FIREBASE_API_KEY=...
```

### Firebase规则

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 只允许用户访问自己的数据
    match /evaluations/{userId}/records/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

### API速率限制

```typescript
// 在firebaseService中实现
const rateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60000 // 1分钟
})
```

## 📊 性能优化策略

### 代码分割

```typescript
// 路由级别代码分割
const EvaluationPage = lazy(() => import('./pages/EvaluationPage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage'))
```

### 图片优化

```typescript
// 自动压缩
const compressed = await compressImage(file, {
  maxWidth: 1024,
  maxHeight: 1024,
  quality: 0.8
})
```

### 缓存策略

```typescript
// 本地缓存评估结果
localStorage.setItem('latestEvaluation', JSON.stringify(result))
```

---

**最后更新**: 2025-12-04
