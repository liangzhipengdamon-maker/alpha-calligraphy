# 快速开始指南

## ⚡ 5分钟快速启动

### 📋 前置条件检查

```bash
node -v          # 应该 >= v16.0.0
npm -v           # 应该 >= 8.0.0
git --version    # 应该有版本信息
```

### 🎬 第1步：克隆仓库（1分钟）

```bash
git clone https://github.com/your-repo/inkmaster-ai.git
cd inkmaster-ai
```

### 📦 第2步：安装依赖（2-3分钟）

```bash
npm install
```

**如果网络慢，使用国内镜像**:
```bash
npm install --registry https://registry.npmmirror.com
```

### 🔑 第3步：配置环境变量（1分钟）

在项目根目录创建 `.env.local` 文件：

```env
# Gemini API Key
# 获取: https://aistudio.google.com/apikey
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Firebase配置
# 获取: https://console.firebase.google.com
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc...
```

### 🚀 第4步：启动开发服务器（1分钟）

```bash
npm run dev
```

你会看到：
```
  VITE v4.5.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

**打开浏览器，访问 http://localhost:5173**

✅ 恭喜！开发环境启动完成！

## 📝 常用命令速查表

| 命令 | 功能 | 场景 |
|------|------|------|
| `npm run dev` | 启动开发服务器 | 日常开发 |
| `npm run build` | 构建生产版本 | 打包部署 |
| `npm run preview` | 本地预览生产构建 | 发布前验证 |
| `npm run lint` | ESLint代码检查 | 质量检验 |
| `npm run format` | Prettier代码格式化 | 代码美化 |
| `npm run type-check` | TypeScript类型检查 | 类型安全 |
| `npm run test` | 运行单元测试 | 功能测试 |
| `npm run test:ui` | UI模式运行测试 | 可视化测试 |
| `npm run test:e2e` | 运行端到端测试 | 集成测试 |

## 🔑 API Key获取指南

### Gemini API Key

1. 访问 https://aistudio.google.com/apikey
2. 点击 **"Create API Key"** 按钮
3. 复制生成的API Key
4. 粘贴到 `.env.local` 的 `VITE_GEMINI_API_KEY`

### Firebase配置

1. 访问 https://console.firebase.google.com
2. 创建新项目或选择现有项目
3. **Project Settings** → **Your apps** → Web应用
4. 复制Firebase配置信息到 `.env.local`

## 🏗️ 项目结构导航

```
src/
├── pages/
│   └── EvaluationPage.tsx    # 📍 评估页面 - 从这里开始
├── components/
│   └── ARLightBox.tsx        # 📍 AR透台 - 核心UI
├── services/
│   ├── aiService.ts          # 📍 Gemini集成
│   └── firebaseService.ts    # 📍 Firebase配置
└── ...
```

## ✅ 首次启动检查清单

- [ ] Node.js版本 >= v16.0.0
- [ ] npm install 完成，无错误
- [ ] `.env.local` 文件已创建
- [ ] Gemini API Key已配置正确
- [ ] Firebase所有配置字段已填入
- [ ] `npm run dev` 启动成功
- [ ] 浏览器访问 http://localhost:5173 可用

## 🐛 常见问题快速解决

### Q: npm install 失败？
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --registry https://registry.npmmirror.com
```

### Q: 开发服务器启动失败？
- 检查Node版本：`node -v`（需要16+）
- 检查端口5173是否被占用
- 清除缓存：`rm -rf node_modules/.vite`

### Q: Gemini API返回401错误？
1. API Key复制是否完整（无多余空格）
2. API Key是否被禁用
3. 重启开发服务器

### Q: Firebase连接失败？
1. 检查所有环境变量是否正确
2. Firebase项目是否真实存在
3. Firestore数据库是否已创建
4. 检查Firestore规则是否允许读写

---

**祝你开发愉快！** 🚀

最后更新: 2025-12-04
