# 编码规范

## 📝 TypeScript编码规范

### 基础规则

#### 1. 严格模式配置
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

#### 2. 类型定义（禁止使用any）

❌ **不好**:
```typescript
function process(data: any): any {
  return data.value;
}
```

✅ **好**:
```typescript
interface DataObject {
  value: string;
  timestamp: Date;
}

function process(data: DataObject): string {
  return data.value;
}
```

#### 3. 导入顺序

```typescript
// 1. React相关
import React, { useState, useEffect } from 'react';

// 2. 第三方库
import { create } from 'zustand';
import gsap from 'gsap';

// 3. 本地导入
import { evaluateHandwriting } from '@/services/aiService';
import { Button } from '@/components';
import { useEvaluation } from '@/hooks';
import type { EvaluationResult } from '@/types';

// 4. 样式
import styles from './Component.module.css';
```

---

## ⚛️ React编码规范

### 1. 函数式组件与Hooks

✅ **推荐**:
```typescript
interface EvaluationPageProps {
  initialScore?: number;
}

export const EvaluationPage: React.FC<EvaluationPageProps> = ({ 
  initialScore = 0 
}) => {
  const [score, setScore] = useState(initialScore);
  
  useEffect(() => {
    // 副作用逻辑
  }, []);

  return (
    <div className={styles.container}>
      {/* JSX内容 */}
    </div>
  );
};

export default EvaluationPage;
```

### 2. Props定义

```typescript
// 使用interface定义Props
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  variant = 'primary'
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
};
```

### 3. 自定义Hooks

```typescript
// hooks/useEvaluation.ts
export function useEvaluation() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const evaluate = useCallback(async (imageBase64: string) => {
    try {
      setLoading(true);
      const data = await evaluateHandwriting(imageBase64);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  return { evaluate, loading, result, error };
}
```

### 4. 条件渲染

✅ **推荐**:
```typescript
// 简单条件
{condition && <Component />}

// 两分支
{isLoading ? <LoadingSpinner /> : <Content />}

// 多分支
{status === 'loading' && <LoadingSpinner />}
{status === 'error' && <ErrorMessage />}
{status === 'success' && <SuccessContent />}
```

❌ **避免**:
```typescript
{condition ? <Component /> : null}  // 用 && 替代
```

### 5. 事件处理

```typescript
// 类型化事件
const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
  e.preventDefault();
  // 逻辑
};

// 表单事件
const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  const value = e.target.value;
  setInput(value);
};
```

---

## 🎨 Tailwind CSS规范

### 1. 类名顺序（以布局为基础）

```html
<!-- 推荐顺序：布局 → 间距 → 大小 → 颜色 → 其他 -->
<div class="
  flex items-center justify-between
  p-4 mb-6
  w-full h-auto
  bg-white text-gray-900
  rounded-lg shadow
  hover:shadow-lg transition-shadow
">
```

### 2. 响应式设计（移动优先）

```html
<!-- ✅ 移动优先 -->
<div class="
  text-base p-4
  sm:text-lg sm:p-6
  md:text-xl md:p-8
  lg:text-2xl lg:p-10
">
  内容
</div>
```

### 3. 避免过度嵌套

✅ **推荐**:
```html
<div class="flex flex-col gap-4">
  <div class="p-4 bg-gray-100 rounded">Item 1</div>
  <div class="p-4 bg-gray-100 rounded">Item 2</div>
</div>
```

❌ **避免**:
```html
<div class="flex">
  <div class="flex-1">
    <div class="p-4">
      <div class="bg-gray-100">
        Item
      </div>
    </div>
  </div>
</div>
```

### 4. 提取重复类名

```typescript
// 使用CSS Module而不是重复类名
const buttonClass = "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600";

// ✅ 好的做法
import styles from './Button.module.css';
// 或
const buttonClasses = "px-4 py-2 rounded transition-colors"
  + " bg-blue-500 hover:bg-blue-600"
  + " text-white font-medium";
```

---

## 🧪 错误处理

### 1. Try-Catch模式

```typescript
async function evaluateHandwriting(imageBase64: string) {
  try {
    const response = await fetch('/api/evaluate', {
      method: 'POST',
      body: JSON.stringify({ imageBase64 })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // 区分错误类型
    if (error instanceof TypeError) {
      console.error('网络错误:', error.message);
      throw new Error('网络连接失败');
    } else if (error instanceof Error) {
      console.error('评估失败:', error.message);
      throw error;
    } else {
      console.error('未知错误:', error);
      throw new Error('未知错误');
    }
  }
}
```

### 2. 错误边界

```typescript
// components/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <div>发生错误: {this.state.error?.message}</div>;
    }
    return this.props.children;
  }
}
```

---

## 📌 常见模式

### 1. 导出默认导出和命名导出

```typescript
// services/aiService.ts
export const evaluateHandwriting = async (...) => { ... }
export const parseResult = (...) => { ... }

// 或
export default {
  evaluateHandwriting,
  parseResult
}
```

### 2. 常量定义

```typescript
// utils/constants.ts
export const SCORING_WEIGHTS = {
  BRUSH_QUALITY: 0.25,
  STRUCTURE_ANALYSIS: 0.35,
  STROKE_CONNECTION: 0.15,
  OVERALL_EVALUATION: 0.25
} as const;

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export const EVALUATION_LEVELS = [
  'excellent',
  'good',
  'medium',
  'acceptable',
  'needsImprovement'
] as const;
```

### 3. 类型守卫

```typescript
function isError(value: unknown): value is Error {
  return value instanceof Error;
}

function assertDefined<T>(
  value: T | undefined,
  message: string
): asserts value is T {
  if (value === undefined) throw new Error(message);
}
```

---

## ✨ 代码风格

### 1. 命名规范

```typescript
// 变量、函数: camelCase
const evaluationResult = { ... };
function calculateScore() { ... }

// 类、接口、类型: PascalCase
class EvaluationService { ... }
interface EvaluationResult { ... }
type ScoreObject = { ... };

// 常量: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_TIMEOUT = 5000;

// 私有变量: _leading underscore
private _internalState = { ... };
```

### 2. 注释规范

```typescript
/**
 * 评估硬笔字迹
 * @param imageBase64 - Base64编码的图片数据
 * @returns 评估结果，包含四维评分和建议
 * @throws {Error} 当API调用失败时
 */
export async function evaluateHandwriting(
  imageBase64: string
): Promise<EvaluationResult> {
  // 实现
}

// TODO: 优化性能
// FIXME: 修复边界情况
// NOTE: 这里有特殊逻辑，需要注意
```

### 3. 代码长度

- 每行代码 < 100字符（带缩进）
- 单个函数 < 50行
- 单个文件 < 500行

---

## 🔍 检查工具

### ESLint配置

```bash
npm run lint           # 检查
npm run lint -- --fix # 自动修复
```

### TypeScript检查

```bash
npm run type-check     # TypeScript类型检查
```

### Prettier格式化

```bash
npm run format         # 格式化代码
```

---

**最后更新**: 2025-12-04
