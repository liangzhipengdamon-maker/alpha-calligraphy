// src/services/svgPathService.ts

export class SVGPathService {
  static drawSVGPath(
    ctx: CanvasRenderingContext2D,
    svgPath: string,
    options: {
      scale?: number;
      offsetX?: number;
      offsetY?: number;
      rotation?: number;
      strokeColor?: string;
      strokeWidth?: number;
      fillColor?: string;
    } = {}
  ) {
    const {
      scale = 1,
      offsetX = 0,
      offsetY = 0,
      rotation = 0,
      strokeColor = '#ff0000',
      strokeWidth = 3,
      fillColor = 'rgba(255, 0, 0, 0.2)',
    } = options

    try {
      ctx.save()

      // 移动到中心点
      ctx.translate(offsetX, offsetY)
      
      // 旋转
      if (rotation !== 0) {
        ctx.rotate((rotation * Math.PI) / 180)
      }
      
      // 缩放
      ctx.scale(scale, scale)

      // 使用 SVG 路径字符串直接绘制
      const path = new Path2D(svgPath)
      
      // 填充
      ctx.fillStyle = fillColor
      ctx.fill(path)
      
      // 描边
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = strokeWidth / scale
      ctx.stroke(path)

      ctx.restore()
    } catch (error) {
      console.error('SVG 绘制错误:', error)
    }
  }
}