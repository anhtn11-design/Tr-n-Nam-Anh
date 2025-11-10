import { GoogleGenAI, Type } from "@google/genai";
import type { Idea, VideoType, MixMode, RemixedIdea } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: 'Tiêu đề gốc, ngắn gọn của ý tưởng ban đầu.' },
      creativeStrategy: { type: Type.STRING, description: 'Chiến lược sáng tạo chính được áp dụng để tạo ra biến thể này: "Góc nhìn mới", "Kết nối bất ngờ", hoặc "Cảm xúc sâu".'},
      variationType: { type: Type.STRING, description: 'Tên biến thể của ý tưởng: "Truyền cảm hứng", "Bắt trend", hoặc "Hài hước thông minh".' },
      upgradedTitle: { type: Type.STRING, description: 'Tiêu đề nâng cấp, hấp dẫn và viral hơn, tương ứng với biến thể.' },
      mainEmotion: { type: Type.STRING, description: 'Cảm xúc chính mà video nâng cấp muốn khơi gợi (Vd: "Cảm động - Truyền cảm hứng", "Ngạc nhiên - Hài hước").' },
      viralScore: { type: Type.NUMBER, description: 'Điểm Viral (0-10) của ý tưởng nâng cấp, dựa trên sức mạnh hook, cảm xúc, tính mới lạ và khả năng bắt trend.' },
      contentSummary: { type: Type.STRING, description: 'Tóm tắt nội dung chính của video nâng cấp trong 1-2 câu.' },
      scriptDirection: { type: Type.STRING, description: 'Hướng dẫn kịch bản ngắn gọn cho video nâng cấp (15-30 giây).' },
      category: { type: Type.STRING, description: 'Phân loại nội dung từ danh sách: Hài hước, Giáo dục, Cảm xúc, Review, Định hướng, Series kiến thức.' },
      scores: {
        type: Type.OBJECT,
        properties: {
          relevance: { type: Type.NUMBER, description: 'Điểm (1-5) về mức độ liên quan sản phẩm/chiến dịch HOCMAI.' },
          viralPotential: { type: Type.NUMBER, description: 'Điểm (1-5) về tiềm năng lan tỏa, bắt trend, gây cảm xúc mạnh.' },
          feasibility: { type: Type.NUMBER, description: 'Điểm (1-5) về khả năng thực thi (dễ quay, chi phí thấp).' },
          audienceFit: { type: Type.NUMBER, description: 'Điểm (1-5) về mức độ phù hợp với đối tượng mục tiêu (học sinh, phụ huynh).' },
          brandFit: { type: Type.NUMBER, description: 'Điểm (1-5) về mức độ phù hợp với hình ảnh thương hiệu HOCMAI (học tập vui, chuyên nghiệp).' },
          novelty: { type: Type.NUMBER, description: 'Điểm (1-5) về mức độ mới lạ, độc đáo của ý tưởng so với các nội dung giáo dục thông thường.' },
          trendFit: { type: Type.NUMBER, description: 'Điểm (1-5) về khả năng bắt trend (format, âm thanh, chủ đề) trên TikTok.' },
          engagementPotential: { type: Type.NUMBER, description: 'Điểm (1-5) về tiềm năng tạo tương tác (comment, share, save) dựa trên insight học sinh.' },
          productFit: { type: Type.NUMBER, description: 'Điểm (1-5) về khả năng liên kết tự nhiên với một sản phẩm cụ thể của HOCMAI (khóa học, sách...).' },
          emotionImpact: { type: Type.NUMBER, description: 'Điểm (1-5) về tác động cảm xúc mà ý tưởng có thể tạo ra.' },
        },
        required: ['relevance', 'viralPotential', 'feasibility', 'audienceFit', 'brandFit', 'novelty', 'trendFit', 'engagementPotential', 'productFit', 'emotionImpact'],
      },
      totalScore: { type: Type.NUMBER, description: 'Điểm tổng hợp (tính trung bình cộng của TẤT CẢ các điểm trong mục scores).' },
      priority: { type: Type.STRING, description: 'Phân loại ý tưởng dựa trên điểm: "⭐ Top Tier" (trên 4.0), "⚙️ Thử nghiệm" (3.0-4.0), "💤 Lưu trữ" (dưới 3.0).' },
      implementationSuggestion: { type: Type.STRING, description: 'Đề xuất triển khai: "Nội bộ" hoặc "KOC/CTV".' },
      videoFormat: { type: Type.STRING, description: 'Dạng video chính, phù hợp nhất (vd: storytelling POV, unboxing, tutorial, meme).' },
      formatRemixes: {
        type: Type.ARRAY,
        description: 'Gợi ý 3 format video khác nhau để triển khai ý tưởng (vd: "POV học sinh", "Phỏng vấn nhanh giáo viên", "Meme trend").',
        items: { type: Type.STRING },
      },
      toneRemixes: {
        type: Type.ARRAY,
        description: 'Viết lại "upgradedTitle" theo 2 tone giọng khác nhau.',
        items: {
          type: Type.OBJECT,
          properties: {
            tone: { type: Type.STRING, description: 'Tên của tone giọng (vd: "Xúc động", "Mặn mòi", "Châm biếm").' },
            upgradedTitle: { type: Type.STRING, description: 'Tiêu đề được viết lại theo tone giọng đó.' },
          },
          required: ['tone', 'upgradedTitle'],
        },
      },
      hooks: {
        type: Type.OBJECT,
        description: 'Chỉ sinh ra cho ý tưởng "⭐ Top Tier". Tạo các hook MỚI cho ý tưởng đã NÂNG CẤP.',
        properties: {
          full: { type: Type.ARRAY, description: '1-2 câu hook dạng nói đầy đủ.', items: { type: Type.STRING } },
          mini: {
            type: Type.ARRAY,
            description: '3 mini-hook đã được tối ưu hóa theo các công thức, kèm điểm giữ chân (retention score).',
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: 'Nội dung của mini hook.' },
                formula: { type: Type.STRING, description: 'Tên công thức đã sử dụng để tạo hook (vd: "Tò mò – giải mã").' },
                retentionScore: { type: Type.NUMBER, description: 'Điểm dự đoán khả năng giữ chân người xem (0-100).' },
              },
              required: ['text', 'formula', 'retentionScore'],
            },
          },
          reverse: { type: Type.ARRAY, description: '1-2 câu hook đảo ngược kỳ vọng.', items: { type: Type.STRING } },
        },
      },
      captions: {
        type: Type.ARRAY,
        description: 'Chỉ sinh ra cho ý tưởng "⭐ Top Tier". 2-3 caption gợi tương tác cho ý tưởng nâng cấp.',
        items: { type: Type.STRING },
      },
      hashtagPack: {
        type: Type.ARRAY,
        description: 'Chỉ sinh ra cho ý tưởng "⭐ Top Tier". Gợi ý các hashtag liên quan, bao gồm #HocmaiEdu, #HocmaiTikTok.',
        items: { type: Type.STRING },
      },
    },
    required: [
      'title', 'creativeStrategy', 'variationType', 'upgradedTitle', 'mainEmotion', 'viralScore', 'contentSummary', 'scriptDirection', 'category', 'scores', 
      'totalScore', 'priority', 'implementationSuggestion', 'videoFormat', 'formatRemixes', 'toneRemixes'
    ],
  },
};

export const generateIdeas = async (keywords: string, videoType: VideoType, creativeOverdrive: boolean, informationDepth: number): Promise<Idea[]> => {
  const videoTypeMapping = {
    'all': 'Bất kỳ loại nào',
    'in-house': 'Tự sản xuất nội bộ',
    'ctv': 'CTV Review sản phẩm',
    'koc': 'KOC lan tỏa thương hiệu',
  };

  const overdriveInstruction = creativeOverdrive 
    ? `**CHẾ ĐỘ ĐỘT PHÁ SÁNG TẠO ĐANG BẬT:** Hãy bỏ qua các giới hạn logic thông thường. Tạo ra 5-7 ý tưởng độc đáo, lạ, và thậm chí là kỳ quặc, vượt ra ngoài khuôn khổ (ví dụ: Nếu HOCMAI là một nhân vật Gen Z? Nếu kỳ thi được tổ chức trong vũ trụ? Nếu một gia sư là streamer?). Ưu tiên sự mới lạ và đột phá hơn là tính khả thi.`
    : `Tạo ra 5-7 ý tưởng video TikTok đa dạng. Tránh các ý tưởng "an toàn" và chung chung như "chia sẻ mẹo học tập" đơn thuần.`;

  const prompt = `
    Bạn là một Giám đốc Sáng tạo chuyên về nội dung viral cho HOCMAI, một nền tảng giáo dục online hàng đầu Việt Nam. Đối tượng của bạn là học sinh Gen Z.
    
    **THÔNG TIN ĐẦU VÀO:**
    -   **Từ khóa:** "${keywords}"
    -   **Loại video:** "${videoTypeMapping[videoType]}"
    -   **ĐỘ SÂU THÔNG TIN (do người dùng chọn): ${informationDepth} / 5** 
        -   1: Ý tưởng trend ngắn, bắt mắt, dễ xem.
        -   3: Ý tưởng cân bằng giữa giải trí và thông tin hữu ích.
        -   5: Ý tưởng chuyên sâu, phân tích, cung cấp giá trị học thuật cao.
        Hãy điều chỉnh độ phức tạp và chiều sâu của nội dung ý tưởng theo mức độ này.

    **QUY TRÌNH SÁNG TẠO NÂNG CAO:**

    **BƯỚC 1: SINH Ý TƯỞNG GỐC**
    ${overdriveInstruction}
    Mỗi ý tưởng gốc phải có một chủ đề rõ ràng, bám sát từ khóa đầu vào.

    **BƯỚC 2: ÁP DỤNG TẦNG LỌC SÁNG TẠO "CREATIVE BOOSTER"**
    Với MỖI ý tưởng gốc, hãy áp dụng quy trình phân tích sáng tạo 3 lớp sau đây để tư duy:
    1.  **Góc nhìn mới (Perspective Shift):** Lật ngược vấn đề, nhìn từ góc độ của một nhân vật phụ, hoặc đảo chiều cảm xúc (VD: thay vì nói về “áp lực thi cử”, hãy tìm “niềm vui trong thi cử”).
    2.  **Kết nối bất ngờ (Unexpected Link):** Kết hợp hai chủ đề tưởng chừng không liên quan để tạo ra sự đột phá (VD: “Nếu môn Toán có Tinder”, “Bài thi HSA là một trò chơi sinh tồn”).
    3.  **Cảm xúc sâu (Emotional Hook):** Chèn các yếu tố gợi cảm xúc chân thật (hối tiếc, tự hào, biết ơn, bất ngờ) một cách tinh tế, không cường điệu.

    Dựa trên quá trình tư duy này, hãy tạo ra **3 BIẾN THỂ** cho mỗi ý tưởng gốc. Mỗi biến thể là một đối tượng JSON hoàn chỉnh trong mảng kết quả:
    -   **Phiên bản truyền cảm hứng (Inspiring):** Hướng đến câu chuyện nhân văn, tạo động lực. Ghi variationType là "Truyền cảm hứng".
    -   **Phiên bản bắt trend (Trend-fit):** Vận dụng các xu hướng, âm thanh, format thịnh hành trên TikTok. Ghi variationType là "Bắt trend".
    -   **Phiên bản hài hước thông minh (Smart Humor):** Sử dụng sự dí dỏm, meme, tình huống oái oăm để tạo tiếng cười. Ghi variationType là "Hài hước thông minh".

    **BƯỚC 3: PHÂN TÍCH CHUYÊN SÂU & TỐI ƯU HÓA (CHO TỪNG BIẾN THỂ)**
    Với mỗi biến thể ý tưởng đã tạo, hãy hoàn thành các yêu cầu sau:
    -   **creativeStrategy:** Ghi lại chiến lược chính ("Góc nhìn mới", "Kết nối bất ngờ", hoặc "Cảm xúc sâu") đã được sử dụng để tạo ra biến thể đó.
    -   **Chấm điểm nâng cao và Tạo biến thể sáng tạo:** Thực hiện đầy đủ các yêu cầu phân tích như trong schema (scores, totalScore, priority, formatRemixes, toneRemixes, etc.).
    -   **TỐI ƯU HÓA HOOKS CHIẾN LƯỢC (chỉ cho ý tưởng "⭐ Top Tier"):**
        Áp dụng quy trình "MINI HOOK OPTIMIZER" để tạo ra các hook text ngắn (1-2 dòng) cho 3-5 giây đầu video.
        **Nguyên tắc:**
        1.  **Gợi tò mò có mục đích:** Tạo cảm giác có kiến thức, câu trả lời đáng nghe.
        2.  **Tự hình dung nội dung:** Người đọc đoán được chủ đề video nhưng vẫn muốn xem chi tiết.
        3.  **Khẳng định chất lượng:** Ngôn ngữ chắc chắn, có logic, "chất chuyên gia".
        **Quy trình:**
        1.  Phân tích ý tưởng nâng cấp để xác định mục tiêu chính (cung cấp kiến thức, truyền cảm xúc, hướng dẫn...).
        2.  Tạo ra các hook \`full\` và \`reverse\` như trong schema.
        3.  Đối với \`mini\` hooks, chọn 1-2 công thức phù hợp nhất từ danh sách sau để áp dụng:
            -   **Tò mò – giải mã:** "Bạn biết 90% học sinh làm sai chỗ này khi..."
            -   **Kết quả – bật mí:** "Sau [thời gian], tôi đã [kết quả] chỉ nhờ 1 điều này."
            -   **So sánh – ngược kỳ vọng:** "Mọi người nghĩ [A] mới đúng, nhưng thực ra [B] mới là lý do."
            -   **Sốc tri thức – fact mạnh:** "Nếu bạn biết điều này sớm hơn, bạn đã không mất 3 năm học sai cách."
            -   **Cảm xúc – đồng cảm:** "Có ai từng học đến 1h sáng mà vẫn thấy chưa đủ không?"
            -   **Xác thực – uy tín:** "Đây là cách mà học sinh đạt 113 HSA thật sự ôn luyện."
        4.  Dựa trên công thức đã chọn, sinh ra 3 phiên bản \`mini\` hook khác nhau.
        5.  Với mỗi \`mini\` hook, hãy ghi rõ tên công thức đã sử dụng (vd: "Tò mò – giải mã") và chấm điểm "Retention Score" (0-100) để dự đoán khả năng giữ chân người xem.
        6.  Tạo các \`captions\` và \`hashtagPack\` theo schema.

    **QUY TẮC AN TOÀN NỘI DUNG (TUYỆT ĐỐI TUÂN THỦ):**
    KHÔNG BAO GIỜ tạo ra hoặc khuyến khích các nội dung sau:
    -   Ngôn từ tục, bậy, phản cảm, ám chỉ tình dục hoặc bạo lực.
    -   Chủ đề liên quan chính trị, tôn giáo, phân biệt vùng miền, giới tính, giai cấp.
    -   Các mô-típ “truyền thông bẩn” (bóc phốt, drama, cạnh tranh tiêu cực).
    -   Nội dung phản giáo dục, khuyến khích gian lận thi cử, lười học, hay thái độ tiêu cực với việc học.

    **YÊU CẦU CHẤT LƯỢNG ĐẦU RA:**
    -   Ý tưởng phải thông minh, nhân văn, gợi tò mò nhưng không phản cảm.
    -   Giữ được tinh thần “Gen Z” (nhanh, ngắn, dí dỏm) nhưng không nhạt nhẽo hoặc vô nghĩa.
    -   Tạo cảm giác người làm video “thông minh hơn chứ không to tiếng hơn”.
    -   Phải liên kết rõ ràng với sản phẩm hoặc thông điệp học tập của HOCMAI.

    Trả về một mảng JSON duy nhất chứa TẤT CẢ các biến thể ý tưởng đã được xử lý theo schema.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedIdeas: Omit<Idea, 'id'>[] = JSON.parse(jsonText);
    
    // FIX: Changed 'parsed' to 'parsedIdeas' to correctly reference the parsed JSON array.
    return parsedIdeas.map(idea => ({
      ...idea,
      id: crypto.randomUUID(),
      hooks: idea.hooks || { full: [], mini: [], reverse: [] },
      captions: idea.captions || [],
      hashtagPack: idea.hashtagPack || [],
      formatRemixes: idea.formatRemixes || [],
      toneRemixes: idea.toneRemixes || [],
    }));

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Không thể tạo ý tưởng từ mô hình AI.");
  }
};


const remixResponseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      originalTheme: { type: Type.STRING, description: "Tiêu đề của ý tưởng gốc được dùng để tạo ra ý tưởng mới này." },
      newExpandedIdea: { type: Type.STRING, description: "Tiêu đề của ý tưởng mới được mở rộng, kết hợp từ khóa mới." },
      videoFormat: { type: Type.STRING, description: "Định dạng video phù hợp cho ý tưởng mới (ví dụ: POV, series, trend)." },
      communicationGoal: { type: Type.STRING, description: "Mục tiêu truyền thông chính của ý tưởng mới (ví dụ: Tăng nhận diện, Thúc đẩy đăng ký, Xây dựng cộng đồng)." },
      ideaSource: { type: Type.STRING, description: "Nguồn gốc của ý tưởng ('Remix', 'Spin-off', hoặc 'Cross-theme')." },
      newPotentialScore: { type: Type.NUMBER, description: "Điểm tiềm năng mới (1-5) của ý tưởng sau khi kết hợp." },
      hooks: {
        type: Type.ARRAY,
        description: "Sinh 2 hook mới: 1 hook đầy đủ (Full) và 1 hook mini cho text trên màn hình (Mini).",
        items: {
          type: Type.OBJECT,
          properties: {
            full: { type: Type.STRING },
            mini: { type: Type.STRING },
          },
          required: ['full', 'mini'],
        },
      },
    },
    required: ['originalTheme', 'newExpandedIdea', 'videoFormat', 'communicationGoal', 'ideaSource', 'newPotentialScore', 'hooks'],
  },
};

export const remixIdeas = async (newKeywords: string, existingIdeas: Idea[], mixMode: MixMode): Promise<RemixedIdea[]> => {
  const topIdeas = existingIdeas
    .filter(idea => idea.priority === '⭐ Top Tier' || idea.totalScore > 4.5)
    .slice(0, 5)
    .map(({ upgradedTitle, category, totalScore, creativeStrategy, variationType }) => ({ title: upgradedTitle, category, totalScore, creativeStrategy, variationType }));
  
  if (topIdeas.length === 0) {
    throw new Error("Không có đủ ý tưởng chất lượng cao (Top Tier hoặc điểm > 4.5) để trộn.");
  }

  const mixModeMapping = {
    'remix': 'Remix: Kết hợp ý tưởng cũ với từ khóa mới để tạo ra một biến thể trực tiếp.',
    'spin-off': 'Spin-off: Lấy chủ đề gốc và mở rộng sang một khía cạnh hoặc câu chuyện mới dựa trên từ khóa.',
    'cross-theme': 'Cross-theme: Kết hợp 2 chủ đề khác nhau từ danh sách ý tưởng cũ với từ khóa mới để tạo ra một ý tưởng đột phá, hoàn toàn mới.',
  };

  const prompt = `
    Bạn là một chuyên gia chiến lược nội dung TikTok cho HOCMAI, một nền tảng giáo dục trực tuyến tại Việt Nam.
    Nhiệm vụ của bạn là tạo ra các ý tưởng video mới, sáng tạo bằng cách kết hợp các ý tưởng thành công hiện có với các từ khóa mới.

    **1. Ý tưởng thành công hiện có (Top Tier):**
    Đây là danh sách các ý tưởng hiệu suất cao nhất hiện tại:
    ${JSON.stringify(topIdeas, null, 2)}

    **2. Từ khóa mới cần kết hợp:**
    "${newKeywords}"

    **3. Hướng sáng tạo (Chế độ trộn):**
    "${mixModeMapping[mixMode]}"

    **Hướng dẫn:**
    - Phân tích các ý tưởng hiện có và các từ khóa mới.
    - Dựa trên hướng sáng tạo đã chọn, tạo ra 5 ý tưởng mở rộng mới.
    - Với mỗi ý tưởng mới, cung cấp tất cả các trường được chỉ định trong schema JSON.
    - 'ideaSource' phải phản ánh chế độ trộn đã sử dụng.
    - 'newPotentialScore' phải là ước tính chuyên môn của bạn dựa trên sự kết hợp, xem xét điểm số ban đầu và tiềm năng của từ khóa mới.
    - 'hooks' phải sáng tạo và hấp dẫn, với cả phiên bản đầy đủ (cho kịch bản) và phiên bản mini (cho văn bản trên màn hình).
    - Duy trì tiếng nói thương hiệu HOCMAI: gần gũi, dành cho học sinh Gen Z, hữu ích và đôi khi hài hước.
    - Đảm bảo các ý tưởng mới phải khác biệt và không chỉ là diễn đạt lại đơn giản.

    Trả về một mảng JSON duy nhất chứa các ý tưởng mới.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: remixResponseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedRemixedIdeas: Omit<RemixedIdea, 'id' | 'originalIdea'>[] = JSON.parse(jsonText);

    return parsedRemixedIdeas.map(remixed => {
      const originalIdea = existingIdeas.find(i => i.upgradedTitle === remixed.originalTheme || i.title === remixed.originalTheme);
      if (!originalIdea) {
          console.warn(`Could not find original idea for theme: ${remixed.originalTheme}`);
          // Create a fallback original idea to prevent crashes
          return {
              ...remixed,
              id: crypto.randomUUID(),
              originalIdea: { id: 'not-found', title: remixed.originalTheme, upgradedTitle: remixed.originalTheme } as Idea
          };
      }
      return {
        ...remixed,
        id: crypto.randomUUID(),
        originalIdea,
      };
    });

  } catch (error) {
    console.error("Error calling Gemini API for remixing:", error);
    throw new Error("Không thể trộn ý tưởng từ mô hình AI.");
  }
};
