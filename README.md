# Alpha-Calligraphy 项目 - 名师手把手

**AI 硬笔书法教学引擎 | Phase 1 MVP**

## 📋 项目概述

Alpha-Calligraphy 是一套智能书法教学系统，通过多模态 AI 能力（字形识别、笔迹分析、姿态检测）对学生的书写进行全维度评估和实时反馈。

- **项目名称**：Alpha-Calligraphy（简称 AG_project）
- **中文名**：名师手把手
- **核心定位**：面向中小学生的 AI 书法批改与教学助手
- **当前阶段**：Phase 1 MVP（2024年12月启动）

## 🏗️ 系统架构

### 四层教学闭环
```
双姿感知（坐姿+执笔）
    ↓
笔画生成（InkSight 笔迹轨迹）
    ↓
笔势连接（笔画衔接评估）
    ↓
结构解码（字形识别 + 笔顺验证）
```

### 多模态 AI 能力分层
- **字形识别**：Qwen-VL（替代 Gemini，降低成本）
- **笔迹分析**：Google InkSight（笔画轨迹、笔力、笔速、笔势）
- **姿态检测**：MediaPipe Pose（Phase 2，实时坐姿+执笔识别）

## 📁 项目结构

```
Alpha-Calligraphy/
├── src/                           # React 前端
│   ├── pages/
│   │   ├── EvaluationPage.tsx     # AI 评分页面
│   │   └── ClassroomPage.tsx      # 课堂反馈页面
│   ├── services/
│   │   ├── ai/                    # AI Provider 接口
│   │   ├── trajectory/            # 笔迹分析服务
│   │   ├── posture/               # 姿态服务骨架（Phase 2）
│   │   └── classroom/
│   ├── types/
│   ├── components/
│   └── App.tsx
│
├── classroom/                     # Python Flask 后端
│   ├── app.py                     # Flask 主应用
│   ├── ai_engine.py               # AI 引擎集成
│   ├── data_manager.py            # 数据管理
│   ├── image_processor.py
│   ├── wechat_notifier.py
│   └── config.py
│
├── docs/
│   ├── 00-action-plan.md          # 项目开发行动纲领（总纲）
│   ├── wiki/                      # 项目 Wiki
│   └── code-review/               # 代码审查资料
│
├── .github/workflows/             # GitHub Actions
│   └── phase1-build.yml
│
├── package.json
├── tsconfig.json
├── .env                           # 环境变量（配置 API Keys）
├── .gitignore
└── README.md
```

## 🚀 快速开始

### 前置条件
- Node.js 18+
- Python 3.10+
- Git

### 1. 克隆并安装依赖

```bash
git clone https://github.com/your-username/alpha-calligraphy.git
cd alpha-calligraphy

# 前端依赖
npm install

# 后端依赖（可选）
cd classroom
pip install -r requirements.txt
cd ..
```

### 2. 配置环境变量

复制 `.env` 并配置 API 密钥：

```bash
cp .env .env.local
# 编辑 .env.local，填入实际的 API Key
```

### 3. 启动开发服务

```bash
# 终端 1：启动前端
npm run dev

# 终端 2：启动后端（可选）
npm run dev:classroom
```

访问 `http://localhost:5173`

## 📚 核心功能（Phase 1）

### 1. AI 书法评分（T2）
- **输入**：手写字图片（来自摄像头或相册）
- **处理**：Qwen-VL 识别 + 笔迹轨迹提取 (InkSight) + 笔顺验证
- **输出**：四维评分（笔画质量、结构分析、笔顺规范、整体评价）

### 2. 课堂反馈（T3）
- **功能**：教师端实时批改、学生端接收反馈
- **集成**：WeChat Notifier、学生进度跟踪

### 3. 评估报告（T4）
- **展示**：学生进度、常见错误、改进建议
- **导出**：PDF 格式报告

## 🔧 技术栈

| 层级 | 技术 | 版本 |
|-----|------|------|
| 前端框架 | React | 18.2+ |
| 前端构建 | Vite | 4.5+ |
| 语言 | TypeScript | 5.2+ |
| 后端框架 | Flask | 2.3+ |
| Python | | 3.10+ |
| AI 服务 | Qwen-VL | Latest |
| 笔迹分析 | Google InkSight | Latest |
| 姿态检测 | MediaPipe | 0.10+ |
| 数据库 | SQLite | Latest |
| 版本控制 | Git | Latest |

## 📋 开发规范

### 代码风格
- **JavaScript/TypeScript**：Prettier + ESLint
- **Python**：Black + Pylint
- **目录结构**：按功能模块划分

### 提交规范
```
chore: Initialize Alpha-Calligraphy project structure
feat(ai): Implement Qwen-VL integration for character recognition
fix(evaluation): Fix scoring calculation logic
docs: Update project documentation
```

### 分支管理
- `main`：生产就绪版本
- `develop`：开发主分支
- `feature/*`：功能分支
- `fix/*`：修复分支

## 📊 Phase 1~3 演进路线

### Phase 1（当前，12.5天）
- ✅ 项目整合与管理规范初始化
- [ ] AI 书法评分引擎（T2）
- [ ] 课堂反馈系统（T3）
- [ ] 评估报告生成（T4）

### Phase 2（预计 2025年1月）
- 实时姿态检测（坐姿+执笔）
- 视频流处理能力
- 改进评分精度

### Phase 3（预计 2025年2月+）
- 教学数据分析与学习路径推荐
- 多字多行评估
- 移动端优化

## 🔗 文档导航

| 文档 | 说明 |
|-----|------|
| [行动纲领](./docs/00-action-plan.md) | 项目总纲领与任务分解 |
| [Wiki](./docs/wiki/) | 项目知识库与设计文档 |
| [代码审查](./docs/code-review/) | 代码审查资料与最佳实践 |

## 📞 联系方式

- **项目管理**：Obsidian 知识库
- **GitHub**：Issue & Pull Request
- **讨论**：GitHub Discussions

## 📄 许可证

MIT License - 详见 LICENSE 文件

---

**最后更新**：2024年12月  
**当前阶段**：Phase 1 MVP 初始化
