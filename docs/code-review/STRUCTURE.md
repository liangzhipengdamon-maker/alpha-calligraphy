# Code Review 项目结构导航

## 📁 文件夹组织

```
code_review/
├── README.md                    # 审视指南（从这里开始）
├── STRUCTURE.md                 # 本文件，完整项目结构导航
├── docs/                        # 技术文档合集
│   ├── 00-快速启动指南.md      # MVP 功能演示、环境配置、启动步骤
│   ├── 01-项目概述.md          # 项目背景、业务目标、技术栈全景
│   ├── 02-系统架构.md          # 三层架构、数据流、模块划分
│   ├── 03-四维评分体系.md      # 评分标准详解、权重设计、计算方式
│   ├── 04-Prompt工程.md        # 核心 Prompt 设计、最佳实践、调试指南
│   ├── 05-快速启动.md          # Phase 1 规划、页面设计、技术实现细节
│   └── 06-开发进度.md          # 已完成功能、已知问题、后续计划
└── code/                        # 核心源代码副本（供审视参考）
    ├── aiService.ts            # AI 评估服务（核心业务逻辑）
    ├── EvaluationPage.tsx       # 评估页面（主要 UI 组件）
    ├── types.ts                # TypeScript 类型定义
    ├── firebaseService.ts       # Firebase 初始化和认证
    ├── package.json            # 项目依赖和脚本配置
    └── tsconfig.json           # TypeScript 编译配置
```

## 📖 阅读顺序建议

### 对于架构师的审视流程：

1. **10 分钟快速概览**
   - 阅读 `README.md` - 了解审视框架
   - 阅读 `01-项目概述.md` - 项目背景和目标

2. **30 分钟架构深入**
   - 阅读 `02-系统架构.md` - 理解整体架构设计
   - 浏览 `code/types.ts` - 了解数据模型

3. **20 分钟核心功能逻辑**
   - 阅读 `03-四维评分体系.md` - 理解评分标准
   - 阅读 `04-Prompt工程.md` - 理解 AI 集成方式
   - 详读 `code/aiService.ts` - 理解 API 集成和重试机制

4. **15 分钟 UI/UX 和初始化**
   - 阅读 `code/EvaluationPage.tsx` - 理解用户交互流程
   - 阅读 `code/firebaseService.ts` - 理解后端初始化

5. **10 分钟开发状态和建议**
   - 阅读 `06-开发进度.md` - 了解当前状态和后续计划
   - 参考 `05-快速启动.md` - 了解 Phase 1 具体规划

### 对于开发者参考：
- 快速启动：`00-快速启动指南.md` + `code/package.json`
- 功能实现参考：各 `code/` 下的源文件
- 问题排查：`06-开发进度.md` 的"已知问题"部分

## 🎯 核心代码模块

### `aiService.ts` - AI 评估核心
**关键职责**：
- 调用 Gemini 2.5 Flash Vision API
- 实现指数退避重试机制
- 缓存评估结果
- 格式化请求 Payload 和响应处理

**关键方法**：
- `evaluateHandwriting(imageBase64, targetChar)` - 主入口
- `callGeminiWithRetry()` - 带重试的 API 调用
- `buildPayload()` - 构建请求体，包含 System Prompt

**Prompt 设计**：四维评分标准集成在 buildPayload 中的 systemPrompt

---

### `EvaluationPage.tsx` - 主 UI 组件
**关键职责**：
- 文件上传和图片压缩
- 状态管理（图片、报告、加载状态）
- 用户交互处理
- 报告展示

**关键 Hook**：
- `useEffect()` - Firebase 初始化和 AI 服务初始化
- `handleGenerateReport()` - 评估流程触发

**改进点**：
- Firebase 初始化非阻塞化，不影响 AI 功能
- 评估前清空旧报告数据
- 详细的错误消息展示

---

### `types.ts` - 数据模型
**关键接口**：
- `EvaluationResult` - 评估结果数据结构
- `User` - 用户信息
- `Character` - 文字数据模型
- `Stroke` - 笔画定义

---

### `firebaseService.ts` - 后端初始化
**关键职责**：
- Firebase 应用初始化
- 匿名认证
- Firestore、Storage、Auth 初始化

**改进点**：非阻塞式初始化，failure graceful

---

## 🔧 技术栈速查

| 层级 | 技术 | 版本 | 用途 |
|------|------|------|------|
| **前端框架** | React | 18.2 | UI 框架 |
| **语言** | TypeScript | 5.2 | 类型安全 |
| **构建工具** | Vite | 4.5 | 开发和构建 |
| **样式** | Tailwind CSS | 3.3 | UI 样式 |
| **AI API** | Gemini 2.5 Flash Vision | - | 书法评估 |
| **后端** | Firebase | 10.4 | Auth, Firestore, Storage |
| **状态管理** | Zustand | 4.4 | 全局状态（预留） |

---

## ✅ 审视清单

- [ ] 架构设计是否合理？
- [ ] 四维评分体系的实现是否完整？
- [ ] Prompt 工程是否有优化空间？
- [ ] 错误处理和重试机制是否足够健壮？
- [ ] Firebase 依赖是否应该解耦？
- [ ] UI/UX 流程是否清晰直观？
- [ ] 代码可维护性是否足够？
- [ ] 后续扩展点在哪里？

---

## 💡 核心设计决策

1. **AI 服务独立化**：AIService 不依赖 Firebase，提高解耦性
2. **非阻塞初始化**：Firebase 失败不影响 AI 功能可用性
3. **缓存机制**：同一图片的评估结果被缓存，提高性能
4. **重试机制**：使用指数退避算法处理 API 调用失败
5. **JSON 响应**：Gemini API 直接返回结构化 JSON，简化解析

---

## 📞 快速问题导航

**"页面卡住不显示结果"** → 查看 `06-开发进度.md#已知问题`
**"如何修改评分标准"** → 查看 `03-四维评分体系.md` + `code/aiService.ts` 的 buildPayload
**"如何改进 Prompt"** → 查看 `04-Prompt工程.md`
**"如何添加新功能"** → 查看 `05-快速启动.md` 的后续规划
**"如何部署到生产"** → 查看 `00-快速启动指南.md#构建和部署`

---

生成时间：2025-12-11
