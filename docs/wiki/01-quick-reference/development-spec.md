# 开发规范汇总

本文档快速索引所有开发规范。详细内容见各专门文档。

## 📋 核心规范清单

### 1. 编码规范
**详见**: [编码规范](../05-development-guide/code-standards.md)

**TypeScript**
- ✅ 启用严格模式 (`strict: true`)
- ✅ 所有变量明确类型（避免 `any`）
- ✅ 导入排序：React → 第三方 → 本地

**React 18**
- ✅ 使用函数式组件 + Hooks
- ✅ 自定义Hook命名：`use*`
- ✅ Props使用interface定义

**Tailwind CSS**
- ✅ 优先使用Tailwind类
- ✅ 避免编写额外CSS
- ✅ 响应式：先移动端，后desktop

### 2. 命名约定
**详见**: [命名约定](../05-development-guide/naming-conventions.md)

**文件命名**
- React组件: `PascalCase` → `EvaluationPage.tsx`
- 工具函数: `camelCase` → `calculateScore.ts`
- 常量文件: `UPPER_SNAKE_CASE` → `SCORING_WEIGHTS.ts`
- 类型文件: `PascalCase` → `EvaluationType.ts`

**代码标识符**
- 组件: `PascalCase` → `<MSSARLightBox />`
- 变量: `camelCase` → `const evaluationScore = ...`
- 常量: `UPPER_SNAKE_CASE` → `const MAX_FILE_SIZE = 10485760`
- 私有: 前缀 `_` → `_calculateDimensions()`

### 3. Git规范
**详见**: [Git规范](../05-development-guide/git-workflow.md)

**分支命名**
```
feature/add-ai-evaluation    # 新功能
bugfix/fix-ar-gesture        # 问题修复
docs/update-wiki             # 文档更新
refactor/optimize-image      # 代码重构
```

**提交信息格式**
```
feat: 添加AI评估功能
fix: 修复AR手势识别bug
docs: 更新快速开始文档
refactor: 优化图片处理性能
```

### 4. 状态管理
**详见**: [状态管理](../05-development-guide/state-management.md)

- ✅ Zustand管理全局状态
- ✅ React Hooks管理组件局部状态
- ✅ Props drilling避免超过3层
- ✅ useContext传递主题等配置

### 5. 样式策略
**详见**: [样式策略](../05-development-guide/styling-strategy.md)

**优先级**:
1. Tailwind工具类（首选）
2. CSS Module（特殊情况）
3. 全局CSS（基础样式）

**响应式设计**:
```tsx
<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
  内容
</div>
```

## 📊 规范检查清单

提交代码前检查：

### 代码质量
- [ ] 通过ESLint检查：`npm run lint`
- [ ] 通过Prettier格式化：`npm run format`
- [ ] TypeScript类型检查：`npm run type-check`
- [ ] 无console.log等调试代码
- [ ] 无注释掉的代码

### 功能完整性
- [ ] 功能实现完整
- [ ] 边界条件处理
- [ ] 错误处理完善
- [ ] 加载状态处理

### 测试覆盖
- [ ] 单元测试通过：`npm run test`
- [ ] 端到端测试通过：`npm run test:e2e`
- [ ] 代码覆盖率 > 80%

### 文档完整性
- [ ] 添加必要注释
- [ ] 更新相关文档
- [ ] 更新CHANGELOG
- [ ] API文档已更新

## 🎯 常见规范问题

### Q: 如何处理异步操作？
**A**: 见 [状态管理](../05-development-guide/state-management.md)

### Q: 样式冲突怎么办？
**A**: 见 [样式策略](../05-development-guide/styling-strategy.md)

### Q: 如何处理错误？
**A**: 见 [编码规范](../05-development-guide/code-standards.md)

## 📚 完整文档

- [编码规范](../05-development-guide/code-standards.md)
- [命名约定](../05-development-guide/naming-conventions.md)
- [Git规范](../05-development-guide/git-workflow.md)
- [状态管理](../05-development-guide/state-management.md)
- [样式策略](../05-development-guide/styling-strategy.md)

---

**记住**: 规范让代码更易维护，更易协作！ 🚀

最后更新: 2025-12-04
