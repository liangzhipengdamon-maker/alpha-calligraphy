# Alpha-Calligraphy 快速参考指南

**最后更新**：2024-12-17 17:45  
**项目状态**：✅ 初始化完成，准备开发

---

## 🎯 4 个关键问题的答案

### 1️⃣ classroom_test 和 inkmaster-ai 怎么处理？
```
✅ 已处理：
  /Documents/归档/classroom_test/     ← 原项目文件
  /Documents/归档/inkmaster-ai/       ← 原项目文件
  
✅ 唯一活跃项目：
  /Documents/Alpha-Calligraphy/       ← 所有后续开发
```

### 2️⃣ 要用 Qoder 自动仓库 Wiki 吗？
```
❌ 决定：不使用
✅ 原因：避免与 docs 目录重复
✅ 方案：继续手动维护 docs 目录
📍 位置：docs/00-action-plan.md 中有详细规范
```

### 3️⃣ 如何记录每天的工作？
```
✅ 新增目录：docs/07-开发日志/
📝 每日更新：docs/07-开发日志/README.md
📅 今日记录：2024-12-17 项目初始化完成
🔄 周期：每日工作结束时更新
```

### 4️⃣ GitHub 仓库配置完成了吗？
```
✅ 仓库已创建：alpha-calligraphy
🔗 地址：https://github.com/liangzhipengdamon-maker/alpha-calligraphy
📍 Remote 已配置：origin (fetch/push)
⏳ 待推送：网络恢复后执行 `git push -u origin main`
```

---

## 📚 文档维护三步法

### 1️⃣ 代码完成后（当日立即）
```bash
# 更新对应的 Wiki 文档
docs/wiki/02-phase1-ai-evaluation/    # 如果是 AI 评分功能
docs/wiki/03-project-management/      # 如果是项目管理相关

# 在 Obsidian 中更新项目笔记
```

### 2️⃣ 每日工作结束时
```bash
# 更新开发日志
docs/07-开发日志/README.md

# 内容包括：
# - 今日完成的工作
# - 遇到的问题和解决方案
# - 明日计划
```

### 3️⃣ 每周检查（建议周一）
```bash
# 检查文档完整性
docs/00-action-plan.md         # 确保指标准确
docs/wiki/                     # 确保无遗漏

# 更新项目统计
PROJECT_STATUS.md             # 更新完成度百分比
```

---

## 🚀 GitHub 推送（网络恢复后）

### 第一步：执行推送
```bash
cd /Users/Zhuanz/Documents/Alpha-Calligraphy
git push -u origin main
```

### 第二步：验证成功
- 访问 https://github.com/liangzhipengdamon-maker/alpha-calligraphy
- 检查是否显示所有 4 个提交
- 检查是否显示完整的项目文件

### 相关文档
📄 详见：`PUSH_TO_GITHUB.md`

---

## 📁 项目目录速查表

| 路径 | 用途 | 维护频率 |
|-----|------|--------|
| `src/` | React 前端代码 | 功能完成后 |
| `classroom/` | Python 后端代码 | 功能完成后 |
| `docs/00-action-plan.md` | 项目总纲领 | 月度审阅 |
| `docs/wiki/` | 技术文档和设计 | 功能完成后 |
| `docs/07-开发日志/` | 每日工作记录 | ⭐ 每日更新 |
| `.github/workflows/` | CI/CD 配置 | 按需修改 |
| `PROJECT_STATUS.md` | 项目状态总结 | 周度更新 |

---

## 💡 关键配置

### 环境变量配置（`.env`）
```env
QWEN_API_KEY=your_actual_key          # 必需
GEMINI_API_KEY=your_actual_key        # 备用
FLASK_ENV=development
DATABASE_URL=sqlite:///./hanzi_teaching.db
```

### 项目命名规范
```
英文名：Alpha-Calligraphy
中文名：名师手把手
简称：AG_project
GitHub：alpha-calligraphy
npm 包：alpha-calligraphy
```

### Git 工作流
```
main          生产分支（保护）
develop       开发主分支
feature/*     功能分支
fix/*         修复分支
```

---

## ✅ 初始化完成清单

- ✅ 文件夹整理（原项目移至归档）
- ✅ docs 目录维护规范确定
- ✅ 开发日志系统建立
- ✅ GitHub 仓库创建
- ✅ Git 配置完成
- ✅ 4 个提交已准备
- ⏳ GitHub 推送（待网络恢复）

---

## 📞 快速参考链接

| 文档 | 说明 |
|-----|------|
| [项目状态](./PROJECT_STATUS.md) | 完整项目状态总结 |
| [推送说明](./PUSH_TO_GITHUB.md) | GitHub 推送命令和说明 |
| [行动纲领](./docs/00-action-plan.md) | 项目总纲领（1100+ 行） |
| [开发日志](./docs/07-开发日志/README.md) | 每日工作记录 |
| [README](./README.md) | 项目简介 |

---

## 🎯 下一步行动

### 今天（网络恢复后）
```bash
git push -u origin main  # 推送到 GitHub
```

### 明天开始
```
启动 T1：AI Provider 工厂模式实现（1 天）
```

---

**记录人**：Qoder  
**创建时间**：2024-12-17  
**建议使用频率**：每周查看一次
