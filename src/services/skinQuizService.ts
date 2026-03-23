import apiClient from './apiClient';

export const skinQuizService = {
  // Lấy danh sách câu hỏi
  getQuestions: async () => {
    try {
      const response = await apiClient.get('/SkinQuiz/questions');
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Lỗi lấy câu hỏi:', error);
      throw error;
    }
  },

  // Gửi đáp án để AI phân tích
  analyzeSkin: async (answers: any) => {
    try {
      const response = await apiClient.post('/SkinQuiz/analyze', answers);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Lỗi phân tích da:', error);
      throw error;
    }
  },

  // Lấy chi tiết thông tin loại da
  getSkinTypeDetails: async (skinType: string) => {
    try {
      const response = await apiClient.get(`/SkinQuiz/skin-types/${skinType}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Lỗi lấy chi tiết loại da:', error);
      throw error;
    }
  },

  // Lấy danh sách sản phẩm khuyên dùng
  getRecommendations: async (skinType: string) => {
    try {
      const response = await apiClient.get(`/SkinQuiz/recommendations/${skinType}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Lỗi lấy sản phẩm khuyên dùng:', error);
      throw error;
    }
  }
};