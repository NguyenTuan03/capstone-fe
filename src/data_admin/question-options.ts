import { QuestionOption } from '@/types/question-option';
import { questions } from './questions';

// Question Options mock data - Đáp án cho từng câu hỏi
// Mỗi câu hỏi có 4 đáp án, 1 đáp án đúng
export const questionOptions: QuestionOption[] = [
  // Question 1 - Kích thước sân
  {
    id: 1,
    content: '13.41m x 6.10m',
    isCorrect: true,
    question: questions[0],
  },
  {
    id: 2,
    content: '10m x 5m',
    isCorrect: false,
    question: questions[0],
  },
  {
    id: 3,
    content: '15m x 7m',
    isCorrect: false,
    question: questions[0],
  },
  {
    id: 4,
    content: '12m x 6m',
    isCorrect: false,
    question: questions[0],
  },

  // Question 2 - Chiều cao lưới
  {
    id: 5,
    content: '86cm',
    isCorrect: true,
    question: questions[1],
  },
  {
    id: 6,
    content: '91cm',
    isCorrect: false,
    question: questions[1],
  },
  {
    id: 7,
    content: '80cm',
    isCorrect: false,
    question: questions[1],
  },
  {
    id: 8,
    content: '100cm',
    isCorrect: false,
    question: questions[1],
  },

  // Question 3 - Chất liệu bóng
  {
    id: 9,
    content: 'Nhựa có lỗ',
    isCorrect: true,
    question: questions[2],
  },
  {
    id: 10,
    content: 'Cao su',
    isCorrect: false,
    question: questions[2],
  },
  {
    id: 11,
    content: 'Da tổng hợp',
    isCorrect: false,
    question: questions[2],
  },
  {
    id: 12,
    content: 'Vải',
    isCorrect: false,
    question: questions[2],
  },

  // Question 4 - Vị trí giao bóng
  {
    id: 13,
    content: 'Sau baseline trong khu vực phục vụ',
    isCorrect: true,
    question: questions[3],
  },
  {
    id: 14,
    content: 'Ở giữa sân',
    isCorrect: false,
    question: questions[3],
  },
  {
    id: 15,
    content: 'Trước baseline',
    isCorrect: false,
    question: questions[3],
  },
  {
    id: 16,
    content: 'Bất kỳ đâu',
    isCorrect: false,
    question: questions[3],
  },

  // Question 5 - Điểm tối đa
  {
    id: 17,
    content: '11 điểm',
    isCorrect: true,
    question: questions[4],
  },
  {
    id: 18,
    content: '15 điểm',
    isCorrect: false,
    question: questions[4],
  },
  {
    id: 19,
    content: '21 điểm',
    isCorrect: false,
    question: questions[4],
  },
  {
    id: 20,
    content: '10 điểm',
    isCorrect: false,
    question: questions[4],
  },

  // Question 6 - Chất liệu vợt
  {
    id: 21,
    content: 'Kim loại rỗng',
    isCorrect: true,
    question: questions[5],
  },
  {
    id: 22,
    content: 'Gỗ',
    isCorrect: false,
    question: questions[5],
  },
  {
    id: 23,
    content: 'Composite',
    isCorrect: false,
    question: questions[5],
  },
  {
    id: 24,
    content: 'Graphite',
    isCorrect: false,
    question: questions[5],
  },

  // Question 7 - Kitchen distance
  {
    id: 25,
    content: '2.13m',
    isCorrect: true,
    question: questions[6],
  },
  {
    id: 26,
    content: '3m',
    isCorrect: false,
    question: questions[6],
  },
  {
    id: 27,
    content: '1.5m',
    isCorrect: false,
    question: questions[6],
  },
  {
    id: 28,
    content: '2.5m',
    isCorrect: false,
    question: questions[6],
  },

  // Question 8 - Giày
  {
    id: 29,
    content: 'Đế chống trượt và hỗ trợ di chuyển',
    isCorrect: true,
    question: questions[7],
  },
  {
    id: 30,
    content: 'Giày chạy bộ',
    isCorrect: false,
    question: questions[7],
  },
  {
    id: 31,
    content: 'Dép xăng đan',
    isCorrect: false,
    question: questions[7],
  },
  {
    id: 32,
    content: 'Giày cao gót',
    isCorrect: false,
    question: questions[7],
  },

  // Question 9 - Trang phục
  {
    id: 33,
    content: 'Không có quy định nghiêm ngặt',
    isCorrect: true,
    question: questions[8],
  },
  {
    id: 34,
    content: 'Phải mặc trắng',
    isCorrect: false,
    question: questions[8],
  },
  {
    id: 35,
    content: 'Phải mặc đồng phục',
    isCorrect: false,
    question: questions[8],
  },
  {
    id: 36,
    content: 'Cấm màu đen',
    isCorrect: false,
    question: questions[8],
  },

  // Question 10 - Underhand serve
  {
    id: 37,
    content: 'Giao từ dưới lên, tay không cao quá eo',
    isCorrect: true,
    question: questions[9],
  },
  {
    id: 38,
    content: 'Giao từ trên cao xuống',
    isCorrect: false,
    question: questions[9],
  },
  {
    id: 39,
    content: 'Giao ngang tầm vai',
    isCorrect: false,
    question: questions[9],
  },
  {
    id: 40,
    content: 'Giao từ cổ tay',
    isCorrect: false,
    question: questions[9],
  },

  // Question 11 - Giao bóng rơi đâu
  {
    id: 41,
    content: 'Ô chéo đối diện, ngoài Kitchen',
    isCorrect: true,
    question: questions[10],
  },
  {
    id: 42,
    content: 'Bất kỳ đâu trong sân',
    isCorrect: false,
    question: questions[10],
  },
  {
    id: 43,
    content: 'Trong Kitchen',
    isCorrect: false,
    question: questions[10],
  },
  {
    id: 44,
    content: 'Phía cùng bên',
    isCorrect: false,
    question: questions[10],
  },

  // Question 12 - Giao lần hai
  {
    id: 45,
    content: 'Trong trận đôi, mỗi đội có 2 lượt giao',
    isCorrect: true,
    question: questions[11],
  },
  {
    id: 46,
    content: 'Khi giao lỗi lần đầu',
    isCorrect: false,
    question: questions[11],
  },
  {
    id: 47,
    content: 'Không bao giờ',
    isCorrect: false,
    question: questions[11],
  },
  {
    id: 48,
    content: 'Khi đối thủ đồng ý',
    isCorrect: false,
    question: questions[11],
  },

  // Question 13 - Topspin
  {
    id: 49,
    content: 'Bóng nảy cao và nhanh hơn',
    isCorrect: true,
    question: questions[12],
  },
  {
    id: 50,
    content: 'Bóng nảy thấp',
    isCorrect: false,
    question: questions[12],
  },
  {
    id: 51,
    content: 'Bóng chậm lại',
    isCorrect: false,
    question: questions[12],
  },
  {
    id: 52,
    content: 'Không ảnh hưởng',
    isCorrect: false,
    question: questions[12],
  },

  // Question 14 - Lỗi giao bóng
  {
    id: 53,
    content: 'Giao vào lưới hoặc ra ngoài',
    isCorrect: true,
    question: questions[13],
  },
  {
    id: 54,
    content: 'Giao quá mạnh',
    isCorrect: false,
    question: questions[13],
  },
  {
    id: 55,
    content: 'Giao quá yếu',
    isCorrect: false,
    question: questions[13],
  },
  {
    id: 56,
    content: 'Không có lỗi',
    isCorrect: false,
    question: questions[13],
  },

  // Question 15 - Stacking
  {
    id: 57,
    content: 'Sắp xếp để người thuận tay ở giữa',
    isCorrect: true,
    question: questions[14],
  },
  {
    id: 58,
    content: 'Đứng chồng lên nhau',
    isCorrect: false,
    question: questions[14],
  },
  {
    id: 59,
    content: 'Đổi vị trí liên tục',
    isCorrect: false,
    question: questions[14],
  },
  {
    id: 60,
    content: 'Đứng sát lưới',
    isCorrect: false,
    question: questions[14],
  },

  // Question 16 - Vị trí khi đồng đội ở lưới
  {
    id: 61,
    content: 'Tiến lên lưới cùng đồng đội',
    isCorrect: true,
    question: questions[15],
  },
  {
    id: 62,
    content: 'Ở lại baseline',
    isCorrect: false,
    question: questions[15],
  },
  {
    id: 63,
    content: 'Ra ngoài sân',
    isCorrect: false,
    question: questions[15],
  },
  {
    id: 64,
    content: 'Ngồi nghỉ',
    isCorrect: false,
    question: questions[15],
  },

  // Question 17 - Bắt bóng giữa
  {
    id: 65,
    content: 'Người thuận tay forehand',
    isCorrect: true,
    question: questions[16],
  },
  {
    id: 66,
    content: 'Người cao hơn',
    isCorrect: false,
    question: questions[16],
  },
  {
    id: 67,
    content: 'Người gần hơn',
    isCorrect: false,
    question: questions[16],
  },
  {
    id: 68,
    content: 'Người ở bên trái',
    isCorrect: false,
    question: questions[16],
  },

  // Question 18 - Dinking
  {
    id: 69,
    content: 'Đánh nhẹ qua lại ở lưới để tìm cơ hội',
    isCorrect: true,
    question: questions[17],
  },
  {
    id: 70,
    content: 'Đánh mạnh liên tục',
    isCorrect: false,
    question: questions[17],
  },
  {
    id: 71,
    content: 'Đánh bóng cao',
    isCorrect: false,
    question: questions[17],
  },
  {
    id: 72,
    content: 'Giao bóng nhanh',
    isCorrect: false,
    question: questions[17],
  },

  // Question 19 - Lob shot
  {
    id: 73,
    content: 'Khi đối thủ tiến quá gần lưới',
    isCorrect: true,
    question: questions[18],
  },
  {
    id: 74,
    content: 'Khi đối thủ ở xa',
    isCorrect: false,
    question: questions[18],
  },
  {
    id: 75,
    content: 'Khi giao bóng',
    isCorrect: false,
    question: questions[18],
  },
  {
    id: 76,
    content: 'Không bao giờ',
    isCorrect: false,
    question: questions[18],
  },

  // Question 20 - Topspin effect
  {
    id: 77,
    content: 'Bóng quay về phía trước, nảy cao và nhanh',
    isCorrect: true,
    question: questions[19],
  },
  {
    id: 78,
    content: 'Bóng quay ngược lại',
    isCorrect: false,
    question: questions[19],
  },
  {
    id: 79,
    content: 'Bóng không quay',
    isCorrect: false,
    question: questions[19],
  },
  {
    id: 80,
    content: 'Bóng lệch sang bên',
    isCorrect: false,
    question: questions[19],
  },

  // Continue for remaining questions (21-49)...
  // For brevity, I'll create a pattern for the remaining questions

  // Question 21 - Backspin
  { id: 81, content: 'Bóng quay ngược, nảy thấp và chậm', isCorrect: true, question: questions[20] },
  { id: 82, content: 'Bóng nảy cao', isCorrect: false, question: questions[20] },
  { id: 83, content: 'Bóng bay xa', isCorrect: false, question: questions[20] },
  { id: 84, content: 'Không ảnh hưởng', isCorrect: false, question: questions[20] },

  // Question 22 - Sidespin
  { id: 85, content: 'Làm bóng lệch hướng, khó dự đoán', isCorrect: true, question: questions[21] },
  { id: 86, content: 'Làm bóng chậm lại', isCorrect: false, question: questions[21] },
  { id: 87, content: 'Làm bóng nảy cao', isCorrect: false, question: questions[21] },
  { id: 88, content: 'Không có tác dụng', isCorrect: false, question: questions[21] },

  // Question 23 - Tạo topspin
  { id: 89, content: 'Đánh từ dưới lên với chuyển động cổ tay nhanh', isCorrect: true, question: questions[22] },
  { id: 90, content: 'Đánh thẳng', isCorrect: false, question: questions[22] },
  { id: 91, content: 'Đánh từ trên xuống', isCorrect: false, question: questions[22] },
  { id: 92, content: 'Đánh ngang', isCorrect: false, question: questions[22] },

  // Question 24 - Vợt cho spin
  { id: 93, content: 'Vợt có bề mặt nhám', isCorrect: true, question: questions[23] },
  { id: 94, content: 'Vợt nhẵn', isCorrect: false, question: questions[23] },
  { id: 95, content: 'Vợt kim loại', isCorrect: false, question: questions[23] },
  { id: 96, content: 'Vợt nặng', isCorrect: false, question: questions[23] },

  // Question 25 - Nhận bóng spin
  { id: 97, content: 'Dự đoán hướng quay và điều chỉnh góc vợt', isCorrect: true, question: questions[24] },
  { id: 98, content: 'Đánh mạnh ngược lại', isCorrect: false, question: questions[24] },
  { id: 99, content: 'Né tránh', isCorrect: false, question: questions[24] },
  { id: 100, content: 'Đứng yên', isCorrect: false, question: questions[24] },

  // Question 26 - Áp lực
  { id: 101, content: 'Giữ bóng trong sân và chờ đối thủ sai', isCorrect: true, question: questions[25] },
  { id: 102, content: 'Đánh mạnh', isCorrect: false, question: questions[25] },
  { id: 103, content: 'Đầu hàng', isCorrect: false, question: questions[25] },
  { id: 104, content: 'Phản đối trọng tài', isCorrect: false, question: questions[25] },

  // Question 27 - Thay đổi nhịp
  { id: 105, content: 'Khi chiến thuật hiện tại không hiệu quả', isCorrect: true, question: questions[26] },
  { id: 106, content: 'Mỗi điểm', isCorrect: false, question: questions[26] },
  { id: 107, content: 'Không bao giờ', isCorrect: false, question: questions[26] },
  { id: 108, content: 'Khi được yêu cầu', isCorrect: false, question: questions[26] },

  // Question 28 - Điểm yếu
  { id: 109, content: 'Backhand', isCorrect: true, question: questions[27] },
  { id: 110, content: 'Forehand', isCorrect: false, question: questions[27] },
  { id: 111, content: 'Giao bóng', isCorrect: false, question: questions[27] },
  { id: 112, content: 'Không có', isCorrect: false, question: questions[27] },

  // Question 29 - Erne
  { id: 113, content: 'Nhảy từ ngoài sân vào đánh bên Kitchen', isCorrect: true, question: questions[28] },
  { id: 114, content: 'Đánh trong Kitchen', isCorrect: false, question: questions[28] },
  { id: 115, content: 'Giao bóng đặc biệt', isCorrect: false, question: questions[28] },
  { id: 116, content: 'Loại vợt', isCorrect: false, question: questions[28] },

  // Question 30 - Dẫn trước
  { id: 117, content: 'Tiếp tục theo kế hoạch, không chủ quan', isCorrect: true, question: questions[29] },
  { id: 118, content: 'Chơi bừa', isCorrect: false, question: questions[29] },
  { id: 119, content: 'Nghỉ ngơi', isCorrect: false, question: questions[29] },
  { id: 120, content: 'Cho đối thủ thắng vài điểm', isCorrect: false, question: questions[29] },

  // Continue pattern for questions 31-49...
  // Question 31 - Khởi động
  { id: 121, content: '10-15 phút', isCorrect: true, question: questions[30] },
  { id: 122, content: '1-2 phút', isCorrect: false, question: questions[30] },
  { id: 123, content: '30 phút', isCorrect: false, question: questions[30] },
  { id: 124, content: 'Không cần', isCorrect: false, question: questions[30] },

  // Question 32 - Chấn thương
  { id: 125, content: 'Viêm khuỷu tay và bong gân cổ chân', isCorrect: true, question: questions[31] },
  { id: 126, content: 'Gãy tay', isCorrect: false, question: questions[31] },
  { id: 127, content: 'Chấn động não', isCorrect: false, question: questions[31] },
  { id: 128, content: 'Không có', isCorrect: false, question: questions[31] },

  // Question 33 - Nghỉ ngơi
  { id: 129, content: 'Khi cảm thấy đau hoặc mệt quá mức', isCorrect: true, question: questions[32] },
  { id: 130, content: 'Sau mỗi điểm', isCorrect: false, question: questions[32] },
  { id: 131, content: 'Không bao giờ', isCorrect: false, question: questions[32] },
  { id: 132, content: 'Khi thua', isCorrect: false, question: questions[32] },

  // Question 34 - Bảo vệ
  { id: 133, content: 'Kính bảo vệ mắt và giày tốt', isCorrect: true, question: questions[33] },
  { id: 134, content: 'Mũ bảo hiểm', isCorrect: false, question: questions[33] },
  { id: 135, content: 'Áo giáp', isCorrect: false, question: questions[33] },
  { id: 136, content: 'Không cần', isCorrect: false, question: questions[33] },

  // Question 35 - Tư thế sẵn sàng
  { id: 137, content: 'Chân mở, gối cúi, trọng tâm giữa', isCorrect: true, question: questions[34] },
  { id: 138, content: 'Đứng thẳng', isCorrect: false, question: questions[34] },
  { id: 139, content: 'Ngồi xổm', isCorrect: false, question: questions[34] },
  { id: 140, content: 'Nhảy cao', isCorrect: false, question: questions[34] },

  // Question 36 - Split step
  { id: 141, content: 'Nhảy nhẹ khi đối thủ chạm bóng', isCorrect: true, question: questions[35] },
  { id: 142, content: 'Chạy nhanh', isCorrect: false, question: questions[35] },
  { id: 143, content: 'Đứng yên', isCorrect: false, question: questions[35] },
  { id: 144, content: 'Quay lưng', isCorrect: false, question: questions[35] },

  // Question 37 - Di chuyển lùi
  { id: 145, content: 'Di chuyển chéo và giữ mặt nhìn bóng', isCorrect: true, question: questions[36] },
  { id: 146, content: 'Chạy thẳng', isCorrect: false, question: questions[36] },
  { id: 147, content: 'Quay lưng chạy', isCorrect: false, question: questions[36] },
  { id: 148, content: 'Nhảy lùi', isCorrect: false, question: questions[36] },

  // Question 38 - Bước chân
  { id: 149, content: 'Bước đầu tiên quyết định tốc độ', isCorrect: true, question: questions[37] },
  { id: 150, content: 'Bước cuối cùng', isCorrect: false, question: questions[37] },
  { id: 151, content: 'Bước thứ hai', isCorrect: false, question: questions[37] },
  { id: 152, content: 'Tất cả như nhau', isCorrect: false, question: questions[37] },

  // Question 39 - Di chuyển hiệu quả
  { id: 153, content: 'Di chuyển nhỏ, nhanh và giữ cân bằng', isCorrect: true, question: questions[38] },
  { id: 154, content: 'Bước lớn và chậm', isCorrect: false, question: questions[38] },
  { id: 155, content: 'Chạy lung tung', isCorrect: false, question: questions[38] },
  { id: 156, content: 'Đứng im', isCorrect: false, question: questions[38] },

  // Question 40 - Mắc lỗi
  { id: 157, content: 'Chấp nhận và tập trung điểm sau', isCorrect: true, question: questions[39] },
  { id: 158, content: 'Tức giận', isCorrect: false, question: questions[39] },
  { id: 159, content: 'Đổ lỗi đồng đội', isCorrect: false, question: questions[39] },
  { id: 160, content: 'Bỏ cuộc', isCorrect: false, question: questions[39] },

  // Question 41 - Kiểm soát cảm xúc
  { id: 161, content: 'Hít thở sâu và tập trung quy trình', isCorrect: true, question: questions[40] },
  { id: 162, content: 'La hét', isCorrect: false, question: questions[40] },
  { id: 163, content: 'Đập vợt', isCorrect: false, question: questions[40] },
  { id: 164, content: 'Khóc', isCorrect: false, question: questions[40] },

  // Question 42 - Đối thủ chơi tốt
  { id: 165, content: 'Tôn trọng và điều chỉnh chiến thuật', isCorrect: true, question: questions[41] },
  { id: 166, content: 'Bỏ cuộc', isCorrect: false, question: questions[41] },
  { id: 167, content: 'Phàn nàn', isCorrect: false, question: questions[41] },
  { id: 168, content: 'Chơi bẩn', isCorrect: false, question: questions[41] },

  // Question 43 - Áp lực đến từ đâu
  { id: 169, content: 'Kỳ vọng bản thân và sợ thất bại', isCorrect: true, question: questions[42] },
  { id: 170, content: 'Thời tiết', isCorrect: false, question: questions[42] },
  { id: 171, content: 'Trang phục', isCorrect: false, question: questions[42] },
  { id: 172, content: 'Vợt', isCorrect: false, question: questions[42] },

  // Question 44 - Tư duy tích cực
  { id: 173, content: 'Tăng tự tin và khả năng phục hồi', isCorrect: true, question: questions[43] },
  { id: 174, content: 'Không giúp gì', isCorrect: false, question: questions[43] },
  { id: 175, content: 'Làm chậm phản ứng', isCorrect: false, question: questions[43] },
  { id: 176, content: 'Gây mệt mỏi', isCorrect: false, question: questions[43] },

  // Question 45 - Ghi điểm
  { id: 177, content: 'Chỉ đội đang giao bóng', isCorrect: true, question: questions[44] },
  { id: 178, content: 'Cả hai đội', isCorrect: false, question: questions[44] },
  { id: 179, content: 'Đội nhận bóng', isCorrect: false, question: questions[44] },
  { id: 180, content: 'Người thắng rally', isCorrect: false, question: questions[44] },

  // Question 46 - Đọc tỷ số
  { id: 181, content: 'Điểm người giao - điểm đối thủ - số lượt', isCorrect: true, question: questions[45] },
  { id: 182, content: 'Chỉ tổng điểm', isCorrect: false, question: questions[45] },
  { id: 183, content: 'Điểm đối thủ trước', isCorrect: false, question: questions[45] },
  { id: 184, content: 'Không có quy chuẩn', isCorrect: false, question: questions[45] },

  // Question 47 - Side out
  { id: 185, content: 'Khi đội giao bóng mất quyền giao', isCorrect: true, question: questions[46] },
  { id: 186, content: 'Khi ghi điểm', isCorrect: false, question: questions[46] },
  { id: 187, content: 'Khi nghỉ giải lao', isCorrect: false, question: questions[46] },
  { id: 188, content: 'Khi thay người', isCorrect: false, question: questions[46] },

  // Question 48 - Đập bóng trong Kitchen
  { id: 189, content: 'Không, trừ khi bóng đã nảy trong Kitchen', isCorrect: true, question: questions[47] },
  { id: 190, content: 'Được phép', isCorrect: false, question: questions[47] },
  { id: 191, content: 'Tùy trọng tài', isCorrect: false, question: questions[47] },
  { id: 192, content: 'Chỉ trong trận đôi', isCorrect: false, question: questions[47] },

  // Question 49 - Double bounce
  { id: 193, content: 'Bóng giao và trả phải nảy trước khi đánh', isCorrect: true, question: questions[48] },
  { id: 194, content: 'Bóng nảy hai lần liên tiếp', isCorrect: false, question: questions[48] },
  { id: 195, content: 'Đánh hai lần', isCorrect: false, question: questions[48] },
  { id: 196, content: 'Hai người đánh cùng lúc', isCorrect: false, question: questions[48] },
];

// Helper functions
export const getOptionById = (id: number): QuestionOption | undefined => {
  return questionOptions.find((opt) => opt.id === id);
};

export const getOptionsByQuestion = (questionId: number): QuestionOption[] => {
  return questionOptions.filter((opt) => opt.question.id === questionId);
};

export const getCorrectOption = (questionId: number): QuestionOption | undefined => {
  return questionOptions.find((opt) => opt.question.id === questionId && opt.isCorrect);
};

export const getIncorrectOptions = (questionId: number): QuestionOption[] => {
  return questionOptions.filter((opt) => opt.question.id === questionId && !opt.isCorrect);
};

