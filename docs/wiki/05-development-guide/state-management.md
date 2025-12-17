# 状态管理

## 🎯 状态管理原则

### 三层状态划分

```
全局状态 (Global State) ← Zustand
  ├─ 用户信息
  ├─ 评估历史
  └─ 应用配置

组件状态 (Component State) ← React Hooks
  ├─ 表单输入
  ├─ 模态框显示
  └─ UI交互状态

服务状态 (Service State) ← 缓存
  ├─ API响应
  ├─ 图片缓存
  └─ 计算结果
```

### 状态管理决策树

```
数据是否被多个组件共享？
  ├─ 是 → 使用Zustand全局状态
  └─ 否 → 使用React Hooks本地状态
      │
      ├─ Props能传递？ → 使用Props
      ├─ 跨越3层组件？ → 使用Context
      └─ 临时UI状态？ → useState
```

---

## 🏪 Zustand全局状态管理

### 状态设计

```typescript
// stores/evaluationStore.ts
import { create } from 'zustand';
import type { EvaluationResult } from '@/types';

interface EvaluationState {
  // 状态
  currentResult: EvaluationResult | null;
  evaluationHistory: EvaluationResult[];
  isLoading: boolean;
  error: Error | null;

  // 方法
  setResult: (result: EvaluationResult) => void;
  addToHistory: (result: EvaluationResult) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  clearHistory: () => void;
}

export const useEvaluationStore = create<EvaluationState>((set) => ({
  // 初始状态
  currentResult: null,
  evaluationHistory: [],
  isLoading: false,
  error: null,

  // 方法实现
  setResult: (result) => set({ currentResult: result }),
  
  addToHistory: (result) => set((state) => ({
    evaluationHistory: [result, ...state.evaluationHistory]
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearHistory: () => set({ evaluationHistory: [] })
}));
```

### Store划分

```typescript
// stores/evaluationStore.ts - 评估相关状态
export const useEvaluationStore = create((set) => ({
  currentResult: null,
  evaluationHistory: [],
  // ...
}));

// stores/uiStore.ts - UI状态
export const useUIStore = create((set) => ({
  isModalOpen: false,
  notification: null,
  // ...
}));

// stores/userStore.ts - 用户状态
export const useUserStore = create((set) => ({
  userId: null,
  user: null,
  preferences: {},
  // ...
}));

// stores/index.ts - 导出所有store
export * from './evaluationStore';
export * from './uiStore';
export * from './userStore';
```

### 在组件中使用

```typescript
// 基础用法
const EvaluationPage: React.FC = () => {
  const { currentResult, isLoading } = useEvaluationStore();
  
  return (
    <div>
      {isLoading ? <LoadingSpinner /> : <ResultCard result={currentResult} />}
    </div>
  );
};

// 更新状态
const Button: React.FC = () => {
  const setResult = useEvaluationStore((state) => state.setResult);
  
  const handleClick = () => {
    const result = { /* ... */ };
    setResult(result);
  };
  
  return <button onClick={handleClick}>评估</button>;
};

// 选择多个状态（优化性能）
const ScoreCard: React.FC = () => {
  const { currentResult, error } = useEvaluationStore((state) => ({
    currentResult: state.currentResult,
    error: state.error
  }));
  
  return <div>{currentResult?.totalScore}</div>;
};
```

---

## ⚛️ React Hooks状态管理

### useState - 基础状态

```typescript
// ✅ 简单状态
const [isVisible, setIsVisible] = useState(false);
const [count, setCount] = useState(0);
const [user, setUser] = useState<User | null>(null);

// 更新函数式状态
const [counter, setCounter] = useState(0);
setCounter(prev => prev + 1);

// 初始化复杂状态
const [formData, setFormData] = useState(() => {
  return {
    name: '',
    email: '',
    message: ''
  };
});
```

### useEffect - 副作用

```typescript
// 组件挂载时执行一次
useEffect(() => {
  initializeAI();
}, []);

// 依赖项变化时执行
useEffect(() => {
  const loadEvaluationHistory = async () => {
    const data = await fetchHistory(userId);
    setHistory(data);
  };
  
  if (userId) {
    loadEvaluationHistory();
  }
}, [userId]);

// 清理副作用
useEffect(() => {
  const subscription = onAuthStateChanged((user) => {
    setCurrentUser(user);
  });
  
  // 清理函数
  return () => subscription();
}, []);
```

### useCallback - 优化回调

```typescript
// 不使用useCallback的问题
const handleEvaluate = () => {
  // 每次渲染都创建新函数，导致子组件重新渲染
  evaluateImage(imageBase64);
};

// 使用useCallback优化
const handleEvaluate = useCallback(() => {
  evaluateImage(imageBase64);
}, [imageBase64]); // 只在imageBase64变化时更新

// 传递给子组件
<EvaluateButton onClick={handleEvaluate} />
```

### useMemo - 优化计算

```typescript
// 计算复杂的派生状态
const averageScore = useMemo(() => {
  if (evaluationHistory.length === 0) return 0;
  const sum = evaluationHistory.reduce((acc, eval) => acc + eval.totalScore, 0);
  return sum / evaluationHistory.length;
}, [evaluationHistory]);

// 创建复杂对象（避免引用变化）
const scoreCardProps = useMemo(() => ({
  score: currentResult.totalScore,
  level: currentResult.level,
  suggestions: currentResult.suggestions
}), [currentResult]);
```

### useRef - 持久化引用

```typescript
// 保存DOM引用
const canvasRef = useRef<HTMLCanvasElement>(null);

const drawOnCanvas = () => {
  const ctx = canvasRef.current?.getContext('2d');
  ctx?.drawImage(/* ... */);
};

return <canvas ref={canvasRef} />;

// 保存定时器（便于清理）
const timerRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  timerRef.current = setInterval(() => {
    // 定期任务
  }, 1000);
  
  return () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
}, []);
```

---

## 🪝 自定义Hooks

### 评估Hook

```typescript
// hooks/useEvaluation.ts
export function useEvaluation() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const addToHistory = useEvaluationStore((s) => s.addToHistory);

  const evaluate = useCallback(async (imageBase64: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const evaluationResult = await evaluateHandwriting(imageBase64);
      
      setResult(evaluationResult);
      addToHistory(evaluationResult);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [addToHistory]);

  return { evaluate, loading, result, error };
}
```

### 图片上传Hook

```typescript
// hooks/useImageUpload.ts
export function useImageUpload() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(async (file: File) => {
    try {
      // 验证
      if (!validateImage(file)) {
        throw new Error('Invalid image');
      }

      // 压缩
      const compressed = await compressImage(file);
      setImage(compressed);

      // 生成预览
      const previewUrl = URL.createObjectURL(compressed);
      setPreview(previewUrl);
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
  }, []);

  // 清理
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return { image, preview, error, handleUpload };
}
```

---

## 🔄 Context API - 跨级状态

### 创建Context

```typescript
// contexts/ThemeContext.ts
import { createContext, useContext } from 'react';

interface Theme {
  mode: 'light' | 'dark';
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme必须在ThemeProvider内使用');
  }
  return context;
}
```

### Provider组件

```typescript
// providers/ThemeProvider.tsx
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [theme, setTheme] = useState<Theme>({ mode: 'light' });

  const toggleTheme = useCallback(() => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light'
    }));
  }, []);

  const value: ThemeContextType = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 在App中使用
<ThemeProvider>
  <App />
</ThemeProvider>
```

### 消费Context

```typescript
// 使用自定义hook
const MyComponent = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className={theme.mode}>
      <button onClick={toggleTheme}>切换主题</button>
    </div>
  );
};
```

---

## 📊 异步状态管理

### 处理Promise状态

```typescript
// ✅ 完整的异步处理
const useAsyncEvaluation = (imageBase64: string) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!imageBase64) return;

    const evaluate = async () => {
      setStatus('pending');
      try {
        const result = await evaluateHandwriting(imageBase64);
        setData(result);
        setStatus('success');
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setStatus('error');
      }
    };

    evaluate();
  }, [imageBase64]);

  return { status, data, error };
};

// 使用
const { status, data, error } = useAsyncEvaluation(imageBase64);

if (status === 'pending') return <LoadingSpinner />;
if (status === 'error') return <ErrorMessage error={error} />;
if (status === 'success') return <ResultCard result={data} />;
return <EmptyState />;
```

---

## 🎨 最佳实践

### 1. 状态尽可能靠近使用位置

```typescript
// ❌ 不好：所有状态都在顶层
const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  
  return <DeepChild modalOpen={modalOpen} setModalOpen={setModalOpen} />;
};

// ✅ 好：状态在使用的地方
const App = () => {
  return <Modal />;
};

const Modal = () => {
  const [isOpen, setIsOpen] = useState(false);
  // ...
};
```

### 2. 避免过度使用Context/Zustand

```typescript
// ❌ 过度使用
const useAppStore = create(() => ({
  buttonLabel: 'Click me',      // 这不应该在全局状态
  isButtonHovered: false,       // 这也不应该
  // ...
}));

// ✅ 合理使用
const useAppStore = create(() => ({
  user: null,                   // ✅ 需要全局访问
  evaluationHistory: [],        // ✅ 需要全局访问
  theme: 'light'               // ✅ 需要全局访问
}));
```

### 3. 选择正确的状态管理工具

| 情况 | 工具 | 理由 |
|------|------|------|
| UI组件内部状态 | useState | 简单、快速 |
| 表单数据 | useState | 本地数据 |
| 用户信息 | Zustand | 全局访问 |
| 主题色 | Context | 跨组件树 |
| 临时UI状态 | useState | 组件级 |
| 评估历史 | Zustand | 全局持久化 |

---

**最后更新**: 2025-12-04
