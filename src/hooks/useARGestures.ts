// src/hooks/useARGestures.ts
import { useGesture } from '@use-gesture/react';
import { useState, useCallback } from 'react';

export interface ARTransform {
  offsetX: number;
  offsetY: number;
  scale: number;
  rotation: number;
}

export const useARGestures = (initialTransform?: Partial<ARTransform>) => {
  const [transform, setTransform] = useState<ARTransform>({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    rotation: 0,
    ...initialTransform,
  });

  const bind = useGesture({
    // 拖拽手势
    onDrag: ({ offset: [x, y] }) => {
      setTransform((prev) => ({
        ...prev,
        offsetX: x,
        offsetY: y,
      }));
    },

    // 缩放和旋转手势（双指）
    onPinch: ({ offset: [scale, rotation] }) => {
      setTransform((prev) => ({
        ...prev,
        scale: Math.max(0.5, Math.min(3, scale)), // 限制缩放范围 0.5x - 3x
        rotation: rotation,
      }));
    },

    // 滚轮缩放（用于桌面测试）
    onWheel: ({ offset: [, y] }) => {
      const delta = y > 0 ? 0.1 : -0.1;
      setTransform((prev) => ({
        ...prev,
        scale: Math.max(0.5, Math.min(3, prev.scale + delta)),
      }));
    },
  });

  const reset = useCallback(() => {
    setTransform({
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      rotation: 0,
    });
  }, []);

  return { transform, bind, reset };
};