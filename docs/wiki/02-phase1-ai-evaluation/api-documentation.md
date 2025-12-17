# API文档

## 🔌 核心API接口

### 1. 评估接口 (Evaluation API)

#### 端点

```
POST /api/evaluation/analyze
```

#### 请求参数

```typescript
interface EvaluationRequest {
  imageBase64: string;        // Base64编码的图片数据
  imageFormat: "jpeg" | "png"; // 图片格式
  imageSize: number;           // 图片大小(字节)
  referenceCharacter?: string;  // 参考字（可选）
  userLevel?: "beginner" | "intermediate" | "advanced"; // 用户水平
}
```

#### 请求示例

```bash
curl -X POST http://localhost:5173/api/evaluation/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "imageFormat": "jpeg",
    "imageSize": 102400,
    "userLevel": "beginner"
  }'
```

#### 响应结构

```typescript
interface EvaluationResponse {
  success: boolean;
  data: {
    brushQuality: {
      score: number;           // 0-25
      explanation: string;
      strengths: string[];
      weaknesses: string[];
    },
    structureAnalysis: {
      score: number;           // 0-35
      explanation: string;
      strengths: string[];
      weaknesses: string[];
    },
    strokeConnection: {
      score: number;           // 0-15
      explanation: string;
      strengths: string[];
      weaknesses: string[];
    },
    overallEvaluation: {
      score: number;           // 0-25
      explanation: string;
      strengths: string[];
      weaknesses: string[];
    },
    suggestions: string[];      // 3-5条改进建议
    totalScore: number;         // 0-100
    level: "优秀" | "良好" | "中等" | "及格" | "需改进";
    encouragement: string;      // 鼓励性文字
    processingTime: number;     // 处理时间(毫秒)
  },
  error?: {
    code: string;
    message: string;
  }
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "brushQuality": {
      "score": 22,
      "explanation": "笔画有力，线条流畅，笔触清晰",
      "strengths": ["笔力表现好", "笔触清晰"],
      "weaknesses": ["转折处稍生硬"]
    },
    "structureAnalysis": {
      "score": 28,
      "explanation": "结构协调，布局均衡，间距均匀",
      "strengths": ["部件比例协调", "整体平衡"],
      "weaknesses": ["竖笔稍微偏斜"]
    },
    "strokeConnection": {
      "score": 12,
      "explanation": "笔画连接自然，呼应明显",
      "strengths": ["转折自然"],
      "weaknesses": ["部分笔画呼应不足"]
    },
    "overallEvaluation": {
      "score": 20,
      "explanation": "整体美观，风格统一",
      "strengths": ["整体和谐", "审美表现好"],
      "weaknesses": ["气韵可进一步提升"]
    },
    "suggestions": [
      "加强转折处的笔力，让转折更加自然果断",
      "微调竖笔角度，确保完全竖直",
      "增加笔画之间的呼应，提升整体连贯性"
    ],
    "totalScore": 82,
    "level": "良好",
    "encouragement": "很棒！你的书法水平不错，保持这个势头，相信你会写得越来越好！",
    "processingTime": 2340
  }
}
```

### 2. 历史记录接口 (History API)

#### 获取评估历史

```
GET /api/history/evaluations?limit=10&offset=0
```

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": "eval_12345",
      "timestamp": "2025-12-04T10:30:00Z",
      "totalScore": 82,
      "level": "良好",
      "imageUrl": "gs://bucket/eval_12345.jpg"
    }
  ],
  "total": 45
}
```

#### 获取单个评估详情

```
GET /api/history/evaluations/{evalId}
```

### 3. 反馈接口 (Feedback API)

#### 提交反馈

```
POST /api/feedback/submit
```

**请求**:
```json
{
  "evaluationId": "eval_12345",
  "helpful": true,
  "accurate": true,
  "comment": "评估结果很准确！",
  "rating": 5
}
```

**响应**:
```json
{
  "success": true,
  "message": "反馈已保存"
}
```

## 🔐 错误处理

### 错误代码表

| 代码 | 含义 | HTTP状态 |
|------|------|---------|
| `INVALID_IMAGE` | 图片格式不支持或损坏 | 400 |
| `IMAGE_TOO_LARGE` | 图片超过大小限制 | 400 |
| `INVALID_FORMAT` | 请求格式不正确 | 400 |
| `API_ERROR` | Gemini API错误 | 500 |
| `TIMEOUT` | 评估超时 | 504 |
| `RATE_LIMIT` | 超过请求限制 | 429 |
| `UNAUTHORIZED` | 未授权 | 401 |
| `INTERNAL_ERROR` | 服务器内部错误 | 500 |

### 错误响应示例

```json
{
  "success": false,
  "error": {
    "code": "IMAGE_TOO_LARGE",
    "message": "图片大小超过限制(最大10MB)",
    "details": {
      "maxSize": 10485760,
      "actualSize": 15728640
    }
  }
}
```

## 📝 使用示例

### TypeScript客户端

```typescript
// 初始化客户端
const client = new EvaluationClient({
  baseUrl: 'http://localhost:5173/api',
  timeout: 5000
});

// 提交评估请求
const response = await client.evaluateHandwriting({
  imageBase64: imageData,
  imageFormat: 'jpeg',
  imageSize: imageSize,
  userLevel: 'beginner'
});

// 处理响应
if (response.success) {
  console.log(`总分: ${response.data.totalScore}`);
  console.log(`建议: ${response.data.suggestions.join(', ')}`);
} else {
  console.error(`错误: ${response.error.message}`);
}
```

### React Hook 使用

```typescript
const useEvaluation = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const evaluate = async (imageBase64: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/evaluation/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          imageFormat: 'jpeg',
          userLevel: 'beginner'
        })
      });

      if (!response.ok) throw new Error('评估失败');
      
      const data = await response.json();
      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  return { evaluate, loading, result, error };
};
```

## ⚡ 性能指标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 平均响应时间 | <3秒 | 包括图片上传和AI评估 |
| 99分位响应时间 | <5秒 | 最坏情况下的响应时间 |
| 可用性 | >99.5% | 全天可用性 |
| 吞吐量 | >100 req/s | 并发处理能力 |

## 🔒 安全性

### 认证

所有请求需要在Header中包含API Key：

```bash
Authorization: Bearer YOUR_API_KEY
```

### 速率限制

- 免费用户: 10 请求/分钟
- 付费用户: 100 请求/分钟

### 数据保护

- 所有图片数据加密传输
- 评估结果存储在Firebase (加密)
- 支持GDPR数据删除请求

---

**最后更新**: 2025-12-04
