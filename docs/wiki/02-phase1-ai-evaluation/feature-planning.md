# Phase 1功能规划

**目标**: 实现AI硬笔书法评估MVP（1-2周）

## 🎯 核心功能清单

### 1. 图片上传与处理
- [ ] 单张图片上传
- [ ] 图片预览
- [ ] 图片格式验证（JPG、PNG）
- [ ] 图片大小限制（≤10MB）
- [ ] 图片压缩优化

### 2. AR透台实时预览
- [ ] 范字显示
- [ ] 用户字迹叠加
- [ ] 透明度调整滑块
- [ ] 缩放与平移手势
- [ ] 实时预览反馈

### 3. AI评估核心
- [ ] Gemini 2.0 Flash集成
- [ ] Vision API调用
- [ ] 四维评分计算
- [ ] 评估错误处理
- [ ] 评估超时处理

### 4. 四维评分系统
- [ ] 笔画质量分（25%）
- [ ] 结构分析分（35%）
- [ ] 笔画连接分（15%）
- [ ] 整体评价分（25%）
- [ ] 综合得分计算

### 5. 评估报告生成
- [ ] 分数卡片展示
- [ ] 评分维度详解
- [ ] 改进建议生成
- [ ] 学习资源推荐
- [ ] 报告导出功能

### 6. 用户反馈收集
- [ ] 评估满意度反馈
- [ ] 改进意见收集
- [ ] 数据上传Firebase
- [ ] 反馈统计分析

## 📊 页面设计规范

### EvaluationPage 布局（多邻国风格）

```
┌─────────────────────────────────┐
│  🎨 硬笔书法AI评估               │
├─────────────────────────────────┤
│ [选择图片]  [📷 拍照]           │
├─────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐
│  │  用户字迹   │  │  参考字迹   │
│  │   预览      │  │   参考      │
│  └─────────────┘  └─────────────┘
│  透明度: [========] 50%        │
├─────────────────────────────────┤
│  [🚀 立即评估]                 │
├─────────────────────────────────┤
│  评估结果 (正在分析...)          │
├─────────────────────────────────┤
│  📊 评分结果                     │
│  ├─ 笔画质量: ⭐⭐⭐⭐ 85分     │
│  ├─ 结构分析: ⭐⭐⭐ 70分      │
│  ├─ 笔画连接: ⭐⭐⭐⭐ 78分     │
│  └─ 整体评价: ⭐⭐⭐⭐ 82分     │
│  总分: 80分 🌟 良好             │
├─────────────────────────────────┤
│  💡 改进建议                     │
│  1. 增加笔力，避免笔画过轻      │
│  2. 调整部件间距，保持均衡      │
│  3. 加强笔画连贯性              │
├─────────────────────────────────┤
│  [👍 很有用]  [👎 不准确]      │
└─────────────────────────────────┘
```

## 🛠️ 技术实现细节

### AI评估流程

```typescript
// 1. 图片上传
const handleImageUpload = (file: File) => {
  // 验证格式、大小
  // 压缩图片
  // 转Base64
}

// 2. 发送到Gemini
const evaluateHandwriting = async (imageBase64: string) => {
  const response = await genAI
    .getGenerativeModel({ model: "gemini-2.0-flash" })
    .generateContent({
      contents: [{
        parts: [
          { text: "评估这个硬笔字迹..." },
          { inline_data: { mime_type: "image/jpeg", data: imageBase64 } }
        ]
      }]
    })
  return parseEvaluationResult(response)
}

// 3. 解析结果
const parseEvaluationResult = (response: string) => {
  return {
    brushQuality: 85,      // 25%权重
    structureAnalysis: 70,  // 35%权重
    strokeConnection: 78,   // 15%权重
    overallEvaluation: 82,  // 25%权重
    suggestions: [...]
  }
}

// 4. 计算总分
const calculateTotalScore = (scores: ScoreObject) => {
  return (
    scores.brushQuality * 0.25 +
    scores.structureAnalysis * 0.35 +
    scores.strokeConnection * 0.15 +
    scores.overallEvaluation * 0.25
  )
}
```

### Prompt工程

见 [Prompt工程指南](prompt-engineering.md)

## 📱 UI组件清单

| 组件 | 功能 | 状态 |
|------|------|------|
| `MSSImageUpload` | 图片上传 | ⏳ 待开发 |
| `MSSARLightBox` | AR透台预览 | ⏳ 待开发 |
| `MSSScoreCard` | 评分卡片 | ⏳ 待开发 |
| `MSSEvaluationButton` | 评估按钮 | ⏳ 待开发 |
| `MSSFeedbackForm` | 反馈表单 | ⏳ 待开发 |
| `MSSSuggestionPanel` | 建议面板 | ⏳ 待开发 |

## 🧪 测试计划

### 单元测试
- [ ] 图片验证逻辑
- [ ] 分数计算公式
- [ ] 结果解析逻辑
- [ ] UI组件渲染

### 集成测试
- [ ] 端到端评估流程
- [ ] Gemini API集成
- [ ] Firebase数据上传
- [ ] 错误处理流程

### 性能测试
- [ ] 图片压缩速度
- [ ] API响应时间（<3s）
- [ ] UI交互流畅度
- [ ] 内存使用量

## 📈 验收标准

✅ **功能完整性**
- 图片上传成功率 >99%
- AR预览显示正常
- AI评估准确率 >85%
- 评分维度完整

✅ **性能指标**
- 评估响应时间 <3秒
- 页面首屏加载 <2秒
- UI交互无卡顿（60fps）

✅ **用户体验**
- 流程直观易用
- 反馈及时清晰
- 无明显bug
- 易于理解评分结果

## 🚀 开发时间表

| 阶段 | 任务 | 时间 | 状态 |
|------|------|------|------|
| Week 1 Day 1-2 | UI设计 & 组件搭建 | 2天 | ⏳ |
| Week 1 Day 3-4 | Gemini集成 & 评估逻辑 | 2天 | ⏳ |
| Week 1 Day 5 | 测试 & 优化 | 1天 | ⏳ |
| Week 2 Day 1-2 | 改进 & 迭代 | 2天 | ⏳ |
| Week 2 Day 3-5 | 用户反馈 & 微调 | 3天 | ⏳ |

---

**最后更新**: 2025-12-04
