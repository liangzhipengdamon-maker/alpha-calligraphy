# 部署指南

## 🚀 部署流程

### 1. 生产构建

```bash
# 构建
npm run build

# 验证构建
npm run preview

# 检查大小
npm run build -- --report

# 生成CHANGELOG
npm run changelog
```

### 2. Firebase部署

```bash
# 安装Firebase CLI
npm install -g firebase-tools

# 初始化（第一次）
firebase init hosting

# 登录
firebase login

# 部署
firebase deploy --only hosting:production

# 验证
curl https://inkmaster-ai.web.app/
```

### 3. 环境变量配置

```bash
# 复制环境变量模板
cp .env.example .env.production

# 填入生产环境值
# VITE_GEMINI_API_KEY=...
# VITE_FIREBASE_*=...
```

---

## 📋 部署检查清单

### 代码质量
- [ ] ESLint无错误：`npm run lint`
- [ ] TypeScript无错误：`npm run type-check`
- [ ] 所有测试通过：`npm run test`
- [ ] E2E测试通过：`npm run test:e2e`
- [ ] 代码覆盖率>80%

### 性能指标
- [ ] Bundle大小<300KB：`npm run build`
- [ ] Lighthouse>90：`npm run lighthouse`
- [ ] 首屏加载<1.5s
- [ ] API响应<3s

### 安全性
- [ ] 无安全漏洞：`npm audit`
- [ ] 环境变量正确配置
- [ ] Firebase规则已验证
- [ ] CORS配置正确

### 文档
- [ ] README.md已更新
- [ ] API文档完整
- [ ] CHANGELOG已更新
- [ ] 部署说明完整

---

## 🔄 回滚方案

```bash
# 查看部署历史
firebase hosting:channels:list

# 切换到上一个版本
firebase hosting:channels:deploy [previous-channel]

# 直接回滚
firebase hosting:rollback
```

---

**最后更新**: 2025-12-04
