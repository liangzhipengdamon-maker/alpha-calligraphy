# 数据库设计

## 📊 Firestore 集合设计

### 集合概览

```
Firestore Database
├── users/                        # 用户信息
├── evaluations/                  # 评估记录
├── feedback/                     # 用户反馈
└── statistics/                   # 统计数据
```

## 👥 Users 集合

### 文档结构

```typescript
// collections/users/{userId}
interface User {
  uid: string;                     // Firebase UID (文档ID)
  email: string;                   // 用户邮箱
  username: string;                // 用户名
  avatar?: string;                 // 头像URL
  level?: "beginner" | "intermediate" | "advanced";  // 用户水平
  createdAt: Timestamp;            // 创建时间
  updatedAt: Timestamp;            // 更新时间
  totalEvaluations: number;        // 总评估次数
  averageScore: number;            // 平均分数
  preferences: {
    language: string;              // 偏好语言
    notifications: boolean;        // 是否接收通知
    privateProfile: boolean;       // 是否私密
  };
}
```

### 索引

```
复合索引:
- createdAt (升序) + totalEvaluations (降序)
- level + averageScore (降序)
```

---

## 📝 Evaluations 集合

### 文档结构

```typescript
// collections/evaluations/{evaluationId}
interface EvaluationRecord {
  evaluationId: string;            // 评估ID (文档ID)
  userId: string;                  // 用户ID (外键)
  imageUrl: string;                // 图片URL (Firebase Storage)
  imagePath: string;               // Storage路径
  imageSize: number;               // 图片大小(字节)
  
  // 评分数据
  scores: {
    brushQuality: number;          // 笔画质量 (0-25)
    structureAnalysis: number;     // 结构分析 (0-35)
    strokeConnection: number;      // 笔画连接 (0-15)
    overallEvaluation: number;     // 整体评价 (0-25)
  };
  
  totalScore: number;              // 总分 (0-100)
  level: "优秀" | "良好" | "中等" | "及格" | "需改进";
  
  // 评估内容
  explanations: {
    brushQuality: string;
    structureAnalysis: string;
    strokeConnection: string;
    overallEvaluation: string;
  };
  
  suggestions: string[];           // 3-5条改进建议
  encouragement: string;           // 鼓励语言
  
  // 元数据
  evaluatedAt: Timestamp;          // 评估时间
  processingTime: number;          // 处理时间(毫秒)
  
  // 反馈
  userFeedback?: {
    helpful: boolean;
    accurate: boolean;
    rating: 1 | 2 | 3 | 4 | 5;
    comment?: string;
    feedbackAt: Timestamp;
  };
}
```

### 索引设计

```
单字段索引:
- userId (升序) - 用户历史查询
- totalScore (降序) - 排行
- evaluatedAt (降序) - 时间序列

复合索引:
- userId + evaluatedAt (降序) - 用户历史排序
- userId + totalScore (降序) - 用户最高分
- level + evaluatedAt (降序) - 等级统计
```

### 查询示例

```typescript
// 获取用户最近10条评估
db.collection('evaluations')
  .where('userId', '==', userId)
  .orderBy('evaluatedAt', 'desc')
  .limit(10)

// 获取某个等级的评估
db.collection('evaluations')
  .where('level', '==', '优秀')
  .orderBy('evaluatedAt', 'desc')
  .limit(50)

// 获取高分评估（排行榜）
db.collection('evaluations')
  .orderBy('totalScore', 'desc')
  .limit(100)
```

---

## 💬 Feedback 集合

### 文档结构

```typescript
// collections/feedback/{feedbackId}
interface FeedbackRecord {
  feedbackId: string;              // 反馈ID (文档ID)
  userId: string;                  // 用户ID (外键)
  evaluationId: string;            // 评估ID (外键)
  
  // 反馈内容
  helpful: boolean;                // 是否有帮助
  accurate: boolean;               // 是否准确
  rating: 1 | 2 | 3 | 4 | 5;      // 整体评分
  comment?: string;                // 自由评论
  
  // 元数据
  submittedAt: Timestamp;          // 提交时间
  
  // 改进建议
  suggestedImprovements?: string[]; // 用户建议的改进
  issueCategory?: "accuracy" | "responsiveness" | "design" | "other";
}
```

### 用途
- 收集用户反馈
- 优化评估算法
- 监控服务质量

---

## 📈 Statistics 集合

### 文档结构

```typescript
// collections/statistics/{statisticId}
interface DailyStatistics {
  statisticId: string;             // 统计ID
  date: string;                    // 日期 (YYYY-MM-DD)
  
  // 用户统计
  totalUsers: number;              // 总用户数
  activeUsers: number;             // 活跃用户数
  newUsers: number;                // 新增用户数
  
  // 评估统计
  totalEvaluations: number;        // 总评估次数
  averageScore: number;            // 平均分数
  topScore: number;                // 最高分
  
  // 等级分布
  levelDistribution: {
    excellent: number;             // 优秀等级数
    good: number;
    medium: number;
    acceptable: number;
    needsImprovement: number;
  };
  
  // 反馈统计
  helpfulFeedback: number;         // 有帮助的反馈数
  feedbackRating: number;          // 平均反馈评分
  
  // 服务指标
  averageResponseTime: number;     // 平均响应时间(ms)
  apiErrors: number;               // API错误数
  
  recordedAt: Timestamp;           // 记录时间
}
```

### 聚合查询

```typescript
// 获取周统计
const weekStart = new Date();
weekStart.setDate(weekStart.getDate() - 7);

db.collection('statistics')
  .where('date', '>=', dateString(weekStart))
  .orderBy('date', 'asc')
  .get()
```

---

## 🗄️ Firebase Storage 设计

### 存储结构

```
inkmaster-ai-bucket/
├── evaluations/
│   ├── {userId}/
│   │   ├── {evaluationId}_original.jpg     # 原图
│   │   ├── {evaluationId}_compressed.jpg  # 压缩图
│   │   └── metadata.json                  # 元数据
│   │
│   └── temp/                               # 临时文件
│       └── {sessionId}_*.jpg               # 临时预览
│
├── users/
│   └── {userId}/
│       └── avatar.jpg                     # 用户头像
│
└── backups/
    └── {timestamp}/                       # 定期备份
```

### 访问规则

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 用户只能访问自己的评估图片
    match /evaluations/{userId}/{allPaths=**} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId
                   && request.resource.size < 10 * 1024 * 1024; // 10MB限制
    }
    
    // 临时文件写入权限
    match /evaluations/temp/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📊 关系图

```
Users (1)
  ├──── (N) Evaluations
  │        ├──── (1) Image (Firebase Storage)
  │        └──── (N) Feedback
  │
  ├──── (N) Feedback
  │
  └──── (1) User Statistics

Statistics (1 per day)
  └──── Aggregate of all Evaluations on that day
```

---

## 🔄 数据一致性策略

### 原子操作

```typescript
// 保存评估时的原子操作
const batch = db.batch();

// 1. 保存评估记录
const evalRef = db.collection('evaluations').doc();
batch.set(evalRef, evaluationData);

// 2. 更新用户统计
const userRef = db.collection('users').doc(userId);
batch.update(userRef, {
  totalEvaluations: increment(1),
  averageScore: newAverage
});

// 3. 提交所有更改
await batch.commit();
```

### 事务处理

```typescript
// 复杂业务逻辑的事务
await db.runTransaction(async (transaction) => {
  // 读取当前数据
  const userDoc = await transaction.get(userRef);
  
  // 计算新值
  const newTotal = userDoc.data().total + 1;
  
  // 原子更新
  transaction.update(userRef, { total: newTotal });
});
```

---

## 🔒 安全最佳实践

### 数据加密

```
- 传输层: HTTPS + TLS
- 存储层: Firebase加密at rest
- 敏感数据: 额外加密（如API key）
```

### 访问控制

```javascript
// 只读权限
allow read: if request.auth.uid == resource.data.userId;

// 写入权限（需验证）
allow write: if request.auth.uid == resource.data.userId
             && request.time < resource.data.expiresAt;
```

### 审计日志

```typescript
// 记录重要操作
const auditLog = {
  userId,
  action: 'evaluation_created',
  timestamp: new Date(),
  result: 'success'
};
```

---

## 📈 性能优化

### 分页查询

```typescript
// 使用cursor分页
let query = db.collection('evaluations')
  .where('userId', '==', userId)
  .orderBy('evaluatedAt', 'desc')
  .limit(10);

const firstPage = await query.get();
const lastDoc = firstPage.docs[firstPage.docs.length - 1];

// 获取下一页
const nextPage = await query
  .startAfter(lastDoc)
  .limit(10)
  .get();
```

### 缓存策略

```typescript
// 启用离线持久化
firebase.firestore().enablePersistence()
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // 多个标签打开
    }
  });
```

### 批量操作

```typescript
// 批量写入评估
const batch = db.batch();
evaluations.forEach(eval => {
  const ref = db.collection('evaluations').doc();
  batch.set(ref, eval);
});
await batch.commit();
```

---

**最后更新**: 2025-12-04
