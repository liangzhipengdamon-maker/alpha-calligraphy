/**
 * Qwen-VL AI Provider 实现
 * 使用阿里云通义千问视觉模型进行字形识别和评估
 */

import {
  IAIProvider,
  CharacterResult,
  StyleAnalysis,
  EvaluationResult,
} from './IAIProvider';

export class QwenVLProvider implements IAIProvider {
  private apiKey: string;
  private apiBase: string;
  private maxRetries: number = 3;
  private retryDelay: number = 1000;

  constructor(apiKey?: string, apiBase?: string) {
    this.apiKey = apiKey || process.env.QWEN_API_KEY || '';
    this.apiBase =
      apiBase ||
      process.env.QWEN_API_BASE ||
      'https://dashscope.aliyuncs.com/compatible-mode/v1';

    if (!this.apiKey) {
      throw new Error(
        'QWEN_API_KEY not provided. Please set environment variable or pass apiKey parameter.'
      );
    }
  }

  /**
   * 识别手写字符
   */
  async recognizeCharacter(image: Buffer | string): Promise<CharacterResult> {
    let retries = 0;
    const imageData = typeof image === 'string' ? image : image.toString('base64');

    while (retries < this.maxRetries) {
      try {
        const response = await this.callQwenAPI(
          '请识别这个手写汉字，并返回 JSON 格式的结果，包含字符、拼音、识别置信度(0-1)、笔画数和结构分类。',
          imageData
        );

        const result = this.parseCharacterResult(response);
        return result;
      } catch (error) {
        retries++;
        if (retries >= this.maxRetries) {
          throw new Error(
            `Failed to recognize character after ${this.maxRetries} retries: ${error}`
          );
        }
        await this.sleep(this.retryDelay * retries);
      }
    }

    throw new Error('Character recognition failed');
  }

  /**
   * 分析书写风格
   */
  async analyzeWritingStyle(trajectoryData: any): Promise<StyleAnalysis> {
    // 基于笔迹轨迹数据分析书写风格
    // 注：需要配合 InkSight 提供的笔迹数据

    const brushWidth = trajectoryData?.brushWidthVariation || [];
    const strokeTiming = trajectoryData?.timing || [];

    return {
      brushForce: {
        level: this.calculateBrushForceLevel(brushWidth),
        consistency: this.calculateConsistency(brushWidth),
      },
      brushSpeed: {
        level: this.calculateBrushSpeedLevel(strokeTiming),
        variation: this.calculateVariation(strokeTiming),
      },
      brushMomentum: {
        smoothness: this.calculateSmoothness(trajectoryData?.points || []),
        connectivity: this.calculateConnectivity(trajectoryData?.strokes || []),
      },
    };
  }

  /**
   * 生成评价反馈
   */
  async generateFeedback(evaluationResult: EvaluationResult): Promise<string> {
    try {
      const prompt = this.buildFeedbackPrompt(evaluationResult);
      const response = await this.callQwenAPI(prompt);
      return response;
    } catch (error) {
      console.error('Error generating feedback:', error);
      return this.generateDefaultFeedback(evaluationResult);
    }
  }

  /**
   * 执行完整的评分流程
   */
  async evaluateCharacter(
    image: Buffer | string,
    trajectoryData?: any
  ): Promise<EvaluationResult> {
    const characterResult = await this.recognizeCharacter(image);
    const styleAnalysis = trajectoryData
      ? await this.analyzeWritingStyle(trajectoryData)
      : null;

    const scores = this.calculateScores(characterResult, styleAnalysis);
    const feedback = await this.generateFeedback(scores);

    return {
      characterId: characterResult.character,
      qualityScore: scores.qualityScore,
      structureScore: scores.structureScore,
      strokeOrderScore: scores.strokeOrderScore,
      overallScore: scores.overallScore,
      totalScore: scores.totalScore,
      feedback,
      suggestions: this.generateSuggestions(scores),
    };
  }

  // ============ 私有方法 ============

  private async callQwenAPI(prompt: string, imageData?: string): Promise<string> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };

    const messages: any = [
      {
        role: 'user',
        content: [{ type: 'text', text: prompt }],
      },
    ];

    if (imageData) {
      messages[0].content.push({
        type: 'image',
        image_url: {
          url: `data:image/jpeg;base64,${imageData}`,
        },
      });
    }

    const response = await fetch(`${this.apiBase}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'qwen-vl-max',
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Qwen API error: ${response.status} ${response.statusText}`
      );
    }

    const data: any = await response.json();
    return data.choices[0].message.content;
  }

  private parseCharacterResult(response: string): CharacterResult {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return {
        character: parsed.character || '未知',
        pinyin: parsed.pinyin || '',
        confidence: parsed.confidence || 0.5,
        structure: parsed.structure || 'unknown',
        strokeCount: parsed.strokeCount || 0,
      };
    } catch (error) {
      console.error('Error parsing character result:', error);
      return {
        character: '未知',
        pinyin: '',
        confidence: 0,
        structure: 'unknown',
        strokeCount: 0,
      };
    }
  }

  private calculateBrushForceLevel(
    brushWidth: number[]
  ): 'light' | 'medium' | 'heavy' {
    if (brushWidth.length === 0) return 'medium';
    const avgWidth = brushWidth.reduce((a, b) => a + b) / brushWidth.length;
    if (avgWidth < 2) return 'light';
    if (avgWidth < 4) return 'medium';
    return 'heavy';
  }

  private calculateConsistency(brushWidth: number[]): number {
    if (brushWidth.length < 2) return 1;
    const mean =
      brushWidth.reduce((a, b) => a + b) / brushWidth.length;
    const variance =
      brushWidth.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      brushWidth.length;
    const stdDev = Math.sqrt(variance);
    return Math.max(0, Math.min(1, 1 - stdDev / (mean || 1)));
  }

  private calculateBrushSpeedLevel(
    timing: number[]
  ): 'slow' | 'medium' | 'fast' {
    if (timing.length === 0) return 'medium';
    const avgTime = timing.reduce((a, b) => a + b) / timing.length;
    if (avgTime > 100) return 'slow';
    if (avgTime > 50) return 'medium';
    return 'fast';
  }

  private calculateVariation(timing: number[]): number {
    if (timing.length < 2) return 0;
    const mean = timing.reduce((a, b) => a + b) / timing.length;
    const variance =
      timing.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      timing.length;
    const stdDev = Math.sqrt(variance);
    return Math.min(1, stdDev / (mean || 1));
  }

  private calculateSmoothness(points: any[]): number {
    if (points.length < 3) return 1;
    let angleVariance = 0;
    for (let i = 1; i < points.length - 1; i++) {
      const p1 = points[i - 1];
      const p2 = points[i];
      const p3 = points[i + 1];
      const angle1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
      angleVariance += Math.abs(angle2 - angle1);
    }
    const avgVariance = angleVariance / (points.length - 2);
    return Math.max(0, Math.min(1, 1 - avgVariance / Math.PI));
  }

  private calculateConnectivity(strokes: any[]): number {
    if (strokes.length < 2) return 1;
    let connectionScore = 0;
    for (let i = 0; i < strokes.length - 1; i++) {
      const endPoint = strokes[i][strokes[i].length - 1];
      const startPoint = strokes[i + 1][0];
      const distance = Math.sqrt(
        Math.pow(endPoint.x - startPoint.x, 2) +
          Math.pow(endPoint.y - startPoint.y, 2)
      );
      connectionScore += distance < 10 ? 1 : 0;
    }
    return connectionScore / (strokes.length - 1);
  }

  private calculateScores(
    characterResult: CharacterResult,
    styleAnalysis: StyleAnalysis | null
  ): EvaluationResult {
    const qualityScore = styleAnalysis
      ? this.calculateQualityScore(styleAnalysis)
      : 15;
    const structureScore = this.calculateStructureScore(characterResult);
    const strokeOrderScore = 12;
    const overallScore = styleAnalysis
      ? this.calculateOverallScore(styleAnalysis)
      : 18;

    const totalScore =
      qualityScore + structureScore + strokeOrderScore + overallScore;

    return {
      characterId: characterResult.character,
      qualityScore,
      structureScore,
      strokeOrderScore,
      overallScore,
      totalScore: Math.round(totalScore),
      feedback: '',
      suggestions: [],
    };
  }

  private calculateQualityScore(styleAnalysis: StyleAnalysis): number {
    const forceScore =
      (styleAnalysis.brushForce.consistency * 10 +
        (styleAnalysis.brushForce.level === 'heavy' ? 5 : 3)) /
      2;
    const speedScore = styleAnalysis.brushSpeed.level === 'medium' ? 8 : 6;
    return Math.round((forceScore + speedScore) / 2);
  }

  private calculateStructureScore(characterResult: CharacterResult): number {
    const baseScore = Math.round(characterResult.confidence * 35);
    return Math.min(35, Math.max(10, baseScore));
  }

  private calculateOverallScore(styleAnalysis: StyleAnalysis): number {
    const smoothness = styleAnalysis.brushMomentum.smoothness * 12;
    const connectivity = styleAnalysis.brushMomentum.connectivity * 13;
    return Math.round((smoothness + connectivity) / 2);
  }

  private buildFeedbackPrompt(evaluation: EvaluationResult): string {
    return `基于以下书法评分结果，生成一个温暖、鼓励且具体的反馈文本（200字以内）：
    
字符: ${evaluation.characterId}
总分: ${evaluation.totalScore}/100
笔画质量: ${evaluation.qualityScore}/25
结构分析: ${evaluation.structureScore}/35
笔顺规范: ${evaluation.strokeOrderScore}/15
整体评价: ${evaluation.overallScore}/25

请用家长和学生都能理解的语言，指出优点和需要改进的地方。`;
  }

  private generateDefaultFeedback(evaluation: EvaluationResult): string {
    const level =
      evaluation.totalScore >= 90
        ? '优秀'
        : evaluation.totalScore >= 75
          ? '良好'
          : '需要改进';
    return `您的"${evaluation.characterId}"字写得${level}。保持练习，继续进步！`;
  }

  private generateSuggestions(evaluation: EvaluationResult): string[] {
    const suggestions: string[] = [];

    if (evaluation.qualityScore < 15) {
      suggestions.push('注意笔画的轻重变化，让笔画更有力度');
    }
    if (evaluation.structureScore < 25) {
      suggestions.push('调整字的整体结构，注意各部分的比例关系');
    }
    if (evaluation.strokeOrderScore < 12) {
      suggestions.push('检查笔顺，确保按照规范顺序书写');
    }
    if (evaluation.overallScore < 20) {
      suggestions.push('加强笔画之间的连接，使整个字更加连贯');
    }

    if (suggestions.length === 0) {
      suggestions.push('继续保持当前的书写水平');
    }

    return suggestions;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
