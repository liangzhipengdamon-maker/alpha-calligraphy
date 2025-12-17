# 问题排查

## 🔍 常见错误及解决方案

### Gemini API 错误

#### 401 Unauthorized
**原因**: API Key无效或过期
**解决**:
```bash
# 1. 检查.env.local
echo $VITE_GEMINI_API_KEY

# 2. 访问https://aistudio.google.com/apikey重新生成

# 3. 重启开发服务器
npm run dev
```

#### 429 Rate Limited
**原因**: 请求过于频繁
**解决**:
```typescript
// 添加重试逻辑和延迟
const evaluateWithRetry = async (image: string, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await evaluateHandwriting(image);
    } catch (error) {
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
};
```

### Firebase错误

#### Connection refused
**原因**: Firebase规则阻止访问
**解决**:
```javascript
// 暂时开放权限（仅开发）
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

#### Quota exceeded
**原因**: 超过免费配额
**解决**:
```
1. 升级Firebase计划
2. 优化查询（添加索引）
3. 启用数据缓存
```

### 部署错误

#### 403 Forbidden
**原因**: 没有部署权限
**解决**:
```bash
firebase logout
firebase login
firebase use --add
```

#### CORS error
**原因**: 跨域请求被阻止
**解决**: 检查Firebase CORS配置

---

**最后更新**: 2025-12-04
