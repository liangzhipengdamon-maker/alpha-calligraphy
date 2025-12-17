# 技术栈选型

## 📚 完整技术栈

### 前端框架与工具

| 技术 | 版本 | 用途 | 为什么选择 |
|------|------|------|---------|
| **React** | 18.2 | UI框架 | 现代化、社区最大、性能最优 |
| **TypeScript** | 5.2 | 类型系统 | 类型安全、开发体验好 |
| **Vite** | 4.5 | 构建工具 | 极速HMR、现代化、零配置 |
| **Tailwind CSS** | 3.3 | 样式框架 | 原子化、响应式、快速开发 |
| **Zustand** | 4.4 | 状态管理 | 轻量级、易上手、性能好 |
| **GSAP** | 3.12 | 动画库 | 高性能、功能强大 |
| **@use-gesture** | 10.3 | 手势识别 | React集成好、支持多手势 |

### 后端与AI服务

| 技术 | 用途 | 配置位置 |
|------|------|---------|
| **Google Gemini 2.0 Flash** | AI视觉分析 | .env.local |
| **Firebase Firestore** | 云数据库（新加坡） | Firebase Console |
| **Firebase Storage** | 云存储（美国） | Firebase Console |
| **Firebase Authentication** | 用户认证 | Firebase Console |

### 开发工具

| 工具 | 版本 | 用途 |
|------|------|------|
| **Vitest** | 0.34 | 单元测试 |
| **Playwright** | 1.39 | E2E测试 |
| **ESLint** | 8.x | 代码检查 |
| **Prettier** | 3.x | 代码格式化 |
| **npm** | 9+ | 包管理 |
| **Node.js** | 18+ | 运行环境 |

---

## 🎯 选型决策表

### 前端框架对比

| 特性 | React | Vue | Angular | Svelte |
|------|-------|-----|---------|--------|
| 学习曲线 | 中 | 中 | 高 | 低 |
| 社区规模 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 性能 | 极好 | 极好 | 好 | 极好 |
| 生态 | 最完善 | 完善 | 完善 | 薄弱 |
| 企业支持 | Meta | 社区 | Google | 社区 |
| **选择** | ✅ **React** | | | |

**选择理由**: 
- ✅ 社区最大，资源丰富
- ✅ 生态最完善
- ✅ 与Gemini/Firebase集成最好
- ✅ 团队经验最足

---

### 构建工具对比

| 特性 | Vite | Webpack | Parcel | esbuild |
|------|------|---------|--------|---------|
| HMR速度 | <100ms | 几秒 | 1-2s | <100ms |
| 配置 | 极简 | 复杂 | 零配置 | 需要 |
| 生态 | 优秀 | 最强 | 一般 | 轻量 |
| **选择** | ✅ **Vite** | | | |

**选择理由**:
- ✅ HMR极速（<100ms）
- ✅ React集成完美
- ✅ 配置简单
- ✅ 性能指标最优

---

### 状态管理对比

| 特性 | Zustand | Redux | Recoil | MobX |
|------|---------|-------|--------|------|
| 学习成本 | 低 | 中 | 中 | 高 |
| 包大小 | <1KB | ~5KB | ~3KB | ~4KB |
| 性能 | 优秀 | 良好 | 优秀 | 优秀 |
| 中间件 | 完整 | 丰富 | 有限 | 完整 |
| **选择** | ✅ **Zustand** | | | |

**选择理由**:
- ✅ 极轻量级
- ✅ 学习成本低
- ✅ 性能优异
- ✅ API简洁

---

### AI模型对比

| 模型 | 成本 | 速度 | 准确率 | 中文支持 | **选择** |
|------|------|------|--------|---------|---------|
| Gemini 2.0 Flash | $$ | 快 | 85%+ | ✅ | ✅ **选择** |
| Claude 3.5 | $$$$ | 中 | 90%+ | ✅ | |
| GPT-4V | $$$ | 慢 | 95%+ | ✅ | |
| LLaVA | $ | 快 | 70% | ✅ | |

**选择理由**:
- ✅ 成本最低
- ✅ 速度快（<3秒）
- ✅ 硬笔识别准确
- ✅ 免费配额充足

---

### 数据库对比

| 特性 | Firestore | MongoDB | PostgreSQL | Supabase |
|------|-----------|---------|------------|----------|
| 实时性 | 极强 | 弱 | 弱 | 强 |
| 无服务器 | ✅ | ❌ | ❌ | ✅ |
| 全文搜索 | 弱 | 强 | 强 | 强 |
| 成本 | 按使用 | 按实例 | 按实例 | 按使用 |
| **选择** | ✅ **Firestore** | | | |

**选择理由**:
- ✅ 完全无服务器
- ✅ 实时数据同步
- ✅ 与Firebase无缝集成
- ✅ 自动扩展

---

## 📦 依赖清单

### 生产依赖

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "vite": "^4.5.0",
    "typescript": "^5.2.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "zustand": "^4.4.0",
    "gsap": "^3.12.0",
    "@use-gesture/react": "^10.3.0",
    "@google/generative-ai": "^0.1.3",
    "firebase": "^10.4.0"
  }
}
```

### 开发依赖

```json
{
  "devDependencies": {
    "@vitejs/plugin-react": "^4.1.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "vitest": "^0.34.0",
    "@vitest/ui": "^0.34.0",
    "@testing-library/react": "^14.0.0",
    "playwright": "^1.39.0",
    "@playwright/test": "^1.39.0",
    "eslint": "^8.50.0",
    "eslint-config-react-app": "^7.0.0",
    "prettier": "^3.0.0"
  }
}
```

---

## 🔌 集成方案

### Gemini API集成

```typescript
// 初始化
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

// 调用
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const response = await model.generateContent({
  contents: [{
    parts: [
      { text: "评估这个硬笔字迹..." },
      { inline_data: { mime_type: "image/jpeg", data: base64Data } }
    ]
  }]
});
```

### Firebase集成

```typescript
// 初始化
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  // ...
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// 保存数据
await setDoc(doc(db, "evaluations", evalId), evaluationData);
```

---

## 🚀 性能指标

### 前端性能目标

| 指标 | 目标值 | 工具验证 |
|------|--------|---------|
| 首屏加载 (FCP) | <1.5s | Lighthouse |
| 最大内容绘制 (LCP) | <2.5s | Web Vitals |
| 累积布局偏移 (CLS) | <0.1 | Web Vitals |
| Bundle大小 | <300KB | `npm run build` |
| Lighthouse评分 | >90 | Lighthouse |

### 后端性能目标

| 指标 | 目标值 |
|------|--------|
| Gemini API响应 | <3s |
| Firestore查询 | <100ms |
| Storage上传 | <2s |
| 总体端到端 | <5s |

---

## 🔒 安全性考虑

### 依赖安全

```bash
# 检查漏洞
npm audit

# 定期更新
npm update

# 使用确定版本
"dependencies": {
  "package": "1.2.3"  # 精确版本
}
```

### API安全

```
- ✅ API Key存储在 .env.local（不提交Git）
- ✅ Firebase规则限制数据访问
- ✅ HTTPS传输所有数据
- ✅ 敏感信息加密存储
```

---

## 📊 技术栈成熟度评估

| 技术 | 成熟度 | 推荐度 | 社区支持 |
|------|--------|--------|---------|
| React 18 | 极高 | ⭐⭐⭐⭐⭐ | 最强 |
| Vite 4 | 高 | ⭐⭐⭐⭐⭐ | 强 |
| Tailwind CSS | 高 | ⭐⭐⭐⭐⭐ | 强 |
| Zustand | 高 | ⭐⭐⭐⭐ | 好 |
| Gemini API | 高 | ⭐⭐⭐⭐ | 好 |
| Firebase | 极高 | ⭐⭐⭐⭐⭐ | 最强 |

---

## 🎓 学习资源

### 官方文档
- React: https://react.dev
- Vite: https://vitejs.dev
- Firebase: https://firebase.google.com/docs
- Gemini API: https://ai.google.dev

### 推荐教程
- React TypeScript: [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- Tailwind: [Tailwind CSS 中文](https://tailwindcss.vexip.one/)
- Firebase: [Firebase官方教程](https://firebase.google.com/codelabs)

---

**最后更新**: 2025-12-04
