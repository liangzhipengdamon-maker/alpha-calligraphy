// src/types/ar.ts

export interface ARLightBoxProps {
  characterSVG: string; // SVG 路径字符串
  onClose?: () => void;
  onCapture?: (imageData: Blob) => void;
}

export interface ARControlsState {
  opacity: number; // 范字透明度 0-1
  scale: number; // 范字大小 0.5-3
  offsetX: number; // X 偏移
  offsetY: number; // Y 偏移
  rotation: number; // 旋转角度
}

export interface CameraError {
  type: 'NOT_FOUND' | 'PERMISSION_DENIED' | 'NOT_SUPPORTED' | 'HTTPS_REQUIRED';
  message: string;
}