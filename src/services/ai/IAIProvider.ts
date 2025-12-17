/**
 * AI Provider 接口定义
 * 定义所有 AI 服务提供商必须实现的接口
 * 支持灵活的 AI 模型切换（Qwen-VL, Gemini 等）
 */

/**
 * 字符识别结果
 */
export interface CharacterResult {
  character: string;
  pinyin: string;
  confidence: number;
  structure: string;
  strokeCount: number;
}

/**
 * 书写风格分析结果
 */
export interface StyleAnalysis {
  brushForce: {
    level: 'light' | 'medium' | 'heavy';
    consistency: number; // 0-1
  };
  brushSpeed: {
    level: 'slow' | 'medium' | 'fast';
    variation: number; // 0-1
  };
  brushMomentum: {
    smoothness: number; // 0-1
    connectivity: number; // 0-1
  };
}

/**
 * 评估结果
 */
export interface EvaluationResult {
  characterId: string;
  qualityScore: number; // 0-25
  structureScore: number; // 0-35
  strokeOrderScore: number; // 0-15
  overallScore: number; // 0-25
  totalScore: number; // 0-100
  feedback: string;
  suggestions: string[];
}

/**
 * AI Provider 基础接口
 * 所有 AI 服务提供商必须实现此接口
 */
export interface IAIProvider {
  /**
   * 识别手写字符
   * @param image 图片 Buffer 或 Base64 字符串
   * @returns 字符识别结果
   */
  recognizeCharacter(image: Buffer | string): Promise<CharacterResult>;

  /**
   * 分析书写风格
   * @param trajectoryData 笔迹轨迹数据
   * @returns 书写风格分析结果
   */
  analyzeWritingStyle(trajectoryData: any): Promise<StyleAnalysis>;

  /**
   * 生成评价反馈
   * @param evaluationResult 评估结果
   * @returns 人工化的反馈文本
   */
  generateFeedback(evaluationResult: EvaluationResult): Promise<string>;

  /**
   * 执行完整的评分流程
   * @param image 字体图片
   * @param trajectoryData 笔迹数据
   * @returns 完整评估结果
   */
  evaluateCharacter(
    image: Buffer | string,
    trajectoryData?: any
  ): Promise<EvaluationResult>;
}
