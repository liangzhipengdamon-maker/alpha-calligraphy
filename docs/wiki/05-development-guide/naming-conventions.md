# 命名约定

## 📋 总体命名原则

1. **自说明**: 名字应该清楚表达其含义
2. **一致性**: 整个项目使用统一的命名风格
3. **避免歧义**: 不要用容易混淆的名字
4. **国际化**: 使用英文，避免中文、拼音

---

## 📁 文件与文件夹命名

### 文件夹命名

| 类型 | 格式 | 示例 |
|------|------|------|
| 功能文件夹 | kebab-case | `ar-lightbox`, `score-card`, `user-profile` |
| 类型文件夹 | 复数形式 | `components`, `pages`, `services`, `hooks` |

```
src/
├── components/           # 复数
├── pages/               # 复数
├── services/            # 复数
├── hooks/               # 复数
├── types/               # 复数
├── stores/              # 复数
├── utils/               # 复数
├── styles/              # 复数
└── config/              # 复数
```

### 文件命名

| 类型 | 格式 | 示例 | 说明 |
|------|------|------|------|
| React组件 | PascalCase.tsx | `EvaluationPage.tsx` | 文件名与导出组件同名 |
| 工具函数 | camelCase.ts | `calculateScore.ts` | 描述函数功能 |
| 常量文件 | UPPER_SNAKE_CASE.ts | `SCORING_WEIGHTS.ts` | 全大写加下划线 |
| 类型定义 | PascalCase.ts | `EvaluationType.ts` | 以Type或Dto结尾 |
| 样式模块 | camelCase.module.css | `component.module.css` | 与组件同名 |
| 测试文件 | camelCase.spec.ts | `calculateScore.spec.ts` | .spec后缀 |

---

## 🎯 代码标识符命名

### 变量命名

#### 基础变量

```typescript
// ✅ 清晰
const evaluationScore = 85;
const isLoading = true;
const userCount = 100;
const arScale = 1.5;

// ❌ 避免
const score = 85;           // 太通用
const data = { ... };       // 含义不清
const flag = true;          // 不说明用途
const x = 1.5;              // 太简洁
```

#### Boolean变量

```typescript
// ✅ is/has/should/can开头
const isLoading = true;
const hasError = false;
const shouldRetry = true;
const canEdit = true;
const isVisible = true;

// ❌ 避免
const loading = true;       // 不够清楚
const error = false;        // 容易混淆（是错误还是有错误？）
const showModal = true;     // 动词开头，用于函数
```

#### 数组变量

```typescript
// ✅ 复数形式或items结尾
const suggestions = ['加强笔力', '调整结构'];
const evaluationHistories = [...];
const usersList = [...];

// ❌ 避免
const suggestion = [item1, item2];  // 单数表示数组
const items = [...];                // 太通用
```

#### 常量

```typescript
// ✅ UPPER_SNAKE_CASE
const SCORING_WEIGHTS = { ... };
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const DEFAULT_TIMEOUT = 5000;
const EVALUATION_LEVELS = ['excellent', ...];

// ❌ 避免
const ScoringWeights = { ... };     // 不是常量大小写
const maxImageSize = 10 * 1024;     // camelCase用于常量
```

### 函数命名

```typescript
// ✅ 动词开头，清晰表达功能
export function calculateTotalScore(scores: ScoreObject): number { }
export async function evaluateHandwriting(image: string): Promise<Result> { }
export function formatScore(score: number): string { }
export function validateImageSize(size: number): boolean { }
export function parseEvaluationResult(response: string): EvaluationResult { }

// ❌ 避免
export function score(data: any): any { }      // 太通用
export function get(id: string): any { }       // 不清楚get什么
export function set_data(data: any): void { }  // 下划线不规范
export function doSomething(): void { }        // 太含糊
```

### 回调函数

```typescript
// ✅ on + Event或Handle + Action
const handleImageUpload = (file: File) => { ... }
const handleEvaluationClick = () => { ... }
const onSuccessfulEvaluation = (result: Result) => { ... }
const onErrorOccurred = (error: Error) => { ... }

// ❌ 避免
const imageUpload = () => { ... }        // 不知道是动作还是数据
const click = () => { ... }              // 太模糊
const callback = () => { ... }           // 无具体含义
```

---

## 🏗️ 类与接口命名

### 类命名

```typescript
// ✅ PascalCase + Service/Manager后缀
export class EvaluationService {
  async evaluate(image: string): Promise<EvaluationResult> { }
}

export class ImageService {
  compressImage(file: File): Promise<Blob> { }
}

export class FirebaseDataManager {
  saveEvaluation(data: any): Promise<void> { }
}

// ❌ 避免
export class evaluation { }              // 小写
export class EvaluateHandler { }         // Handler含义模糊
export class Process { }                 // 太通用
```

### 接口命名

```typescript
// ✅ I前缀或Type后缀（推荐后者）
export interface IEvaluationResult {
  totalScore: number;
  suggestions: string[];
}

export interface EvaluationResultType {
  totalScore: number;
  suggestions: string[];
}

export type EvaluationResult = {
  totalScore: number;
  suggestions: string[];
}

// ❌ 避免
export interface evaluationResult { }    // 小写
export interface Result { }              // 太通用
export interface GetEvaluationResponse { } // 动词开头
```

### 泛型命名

```typescript
// ✅ 简短、大写字母
function processData<T>(data: T[]): T[] { }
function mapArray<K, V>(map: Map<K, V>): [K, V][] { }
function withCache<T>(fn: () => Promise<T>): () => Promise<T> { }

// ❌ 避免
function processData<Data>(data: Data[]): Data[] { }  // 太详细
function mapArray<anything, something>(map: Map<anything, something>): any[] { }
```

---

## 🎨 React组件命名

### 组件名

```typescript
// ✅ PascalCase
export const EvaluationPage: React.FC = () => { }
export const ScoreCard: React.FC<ScoreCardProps> = () => { }
export const ARLightBox: React.FC = () => { }
export const SuggestionPanel: React.FC = () => { }

// ❌ 避免
export const evaluationPage = () => { }       // 小写
export const score_card = () => { }           // 下划线
export const ArLightbox = () => { }           // AR首字母大小不一
```

### Props接口

```typescript
// ✅ 组件名 + Props后缀
interface EvaluationPageProps {
  initialScore?: number;
}

interface ScoreCardProps {
  score: number;
  level: string;
}

export const EvaluationPage: React.FC<EvaluationPageProps> = (props) => { }

// ❌ 避免
interface Props {
  score: number;  // 太通用，容易混淆
}

interface EvaluationPageP {
  score: number;  // 简写不清晰
}
```

### Hook命名

```typescript
// ✅ use + 功能名
export function useEvaluation() {
  // 返回评估相关逻辑
}

export function useImageUpload() {
  // 返回图片上传逻辑
}

export function useARGestures() {
  // 返回AR手势逻辑
}

// ❌ 避免
export function evaluation() { }    // 没有use前缀（会被识别为组件）
export function getEvaluation() { } // get前缀用于非Hook
```

---

## 📊 项目前缀约定

### MSS前缀（Master's HandGuid Smart System）

所有新建的核心组件和服务使用MSS前缀：

```typescript
// 组件
export const MSSEvaluationPage: React.FC = () => { }
export const MSSARLightBox: React.FC = () => { }
export const MSSScoreCard: React.FC = () => { }

// 服务
export class MSSEvaluationService { }
export class MSSImageService { }
export class MSSFirebaseService { }

// 类型
export interface MSSEvaluationResult { }
export type MSSScoreObject = { }

// Hooks
export function useMSSEvaluation() { }
export function useMSSARGestures() { }

// Store
export const useMSSEvaluationStore = create(...) { }
```

### 使用场景

✅ **使用MSS前缀**:
- 核心业务组件
- AI评估相关的所有代码
- 项目特定的工具函数
- 项目特定的类型定义

❌ **不使用MSS前缀**:
- 通用UI组件（Button、Card等）
- React Hooks标准库
- 第三方库的包装器
- 通用工具函数

---

## 🗂️ 目录结构命名示例

```
src/
├── components/
│   ├── ARLightBox/
│   │   ├── ARLightBox.tsx
│   │   ├── ARLightBox.module.css
│   │   └── types.ts
│   ├── ScoreCard/
│   │   ├── ScoreCard.tsx
│   │   ├── ScoreCard.module.css
│   │   └── index.ts
│   └── index.ts
│
├── pages/
│   ├── EvaluationPage/
│   │   ├── EvaluationPage.tsx
│   │   ├── EvaluationPage.module.css
│   │   └── hooks.ts
│   └── HistoryPage/
│
├── services/
│   ├── aiService.ts           # 不同的前缀
│   ├── firebaseService.ts
│   ├── imageService.ts
│   └── index.ts
│
├── hooks/
│   ├── useEvaluation.ts
│   ├── useImageUpload.ts
│   └── useARGestures.ts
│
├── types/
│   ├── index.ts               # 通用类型
│   ├── evaluation.ts           # 功能特定类型
│   └── ar.ts
│
└── utils/
    ├── constants.ts            # UPPER_SNAKE_CASE
    ├── helpers.ts              # camelCase函数
    └── validators.ts
```

---

**最后更新**: 2025-12-04
