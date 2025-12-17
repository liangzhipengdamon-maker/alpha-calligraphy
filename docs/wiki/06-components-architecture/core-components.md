# 核心组件

## 📋 组件清单

本文档列出所有核心React组件，包括功能、Props、使用示例。

---

## 1. ScoreCard 评分卡片

### 功能
展示AI评估的四维评分结果和总分，以卡片形式呈现。

### Props

```typescript
interface ScoreCardProps {
  scores: {
    brushQuality: number;        // 笔画质量 (0-25)
    structureAnalysis: number;   // 结构分析 (0-35)
    strokeConnection: number;    // 笔画连接 (0-15)
    overallEvaluation: number;   // 整体评价 (0-25)
  };
  totalScore: number;            // 总分 (0-100)
  level: 'excellent' | 'good' | 'medium' | 'acceptable' | 'needsImprovement';
  suggestions?: string[];        // 改进建议
}
```

### 使用示例

```tsx
<ScoreCard
  scores={{
    brushQuality: 22,
    structureAnalysis: 28,
    strokeConnection: 12,
    overallEvaluation: 20
  }}
  totalScore={82}
  level="good"
  suggestions={['加强笔力', '调整间距']}
/>
```

---

## 2. SuggestionPanel 建议面板

### 功能
展示AI生成的改进建议和学习资源推荐。

### Props

```typescript
interface SuggestionPanelProps {
  suggestions: string[];         // 改进建议列表
  encouragement?: string;        // 鼓励语言
  onResourceClick?: (resource: string) => void;
}
```

### 使用示例

```tsx
<SuggestionPanel
  suggestions={[
    '加强笔力，避免笔画过轻',
    '调整部件间距，保持均衡',
    '增加笔画连贯性'
  ]}
  encouragement="很棒！继续加油！"
/>
```

---

## 3. FeedbackForm 反馈表单

### 功能
收集用户对评估结果的反馈，帮助改进AI模型。

### Props

```typescript
interface FeedbackFormProps {
  evaluationId: string;
  onSubmit?: (feedback: UserFeedback) => Promise<void>;
  onCancel?: () => void;
}

interface UserFeedback {
  helpful: boolean;
  accurate: boolean;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
}
```

### 使用示例

```tsx
<FeedbackForm
  evaluationId="eval_12345"
  onSubmit={async (feedback) => {
    await saveFeedback(feedback);
    alert('感谢您的反馈！');
  }}
/>
```

---

## 4. Button 通用按钮

### 功能
可复用的按钮组件，支持多种样式和状态。

### Props

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}
```

### 使用示例

```tsx
<Button
  label="立即评估"
  onClick={handleEvaluate}
  variant="primary"
  size="large"
  disabled={!hasImage}
/>
```

---

## 5. Loading 加载动画

### 功能
显示加载状态，提示用户等待。

### Props

```typescript
interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}
```

### 使用示例

```tsx
{isLoading && <Loading message="正在评估..." />}
```

---

## 6. Modal 模态框

### 功能
显示覆盖层模态框，用于确认或显示重要信息。

### Props

```typescript
interface ModalProps {
  title: string;
  content: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}
```

### 使用示例

```tsx
<Modal
  title="确认评估"
  content="要评估这个字迹吗？"
  onConfirm={handleConfirm}
  onCancel={handleCancel}
/>
```

---

## 📊 组件依赖关系

```
EvaluationPage
├── ARLightBox
├── Button
├── ScoreCard
│   └── (显示四维评分)
├── SuggestionPanel
│   └── (显示改进建议)
└── FeedbackForm
    └── (收集用户反馈)

HistoryPage
├── ScoreCard (列表)
├── Button
└── Loading
```

---

## 🎨 样式系统

### CSS Module使用

每个组件都有对应的`.module.css`文件：

```typescript
// Button.tsx
import styles from './Button.module.css';

export const Button: React.FC<ButtonProps> = (props) => (
  <button className={styles.button}>
    {props.label}
  </button>
);
```

### Tailwind集成

对于简单组件，直接使用Tailwind类：

```typescript
export const Badge: React.FC<{ level: string }> = ({ level }) => (
  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
    {level}
  </span>
);
```

---

## 🧪 组件测试示例

```typescript
// tests/components/Button.spec.ts
import { render, fireEvent } from '@testing-library/react';
import { Button } from '@/components/Button';

describe('Button', () => {
  it('应该响应点击事件', () => {
    const handleClick = vitest.fn();
    const { getByText } = render(
      <Button label="Click me" onClick={handleClick} />
    );
    
    fireEvent.click(getByText('Click me'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('禁用状态应该不响应点击', () => {
    const handleClick = vitest.fn();
    const { getByRole } = render(
      <Button label="Click me" onClick={handleClick} disabled />
    );
    
    const button = getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

---

## 📱 响应式设计

所有组件都遵循移动优先的响应式设计原则：

```css
/* 移动端（默认） */
.container {
  padding: 8px;
  font-size: 14px;
}

/* 平板及以上 */
@media (min-width: 768px) {
  .container {
    padding: 16px;
    font-size: 16px;
  }
}

/* 桌面及以上 */
@media (min-width: 1024px) {
  .container {
    padding: 24px;
    font-size: 18px;
  }
}
```

---

**最后更新**: 2025-12-04
