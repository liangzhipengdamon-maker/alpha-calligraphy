# AR透台功能 (ARLightBox)

## 🎯 功能概述

AR透台是一个实时对比工具，允许用户：
- 上传自己的字迹图片
- 实时查看参考字（范字）
- 通过透明度调节对比两个字
- 使用手势进行缩放和旋转

## 🏗️ 组件架构

### ARLightBox组件结构

```
ARLightBox
├── Canvas画布
│   ├── 参考字图片 (底层)
│   ├── 用户字迹 (上层，可调透明度)
│   └── 网格参考线 (可选)
│
├── 控制面板
│   ├── 透明度滑块 (0-100%)
│   ├── 缩放按钮 (+/-)
│   ├── 旋转按钮 (90°)
│   └── 重置按钮
│
└── 手势识别
    ├── Pinch缩放
    ├── Rotate旋转
    └── Pan平移
```

### 核心Props

```typescript
interface ARLightBoxProps {
  referenceImageUrl: string;    // 参考字图片URL
  userImageUrl: string;          // 用户字迹图片URL
  onTransformChange?: (transform: ARTransform) => void;
  allowGestures?: boolean;       // 是否启用手势（默认true）
  gridLines?: boolean;           // 是否显示网格
}
```

## 📐 变换状态 (Transform)

```typescript
interface ARTransform {
  scale: number;        // 缩放比例 (0.5-3)
  rotation: number;     // 旋转角度 (0-360)
  opacity: number;      // 用户图片透明度 (0-1)
  offsetX: number;      // X轴偏移
  offsetY: number;      // Y轴偏移
}
```

## 🎨 实现细节

### HTML结构

```html
<div class="ar-lightbox">
  <!-- 画布层 -->
  <div class="canvas-container">
    <!-- 参考字图片 -->
    <img class="reference-image" src={referenceImageUrl} />
    
    <!-- 用户字迹 (可调透明度) -->
    <img
      class="user-image"
      src={userImageUrl}
      style={{
        opacity: opacity,
        transform: `scale(${scale}) rotate(${rotation}deg) translate(${offsetX}px, ${offsetY}px)`
      }}
    />
  </div>

  <!-- 控制面板 -->
  <div class="controls">
    <!-- 透明度滑块 -->
    <div class="control-group">
      <label>透明度</label>
      <input
        type="range"
        min="0"
        max="100"
        value={opacity * 100}
        onChange={handleOpacityChange}
      />
      <span>{Math.round(opacity * 100)}%</span>
    </div>

    <!-- 缩放控制 -->
    <div class="control-group">
      <button onClick={() => handleScale(1.1)}>+</button>
      <span>{Math.round(scale * 100)}%</span>
      <button onClick={() => handleScale(0.9)}>-</button>
    </div>

    <!-- 旋转控制 -->
    <div class="control-group">
      <button onClick={() => handleRotate(90)}>旋转90°</button>
      <button onClick={handleReset}>重置</button>
    </div>
  </div>
</div>
```

### CSS样式

```css
.ar-lightbox {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.canvas-container {
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* 1:1比例 */
  overflow: hidden;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: #f5f5f5;
}

.reference-image,
.user-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.reference-image {
  z-index: 1;
  opacity: 1;
}

.user-image {
  z-index: 2;
  transform-origin: center;
  transition: transform 0.3s ease;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-group label {
  font-size: 14px;
  font-weight: 500;
  min-width: 60px;
}

.control-group input[type="range"] {
  flex: 1;
  height: 6px;
  cursor: pointer;
}

.control-group span {
  font-size: 12px;
  color: #666;
  min-width: 40px;
}

.control-group button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 12px;
}

.control-group button:hover {
  background: #f0f0f0;
}
```

### React实现

```typescript
import React, { useState, useCallback } from 'react';
import styles from './ARLightBox.module.css';

interface ARLightBoxProps {
  referenceImageUrl: string;
  userImageUrl: string;
  onTransformChange?: (transform: ARTransform) => void;
}

export const ARLightBox: React.FC<ARLightBoxProps> = ({
  referenceImageUrl,
  userImageUrl,
  onTransformChange
}) => {
  const [transform, setTransform] = useState({
    scale: 1,
    rotation: 0,
    opacity: 0.5,
    offsetX: 0,
    offsetY: 0
  });

  // 处理透明度变化
  const handleOpacityChange = useCallback((value: number) => {
    const newTransform = {
      ...transform,
      opacity: value / 100
    };
    setTransform(newTransform);
    onTransformChange?.(newTransform);
  }, [transform, onTransformChange]);

  // 处理缩放
  const handleScale = useCallback((factor: number) => {
    const newScale = Math.max(0.5, Math.min(3, transform.scale * factor));
    const newTransform = { ...transform, scale: newScale };
    setTransform(newTransform);
    onTransformChange?.(newTransform);
  }, [transform, onTransformChange]);

  // 处理旋转
  const handleRotate = useCallback((angle: number) => {
    const newRotation = (transform.rotation + angle) % 360;
    const newTransform = { ...transform, rotation: newRotation };
    setTransform(newTransform);
    onTransformChange?.(newTransform);
  }, [transform, onTransformChange]);

  // 重置
  const handleReset = useCallback(() => {
    const resetTransform = {
      scale: 1,
      rotation: 0,
      opacity: 0.5,
      offsetX: 0,
      offsetY: 0
    };
    setTransform(resetTransform);
    onTransformChange?.(resetTransform);
  }, [onTransformChange]);

  return (
    <div className={styles.arLightbox}>
      <div className={styles.canvasContainer}>
        <img
          className={styles.referenceImage}
          src={referenceImageUrl}
          alt="Reference character"
        />
        <img
          className={styles.userImage}
          src={userImageUrl}
          alt="User character"
          style={{
            opacity: transform.opacity,
            transform: `scale(${transform.scale}) rotate(${transform.rotation}deg) translate(${transform.offsetX}px, ${transform.offsetY}px)`
          }}
        />
      </div>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label>透明度</label>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(transform.opacity * 100)}
            onChange={(e) => handleOpacityChange(Number(e.target.value))}
          />
          <span>{Math.round(transform.opacity * 100)}%</span>
        </div>

        <div className={styles.controlGroup}>
          <button onClick={() => handleScale(1.1)}>+</button>
          <span>{Math.round(transform.scale * 100)}%</span>
          <button onClick={() => handleScale(0.9)}>-</button>
        </div>

        <div className={styles.controlGroup}>
          <button onClick={() => handleRotate(90)}>旋转90°</button>
          <button onClick={handleReset}>重置</button>
        </div>
      </div>
    </div>
  );
};

export default ARLightBox;
```

## 📱 手势交互（可选增强）

### 使用@use-gesture

```typescript
import { useGesture } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';

const ARLightBoxWithGestures: React.FC<ARLightBoxProps> = (props) => {
  const [{ scale, rotation }, api] = useSpring(() => ({
    scale: 1,
    rotation: 0
  }));

  const bind = useGesture({
    // 双指缩放
    onPinch: ({ offset: [s] }) => {
      api.start({ scale: s });
    },

    // 双指旋转
    onRotate: ({ offset: [r] }) => {
      api.start({ rotation: r });
    }
  });

  return (
    <div {...bind()}>
      <animated.img
        style={{
          scale,
          rotate: rotation
        }}
        src={props.userImageUrl}
      />
    </div>
  );
};
```

## 🧪 测试用例

```typescript
// tests/components/ARLightBox.spec.ts
describe('ARLightBox', () => {
  it('应该渲染参考图片和用户图片', () => {
    const { getByAltText } = render(
      <ARLightBox
        referenceImageUrl="/ref.jpg"
        userImageUrl="/user.jpg"
      />
    );
    expect(getByAltText('Reference character')).toBeInTheDocument();
    expect(getByAltText('User character')).toBeInTheDocument();
  });

  it('应该调整透明度', () => {
    const { getByRole } = render(
      <ARLightBox
        referenceImageUrl="/ref.jpg"
        userImageUrl="/user.jpg"
      />
    );
    const slider = getByRole('slider');
    fireEvent.change(slider, { target: { value: 75 } });
    expect(slider).toHaveValue('75');
  });
});
```

## 🎓 使用示例

```typescript
// pages/EvaluationPage.tsx
const EvaluationPage = () => {
  const [referenceImage, setReferenceImage] = useState<string>('');
  const [userImage, setUserImage] = useState<string>('');

  return (
    <div>
      {userImage && referenceImage && (
        <ARLightBox
          referenceImageUrl={referenceImage}
          userImageUrl={userImage}
          onTransformChange={(transform) => {
            console.log('Transform:', transform);
          }}
        />
      )}
    </div>
  );
};
```

---

**最后更新**: 2025-12-04
