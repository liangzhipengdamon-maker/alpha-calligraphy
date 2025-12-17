import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useARGestures } from '@/hooks/useARGestures'
import { SVGPathService } from '@/services/svgPathService'
import { ARLightBoxProps, CameraError, ARControlsState } from '@/types/ar'

const ARLightBox: React.FC<ARLightBoxProps> = ({
  characterSVG,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [cameraError, setCameraError] = useState<CameraError | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [controls, setControls] = useState<ARControlsState>({
    opacity: 0.5,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
  })

  const { transform, bind, reset: resetGestures } = useARGestures({
    offsetX: controls.offsetX,
    offsetY: controls.offsetY,
    scale: controls.scale,
    rotation: controls.rotation,
  })

  useEffect(() => {
    setControls((prev) => ({
      ...prev,
      offsetX: transform.offsetX,
      offsetY: transform.offsetY,
      scale: transform.scale,
      rotation: transform.rotation,
    }))
  }, [transform])

  useEffect(() => {
    const startCamera = async () => {
      if (!videoRef.current) return

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        })

        videoRef.current.srcObject = stream
        setIsCameraActive(true)
        setCameraError(null)
      } catch (err: any) {
        try {
          const streamFallback = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          })
          videoRef.current!.srcObject = streamFallback
          setIsCameraActive(true)
          setCameraError(null)
        } catch (fallbackErr: any) {
          let errorType: CameraError['type'] = 'NOT_FOUND'
          let message = '无法访问摄像头'

          if (
            fallbackErr.name === 'NotAllowedError' ||
            fallbackErr.message?.includes('Permission denied')
          ) {
            errorType = 'PERMISSION_DENIED'
            message = '请允许访问摄像头权限'
          } else if (
            fallbackErr.name === 'NotSupportedError' ||
            fallbackErr.message?.includes('https')
          ) {
            errorType = 'HTTPS_REQUIRED'
            message = '请使用 HTTPS 或 localhost 访问此功能'
          }

          setCameraError({
            type: errorType,
            message,
          })
          setIsCameraActive(false)
        }
      }
    }

    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (
          videoRef.current.srcObject as MediaStream
        ).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  useEffect(() => {
    if (!canvasRef.current || !videoRef.current || !isCameraActive) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    const updateCanvasSize = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth
        canvas.height = containerRef.current.clientHeight
      }
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    let animationId: number

    const draw = () => {
      const { width, height } = canvas

      ctx.clearRect(0, 0, width, height)

      try {
        const centerX = width / 2 + controls.offsetX
        const centerY = height / 2 + controls.offsetY

        ctx.globalAlpha = controls.opacity

        SVGPathService.drawSVGPath(ctx, characterSVG, {
          scale: controls.scale * 100,
          offsetX: centerX,
          offsetY: centerY,
          rotation: controls.rotation,
          strokeColor: '#ff0000',
          strokeWidth: 3,
          fillColor: 'rgba(255, 0, 0, 0.1)',
        })

        ctx.globalAlpha = 1
      } catch (err) {
        console.error('Failed to draw SVG path:', err)
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', updateCanvasSize)
      cancelAnimationFrame(animationId)
    }
  }, [isCameraActive, controls, characterSVG])

  const handleReset = useCallback(() => {
    resetGestures()
    setControls({
      opacity: 0.5,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
    })
  }, [resetGestures])

  const handleCapture = useCallback(() => {
    if (!canvasRef.current) return

    canvasRef.current.toBlob((blob) => {
      if (blob && onCapture) {
        onCapture(blob)
      }
    }, 'image/png')
  }, [onCapture])

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden bg-black"
      style={{ touchAction: 'none' }}
      {...bind()}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ zIndex: 1 }}
      />

      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ zIndex: 10, touchAction: 'none' }}
      />

      <div className="absolute bottom-0 left-0 w-full z-50 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        {cameraError ? (
          <div className="bg-red-500/90 text-white p-4 rounded-lg mb-4 text-center">
            <p className="font-semibold">{cameraError.message}</p>
            <p className="text-sm mt-1 opacity-80">
              错误类型: {cameraError.type}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-black/50 p-4 rounded-xl backdrop-blur-sm mb-4">
              <label className="text-white text-sm font-medium block mb-2">
                透台浓度: {Math.round(controls.opacity * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={controls.opacity}
                onChange={(e) =>
                  setControls((prev) => ({
                    ...prev,
                    opacity: parseFloat(e.target.value),
                  }))
                }
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            <div className="bg-black/50 p-4 rounded-xl backdrop-blur-sm mb-4">
              <label className="text-white text-sm font-medium block mb-2">
                范字大小: {Math.round(controls.scale * 100)}%
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={controls.scale}
                onChange={(e) =>
                  setControls((prev) => ({
                    ...prev,
                    scale: parseFloat(e.target.value),
                  }))
                }
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            <div className="text-white text-center text-sm opacity-70 mb-4">
              旋转: {Math.round(controls.rotation)}°
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition"
              >
                重置
              </button>
              <button
                onClick={handleCapture}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
              >
                截图
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition"
              >
                关闭
              </button>
            </div>

            <p className="text-white text-xs opacity-60 mt-4 text-center">
              💡 提示: 拖拽移动位置 | 双指缩放/旋转 | 滑块调整透明度和大小
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default ARLightBox