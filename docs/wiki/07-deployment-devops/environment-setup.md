# 环境配置

## 🔧 开发环境

### .env.local

```env
# Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key

# Firebase
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=project-id
VITE_FIREBASE_STORAGE_BUCKET=project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc...
VITE_FIREBASE_DATABASE_URL=https://project.firebaseio.com

# 开发配置
VITE_API_TIMEOUT=5000
VITE_MAX_IMAGE_SIZE=10485760
```

### .env.example

提交到Git，供其他开发者参考：

```env
VITE_GEMINI_API_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_DATABASE_URL=
VITE_API_TIMEOUT=5000
VITE_MAX_IMAGE_SIZE=10485760
```

### .env.production

生产环境变量（不提交）：

```env
VITE_GEMINI_API_KEY=prod_key
VITE_FIREBASE_PROJECT_ID=production-project
# 其他生产配置...
```

## 🔐 获取API凭证

### Gemini API Key

1. 访问 https://aistudio.google.com/apikey
2. 点击"Create API Key"
3. 选择或创建项目
4. 复制Key并配置到.env.local

### Firebase配置

1. 访问 https://console.firebase.google.com
2. 创建或选择项目
3. Project Settings → Your apps → Web
4. 复制配置信息

---

**最后更新**: 2025-12-04
