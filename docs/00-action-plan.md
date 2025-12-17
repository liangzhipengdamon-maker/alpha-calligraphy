# Alpha-Calligraphy 项目开发行动纲领 v1.0

**项目名称**：Alpha-Calligraphy（名师手把手）  
**启动日期**：2024年12月  
**当前阶段**：Phase 1 MVP  
**文档版本**：v1.0  

---

## 📌 目录

1. [项目愿景](#项目愿景)
2. [核心价值主张](#核心价值主张)
3. [系统架构](#系统架构)
4. [技术栈](#技术栈)
5. [评分体系](#评分体系)
6. [开发计划与任务分解](#开发计划与任务分解)
7. [项目管理规范](#项目管理规范)
8. [多模态设计](#多模态设计)
9. [演进路线](#演进路线)

---

## 项目愿景

Alpha-Calligraphy 旨在通过 **AI 多模态能力**（字形识别、笔迹分析、姿态检测）构建一套 **智能硬笔书法教学引擎**，为中小学生提供：

- ✅ **全维度书写评估**：笔画质量、结构规范、笔顺正确、整体气韵
- ✅ **实时教学反馈**：课堂即时批改、学生进度追踪
- ✅ **个性化学习路径**：基于学生错误模式的改进建议
- ✅ **教师赋能**：降低批改工作量 30%+，集中精力做教学创新

---

## 核心价值主张

### 对学生的价值
1. **及时反馈**：写完即评，不等待教师批改
2. **多维度评估**：不仅看对错，还看笔画质量、笔势呼应
3. **可视化学习**：看到具体改进点，而不是模糊的"写不好"

### 对教师的价值
1. **批改效率**：从手工批改 → AI 辅助评分 → 教师审核
2. **教学数据**：班级学生书法水平分析，针对性教学
3. **教学创新**：释放时间做更高价值的事（如文化传承、艺术鉴赏）

### 对项目的价值
1. **成本优化**：从 Gemini 切换到 Qwen-VL，降低 API 成本 50%+
2. **技术创新**：通过 InkSight 笔迹分析推断笔力/笔速/笔势
3. **市场机会**：硬笔书法教学市场缺乏 AI 解决方案

---

## 系统架构

### 四层教学闭环架构

```
┌─────────────────────────────────────┐
│     输入层：双姿感知              │
│  （坐姿、执笔姿势检测）          │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│     笔画层：笔迹轨迹生成            │
│  （InkSight 提取笔画轨迹）        │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│   笔势层：笔画衔接与气韵评估        │
│  （笔势呼应、笔画连贯性）         │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│   结构层：结构解码与笔顺验证        │
│  （字形识别、笔顺对比、错误反馈）│
└─────────────────────────────────────┘
```

### AI 能力分层

#### Tier 1：字形识别（Qwen-VL）
- **功能**：识别学生写的是哪个汉字，对比标准字形
- **成本优化**：从 Gemini (0.02$/分钟) 切换到 Qwen-VL (0.001$/分钟)
- **精度**：95%+ （相当于 Gemini）

#### Tier 2：笔迹分析（Google InkSight）
- **功能**：提取笔画轨迹坐标、笔速、笔压（通过笔粗细推断）
- **创新点**：通过 **笔粗细变化** 推断：
  - **笔力强弱**：笔粗 = 笔力强，笔细 = 笔力轻
  - **笔速快慢**：笔粗细变化频繁 = 笔速慢，变化平缓 = 笔速快
  - **笔势评估**：笔画衔接是否流畅

#### Tier 3：姿态检测（MediaPipe Pose - Phase 2）
- **功能**：检测学生坐姿、执笔姿势是否规范
- **实现**：视频流 → MediaPipe → 关节点 → 评估
- **上线时间**：Phase 2（2025年1月）

#### Tier 4：教学数据分析（Phase 3）
- **功能**：班级级别数据分析，个性化学习路径推荐
- **上线时间**：Phase 3（2025年2月+）

---

## 技术栈

### 前端（React + TypeScript + Vite）
```
React 18.2 + TypeScript 5.2 + Vite 4.5
│
├─ Pages
│  ├── EvaluationPage: AI 书法评分页面
│  └── ClassroomPage: 课堂反馈系统
│
├─ Services
│  ├─ AI Provider (工厂模式)
│  │  ├── Qwen-VL 字形识别
│  │  ├── Gemini 备用方案
│  │  └── AIProviderFactory 动态切换
│  ├─ Trajectory Analysis
│  │  ├── InkSight 笔迹提取
│  │  ├── WritingRhythmAnalyzer 笔迹分析
│  │  └── StrokeValidator 笔顺验证
│  ├─ Posture Service (Phase 2)
│  │  └── MediaPipe 集成骨架
│  └─ Classroom Service
│     └── 课堂反馈系统
│
└─ Components
   ├── ImageUploader
   ├── EvaluationReport
   └── ProgressChart
```

### 后端（Flask + Python 3.10）
```
Flask 2.3 + Python 3.10
│
├─ app.py: Flask 主应用
├─ ai_engine.py: AI 推理引擎
├─ data_manager.py: 数据库操作
├─ image_processor.py: 图片处理
├─ wechat_notifier.py: 微信通知
└─ config.py: 配置管理
```

### 数据库（SQLite）
```
hanzi_teaching.db
├─ characters 表
│  ├── id: 汉字 ID
│  ├── hanzi: 汉字文本
│  ├── pinyin: 拼音
│  ├── level: 难度等级 (1-3)
│  ├── level1_structure: 一级分类 (12类结构)
│  ├── level2_features: 二级特征 (笔画特点)
│  ├── stroke_count: 笔画数
│  ├── basic_char: 基础字符标志
│  └── reference_image: 标准字形图
│
├─ user_progress 表
│  ├── user_id
│  ├── character_id
│  ├── writing_date
│  ├── score_quality: 笔画质量分 (0-25)
│  ├── score_structure: 结构分 (0-35)
│  ├── score_stroke_order: 笔顺分 (0-15)
│  ├── score_overall: 整体评价分 (0-25)
│  └── feedback
│
├─ user_posture 表 (Phase 2)
│  ├── user_id
│  ├── session_date
│  ├── posture_score: 坐姿评分
│  ├── grip_score: 执笔评分
│  └── common_errors: JSON 常见错误
│
└─ classroom_feedback 表
   ├── teacher_id
   ├── class_id
   ├── student_id
   ├── feedback_text
   └── created_at
```

### AI 服务
- **字形识别**：Qwen-VL (阿里云通义千问)
- **笔迹分析**：Google InkSight
- **姿态检测**：MediaPipe Pose (Phase 2)

### 版本控制 & 部署
- **Git**：GitHub + GitHub Actions
- **分支模式**：main (生产) / develop (开发) / feature/* (功能)
- **CI/CD**：GitHub Actions (自动化测试 + 构建)

---

## 评分体系

### Phase 1 MVP：四维评分体系

#### 1. 笔画质量评分 (占比 25%)
- **评估维度**：笔的粗细变化、力度表现
- **数据来源**：InkSight 笔迹轨迹
- **评分方法**：
  - 笔粗细均匀 ✅ (+10 分)
  - 笔力表现有力 ✅ (+10 分)
  - 笔触精细度 ✅ (+5 分)
- **实现方式**：通过笔粗细变化的标准差判断

#### 2. 结构分析评分 (占比 35%)
- **评估维度**：字形是否规范、笔画位置是否准确
- **数据来源**：Qwen-VL 识别 + hanzi_teaching.db 映射
- **评分方法**：
  - 一级结构匹配 (12类结构) ✅ (+20 分)
  - 二级特征准确 ✅ (+10 分)
  - 字形美观度评价 ✅ (+5 分)

#### 3. 笔顺规范性评分 (占比 15%)
- **评估维度**：笔顺是否符合汉字笔顺规范
- **数据来源**：InkSight 笔迹轨迹 + 标准笔顺库
- **评分方法**：
  - 笔顺完全正确 ✅ (+15 分)
  - 笔顺部分错误 ⚠️ (+8 分)
  - 笔顺完全错误 ❌ (0 分)

#### 4. 整体评价评分 (占比 25%)
- **评估维度**：笔势呼应、气韵连贯、整体美感
- **数据来源**：多模态融合
- **评分方法**：
  - 笔势呼应流畅 ✅ (+12 分)
  - 气韵连贯 ✅ (+8 分)
  - 整体美感评价 ✅ (+5 分)

### 最终评分
```
最终得分 = 笔画质量 × 0.25 + 结构分 × 0.35 + 笔顺分 × 0.15 + 整体评价 × 0.25
评级规则：
  90-100: 优秀 ⭐⭐⭐⭐⭐
  80-89:  良好 ⭐⭐⭐⭐
  70-79:  及格 ⭐⭐⭐
  60-69:  需改进 ⭐⭐
  <60:    重做 ⭐
```

---

## 开发计划与任务分解

### 总工时：12.5 天 (100 小时)

### Phase 1 MVP 任务列表

#### ✅ T0：项目整合与管理规范初始化 (0.5天)
- [x] 创建 Alpha-Calligraphy 目录结构
- [x] 代码资产迁移（React 前端 + Python 后端）
- [x] 初始化 Git 仓库与 .gitignore
- [x] 创建 package.json、tsconfig.json、.env
- [x] 保存本行动纲领为 docs/00-action-plan.md
- [x] GitHub 初始化配置

**交付物**：项目框架完整、可立即开始功能开发

---

#### T1：AI Provider 工厂模式实现 (1天)
**目标**：建立灵活的 AI 模型切换机制

**任务分解**：
1. 定义 IAIProvider 接口
   - `recognizeCharacter(image): Promise<CharacterResult>`
   - `analyzeWritingStyle(trajectoryData): Promise<StyleAnalysis>`
   - `generateFeedback(evaluationResult): Promise<string>`

2. 实现 QwenVLProvider
   - 对接阿里云 Qwen-VL API
   - 字形识别逻辑
   - 错误处理与重试机制

3. 实现 GeminiProvider（备用）
   - 对接 Google Gemini API
   - 保留灰度切换选项

4. 实现 AIProviderFactory
   - 根据环境变量动态切换
   - 支持 A/B 测试

5. 单元测试
   - Mock AI 服务响应
   - 测试工厂模式切换逻辑

**交付物**：
```
src/services/ai/
├── IAIProvider.ts (接口定义)
├── QwenVLProvider.ts (实现)
├── GeminiProvider.ts (备用)
├── AIProviderFactory.ts (工厂)
└── __tests__/
    └── AIProviderFactory.test.ts
```

**验收标准**：
- ✅ 所有 TypeScript 类型正确
- ✅ 单元测试覆盖率 ≥ 80%
- ✅ 可正常切换 Qwen-VL ↔ Gemini

---

#### T2：AI 书法评分引擎核心实现 (4天)
**目标**：实现四维评分系统的核心逻辑

**任务分解**：

##### T2.1：字形识别与结构分析 (1.5天)
1. 集成 Qwen-VL 字形识别
   - 调用 QwenVLProvider.recognizeCharacter()
   - 获取识别结果 + 置信度

2. 实现结构分析模块
   - hanzi_teaching.db 一级结构 (12类)
   - hanzi_teaching.db 二级特征映射
   - 得分计算：结构匹配度 × 权重

3. 数据库查询优化
   - 缓存常用汉字的结构数据
   - 实现快速查询

**交付物**：
```
src/services/ai/
├── CharacterRecognitionService.ts
├── StructureAnalyzer.ts
└── __tests__/
    └── CharacterRecognitionService.test.ts
```

##### T2.2：笔迹分析 - InkSight 集成 (1.5天)
1. InkSight API 对接
   - 笔画轨迹坐标提取
   - 笔粗细数据获取
   - 笔速/笔压推断

2. 实现 WritingRhythmAnalyzer
   - 通过笔粗细变化推断笔力
   - 通过笔粗细变化频率推断笔速
   - 笔势平稳度评估

3. 单元测试
   - Mock InkSight 数据
   - 测试笔迹分析逻辑

**交付物**：
```
src/services/trajectory/
├── InkSightService.ts (API 对接)
├── WritingRhythmAnalyzer.ts (笔迹分析)
├── types/
│   └── trajectory.ts (数据类型)
└── __tests__/
    └── WritingRhythmAnalyzer.test.ts
```

##### T2.3：笔顺验证 (1天)
1. 实现 StrokeValidator
   - 标准笔顺库查询
   - 笔迹轨迹与标准笔顺对比
   - 错误定位与反馈

2. 集成笔画顺序检测
   - 从 InkSight 轨迹数据识别笔画分割
   - 顺序判断逻辑

**交付物**：
```
src/services/trajectory/
├── StrokeValidator.ts
└── __tests__/
    └── StrokeValidator.test.ts
```

##### T2.4：评分聚合与报告生成 (1天)
1. 实现 ScoringAggregator
   - 四维评分权重计算
   - 最终得分与评级

2. 实现 EvaluationReportGenerator
   - 生成评估报告 JSON
   - 生成可视化反馈

**交付物**：
```
src/services/ai/
├── ScoringAggregator.ts
├── EvaluationReportGenerator.ts
└── __tests__/
    └── ScoringAggregator.test.ts
```

**验收标准**：
- ✅ 四维评分逻辑正确实现
- ✅ Qwen-VL + InkSight 成功集成
- ✅ 单元测试覆盖率 ≥ 85%
- ✅ 评分结果合理性检验通过

---

#### T3：课堂反馈系统 (3天)
**目标**：实现教师端实时批改、学生端接收反馈的完整流程

**任务分解**：

##### T3.1：后端课堂服务 (1.5天)
1. 实现 ClassroomService (Flask)
   - 学生作业上传接口 POST /api/submissions
   - 评分队列管理
   - 反馈存储与推送

2. 集成微信通知 (WeChat Notifier)
   - 学生完成通知
   - 反馈推送到学生微信
   - 教师批改通知

3. 数据库设计与实现
   - user_progress 表：学生进度追踪
   - classroom_feedback 表：课堂反馈记录
   - 索引优化

**交付物**：
```
classroom/
├── services/
│   └── ClassroomService.py
├── notifiers/
│   └── WeChatNotifier.py
└── models/
    └── database.py
```

##### T3.2：前端课堂反馈页面 (1.5天)
1. 实现 ClassroomPage 组件
   - 学生作业列表
   - 实时评分状态展示
   - 反馈查看与下载

2. 实现教师批改界面
   - 评分预览
   - 手动调整分数选项
   - 批量操作 (导出、发送反馈)

3. 进度可视化
   - 学生进度条
   - 班级平均分柱状图
   - 常见错误分析

**交付物**：
```
src/pages/
├── ClassroomPage.tsx
└── components/
    ├── StudentProgressList.tsx
    ├── FeedbackViewer.tsx
    └── ProgressChart.tsx
```

**验收标准**：
- ✅ 教师可正常批改和推送反馈
- ✅ 学生可实时接收反馈
- ✅ WeChat 通知发送成功率 ≥ 95%
- ✅ UI 响应时间 < 2s

---

#### T4：评估报告生成与导出 (2.5天)
**目标**：生成可视化评估报告，支持多种导出格式

**任务分解**：

##### T4.1：报告模板设计 (0.5天)
1. 定义报告结构
   - 学生信息
   - 书写日期与作品
   - 四维评分详情
   - 改进建议
   - 对标数据 (班级平均、历史对比)

2. 确定可视化组件
   - 雷达图：四维评分展示
   - 柱状图：历史对比
   - 热力图：常见错误位置

##### T4.2：前端报告生成 (1day)
1. 实现 EvaluationReportPage
   - 评估结果展示
   - 四维评分雷达图
   - 改进建议列表

2. 实现 ReportCard 组件
   - 紧凑的报告卡片格式
   - 支持分享与打印

**交付物**：
```
src/pages/
├── EvaluationReportPage.tsx
└── components/
    ├── ReportCard.tsx
    ├── ScoringRadar.tsx
    ├── ProgressComparison.tsx
    └── ImprovementSuggestions.tsx
```

##### T4.3：PDF 导出功能 (1day)
1. 集成 html2pdf 库
   - 将报告转为 PDF
   - 支持本地下载

2. 后端报告生成接口
   - POST /api/reports/generate
   - 返回 PDF 文件

**交付物**：
```
src/utils/
└── ReportExporter.ts
```

**验收标准**：
- ✅ 报告生成无错误
- ✅ PDF 导出成功，格式正确
- ✅ 分享功能正常工作

---

#### T5：多模态输入预留与 Phase 2 骨架 (1.5天)
**目标**：为 Phase 2 实时姿态检测预留接口与骨架

**任务分解**：
1. 定义 IPostureProvider 接口
   - `analyzePosture(videoStream): Promise<PostureResult>`
   - `detectExecutionGrip(videoFrame): Promise<GripAnalysis>`

2. 实现 PostureService 骨架 (Phase 2)
   - MediaPipe Pose 集成占位
   - 数据流处理框架
   - user_posture 表设计

3. 多模态输入适配器
   - 图片输入 ✅ (Phase 1)
   - 视频流输入 🔜 (Phase 2)
   - 实时摄像头 🔜 (Phase 2)

**交付物**：
```
src/services/posture/
├── IPostureProvider.ts
├── PostureService.ts (骨架)
└── types/
    └── posture.ts
```

**验收标准**：
- ✅ 接口定义完整，无语法错误
- ✅ 数据库表结构正确
- ✅ 文档明确 Phase 2 实现路径

---

#### T6：数据库设计与初始化 (1day)
**目标**：完成 hanzi_teaching.db 数据库的设计和初始数据导入

**任务分解**：
1. 数据库架构设计
   - characters 表：汉字基础数据
   - user_progress 表：学生进度
   - user_posture 表：姿态数据 (Phase 2)
   - classroom_feedback 表：反馈记录

2. 初始数据导入
   - 导入 3500+ 常用汉字
   - 12类结构分类数据
   - 标准笔顺库

3. 索引和查询优化
   - hanzi 字段唯一索引
   - user_id + character_id 复合索引
   - 查询性能测试

**交付物**：
```
database/
├── schema.sql (数据库架构)
├── init_data.sql (初始数据)
└── hanzi_teaching.db (已初始化的数据库文件)
```

**验收标准**：
- ✅ 数据库可正常查询
- ✅ 查询性能 < 100ms
- ✅ 初始数据完整 (≥ 3500 汉字)

---

#### T7：集成测试与 Mock 数据 (1day)
**目标**：建立完整的测试框架和 Mock 数据，支持功能开发与演示

**任务分解**：
1. 实现 Mock 数据生成器
   - Mock Qwen-VL 识别结果
   - Mock InkSight 笔迹轨迹
   - Mock 用户进度数据

2. 端到端集成测试
   - 完整的评分流程测试
   - 报告生成测试
   - WeChat 通知模拟测试

3. 测试覆盖率
   - 单元测试：≥ 85%
   - 集成测试：核心流程 100%
   - E2E 测试：关键用户故事

**交付物**：
```
test/
├── mocks/
│   ├── mockQwenVL.ts
│   ├── mockInkSight.ts
│   └── mockDatabase.ts
├── integration/
│   └── evaluationFlow.test.ts
└── e2e/
    └── classroom.e2e.ts
```

**验收标准**：
- ✅ 测试覆盖率达到要求
- ✅ Mock 数据逼真，能用于演示
- ✅ CI/CD 流程正确配置

---

#### T8：性能优化与缓存 (1day)
**目标**：优化关键路径性能，改善用户体验

**任务分解**：
1. 前端性能优化
   - React 组件懒加载
   - 图片优化 (压缩、CDN)
   - 打包体积分析与优化

2. 后端性能优化
   - 数据库查询优化 (索引、缓存)
   - API 响应时间优化
   - Redis 缓存层 (可选)

3. 性能监测
   - 前端性能指标 (LCP, FID, CLS)
   - 后端响应时间监测
   - 错误率监测

**交付物**：
```
- 性能优化报告
- 缓存策略文档
- 监测仪表板
```

**验收标准**：
- ✅ 首页加载时间 < 3s
- ✅ API 响应时间 < 500ms
- ✅ 包体积 < 500KB (gzip)

---

#### T9：安全加固与错误处理 (1day)
**目标**：增强系统安全性和稳定性

**任务分解**：
1. 前端安全
   - XSS 防护 (React 内置)
   - CSRF 防护
   - 敏感数据脱敏

2. 后端安全
   - 输入验证 (Flask-RESTful)
   - SQL 注入防护 (ORM)
   - API 速率限制
   - 日志脱敏

3. 错误处理
   - 统一错误响应格式
   - 用户友好的错误提示
   - 错误监测与告警 (可选)

**交付物**：
```
src/utils/
├── ValidationSchemas.ts (输入验证)
├── ErrorHandler.ts (错误处理)
└── Logger.ts (日志记录)
```

**验收标准**：
- ✅ OWASP Top 10 风险覆盖 ≥ 80%
- ✅ 无已知安全漏洞
- ✅ 错误覆盖率 ≥ 90%

---

#### T10：文档编写与知识库管理 (1day)
**目标**：完成项目文档和开发指南

**任务分解**：
1. API 文档
   - Swagger/OpenAPI 规范
   - 使用示例
   - 错误码说明

2. 前端开发指南
   - 组件库文档
   - 状态管理说明
   - 最佳实践

3. 后端开发指南
   - Flask 项目结构
   - 数据库操作指南
   - AI 服务集成指南

4. 部署文档
   - 开发环境搭建
   - 生产环境部署
   - CI/CD 流程

**交付物**：
```
docs/
├── 01-quick-reference/
│   └── API.md
├── 02-phase1-ai-evaluation/
│   ├── scoring-system.md
│   └── inksight-integration.md
├── 03-project-management/
│   └── workflow.md
├── 04-technical-design/
│   ├── database-schema.md
│   └── architecture.md
├── 05-development-guide/
│   ├── frontend-setup.md
│   ├── backend-setup.md
│   └── testing-guide.md
└── 06-multimodal-design/
    └── phase2-posture-detection.md
```

**验收标准**：
- ✅ 文档完整，覆盖所有关键点
- ✅ 示例代码可直接运行
- ✅ 新开发者能独立上手

---

#### T11：GitHub Actions CI/CD 与版本发布 (1day)
**目标**：建立自动化构建、测试、部署流程

**任务分解**：
1. GitHub Actions 工作流
   - 代码提交后自动运行单元测试
   - TypeScript 类型检查
   - ESLint 代码检查
   - 构建成功后自动部署 (可选)

2. 版本管理
   - Semantic Versioning (SemVer)
   - 自动生成 CHANGELOG
   - GitHub Release 发布

3. 部署流程
   - 开发环境：自动部署
   - 测试环境：手动触发
   - 生产环境：需审核批准

**交付物**：
```
.github/workflows/
├── phase1-build.yml (主流程)
├── test.yml (单元测试)
└── deploy.yml (部署)
```

**验收标准**：
- ✅ CI 流程完整，通过率 ≥ 95%
- ✅ 部署流程可正常执行
- ✅ 版本发布自动化

---

### 工时分配总览

| 任务 | 预计时间 | 实际时间 | 完成度 |
|-----|---------|---------|--------|
| T0：项目整合与规范 | 0.5天 | - | 🔄 进行中 |
| T1：AI Provider 工厂 | 1天 | - | ⏳ 待开始 |
| T2：评分引擎核心 | 4天 | - | ⏳ 待开始 |
| T3：课堂反馈系统 | 3天 | - | ⏳ 待开始 |
| T4：报告生成与导出 | 2.5天 | - | ⏳ 待开始 |
| T5：多模态预留骨架 | 1.5天 | - | ⏳ 待开始 |
| T6：数据库设计初始化 | 1天 | - | ⏳ 待开始 |
| T7：集成测试与 Mock | 1天 | - | ⏳ 待开始 |
| T8：性能优化 | 1天 | - | ⏳ 待开始 |
| T9：安全加固 | 1天 | - | ⏳ 待开始 |
| T10：文档编写 | 1天 | - | ⏳ 待开始 |
| T11：GitHub Actions | 1天 | - | ⏳ 待开始 |
| **总计** | **12.5天** | - | - |

---

## 项目管理规范

### 1. 统一命名规范

#### 项目级命名
- **项目正式名**：Alpha-Calligraphy（英文）
- **项目中文名**：名师手把手
- **项目简称**：AG_project
- **GitHub 仓库名**：alpha-calligraphy
- **npm package 名**：alpha-calligraphy

#### 目录结构命名
```
使用 kebab-case：
✅ src/services/ai/
✅ src/components/evaluation-report/
❌ src/services/AI/
❌ src/components/EvaluationReport/
```

#### 代码命名
```
TypeScript/JavaScript：
- 类名、接口名：PascalCase (e.g., AIProvider, CharacterRecognizer)
- 函数、变量：camelCase (e.g., recognizeCharacter, userId)
- 常量：UPPER_SNAKE_CASE (e.g., MAX_RETRIES, API_TIMEOUT)
- 文件名：kebab-case (e.g., ai-provider.ts, character-recognizer.ts)

Python：
- 类名：PascalCase (e.g., CharacterRecognizer)
- 函数、变量：snake_case (e.g., recognize_character, user_id)
- 常量：UPPER_SNAKE_CASE (e.g., MAX_RETRIES)
- 文件名：snake_case (e.g., character_recognizer.py)
```

### 2. 代码资产继承规则

#### inkmaster-ai 的迁移
```
inkmaster-ai/
├── src/ → Alpha-Calligraphy/src/
├── docs/wiki/ → Alpha-Calligraphy/docs/wiki/
└── code_review/ → Alpha-Calligraphy/docs/code-review/
```

#### classroom_test 的迁移
```
classroom_test/
├── classroom_mvp/ → Alpha-Calligraphy/classroom/
├── utils/ → Alpha-Calligraphy/classroom/utils/
└── requirements.txt → Alpha-Calligraphy/classroom/requirements.txt
```

### 3. Git 工作流规范

#### 分支模式
- **main**：生产发布分支，只接收 PR (保护分支)
- **develop**：开发主分支，所有 feature 分支从此分出
- **feature/***: 功能分支 (e.g., feature/ai-provider-factory)
- **fix/***: 修复分支 (e.g., fix/character-recognition-bug)
- **docs/***: 文档分支 (e.g., docs/api-documentation)

#### 提交规范 (Conventional Commits)
```
<type>(<scope>): <subject>

<body>

<footer>

类型：
- feat: 新功能
- fix: 修复 bug
- refactor: 代码重构
- perf: 性能优化
- test: 测试相关
- docs: 文档更新
- chore: 项目配置、构建流程

示例：
feat(ai): Implement Qwen-VL provider with error handling
fix(evaluation): Fix scoring calculation for structure dimension
docs(wiki): Add InkSight integration guide
```

#### Pull Request 规范
```
标题：[T1] AI Provider Factory Implementation

描述：
- 实现 IAIProvider 接口
- 完成 QwenVLProvider 实现
- 添加单元测试

关闭 Issue：#123
```

### 4. 代码审查流程

#### 审查要点
- [ ] 代码风格符合规范
- [ ] 功能完整，无逻辑错误
- [ ] 单元测试覆盖率 ≥ 85%
- [ ] 无安全漏洞
- [ ] 性能符合要求
- [ ] 文档完整

#### 审查周期
- 单个 PR 小于 400 行：1 天内审查
- 单个 PR 400-1000 行：2 天内审查
- 单个 PR 超过 1000 行：拆分后审查

### 5. 项目知识库管理 (Obsidian)

#### 知识库结构
```
Obsidian-KB/
├── Alpha-Calligraphy/
│   ├── 00-项目概述.md
│   ├── 01-技术架构.md
│   ├── 02-开发指南.md
│   ├── 03-API 文档.md
│   ├── 04-已知问题.md
│   └── 05-会议记录.md
```

#### 更新规则
- 每周更新一次项目进度
- 每个 task 完成后更新对应文档
- 保持知识库与代码库同步

### 6. GitHub 配置

#### Repo Settings
- 保护 main 分支：需要 1 个审查，通过 CI 检查
- 自动删除分支：PR 合并后自动删除
- 允许 squash merge：保持 commit 历史清洁

#### Secrets 配置
```
QWEN_API_KEY=xxx
GEMINI_API_KEY=xxx
WECHAT_CORPID=xxx
WECHAT_CORPSECRET=xxx
```

---

## 多模态设计

### Phase 1：图片 + 笔迹轨迹（现在）

#### 输入
- 学生拍照上传手写字
- InkSight 提取笔迹轨迹数据

#### 处理
```
图片 + 笔迹轨迹
  ↓
Qwen-VL 识别字形
  ↓
InkSight 分析笔力/笔速/笔势
  ↓
结合 hanzi_teaching.db 结构数据
  ↓
四维评分
```

#### 输出
- 字形识别结果 + 置信度
- 笔画质量评分
- 结构评分
- 整体建议

---

### Phase 2：实时视频流 + 姿态检测（2025年1月）

#### 输入
- 学生实时视频流（摄像头）
- MediaPipe 检测身体关键点

#### 新能力
```
坐姿评估：
  - 脊椎挺直度
  - 肩膀水平度
  - 头部前倾度

执笔姿势评估：
  - 手指握笔位置
  - 手腕角度
  - 肘部位置
```

#### 输出
- 坐姿评分 + 改进建议
- 执笔姿势评分 + 改进建议
- 常见错误列表

---

### Phase 3：多字多行 + 学习路径推荐（2025年2月+）

#### 能力扩展
- 支持评估整个作业（多字多行）
- 集成教学数据分析
- 个性化学习路径推荐

#### 输出
- 班级水平分析
- 学生进度跟踪
- 推荐下一步学习内容

---

## 演进路线

### Phase 1：MVP 验证（当前，12.5天）
**核心目标**：验证商业模式、建立技术基础

**关键指标**：
- 字形识别准确率 ≥ 95%
- 笔迹分析识别率 ≥ 90%
- 用户满意度 ≥ 4.0/5.0

**交付物**：
- 完整的评分引擎
- 课堂反馈系统
- 项目文档与知识库

---

### Phase 2：能力扩展（2025年1月，~15天）
**核心目标**：引入实时姿态检测，改进评分精度

**新功能**：
- 实时视频流处理
- 坐姿检测
- 执笔姿势检测
- 进度跟踪可视化

**技术亮点**：
- MediaPipe Pose 集成
- 实时处理管线优化
- 多维度评估融合

---

### Phase 3：数据驱动（2025年2月+）
**核心目标**：通过教学数据分析驱动个性化学习

**新功能**：
- 班级级别数据分析
- 学生进度追踪与预测
- 个性化学习路径推荐
- 教师数据看板

**商业价值**：
- 支持 SaaS 定价模式
- 支持 B2B 校级部署

---

## 附录：常见问题 (FAQ)

### Q1：为什么选择 Qwen-VL 而不是 Gemini？
**A**：成本优化。Qwen-VL (0.001$/分钟) vs Gemini (0.02$/分钟)，成本降低 95%。精度相当。

### Q2：InkSight 如何推断笔力？
**A**：通过笔粗细变化。笔粗 = 笔力强，笔细 = 笔力轻。标准差大 = 笔力不均匀。

### Q3：MediaPipe 能检测执笔吗？
**A**：部分可以。手指关键点能推断握笔位置和手腕角度。完全精准的执笔分析可能需要深度摄像头。

### Q4：什么时候支持多字多行？
**A**：Phase 3（2025年2月+）。Phase 1 专注单字评估。

### Q5：如何扩展到其他语言？
**A**：目前专注中文。未来可扩展到日文、韩文，核心逻辑相同。

---

## 🔗 文档导航

| 文档 | 说明 |
|-----|------|
| [本文档](./00-action-plan.md) | 项目总纲领与任务分解 |
| [Wiki 知识库](./wiki/) | 项目设计文档与技术指南 |
| [代码审查资料](./code-review/) | 代码范例与最佳实践 |
| [开发日志](./07-开发日志/) | 每日工作记录与进度跟踪 |

## 📝 docs 目录维护规范

> ⚠️ **重要提示**
>
> 由于暂不使用 Qoder 的自动仓库 Wiki 功能，需按以下规范手动维护 docs 目录，避免与自动生成内容重复：
>
> **维护规则**：
> 1. **每次功能修改后**，更新对应的 Wiki 文档文件
> 2. **重点维护的文件**：
>    - `docs/wiki/02-phase1-ai-evaluation/` - AI 评分功能相关文档
>    - `docs/wiki/03-project-management/development-progress.md` - 开发进度追踪
>    - `docs/07-开发日志/` - 每日工作记录与反思
> 3. **更新周期**：
>    - 功能完成后立即更新对应的 Wiki 文档（同一天）
>    - 每日工作结束时更新开发日志
>    - 每周检查一次文档完整性和准确性
> 4. **Obsidian 同步**：
>    - 代码完成后，在 Obsidian 的项目笔记中更新对应内容
>    - 保持 docs 与 Obsidian 知识库同步

---

## 版本历史

| 版本 | 日期 | 主要变更 |
|-----|-----|--------|
| v1.0 | 2024-12-17 | 初版发布，确定 Phase 1~3 演进路线 |

---

**文档维护者**：Qoder (AI Engineering Team)  
**最后更新**：2024年12月  
**下次审阅**：2025年1月（Phase 1 完成后）
