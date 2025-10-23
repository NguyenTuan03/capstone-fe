import { GoogleGenerativeAI } from '@google/generative-ai';
import { CombinedAnalysisResult, VideoComparisonResult } from '@/@crema/types/models/AI';

const apiKey = process.env.NEXT_PUBLIC_API_KEY;
if (!apiKey) {
  throw new Error(
    'NEXT_PUBLIC_API_KEY environment variable is not set. Please add it to your .env.local file.',
  );
}

const ai = new GoogleGenerativeAI(apiKey);

const model = 'gemini-2.5-flash';

const parseJsonResponse = <T>(text: string): T => {
  try {
    const cleanedText = text.replace(/^```json\s*|```$/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (e) {
    console.error('Failed to parse JSON response:', text);
    throw new Error('Đã nhận được phản hồi không hợp lệ từ AI. Vui lòng thử lại.');
  }
};

const analyzeVideoSchema = {
  type: 'object' as const,
  properties: {
    shotType: { type: 'string' as const },
    confidence: { type: 'number' as const },
    pose: {
      type: 'object' as const,
      properties: {
        summary: { type: 'string' as const },
        feedback: { type: 'string' as const },
      },
      required: ['summary', 'feedback'],
    },
    movement: {
      type: 'object' as const,
      properties: {
        preparation: { type: 'string' as const },
        contact: { type: 'string' as const },
        followThrough: { type: 'string' as const },
      },
      required: ['preparation', 'contact', 'followThrough'],
    },
    recommendations: {
      type: 'array' as const,
      items: { type: 'string' as const },
    },
    tags: {
      type: 'array' as const,
      items: { type: 'string' as const },
    },
    description: { type: 'string' as const },
  },
  required: [
    'shotType',
    'confidence',
    'pose',
    'movement',
    'recommendations',
    'tags',
    'description',
  ],
};

const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isRetryableError =
        error?.message?.includes('overloaded') ||
        error?.message?.includes('503') ||
        error?.message?.includes('UNAVAILABLE');

      if (!isRetryableError || attempt === maxRetries - 1) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
};

export const analyzeVideo = async (base64Frames: string[]): Promise<CombinedAnalysisResult> => {
  const prompt = `
    Bạn là một huấn luyện viên pickleball chuyên nghiệp với kiến thức sâu rộng về cơ sinh học.
    Phân tích chuỗi hình ảnh từ một video. Các hình ảnh được sắp xếp theo thứ tự thời gian và thể hiện một cú đánh duy nhất.
    Nhiệm vụ của bạn là thực hiện một phân tích toàn diện và trả về một đối tượng JSON duy nhất.
    1.  **Phân tích Kỹ thuật:**
        *   Phân loại loại cú đánh (ví dụ: cú smash, cú lốp, cú vô lê, v.v.).
        *   Phân tích chi tiết tư thế và chuyển động của người chơi (chuẩn bị, tiếp xúc, kết thúc).
        *   Đưa ra các đề xuất cụ thể để cải thiện kỹ thuật.
    2.  **Tạo Thẻ và Mô tả:**
        *   Tạo từ 1 đến 3 thẻ. Thẻ quan trọng nhất PHẢI là tên của kỹ thuật/cú đánh chính. Ví dụ: "Giao bóng" (Serve), "Bỏ nhỏ" (Dink), "Vô lê" (Volley). TUYỆT ĐỐI KHÔNG tạo thẻ về tư thế hoặc chuẩn bị.
        *   Viết một mô tả ngắn gọn (1-2 câu) tóm tắt hành động.

    Hãy trả lời CHỈ bằng một đối tượng JSON bằng tiếng Việt theo lược đồ đã cung cấp.`;

  const imageParts = base64Frames.map((frame) => ({
    inlineData: { mimeType: 'image/jpeg', data: frame },
  }));

  return retryWithBackoff(async () => {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [...imageParts, { text: prompt }],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: analyzeVideoSchema,
        },
      });

      return parseJsonResponse<CombinedAnalysisResult>(response.text || '');
    } catch (error) {
      console.error('Gemini API call failed in analyzeVideo:', error);
      throw new Error(
        'AI không thể xử lý video. Điều này có thể do sự cố mạng hoặc sự cố dịch vụ tạm thời. Vui lòng thử lại sau.',
      );
    }
  });
};

const comparisonDetailSchema = {
  type: 'object' as const,
  properties: {
    analysis: {
      type: 'string' as const,
      description: 'Phân tích chi tiết về kỹ thuật của người chơi trong giai đoạn này.',
    },
    strengths: {
      type: 'array' as const,
      items: { type: 'string' as const },
      description: 'Danh sách các điểm mạnh cụ thể.',
    },
    weaknesses: {
      type: 'array' as const,
      items: { type: 'string' as const },
      description: 'Danh sách các điểm yếu cụ thể cần cải thiện.',
    },
    timestamp: {
      type: 'number' as const,
      description: 'Dấu thời gian (tính bằng giây) trong video mà phân tích này áp dụng.',
    },
  },
  required: ['analysis', 'strengths', 'weaknesses', 'timestamp'],
};

const keyDifferenceSchema = {
  type: 'object' as const,
  properties: {
    aspect: {
      type: 'string' as const,
      description:
        'Khía cạnh kỹ thuật được so sánh (ví dụ: Dáng đứng, Vung vợt, Chuyển động chân).',
    },
    player1_technique: {
      type: 'string' as const,
      description: 'Mô tả kỹ thuật của Huấn luyện viên.',
    },
    player2_technique: { type: 'string' as const, description: 'Mô tả kỹ thuật của Học viên.' },
    impact: {
      type: 'string' as const,
      description: 'Phân tích tác động của sự khác biệt này đối với cú đánh.',
    },
  },
  required: ['aspect', 'player1_technique', 'player2_technique', 'impact'],
};

const drillSchema = {
  type: 'object' as const,
  properties: {
    title: { type: 'string' as const, description: 'Tiêu đề của bài tập.' },
    description: {
      type: 'string' as const,
      description: 'Mô tả chi tiết về cách thực hiện bài tập.',
    },
    practice_sets: {
      type: 'string' as const,
      description: "Các hiệp thực hành được đề xuất (ví dụ: '3 hiệp, mỗi hiệp 10 lần lặp').",
    },
  },
  required: ['title', 'description', 'practice_sets'],
};

const recommendationWithDrillSchema = {
  type: 'object' as const,
  properties: {
    recommendation: { type: 'string' as const, description: 'Một đề xuất cụ thể để cải thiện.' },
    drill: drillSchema,
  },
  required: ['recommendation', 'drill'],
};

const compareVideosSchema = {
  type: 'object' as const,
  properties: {
    comparison: {
      type: 'object' as const,
      properties: {
        preparation: {
          type: 'object' as const,
          properties: {
            player1: comparisonDetailSchema,
            player2: comparisonDetailSchema,
            advantage: { type: 'string' as const },
          },
          required: ['player1', 'player2', 'advantage'],
        },
        swingAndContact: {
          type: 'object' as const,
          properties: {
            player1: comparisonDetailSchema,
            player2: comparisonDetailSchema,
            advantage: { type: 'string' as const },
          },
          required: ['player1', 'player2', 'advantage'],
        },
        followThrough: {
          type: 'object' as const,
          properties: {
            player1: comparisonDetailSchema,
            player2: comparisonDetailSchema,
            advantage: { type: 'string' as const },
          },
          required: ['player1', 'player2', 'advantage'],
        },
      },
      required: ['preparation', 'swingAndContact', 'followThrough'],
    },
    keyDifferences: {
      type: 'array' as const,
      items: keyDifferenceSchema,
    },
    summary: { type: 'string' as const },
    recommendationsForPlayer2: {
      type: 'array' as const,
      items: recommendationWithDrillSchema,
    },
    overallScoreForPlayer2: {
      type: 'number' as const,
      description: 'Điểm tổng thể cho kỹ thuật của Học viên trên thang điểm 10.',
    },
  },
  required: [
    'comparison',
    'keyDifferences',
    'summary',
    'recommendationsForPlayer2',
    'overallScoreForPlayer2',
  ],
};

export const compareVideos = async (
  coachFrames: string[],
  coachTimestamps: number[],
  learnerFrames: string[],
  learnerTimestamps: number[],
): Promise<VideoComparisonResult> => {
  const prompt = `
    Bạn là một huấn luyện viên pickleball đẳng cấp thế giới, chuyên phân tích cơ sinh học. Nhiệm vụ của bạn là so sánh kỹ thuật giữa hai video: "Video Huấn luyện viên" và "Video Học viên".

    - Video 1 là của "Huấn luyện viên" (player1). Đây là video tham chiếu cho kỹ thuật đúng.
    - Video 2 là của "Học viên" (player2).
    - Trong cấu trúc JSON, "player1" PHẢI LUÔN là Huấn luyện viên và "player2" PHẢI LUÔN là Học viên.
    - Toàn bộ phân tích, bao gồm tóm tắt, đề xuất và điểm số, phải tập trung vào việc giúp "Học viên" (player2) cải thiện để giống với "Huấn luyện viên" (player1) hơn.

    Bạn được cung cấp ba khung hình cho mỗi video. Dấu thời gian cho các khung hình của Video Huấn luyện viên là ${coachTimestamps.join(', ')} giây. Dấu thời gian cho các khung hình của Video Học viên là ${learnerTimestamps.join(', ')} giây.
    Khung hình đầu tiên tương ứng với giai đoạn Chuẩn bị, khung hình thứ hai với Vung vợt & Tiếp xúc, và khung hình thứ ba với Kết thúc.

    Hãy thực hiện một phân tích cực kỳ chi tiết, song song. Đối với mỗi giai đoạn, hãy phân tích từng người chơi (Huấn luyện viên và Học viên), liệt kê các điểm mạnh và điểm yếu của họ. Sau đó, xác định những khác biệt chính, tóm tắt lại và đưa ra các đề xuất mang tính xây dựng, bao gồm các bài tập thực hành cụ thể cho Học viên. Cuối cùng, chấm điểm tổng thể cho Học viên.

    Hãy trả lời CHỈ bằng một đối tượng JSON bằng tiếng Việt theo lược đồ đã cung cấp.
    - Trong 'comparison', 'analysis' phải là một đoạn văn chi tiết. 'strengths' và 'weaknesses' phải là các điểm gạch đầu dòng ngắn gọn.
    - Đối với mỗi phân tích, bạn PHẢI bao gồm dấu thời gian tương ứng trong khóa 'timestamp'.
    - 'keyDifferences' phải nêu bật 2-3 khác biệt quan trọng nhất.
    - 'recommendationsForPlayer2' phải bao gồm một bài tập thực hành ('drill') cho mỗi đề xuất. Mỗi 'drill' phải là một đối tượng có 'title', 'description' và 'practice_sets'.
    - 'overallScoreForPlayer2' phải là một con số từ 1 đến 10.`;

  const parts = [
    { text: 'Khung hình từ Video Huấn luyện viên (player1):' },
    ...coachFrames.map((frame) => ({ inlineData: { mimeType: 'image/jpeg', data: frame } })),
    { text: 'Khung hình từ Video Học viên (player2):' },
    ...learnerFrames.map((frame) => ({ inlineData: { mimeType: 'image/jpeg', data: frame } })),
    { text: prompt },
  ];

  return retryWithBackoff(async () => {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          responseSchema: compareVideosSchema,
        },
      });

      return parseJsonResponse<VideoComparisonResult>(response.text || '');
    } catch (error) {
      console.error('Gemini API call failed in compareVideos:', error);
      throw new Error(
        'AI không thể xử lý video để so sánh. Điều này có thể do sự cố mạng hoặc sự cố dịch vụ tạm thời. Vui lòng thử lại sau.',
      );
    }
  });
};
