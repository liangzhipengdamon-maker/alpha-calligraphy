import { EvaluationResult } from '@/types'

const GEMINI_MODEL = 'gemini-2.5-flash-preview-09-2025'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

export class AIEvaluationService {
  private apiKey: string
  private cacheMap: Map<string, EvaluationResult> = new Map()

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  // 清空缓存（用于调试或重新评估）
  clearCache() {
    this.cacheMap.clear()
    console.log('Cache cleared')
  }

  /**
   * 评估手写字体
   */
  async evaluateHandwriting(
    imageBase64: string,
    targetChar: string,
  ): Promise<EvaluationResult> {
    // 检查缓存
    const cacheKey = `${targetChar}_${imageBase64.slice(0, 20)}`
    if (this.cacheMap.has(cacheKey)) {
      return this.cacheMap.get(cacheKey)!
    }

    // 调用 API
    const result = await this.callGeminiWithRetry(imageBase64, targetChar)

    // 缓存结果
    this.cacheMap.set(cacheKey, result)

    return result
  }

  private async callGeminiWithRetry(
    imageBase64: string,
    targetChar: string,
    maxRetries: number = 3,
  ): Promise<EvaluationResult> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(`${GEMINI_URL}?key=${this.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.buildPayload(imageBase64, targetChar)),
        })

        if (!response.ok) {
          if (response.status === 429 && attempt < maxRetries - 1) {
            const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500
            await new Promise((r) => setTimeout(r, delay))
            continue
          }
          throw new Error(`API 错误: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
          throw new Error('API 响应结构不正常')
        }
        const jsonString = data.candidates[0].content.parts[0].text
        const result = JSON.parse(jsonString) as EvaluationResult
        result.timestamp = new Date()
        return result
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        console.error(`第 ${attempt + 1}/${maxRetries} 次尝试失败:`, errorMsg)
        
        if (attempt === maxRetries - 1) {
          throw new Error(`评估失败（已重试${maxRetries}次）: ${errorMsg}`)
        }
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500
        await new Promise((r) => setTimeout(r, delay))
      }
    }

    throw new Error('Failed to evaluate after max retries')
  }

  private buildPayload(imageBase64: string, targetChar: string) {
    const systemPrompt = `你是一位专业的硬笔书法导师。请对图片中的"${targetChar}"字进行详细评估。
    
    请严格按照以下 JSON 格式输出：
    {
      "totalScore": 0-100,
      "scores": {
        "centerOfGravity": 1-5,
        "strokeNeatness": 1-5,
        "outerContour": 1-5,
        "mainStrokeProminence": 1-5,
        "overallStrokeScore": 1-5
      },
      "commentary": {
        "overall": "总体评价",
        "structure": {
          "centerOfGravity": "重心评价",
          "strokeNeatness": "笔画整齐度评价",
          "outerContour": "外轮廓评价",
          "mainStrokeProminence": "主笔评价"
        },
        "strokeDetails": [
          {"critiqueId": "dian", "text": "点的评价"},
          {"critiqueId": "heng", "text": "横的评价"},
          {"critiqueId": "shu", "text": "竖的评价"},
          {"critiqueId": "pie", "text": "撇的评价"},
          {"critiqueId": "na", "text": "捺的评价"}
        ]
      }
    }`

    return {
      contents: [
        {
          role: 'user',
          parts: [
            { text: `请对图片中的"${targetChar}"字进行笔画级评估` },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: imageBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
      },
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
    }
  }
}
