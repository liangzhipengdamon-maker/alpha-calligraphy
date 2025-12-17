# Git规范

## 🌳 分支管理

### 分支命名规范

```
格式: <type>/<feature-description>

类型:
- feature    创建新功能
- bugfix     修复bug
- hotfix     紧急修复
- refactor   代码重构
- docs       文档更新
- test       测试代码
- chore      其他变更
```

### 分支示例

```bash
# 新功能
git checkout -b feature/add-ai-evaluation
git checkout -b feature/ar-lightbox-preview

# 问题修复
git checkout -b bugfix/fix-gemini-api-timeout
git checkout -b bugfix/firebase-auth-error

# 紧急修复
git checkout -b hotfix/critical-security-issue

# 重构
git checkout -b refactor/optimize-image-service
git checkout -b refactor/simplify-zustand-store

# 文档
git checkout -b docs/update-readme
git checkout -b docs/add-api-guide

# 测试
git checkout -b test/add-ar-lightbox-tests
```

### 主要分支

| 分支 | 用途 | 保护 |
|------|------|------|
| `main` | 生产环境 | ✅ 需要PR审查 |
| `develop` | 开发环境 | ✅ 需要PR审查 |
| `staging` | 暂存环境 | ⚠️ 可直接推送 |

---

## 📝 提交信息规范

### 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

| Type | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | feat: 添加AI评估功能 |
| `fix` | 修复bug | fix: 修复AR透台缩放bug |
| `docs` | 文档更新 | docs: 更新API文档 |
| `style` | 代码格式（不影响功能） | style: 格式化代码 |
| `refactor` | 代码重构 | refactor: 简化评分逻辑 |
| `perf` | 性能优化 | perf: 优化图片压缩 |
| `test` | 测试 | test: 添加AR手势测试 |
| `chore` | 构建、依赖等 | chore: 更新依赖版本 |
| `ci` | CI配置 | ci: 添加GitHub Actions |

### Scope 范围（可选）

```
<type>(<scope>): <subject>

// 示例
feat(ar-lightbox): 添加透明度调节
fix(ai-service): 修复Gemini API超时
docs(wiki): 更新快速开始指南
```

常见scope:
- `ai-service` - AI相关
- `firebase` - 数据库相关
- `ui` - UI组件
- `ar-lightbox` - AR功能
- `scoring` - 评分系统

### 主体信息规范

```
// ✅ 好的提交信息
feat(ai-service): 实现四维评分计算

- 添加笔画质量评估 (25%)
- 添加结构分析评估 (35%)
- 添加笔画连接评估 (15%)
- 添加整体评价评估 (25%)
- 实现权重计算

// ❌ 不好的提交信息
feat: add feature
fix: bug
update stuff
```

### Footer规则

用于关闭issue或注明破坏性变更：

```
Closes #123
Closes #124

BREAKING CHANGE: 更改了API响应格式
```

### 完整示例

```
feat(ar-lightbox): 实现AR透台手势交互

添加对pinch缩放和rotate旋转的支持，提升用户体验。

- 使用@use-gesture库实现多点触控
- 支持鼠标滚轮缩放
- 限制缩放范围(0.5x-2x)
- 添加透明度调节滑块

测试覆盖率: 85%
性能影响: <10ms

Closes #45
```

---

## 🔄 Pull Request流程

### 开发流程

```
1. 创建特性分支
   git checkout -b feature/xxx

2. 开发并提交
   git commit -m "feat(scope): message"

3. 推送远程
   git push origin feature/xxx

4. 创建Pull Request
   - 填写PR描述
   - 关联相关issue
   - 选择reviewer

5. 代码审查
   - 至少1个批准
   - 所有检查通过
   - 解决冲突

6. 合并到develop
   - Squash or Rebase
   - 删除特性分支

7. 测试与发布
   - 暂存环境验证
   - 生产环境部署
```

### PR模板

```markdown
## 描述
简要描述这个PR做了什么

## 关联的Issue
Closes #123

## 改动类型
- [ ] Bug修复
- [ ] 新功能
- [ ] 重构
- [ ] 文档更新

## 测试清单
- [ ] 单元测试 (>80%)
- [ ] 集成测试通过
- [ ] 本地测试通过
- [ ] 无console.error

## 性能影响
- 包大小: +5KB
- 首屏时间: -100ms
- API调用: 无增加

## 截图（如适用）
[添加截图]

## 额外信息
[其他需要说明的信息]
```

---

## 🚀 发布流程

### 版本号管理（Semantic Versioning）

```
vMAJOR.MINOR.PATCH

v0.1.0
 │ │ └─ Patch: 修复bug
 │ └─── Minor: 新功能
 └───── Major: 破坏性变更

示例:
v0.1.0 - Alpha版（初始发布）
v0.2.0 - 添加笔顺功能
v1.0.0 - 生产版发布
v1.1.0 - 新增社区功能
v2.0.0 - 重大升级
```

### 标签与发布

```bash
# 创建标签
git tag -a v0.1.0 -m "Release version 0.1.0"

# 推送标签
git push origin v0.1.0

# 创建Release
# 在GitHub上手动创建Release
# 或使用CLI
```

### 变更日志 (CHANGELOG)

```markdown
# Changelog

## [0.2.0] - 2026-01-08

### Added
- 笔顺检测功能
- 教学动画系统
- 练习模式

### Fixed
- 修复AR缩放卡顿问题
- 修复Firebase连接超时

### Changed
- 优化图片压缩算法

## [0.1.0] - 2025-12-25

### Added
- AI硬笔评估系统
- 四维评分体系
- AR透台预览功能
```

---

## 🔐 提交安全性

### 避免提交的文件

```gitignore
# .gitignore
.env.local           # ❌ API keys
.env.*.local
node_modules/        # ❌ 依赖
dist/
build/
.DS_Store            # ❌ 系统文件
*.log                # ❌ 日志文件
.idea/
.vscode/*
!.vscode/settings.json
```

### 提交前检查清单

```bash
# 检查代码质量
npm run lint --fix
npm run type-check
npm run test

# 检查是否有secrets
git diff --cached | grep -E "(API_KEY|SECRET|PASSWORD)"

# 预览将要提交的内容
git diff --cached
```

---

## 📊 常用Git命令

### 分支操作

```bash
# 查看本地分支
git branch

# 查看远程分支
git branch -r

# 创建并切换分支
git checkout -b feature/xxx

# 删除本地分支
git branch -d feature/xxx

# 删除远程分支
git push origin --delete feature/xxx

# 同步主分支
git fetch origin main
git rebase origin/main
```

### 提交操作

```bash
# 查看提交历史
git log --oneline

# 查看某个文件的历史
git log --oneline -- file.tsx

# 查看提交详情
git show <commit-hash>

# 撤回最后一次提交（未推送）
git reset --soft HEAD~1

# 修改最后一次提交信息
git commit --amend -m "new message"
```

### 同步操作

```bash
# 拉取远程变更
git pull origin develop

# 推送到远程
git push origin feature/xxx

# 强制推送（谨慎！）
git push -f origin feature/xxx
```

---

## ⚠️ 常见问题

### Q: 不小心提交了API Key

**A**: 立即删除并重新生成Key

```bash
# 从历史中移除文件
git filter-branch --tree-filter 'rm -f .env.local' HEAD

# 推送
git push -f origin main
```

### Q: 合并冲突

**A**: 手动解决冲突

```bash
# 查看冲突
git status

# 编辑冲突文件
# 删除冲突标记（<<<, ===, >>>）

# 标记为已解决
git add .
git commit -m "resolve conflicts"
```

### Q: 需要回滚某个提交

**A**: 创建revert提交

```bash
# 查找提交ID
git log --oneline

# 回滚
git revert <commit-hash>
git push origin develop
```

---

**最后更新**: 2025-12-04
