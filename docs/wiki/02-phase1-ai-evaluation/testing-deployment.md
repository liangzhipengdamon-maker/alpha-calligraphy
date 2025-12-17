# 测试与部署

## 🧪 测试计划

### 单元测试（Vitest）

#### 测试结构

```
tests/
├── unit/
│   ├── services/
│   │   ├── aiService.spec.ts
│   │   ├── imageService.spec.ts
│   │   └── firebaseService.spec.ts
│   ├── utils/
│   │   ├── calculateScore.spec.ts
│   │   └── parseResult.spec.ts
│   └── hooks/
│       ├── useEvaluation.spec.ts
│       └── useImageUpload.spec.ts
├── integration/
│   ├── evaluationFlow.spec.ts
│   └── firebaseIntegration.spec.ts
└── e2e/
    └── evaluation.e2e.spec.ts
```

#### 关键测试用例

**aiService.spec.ts**
```typescript
describe('aiService', () => {
  it('应该成功调用Gemini API', async () => {
    const result = await evaluateHandwriting(mockImageBase64);
    expect(result).toHaveProperty('brushQuality');
    expect(result.totalScore).toBeGreaterThan(0);
  });

  it('应该正确解析评分结果', async () => {
    const result = await evaluateHandwriting(mockImageBase64);
    expect(result.totalScore).toBeLessThanOrEqual(100);
    expect(result.brushQuality.score).toBeLessThanOrEqual(25);
  });

  it('应该处理API错误', async () => {
    expect(evaluateHandwriting(invalidImageBase64)).rejects.toThrow();
  });
});
```

**calculateScore.spec.ts**
```typescript
describe('calculateScore', () => {
  it('应该正确计算总分', () => {
    const scores = {
      brushQuality: 25,
      structureAnalysis: 35,
      strokeConnection: 15,
      overallEvaluation: 25
    };
    const total = calculateTotalScore(scores);
    expect(total).toBe(100);
  });

  it('应该按权重计算', () => {
    const scores = {
      brushQuality: 20,      // 20 * 0.25 = 5
      structureAnalysis: 30, // 30 * 0.35 = 10.5
      strokeConnection: 10,  // 10 * 0.15 = 1.5
      overallEvaluation: 20  // 20 * 0.25 = 5
    };
    const total = calculateTotalScore(scores);
    expect(total).toBe(22); // 5 + 10.5 + 1.5 + 5 = 22
  });
});
```

### 集成测试

**evaluationFlow.spec.ts**
```typescript
describe('评估完整流程', () => {
  it('应该完成从上传到评估的全流程', async () => {
    // 1. 上传图片
    const file = new File([mockImageBuffer], 'test.jpg');
    const imageBase64 = await fileToBase64(file);

    // 2. 提交评估
    const response = await evaluateHandwriting(imageBase64);

    // 3. 验证结果
    expect(response.success).toBe(true);
    expect(response.data.totalScore).toBeDefined();
    expect(response.data.suggestions.length).toBeGreaterThan(0);

    // 4. 保存到Firebase
    const saved = await saveEvaluationToFirebase(response.data);
    expect(saved.id).toBeDefined();
  });
});
```

### 端到端测试（Playwright）

**evaluation.e2e.spec.ts**
```typescript
import { test, expect } from '@playwright/test';

test.describe('AI评估功能E2E', () => {
  test('用户应该能够上传图片并获得评估结果', async ({ page }) => {
    // 1. 导航到页面
    await page.goto('http://localhost:5173/evaluation');

    // 2. 上传图片
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('test-images/sample.jpg');

    // 3. 点击评估按钮
    await page.locator('button:has-text("立即评估")').click();

    // 4. 等待结果显示
    await expect(page.locator('text=总分')).toBeVisible({ timeout: 5000 });

    // 5. 验证评分显示
    const scoreText = await page.locator('.total-score').textContent();
    expect(scoreText).toMatch(/\d+分/);

    // 6. 验证建议显示
    const suggestions = await page.locator('.suggestions-list li').count();
    expect(suggestions).toBeGreaterThan(0);
  });

  test('用户应该能够查看AR透台预览', async ({ page }) => {
    await page.goto('http://localhost:5173/evaluation');
    
    // 上传图片
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('test-images/sample.jpg');

    // 验证AR透台显示
    const arLightbox = page.locator('[data-testid="ar-lightbox"]');
    await expect(arLightbox).toBeVisible();

    // 调整透明度
    const slider = page.locator('input[type="range"]');
    await slider.fill('75');

    // 验证透明度更新
    const arImage = page.locator('[data-testid="ar-image"]');
    const opacity = await arImage.evaluate(el => 
      window.getComputedStyle(el).opacity
    );
    expect(parseFloat(opacity as string)).toBe(0.75);
  });
});
```

## 📊 测试覆盖率目标

| 模块 | 目标覆盖率 | 状态 |
|------|----------|------|
| services/ | >90% | ⏳ |
| utils/ | >85% | ⏳ |
| hooks/ | >80% | ⏳ |
| components/ | >75% | ⏳ |
| **总体** | **>80%** | ⏳ |

## 🚀 部署流程

### 1. 本地验证

```bash
# 运行所有测试
npm run test

# 检查代码质量
npm run lint
npm run type-check

# 构建项目
npm run build

# 预览生产构建
npm run preview
```

### 2. 暂存环境部署

```bash
# 构建暂存版本
npm run build -- --mode staging

# 部署到Firebase暂存环境
firebase deploy --only hosting:staging

# 验证部署
curl https://staging.inkmaster-ai.web.app/
```

### 3. 生产环境部署

```bash
# 构建生产版本
npm run build

# 验证构建大小
npm run build -- --report

# 部署到Firebase生产环境
firebase deploy --only hosting:production

# 验证生产环境
curl https://inkmaster-ai.web.app/
```

### 部署检查清单

- [ ] 所有测试通过
- [ ] 代码审查完成
- [ ] 环境变量正确配置
- [ ] Firebase规则已更新
- [ ] Gemini API配额充足
- [ ] 构建大小 <500KB (gzipped)
- [ ] 性能评分 >90 (Lighthouse)
- [ ] 无安全警告
- [ ] CDN缓存规则正确

## 📈 性能监控

### 关键指标

| 指标 | 目标值 | 当前值 | 状态 |
|------|--------|--------|------|
| 首屏加载 (FCP) | <1.5s | - | ⏳ |
| 首次内容绘制 (LCP) | <2.5s | - | ⏳ |
| 评估API响应 | <3s | - | ⏳ |
| 包大小 (gzipped) | <300KB | - | ⏳ |
| Lighthouse评分 | >90 | - | ⏳ |

### 监控工具

- **Firebase Performance**: 实时性能监控
- **Sentry**: 错误追踪和监控
- **Google Analytics**: 用户行为分析
- **Lighthouse CI**: 自动化性能测试

## 🔄 持续集成/持续部署 (CI/CD)

### GitHub Actions工作流

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: actions/upload-artifact@v2
        with:
          name: dist
          path: dist/

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/download-artifact@v2
        with:
          name: dist
          path: dist/
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: inkmaster-ai
```

## 📝 回滚计划

### 快速回滚

```bash
# 查看部署历史
firebase hosting:channels:list

# 切换到上一个版本
firebase hosting:channels:deploy [previous-channel-id]

# 或直接回滚
firebase hosting:rollback
```

### 故障排查

| 问题 | 症状 | 解决方案 |
|------|------|--------|
| API超时 | 评估请求超过3秒 | 检查Gemini API配额，增加超时时间 |
| Firebase错误 | 数据保存失败 | 检查数据库规则，增加配额 |
| 图片上传失败 | 文件无法上传 | 检查Storage规则，验证CORS配置 |
| 内存溢出 | 处理大图片时应用崩溃 | 优化图片压缩，减少分辨率 |

---

**最后更新**: 2025-12-04
