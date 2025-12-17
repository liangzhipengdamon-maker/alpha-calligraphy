import { useState, useRef, useEffect } from 'react'
import { AIEvaluationService } from '@/services/aiService'
import { ImageService } from '@/services/imageService'
import { initializeAuth } from '@/services/firebaseService'
import { EvaluationResult } from '@/types'
import ARLightBox from '@/components/ARLightBox'

export default function EvaluationPage() {
  const [userImage, setUserImage] = useState<string | null>(null)
  const [reportData, setReportData] = useState<EvaluationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('准备就绪')
  const [targetChar, setTargetChar] = useState('永')
  const [showARMode, setShowARMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const aiService = useRef<AIEvaluationService | null>(null)

  // 初始化
  useEffect(() => {
    const init = async () => {
      // Firebase 初始化，但不阻止主要功能
      try {
        await initializeAuth()
      } catch (err) {
        console.warn('Firebase 初始化失败，但 AI 评估功能不受影响')
      }

      // AI 服务不依赖 Firebase
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''
      if (!apiKey) {
        setStatus('错误：未配置 Gemini API Key')
        return
      }
      aiService.current = new AIEvaluationService(apiKey)
      setStatus('已连接')
    }
    init()
  }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setStatus('处理图片中...')
      const compressed = await ImageService.compressImage(file)
      setUserImage(compressed)
      setStatus('图片已加载，请进行评估')
    } catch (error) {
      setStatus('图片处理失败')
      console.error(error)
    }
  }

  const handleGenerateReport = async () => {
    if (!userImage || !aiService.current) {
      setStatus('请先上传图片或重新加载页面')
      return
    }

    setIsLoading(true)
    setReportData(null) // 清空旧的报告
    setStatus('正在生成评估报告（请稍候）...')

    try {
      const result = await aiService.current.evaluateHandwriting(userImage, targetChar)
      setReportData(result)
      setStatus('报告生成完毕')
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '未知错误'
      setStatus(`错误: ${errorMsg}`)
      console.error('评估失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (showARMode) {
    return (
      <ARLightBox
        characterSVG="M 150,50 L 150,300 M 50,150 L 250,150 M 100,200 L 200,200 M 80,250 L 220,250"
        onClose={() => setShowARMode(false)}
        onCapture={(blob) => {
          console.log('Captured:', blob)
          setShowARMode(false)
        }}
      />
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white rounded-xl shadow-2xl">
      <h1 className="text-4xl font-bold text-indigo-700 mb-2">名师手把手</h1>
      <p className="text-gray-600 mb-8">AI 硬笔书法评估系统</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 左侧：上传和控制 */}
        <div className="space-y-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-bold text-indigo-800 mb-4">1. 上传字迹照片</h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              选择照片
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-bold text-purple-800 mb-4">2. 评估设置</h3>
            <label className="block text-sm text-gray-700 mb-2">目标文字</label>
            <input
              type="text"
              value={targetChar}
              onChange={(e) => setTargetChar(e.target.value[0] || '永')}
              maxLength={1}
              className="w-full border rounded p-2 text-center text-2xl font-bold"
            />
          </div>

          <button
            onClick={() => setShowARMode(true)}
            className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition font-semibold"
          >
            📱 AR 透台
          </button>

          <button
            onClick={handleGenerateReport}
            disabled={!userImage || isLoading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400"
          >
            {isLoading ? '生成中...' : '✨ 生成评估报告'}
          </button>

          <div className="bg-gray-100 p-3 rounded text-sm text-gray-600">
            <strong>状态:</strong> {status}
          </div>
        </div>

        {/* 右侧：预览和报告 */}
        <div className="space-y-4">
          {userImage && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">预览</h3>
              <img
                src={`data:image/jpeg;base64,${userImage}`}
                alt="user handwriting"
                className="w-full rounded border-2 border-gray-300"
              />
            </div>
          )}

          {reportData && (
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-bold text-indigo-800 mb-2">评估结果</h3>
              <div className="text-3xl font-bold text-indigo-700">
                {reportData.totalScore} <span className="text-lg text-indigo-600">/100</span>
              </div>
              <p className="text-gray-700 mt-2">{reportData.commentary.overall}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
