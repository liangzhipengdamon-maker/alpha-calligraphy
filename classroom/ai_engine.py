"""
AI 评语生成引擎模块

功能职责：
- generate_ai_comment(image_path, student_name, style) - 调用 Qwen-VL 生成评语
- 支持多风格评语生成（预留）
- 完整的容错和重试机制
- 详细的日志记录
"""

import time
import logging
from dashscope import MultiModalConversation
from .config import DASHSCOPE_API_KEY, AI_MAX_RETRIES, AI_RETRY_DELAY, AI_MODEL

logger = logging.getLogger(__name__)


def generate_ai_comment(image_path, student_name="学生", style="professional"):
    """调用 Qwen-VL 多模态大模型生成书法评语

    Args:
        image_path: 书法作品照片路径
        student_name: 学生名字（用于个性化评语）
        style: 评语风格
            - "professional": 专业点评型（默认）
            - "warm": 温暖鼓励型
            - "childlike": 童趣活泼型

    Returns:
        (comment, error, elapsed_ms): 
            - 成功: (评语文本, None, 耗时ms)
            - 失败: (None, 错误信息, 0)
    """
    if not DASHSCOPE_API_KEY:
        error_msg = "API Key 未配置"
        logger.error(f"❌ {error_msg}")
        return None, error_msg, 0

    # 多风格评语提示词映射
    prompt_map = {
        "professional": f"你是一位书法教师，请从笔法、结构、章法角度对{student_name}的书法作品进行专业点评。分析包括：(1)笔画质量与笔法特点，(2)字体结构的合理性，(3)整体布局，(4)可改进方向。评语应专业、具体、建设性。",
        "warm": f"请用温暖鼓励的语气，像关心孩子的长辈一样，肯定{student_name}的努力和进步。评语应该：(1)先表扬具体的优点（笔画、笔势、布局等），(2)指出可以改进的地方，(3)以温暖的鼓励结尾。语言亲切、具体、易于家长理解。",
        "childlike": f"请用6岁孩子能听懂的可爱语言，向{student_name}夸奖他/她的书法作品。可以带上✨🌟😊等表情符号。评语应该生动活泼、充满想象力，强调'你很棒'的主题，激发孩子的学习热情。",
    }
    prompt = prompt_map.get(style, prompt_map["professional"])

    for attempt in range(AI_MAX_RETRIES):
        try:
            # 日志记录
            if attempt == 0:
                logger.info(f"🔍 正在为 {student_name} 调用 Qwen-VL (风格: {style})...")
            else:
                logger.info(f"🔄 重试第 {attempt} 次调用 Qwen-VL...")

            start_time = time.time()

            # 构建消息体
            messages = [
                {
                    "role": "user",
                    "content": [
                        {"type": "image", "image": image_path},
                        {"type": "text", "text": prompt},
                    ],
                }
            ]

            # 调用 Qwen-VL 多模态对话 API
            response = MultiModalConversation.call(
                model=AI_MODEL,
                messages=messages,
                api_key=DASHSCOPE_API_KEY,
            )

            # 检查响应
            if response.status_code == 200:
                # 提取生成的评语
                comment = response.output.choices[0].message.content
                # 如果是列表，取第一个文本内容
                if isinstance(comment, list):
                    for item in comment:
                        if isinstance(item, dict) and item.get("type") == "text":
                            comment = item.get("text", "")
                            break

                elapsed_ms = int((time.time() - start_time) * 1000)
                logger.info(
                    f"✅ AI 评语生成成功（耗时 {elapsed_ms}ms, 风格: {style}）"
                )
                return str(comment), None, elapsed_ms
            else:
                error_msg = (
                    response.message
                    if hasattr(response, "message")
                    else "未知错误"
                )
                logger.warning(
                    f"⚠️ AI 调用失败 (HTTP {response.status_code}): {error_msg}"
                )

                # 如果不是最后一次尝试，等待后重试
                if attempt < AI_MAX_RETRIES - 1:
                    time.sleep(AI_RETRY_DELAY)
                    continue
                else:
                    return None, f"AI 调用失败: {error_msg}", 0

        except Exception as e:
            error_type = type(e).__name__
            error_msg = str(e)
            logger.warning(f"⚠️ AI 调用异常 ({error_type}): {error_msg}")

            # 如果不是最后一次尝试，等待后重试
            if attempt < AI_MAX_RETRIES - 1:
                logger.info(f"   将在 {AI_RETRY_DELAY} 秒后重试...")
                time.sleep(AI_RETRY_DELAY)
                continue
            else:
                return None, "AI 评语生成暂时不可用，请稍后重试，或手动填写评语。", 0

    # 如果所有重试都失败
    return None, "AI 评语生成暂时不可用，请稍后重试，或手动填写评语。", 0
